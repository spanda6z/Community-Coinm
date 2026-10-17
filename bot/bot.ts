import { Bot, InlineKeyboard, Context, webhookCallback } from "grammy";
import {
  Keypair,
  PublicKey,
  Connection,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import {
  touchPlayer,
  getPlayer,
  findByUsername,
  transferPoints,
  claimDaily,
  markActive,
  getActive,
  leaderboard,
  startBattle,
  getActiveBattle,
  addMemeEntry,
  voteMeme,
  closeBattle,
  addPoints,
  setCaptcha,
  getCaptcha,
  clearCaptcha,
  setCreatedWallet,
  setImportedWallet,
  clearWallet,
} from "./store";

const CAPTCHA_MS = 3 * 60 * 1000;

/** Commands allowed to reply in groups */
const GROUP_OK = new Set([
  "tip",
  "rain",
  "leaderboard",
  "memebattle",
  "meme",
  "quiz",
  "vault",
  "price",
]);

function siteUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL || "https://community-coinm.vercel.app"
  ).replace(/\/$/, "");
}

function treasury() {
  return (
    process.env.NEXT_PUBLIC_TREASURY_ADDRESS ||
    "21fsnH5cGMoKdN49psbw1dcbD16VW64ziu1nnKPy4NAP"
  );
}

function uid(ctx: Context): string | null {
  return ctx.from?.id ? String(ctx.from.id) : null;
}

function display(p: { username?: string; name: string }) {
  return p.username ? `@${p.username}` : p.name;
}

function ensure(ctx: Context) {
  const id = uid(ctx);
  if (!id || !ctx.from) return null;
  return touchPlayer(id, ctx.from.username, ctx.from.first_name);
}

function isPrivate(ctx: Context) {
  return ctx.chat?.type === "private";
}

function isGroup(ctx: Context) {
  const t = ctx.chat?.type;
  return t === "group" || t === "supergroup";
}

function mention(user: {
  id: number;
  first_name?: string;
  username?: string;
}) {
  const name = user.first_name || user.username || "member";
  return `[${name}](tg://user?id=${user.id})`;
}

function makeMath() {
  const a = 2 + Math.floor(Math.random() * 12);
  const b = 2 + Math.floor(Math.random() * 12);
  return { a, b, answer: a + b };
}

export function createBot() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) throw new Error("TELEGRAM_BOT_TOKEN is not set");

  const bot = new Bot(token);
  const site = siteUrl();
  const TREASURY = treasury();

  async function restrictNewMember(chatId: number, userId: number) {
    try {
      await bot.api.restrictChatMember(chatId, userId, {
        permissions: {
          can_send_messages: false,
          can_send_audios: false,
          can_send_documents: false,
          can_send_photos: false,
          can_send_videos: false,
          can_send_video_notes: false,
          can_send_voice_notes: false,
          can_send_polls: false,
          can_send_other_messages: false,
          can_add_web_page_previews: false,
          can_change_info: false,
          can_invite_users: false,
          can_pin_messages: false,
          can_manage_topics: false,
        },
      });
    } catch (e) {
      console.error("restrict failed", e);
    }
  }

  async function unrestrictMember(chatId: number, userId: number) {
    try {
      await bot.api.restrictChatMember(chatId, userId, {
        permissions: {
          can_send_messages: true,
          can_send_audios: true,
          can_send_documents: true,
          can_send_photos: true,
          can_send_videos: true,
          can_send_video_notes: true,
          can_send_voice_notes: true,
          can_send_polls: true,
          can_send_other_messages: true,
          can_add_web_page_previews: true,
          can_change_info: false,
          can_invite_users: true,
          can_pin_messages: false,
          can_manage_topics: false,
        },
      });
    } catch (e) {
      console.error("unrestrict failed", e);
    }
  }

  async function kickMember(chatId: number, userId: number) {
    try {
      await bot.api.banChatMember(chatId, userId);
      await bot.api.unbanChatMember(chatId, userId);
    } catch (e) {
      console.error("kick failed", e);
    }
  }

  async function startCaptcha(
    chatId: number,
    user: { id: number; first_name?: string; username?: string }
  ) {
    clearCaptcha(chatId, user.id);
    await restrictNewMember(chatId, user.id);

    const { a, b, answer } = makeMath();
    const options = new Set<number>([answer]);
    while (options.size < 4) {
      const fake = answer + (Math.floor(Math.random() * 9) - 4);
      if (fake > 0 && fake !== answer) options.add(fake);
    }
    const shuffled = [...options].sort(() => Math.random() - 0.5);

    const kb = new InlineKeyboard();
    shuffled.forEach((n, i) => {
      kb.text(String(n), `captcha:${chatId}:${user.id}:${n}`);
      if (i % 2 === 1) kb.row();
    });

    const welcome =
      `Welcome ${mention(user)} 👋\n\n` +
      `*COMMUNITY Coin* — community-owned on Solana.\n\n` +
      `🔐 *Guardian check* (3 min)\n` +
      `*What is ${a} + ${b}?*\n\n` +
      `Tap the answer. Wrong or timeout = removed.`;

    let messageId: number | undefined;
    try {
      const msg = await bot.api.sendMessage(chatId, welcome, {
        parse_mode: "Markdown",
        reply_markup: kb,
      });
      messageId = msg.message_id;
    } catch (e) {
      console.error("welcome send failed", e);
    }

    setCaptcha({
      chatId,
      userId: user.id,
      answer,
      a,
      b,
      messageId,
      endsAt: Date.now() + CAPTCHA_MS,
    });
  }

  // Activity only — never reply to normal group messages
  bot.on("message", async (ctx, next) => {
    const id = uid(ctx);
    if (id && ctx.chat) {
      ensure(ctx);
      markActive(String(ctx.chat.id), id);
    }
    await next();
  });

  bot.on("message:new_chat_members", async (ctx) => {
    const chatId = ctx.chat?.id;
    if (!chatId || chatId > 0) return;
    for (const member of ctx.message?.new_chat_members || []) {
      if (member.is_bot) continue;
      touchPlayer(String(member.id), member.username, member.first_name);
      await startCaptcha(chatId, member);
    }
  });

  bot.on("chat_member", async (ctx) => {
    const update = ctx.chatMember;
    if (!update || update.chat.id > 0) return;
    const user = update.new_chat_member.user;
    if (user.is_bot) return;
    const oldS = update.old_chat_member.status;
    const newS = update.new_chat_member.status;
    const joined =
      (oldS === "left" || oldS === "kicked") &&
      (newS === "member" || newS === "restricted");
    if (!joined) return;
    touchPlayer(String(user.id), user.username, user.first_name);
    await startCaptcha(update.chat.id, user);
  });

  bot.callbackQuery(/^captcha:(-?\d+):(\d+):(\d+)$/, async (ctx) => {
    const chatId = Number(ctx.match![1]);
    const userId = Number(ctx.match![2]);
    const picked = Number(ctx.match![3]);

    if (!ctx.from || ctx.from.id !== userId) {
      return ctx.answerCallbackQuery({
        text: "Not your check.",
        show_alert: true,
      });
    }

    const challenge = getCaptcha(chatId, userId);
    if (!challenge || challenge.endsAt < Date.now()) {
      clearCaptcha(chatId, userId);
      await kickMember(chatId, userId);
      return ctx.answerCallbackQuery({
        text: "Expired. Rejoin the group.",
        show_alert: true,
      });
    }

    if (picked !== challenge.answer) {
      clearCaptcha(chatId, userId);
      await ctx.answerCallbackQuery({ text: "Wrong.", show_alert: true });
      await kickMember(chatId, userId);
      try {
        await ctx.editMessageText("Verification failed — removed.");
      } catch {}
      return;
    }

    clearCaptcha(chatId, userId);
    await unrestrictMember(chatId, userId);
    await ctx.answerCallbackQuery({ text: "Verified ✓" });
    const p = touchPlayer(
      String(userId),
      ctx.from.username,
      ctx.from.first_name
    );
    addPoints(p.id, 10);
    try {
      await ctx.editMessageText(
        `✅ ${mention(ctx.from)} verified. Welcome. +10 pts.`,
        { parse_mode: "Markdown" }
      );
    } catch {}
  });

  // /start — full menu only in private; silence in groups
  bot.command("start", async (ctx) => {
    if (isGroup(ctx)) {
      // Ignore long welcome spam in groups
      return;
    }
    const p = ensure(ctx);
    const keyboard = new InlineKeyboard()
      .url("Website", site)
      .url("Chat", process.env.NEXT_PUBLIC_TELEGRAM_URL || "https://t.me/communitycoinchatt")
      .row()
      .text("Daily", "menu:daily")
      .text("Balance", "menu:balance")
      .row()
      .text("Leaderboard", "menu:leaderboard")
      .text("Help", "menu:help")
      .row()
      .text("Create wallet", "wallet:create")
      .text("Wallet status", "wallet:status");

    await ctx.reply(
      `Welcome to COMMUNITY Coin.\n\n` +
        `${p ? `Points: *${p.points}*` : ""}\n\n` +
        `Use buttons below. Points ≠ tokens.\n` +
        `Wallet: /wallet create or /wallet import`,
      { parse_mode: "Markdown", reply_markup: keyboard }
    );
  });

  // Menu buttons — alert in groups, message only in private
  bot.callbackQuery(/^menu:(daily|balance|leaderboard|help)$/, async (ctx) => {
    const action = ctx.match![1];
    const p = ensure(ctx);
    const privateChat = isPrivate(ctx);

    if (action === "daily") {
      if (!p) return ctx.answerCallbackQuery();
      const result = claimDaily(p.id);
      await ctx.answerCallbackQuery({
        text: result.ok ? `+${result.amount} pts · bal ${result.points}` : result.error,
        show_alert: true,
      });
      if (result.ok && privateChat) {
        await ctx.reply(`Daily: *+${result.amount}* · Balance: *${result.points}*`, {
          parse_mode: "Markdown",
        });
      }
      return;
    }

    if (action === "balance") {
      if (!p) return ctx.answerCallbackQuery();
      await ctx.answerCallbackQuery({
        text: `${p.points} points`,
        show_alert: true,
      });
      if (privateChat) {
        await ctx.reply(
          `${display(p)}\nPoints: *${p.points}*\nTips: ${p.tipsSent} sent / ${p.tipsReceived} recv` +
            (p.walletAddress ? `\nWallet: \`${p.walletAddress}\`` : ""),
          { parse_mode: "Markdown" }
        );
      }
      return;
    }

    if (action === "leaderboard") {
      const top = leaderboard(10);
      if (!top.length) {
        return ctx.answerCallbackQuery({ text: "No players yet", show_alert: true });
      }
      const lines = top.map((player, i) => `${i + 1}. ${display(player)} — ${player.points}`);
      // Leaderboard is fine in groups, but keep it short via alert if group + long; allow group message once
      await ctx.answerCallbackQuery();
      if (privateChat || isGroup(ctx)) {
        await ctx.reply(`*Leaderboard*\n\n${lines.join("\n")}`, {
          parse_mode: "Markdown",
        });
      }
      return;
    }

    if (action === "help") {
      await ctx.answerCallbackQuery({
        text: "DM the bot for full help: /help",
        show_alert: true,
      });
      if (privateChat) {
        await ctx.reply(
          `*Commands*\n/daily /tip /rain /balance /leaderboard\n/quiz /memebattle /vault\n/wallet create · import · clear\n\nNever paste seed phrases.`,
          { parse_mode: "Markdown" }
        );
      }
    }
  });

  bot.command("help", async (ctx) => {
    if (isGroup(ctx)) return; // ignore in groups
    await ctx.reply(
      `*COMMUNITY Coin*\n\n` +
        `/daily /tip /rain /balance /leaderboard\n` +
        `/quiz /memebattle /meme\n` +
        `/vault /price\n\n` +
        `*Wallet (DM only)*\n` +
        `/wallet create\n/wallet import <address>\n/wallet clear\n\n` +
        `Group: tip · rain · leaderboard · quiz · memes · vault only.`,
      { parse_mode: "Markdown" }
    );
  });

  bot.command("balance", async (ctx) => {
    const p = ensure(ctx);
    if (!p) return;
    if (isGroup(ctx)) {
      // Short reply only — or silent; use brief
      return ctx.reply(`${display(p)}: *${p.points}* pts`, {
        parse_mode: "Markdown",
      });
    }
    await ctx.reply(
      `${display(p)}\nPoints: *${p.points}*\nTips sent: ${p.tipsSent} · received: ${p.tipsReceived}` +
        (p.walletAddress ? `\nWallet: \`${p.walletAddress}\`` : ""),
      { parse_mode: "Markdown" }
    );
  });

  bot.command("daily", async (ctx) => {
    const p = ensure(ctx);
    if (!p) return;
    const result = claimDaily(p.id);
    if (!result.ok) {
      if (isGroup(ctx)) return; // don't spam errors in group
      return ctx.reply(result.error);
    }
    await ctx.reply(`Daily *+${result.amount}* · *${result.points}* pts`, {
      parse_mode: "Markdown",
    });
  });

  bot.command("tip", async (ctx) => {
    const p = ensure(ctx);
    if (!p) return;
    const parts = (ctx.message?.text || "").trim().split(/\s+/);
    let targetId: string | undefined;
    let targetUsername: string | undefined;
    let amountStr: string | undefined;

    if (ctx.message?.reply_to_message?.from) {
      const t = ctx.message.reply_to_message.from;
      targetId = String(t.id);
      touchPlayer(targetId, t.username, t.first_name);
      amountStr = parts[1];
    } else {
      targetUsername = parts[1];
      amountStr = parts[2];
    }

    const amount = Number(amountStr);
    if (!amountStr || !Number.isFinite(amount) || amount <= 0) {
      if (isGroup(ctx)) return;
      return ctx.reply("Usage: `/tip @user 50` or reply `/tip 50`", {
        parse_mode: "Markdown",
      });
    }

    let to = targetId ? getPlayer(targetId) : undefined;
    if (!to && targetUsername) to = findByUsername(targetUsername);
    if (!to) {
      if (isGroup(ctx)) return;
      return ctx.reply("User not found — they need /start in DM first.");
    }

    const result = transferPoints(p.id, to.id, Math.floor(amount));
    if (!result.ok) {
      if (isGroup(ctx)) return;
      return ctx.reply(result.error);
    }
    await ctx.reply(
      `${display(p)} → ${display(to)}: *${Math.floor(amount)}* pts`,
      { parse_mode: "Markdown" }
    );
  });

  bot.command("rain", async (ctx) => {
    const p = ensure(ctx);
    if (!p || !ctx.chat) return;
    const amount = Math.floor(Number((ctx.message?.text || "").split(/\s+/)[1]));
    if (!Number.isFinite(amount) || amount < 10) {
      if (isGroup(ctx)) return;
      return ctx.reply("Usage: `/rain 100`", { parse_mode: "Markdown" });
    }
    if (p.points < amount) {
      if (isGroup(ctx)) return;
      return ctx.reply(`Not enough points (${p.points}).`);
    }

    const recipients = getActive(String(ctx.chat.id), p.id).slice(0, 10);
    if (!recipients.length) {
      if (isGroup(ctx)) return;
      return ctx.reply("No recent active users.");
    }

    const each = Math.floor(amount / recipients.length);
    if (each < 1) return;
    const total = each * recipients.length;
    addPoints(p.id, -total);
    const names: string[] = [];
    for (const rid of recipients) {
      addPoints(rid, each);
      const rp = getPlayer(rid);
      if (rp) names.push(display(rp));
    }
    await ctx.reply(
      `Rain *${each}* × ${recipients.length} = *${total}*\n${names.join(", ")}`,
      { parse_mode: "Markdown" }
    );
  });

  bot.command("leaderboard", async (ctx) => {
    ensure(ctx);
    const top = leaderboard(10);
    if (!top.length) {
      if (isGroup(ctx)) return;
      return ctx.reply("No players yet.");
    }
    const lines = top.map((p, i) => `${i + 1}. ${display(p)} — *${p.points}*`);
    await ctx.reply(`*Leaderboard*\n\n${lines.join("\n")}`, {
      parse_mode: "Markdown",
    });
  });

  const QUIZZES = [
    {
      q: "What chain is COMMUNITY Coin on?",
      options: ["Ethereum", "Solana", "Bitcoin"],
      answer: 1,
    },
    {
      q: "Who controls the culture?",
      options: ["A CEO", "The community", "A private fund"],
      answer: 1,
    },
    {
      q: "Vault deposits generate yield?",
      options: ["Yes", "No — voluntary only", "Sometimes"],
      answer: 1,
    },
  ];

  bot.command("quiz", async (ctx) => {
    ensure(ctx);
    const item = QUIZZES[Math.floor(Math.random() * QUIZZES.length)];
    const kb = new InlineKeyboard();
    item.options.forEach((opt, i) =>
      kb.text(opt, `quiz:${i}:${item.answer}`).row()
    );
    await ctx.reply(`*Quiz*\n${item.q}`, {
      parse_mode: "Markdown",
      reply_markup: kb,
    });
  });

  bot.callbackQuery(/^quiz:(\d+):(\d+)$/, async (ctx) => {
    const p = ensure(ctx);
    if (!p) return ctx.answerCallbackQuery();
    const picked = Number(ctx.match![1]);
    const answer = Number(ctx.match![2]);
    if (picked === answer) {
      addPoints(p.id, 15);
      const updated = getPlayer(p.id)!;
      updated.quizCorrect += 1;
      await ctx.answerCallbackQuery({ text: `Correct! +15 → ${updated.points}` });
      try {
        await ctx.editMessageText(`✓ Correct. +15 pts (bal ${updated.points})`);
      } catch {}
    } else {
      await ctx.answerCallbackQuery({ text: "Wrong" });
      try {
        await ctx.editMessageText("Wrong. /quiz for another.");
      } catch {}
    }
  });

  bot.command("memebattle", async (ctx) => {
    ensure(ctx);
    if (!ctx.chat) return;
    if (getActiveBattle(String(ctx.chat.id))) {
      if (isGroup(ctx)) return;
      return ctx.reply("Battle already running.");
    }
    startBattle(String(ctx.chat.id));
    await ctx.reply(
      `*Meme battle* (5 min)\n\`/meme your text\` · winner +50`,
      { parse_mode: "Markdown" }
    );
  });

  bot.command("meme", async (ctx) => {
    const p = ensure(ctx);
    if (!p || !ctx.chat) return;
    const battle = getActiveBattle(String(ctx.chat.id));
    if (!battle) {
      if (isGroup(ctx)) return;
      return ctx.reply("No active battle. /memebattle");
    }
    if (battle.endsAt <= Date.now()) {
      const closed = closeBattle(battle.id);
      if (closed?.entries.length) {
        const w = closed.entries[0];
        const wp = getPlayer(w.userId);
        await ctx.reply(`Battle ended. Winner: ${wp ? display(wp) : w.userId}`);
      }
      return;
    }
    const textMsg = (ctx.message?.text || "")
      .replace(/^\/meme(@\w+)?\s*/i, "")
      .trim();
    const result = addMemeEntry(battle.id, p.id, textMsg);
    if (!result.ok) {
      if (isGroup(ctx)) return;
      return ctx.reply(result.error);
    }
    const kb = new InlineKeyboard();
    battle.entries.forEach((e, i) => {
      const author = getPlayer(e.userId);
      kb.text(
        `${i + 1}. ${(author ? display(author) : "?").slice(0, 12)} (${e.votes.length})`,
        `mvote:${battle.id}:${i}`
      ).row();
    });
    await ctx.reply(`Entry in (${battle.entries.length}). Vote:`, {
      reply_markup: kb,
    });
  });

  bot.callbackQuery(/^mvote:([^:]+):(\d+)$/, async (ctx) => {
    const p = ensure(ctx);
    if (!p) return ctx.answerCallbackQuery();
    const result = voteMeme(ctx.match![1], Number(ctx.match![2]), p.id);
    // Silent toast only — no group spam
    await ctx.answerCallbackQuery({
      text: result.ok ? "Vote recorded" : result.error,
    });
  });

  bot.command("vault", async (ctx) => {
    await ctx.reply(
      `*Vault* (marketing & airdrops)\n\`${TREASURY}\`\nhttps://explorer.solana.com/address/${TREASURY}`,
      { parse_mode: "Markdown" }
    );
  });

  bot.command("price", async (ctx) => {
    try {
      const response = await fetch(site + "/api/token", {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(8000),
      });
      const data = (await response.json()) as {
        configured?: boolean;
        mint?: string;
        supply?: { uiAmount?: string };
        message?: string;
      };
      if (!response.ok || !data.configured || !data.supply) {
        if (isGroup(ctx)) return;
        return ctx.reply("Token data unavailable.");
      }
      return ctx.reply(
        `Mint: \`${data.mint}\`\nSupply: ${data.supply.uiAmount}`,
        { parse_mode: "Markdown" }
      );
    } catch {
      if (isGroup(ctx)) return;
      return ctx.reply("Could not reach token data.");
    }
  });

  async function solBalance(address: string): Promise<string | null> {
    const rpc = process.env.SOLANA_RPC_URL;
    if (!rpc) return null;
    try {
      const conn = new Connection(rpc, "confirmed");
      const lamports = await conn.getBalance(new PublicKey(address));
      return (lamports / LAMPORTS_PER_SOL).toFixed(4);
    } catch {
      return null;
    }
  }

  function looksLikeSeedOrSecret(input: string): boolean {
    const t = input.trim().toLowerCase();
    if (t.split(/\s+/).length >= 12) return true;
    if (/^\d+(,\s*\d+){31,}$/.test(t)) return true;
    if (t.length > 88) return true;
    return false;
  }

  function isValidSolAddress(input: string): boolean {
    try {
      const pk = new PublicKey(input.trim());
      return PublicKey.isOnCurve(pk.toBytes());
    } catch {
      return false;
    }
  }

  // Wallet — private only
  bot.command("wallet", async (ctx) => {
    if (isGroup(ctx)) {
      // Ignore full wallet flow in groups
      return;
    }
    const p = ensure(ctx);
    if (!p) return;

    const parts = (ctx.message?.text || "").trim().split(/\s+/);
    const sub = (parts[1] || "").toLowerCase();
    const arg = parts.slice(2).join(" ").trim();

    if (sub === "create") {
      if (p.walletAddress) {
        return ctx.reply(
          `Already linked:\n\`${p.walletAddress}\`\n/wallet clear to replace.`,
          { parse_mode: "Markdown" }
        );
      }
      const kp = Keypair.generate();
      const address = kp.publicKey.toBase58();
      const secret = Buffer.from(kp.secretKey).toString("base64");
      setCreatedWallet(p.id, address, secret);
      await ctx.reply(
        `*Wallet created*\n\n\`${address}\`\n\n*Backup (save offline):*\n\`${secret}\`\n\nFund with SOL. Never share the secret.`,
        { parse_mode: "Markdown" }
      );
      return;
    }

    if (sub === "import") {
      if (!arg) {
        return ctx.reply(
          "`/wallet import PUBLIC_ADDRESS`\nNever paste seed phrases.",
          { parse_mode: "Markdown" }
        );
      }
      if (looksLikeSeedOrSecret(arg)) {
        return ctx.reply("Refused — public address only. Never paste seeds/keys.");
      }
      if (!isValidSolAddress(arg)) {
        return ctx.reply("Invalid Solana address.");
      }
      const address = new PublicKey(arg.trim()).toBase58();
      setImportedWallet(p.id, address);
      const bal = await solBalance(address);
      await ctx.reply(
        `Imported:\n\`${address}\`` +
          (bal != null ? `\nSOL: *${bal}*` : ""),
        { parse_mode: "Markdown" }
      );
      return;
    }

    if (sub === "clear") {
      if (!p.walletAddress) return ctx.reply("No wallet linked.");
      clearWallet(p.id);
      return ctx.reply("Unlinked. On-chain funds unchanged.");
    }

    if (!p.walletAddress) {
      return ctx.reply(
        `No wallet yet.\n\`/wallet create\` or \`/wallet import <address>\``,
        { parse_mode: "Markdown" }
      );
    }
    const bal = await solBalance(p.walletAddress);
    await ctx.reply(
      `*Wallet*\n\`${p.walletAddress}\`\nSource: ${p.walletSource}` +
        (bal != null ? `\nSOL: *${bal}*` : ""),
      { parse_mode: "Markdown" }
    );
  });

  // Wallet buttons — alerts only, never group spam
  bot.callbackQuery("wallet:create", async (ctx) => {
    await ctx.answerCallbackQuery({
      text: "Open a private chat with the bot → /wallet create",
      show_alert: true,
    });
  });

  bot.callbackQuery("wallet:status", async (ctx) => {
    const p = ensure(ctx);
    if (!p?.walletAddress) {
      return ctx.answerCallbackQuery({
        text: "No wallet. DM bot: /wallet create",
        show_alert: true,
      });
    }
    await ctx.answerCallbackQuery({
      text: p.walletAddress.slice(0, 8) + "…" + p.walletAddress.slice(-6),
      show_alert: true,
    });
  });

  bot.callbackQuery("wallet:import_help", async (ctx) => {
    await ctx.answerCallbackQuery({
      text: "DM: /wallet import YOUR_ADDRESS",
      show_alert: true,
    });
  });

  bot.command("treasury", async (ctx) => {
    if (isGroup(ctx)) return;
    await ctx.reply(`${site}/treasury`);
  });

  bot.command("governance", async (ctx) => {
    if (isGroup(ctx)) return;
    await ctx.reply(`${site}/governance`);
  });

  bot.catch((err) => console.error("Telegram bot error:", err));

  return bot;
}

export function getWebhookCallback() {
  const bot = createBot();
  return webhookCallback(bot, "std/http");
}
