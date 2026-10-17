import { Bot, InlineKeyboard, Context, webhookCallback } from "grammy";
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
} from "./store";

const CAPTCHA_MS = 3 * 60 * 1000;

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
      `*COMMUNITY Coin* — community-owned on Solana.\n` +
      `No CEO. No private allocation. Holders build the culture.\n\n` +
      `🔐 *Guardian check*\n` +
      `Solve this to unlock chat (3 minutes):\n\n` +
      `*What is ${a} + ${b}?*\n\n` +
      `Tap the correct answer. Wrong or timeout = removed.`;

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
        text: "This check is not for you.",
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
      await ctx.answerCallbackQuery({ text: "Wrong answer.", show_alert: true });
      await kickMember(chatId, userId);
      try {
        await ctx.editMessageText("Verification failed. Removed from the group.");
      } catch {}
      return;
    }

    clearCaptcha(chatId, userId);
    await unrestrictMember(chatId, userId);
    await ctx.answerCallbackQuery({ text: "Verified. Welcome in." });
    const p = touchPlayer(
      String(userId),
      ctx.from.username,
      ctx.from.first_name
    );
    addPoints(p.id, 10);
    try {
      await ctx.editMessageText(
        `✅ ${mention(ctx.from)} verified.\n\nWelcome to *COMMUNITY Coin*.\n+10 points. Try /daily · /tip · /vault`,
        { parse_mode: "Markdown" }
      );
    } catch {}
  });

  bot.on("message", async (ctx, next) => {
    const id = uid(ctx);
    if (id && ctx.chat) {
      ensure(ctx);
      markActive(String(ctx.chat.id), id);
    }
    await next();
  });

  bot.command("start", async (ctx) => {
    const p = ensure(ctx);
    await ctx.reply(
      `Welcome to COMMUNITY Coin.\n\nCommunity-owned. No CEO. Built by holders.\n\n` +
        `${p ? `You have *${p.points} points*.` : ""}\n\n` +
        `/help · /daily · /tip · /rain · /leaderboard · /vault · /memebattle\n\n` +
        `Points are for activity only — not real tokens.`,
      { parse_mode: "Markdown" }
    );
  });

  bot.command("help", async (ctx) => {
    await ctx.reply(
      `*COMMUNITY Coin bot*\n\n` +
        `/daily /tip /rain /balance /leaderboard\n` +
        `/quiz /memebattle /meme\n` +
        `/vault /price /wallet /treasury\n\n` +
        `Guardian: new members solve maths in 3 min or get removed.\n` +
        `Points ≠ tokens.`,
      { parse_mode: "Markdown" }
    );
  });

  bot.command("balance", async (ctx) => {
    const p = ensure(ctx);
    if (!p) return;
    await ctx.reply(
      `${display(p)}\nPoints: *${p.points}*\nTips sent: ${p.tipsSent} · received: ${p.tipsReceived}`,
      { parse_mode: "Markdown" }
    );
  });

  bot.command("daily", async (ctx) => {
    const p = ensure(ctx);
    if (!p) return;
    const result = claimDaily(p.id);
    if (!result.ok) return ctx.reply(result.error);
    await ctx.reply(
      `Daily claimed: *+${result.amount}*\nBalance: *${result.points}*`,
      { parse_mode: "Markdown" }
    );
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
      return ctx.reply("Usage: `/tip @username 50` or reply `/tip 50`", {
        parse_mode: "Markdown",
      });
    }

    let to = targetId ? getPlayer(targetId) : undefined;
    if (!to && targetUsername) to = findByUsername(targetUsername);
    if (!to)
      return ctx.reply("User not found. They need to /start first.");

    const result = transferPoints(p.id, to.id, Math.floor(amount));
    if (!result.ok) return ctx.reply(result.error);
    await ctx.reply(
      `${display(p)} tipped *${Math.floor(amount)}* to ${display(to)}.\nYour balance: *${getPlayer(p.id)?.points}*`,
      { parse_mode: "Markdown" }
    );
  });

  bot.command("rain", async (ctx) => {
    const p = ensure(ctx);
    if (!p || !ctx.chat) return;
    const amount = Math.floor(Number((ctx.message?.text || "").split(/\s+/)[1]));
    if (!Number.isFinite(amount) || amount < 10)
      return ctx.reply("Usage: `/rain 100` (min 10)", { parse_mode: "Markdown" });
    if (p.points < amount)
      return ctx.reply(`Not enough points. You have ${p.points}.`);

    const recipients = getActive(String(ctx.chat.id), p.id).slice(0, 10);
    if (!recipients.length)
      return ctx.reply("No recent active users to rain on.");

    const each = Math.floor(amount / recipients.length);
    if (each < 1) return ctx.reply("Amount too small to split.");
    const total = each * recipients.length;
    addPoints(p.id, -total);

    const names: string[] = [];
    for (const rid of recipients) {
      addPoints(rid, each);
      const rp = getPlayer(rid);
      if (rp) names.push(display(rp));
    }
    await ctx.reply(
      `Rain: *${each}* × ${recipients.length} (*${total}*)\n${names.join(", ")}`,
      { parse_mode: "Markdown" }
    );
  });

  bot.command("leaderboard", async (ctx) => {
    ensure(ctx);
    const top = leaderboard(10);
    if (!top.length) return ctx.reply("No players yet — /start");
    const lines = top.map((p, i) => `${i + 1}. ${display(p)} — *${p.points}*`);
    await ctx.reply(`*Leaderboard*\n\n${lines.join("\n")}`, {
      parse_mode: "Markdown",
    });
  });

  const QUIZZES = [
    { q: "What chain is COMMUNITY Coin on?", options: ["Ethereum", "Solana", "Bitcoin"], answer: 1 },
    { q: "Who controls the culture?", options: ["A CEO", "The community", "A private fund"], answer: 1 },
    { q: "Vault deposits generate yield?", options: ["Yes", "No — voluntary only", "Sometimes"], answer: 1 },
    { q: "Shared vision target?", options: ["$1M MC", "$1B MC", "$10B MC"], answer: 1 },
  ];

  bot.command("quiz", async (ctx) => {
    ensure(ctx);
    const item = QUIZZES[Math.floor(Math.random() * QUIZZES.length)];
    const kb = new InlineKeyboard();
    item.options.forEach((opt, i) => kb.text(opt, `quiz:${i}:${item.answer}`).row());
    await ctx.reply(`*Quiz*\n${item.q}`, { parse_mode: "Markdown", reply_markup: kb });
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
      await ctx.answerCallbackQuery({ text: "Correct! +15" });
      await ctx.editMessageText(`Correct. +15\nBalance: *${updated.points}*`, {
        parse_mode: "Markdown",
      });
    } else {
      await ctx.answerCallbackQuery({ text: "Wrong" });
      await ctx.editMessageText("Wrong. Try /quiz again.");
    }
  });

  bot.command("memebattle", async (ctx) => {
    ensure(ctx);
    if (!ctx.chat) return;
    if (getActiveBattle(String(ctx.chat.id)))
      return ctx.reply("Battle already running. `/meme your text`", {
        parse_mode: "Markdown",
      });
    startBattle(String(ctx.chat.id));
    await ctx.reply(
      `*Meme battle* (5 min)\nSubmit: `/meme your text`\nWinner +50 points.`,
      { parse_mode: "Markdown" }
    );
  });

  bot.command("meme", async (ctx) => {
    const p = ensure(ctx);
    if (!p || !ctx.chat) return;
    const battle = getActiveBattle(String(ctx.chat.id));
    if (!battle) return ctx.reply("No active battle. /memebattle");
    // auto-close if expired
    if (battle.endsAt <= Date.now()) {
      const closed = closeBattle(battle.id);
      if (closed?.entries.length) {
        const w = closed.entries[0];
        const wp = getPlayer(w.userId);
        await ctx.reply(
          `Battle ended. Winner: ${wp ? display(wp) : w.userId} (+50)`
        );
      }
      return;
    }
    const text = (ctx.message?.text || "")
      .replace(/^\/meme(@\w+)?\s*/i, "")
      .trim();
    const result = addMemeEntry(battle.id, p.id, text);
    if (!result.ok) return ctx.reply(result.error);
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
    if (!result.ok) return ctx.answerCallbackQuery({ text: result.error });
    await ctx.answerCallbackQuery({ text: "Vote recorded" });
  });

  bot.command("vault", async (ctx) => {
    await ctx.reply(
      `*Community vault*\n\n\`${TREASURY}\`\n\n` +
        `Funds for *marketing* and *airdrops*.\n` +
        `Voluntary. No yield.\n\n` +
        `https://explorer.solana.com/address/${TREASURY}`,
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
      if (!response.ok || !data.configured || !data.supply)
        return ctx.reply(
          "Token data unavailable. " + (data.message || "Mint not configured.")
        );
      return ctx.reply(
        `*On-chain*\nMint: \`${data.mint}\`\nSupply: ${data.supply.uiAmount}`,
        { parse_mode: "Markdown" }
      );
    } catch {
      return ctx.reply("Could not reach token data.");
    }
  });

  bot.command("wallet", async (ctx) => {
    const keyboard = new InlineKeyboard().url(
      "Open wallet linking",
      site + "/link-wallet"
    );
    await ctx.reply(
      "Link wallet by signing a message. Does *not* send funds.",
      { parse_mode: "Markdown", reply_markup: keyboard }
    );
  });

  bot.command("treasury", async (ctx) => {
    await ctx.reply(`Treasury: ${site}/treasury`);
  });

  bot.command("governance", async (ctx) => {
    await ctx.reply(`Governance: ${site}/governance`);
  });

  bot.catch((err) => console.error("Telegram bot error:", err));

  return bot;
}

export function getWebhookCallback() {
  const bot = createBot();
  return webhookCallback(bot, "std/http");
}
