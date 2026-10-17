import { Bot, InlineKeyboard, Context } from "grammy";
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
} from "./store";

const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
  console.error("TELEGRAM_BOT_TOKEN is required to start the bot.");
  process.exit(1);
}

const bot = new Bot(token);
const site = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://community-coinm.vercel.app"
).replace(/\/$/, "");
const TREASURY =
  process.env.NEXT_PUBLIC_TREASURY_ADDRESS ||
  "21fsnH5cGMoKdN49psbw1dcbD16VW64ziu1nnKPy4NAP";

const CAPTCHA_MS = 3 * 60 * 1000;

type PendingCaptcha = {
  chatId: number;
  userId: number;
  answer: number;
  a: number;
  b: number;
  messageId?: number;
  timer: ReturnType<typeof setTimeout>;
};

const pending = new Map<string, PendingCaptcha>();

function captchaKey(chatId: number, userId: number) {
  return `${chatId}:${userId}`;
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

function makeMath(): { a: number; b: number; answer: number } {
  const a = 2 + Math.floor(Math.random() * 12);
  const b = 2 + Math.floor(Math.random() * 12);
  return { a, b, answer: a + b };
}

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

function clearCaptcha(key: string) {
  const p = pending.get(key);
  if (p) {
    clearTimeout(p.timer);
    pending.delete(key);
  }
}

async function startCaptcha(
  chatId: number,
  user: { id: number; first_name?: string; username?: string }
) {
  const key = captchaKey(chatId, user.id);
  clearCaptcha(key);
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
    `Tap the correct answer below. Wrong answer or timeout = removed.`;

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

  const timer = setTimeout(async () => {
    const still = pending.get(key);
    if (!still) return;
    pending.delete(key);
    await kickMember(chatId, user.id);
    try {
      await bot.api.sendMessage(
        chatId,
        `${mention(user)} did not verify in time and was removed. They can rejoin and try again.`,
        { parse_mode: "Markdown" }
      );
      if (messageId) {
        await bot.api.deleteMessage(chatId, messageId).catch(() => {});
      }
    } catch {}
  }, CAPTCHA_MS);

  pending.set(key, {
    chatId,
    userId: user.id,
    answer,
    a,
    b,
    messageId,
    timer,
  });
}

bot.on("message:new_chat_members", async (ctx) => {
  const chatId = ctx.chat?.id;
  if (!chatId || chatId > 0) return;
  const members = ctx.message?.new_chat_members || [];
  for (const member of members) {
    if (member.is_bot) continue;
    touchPlayer(String(member.id), member.username, member.first_name);
    await startCaptcha(chatId, member);
  }
});

bot.on("chat_member", async (ctx) => {
  const update = ctx.chatMember;
  if (!update) return;
  const chatId = update.chat.id;
  if (chatId > 0) return;
  const oldStatus = update.old_chat_member.status;
  const newStatus = update.new_chat_member.status;
  const user = update.new_chat_member.user;
  if (user.is_bot) return;
  const joined =
    (oldStatus === "left" || oldStatus === "kicked") &&
    (newStatus === "member" || newStatus === "restricted");
  if (!joined) return;
  touchPlayer(String(user.id), user.username, user.first_name);
  await startCaptcha(chatId, user);
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
  const key = captchaKey(chatId, userId);
  const challenge = pending.get(key);
  if (!challenge) {
    return ctx.answerCallbackQuery({
      text: "This check expired. Rejoin the group.",
      show_alert: true,
    });
  }
  if (picked !== challenge.answer) {
    clearCaptcha(key);
    await ctx.answerCallbackQuery({ text: "Wrong answer.", show_alert: true });
    await kickMember(chatId, userId);
    try {
      await ctx.editMessageText(
        `Verification failed for user ${userId}. Removed from the group.`
      );
    } catch {}
    try {
      await bot.api.sendMessage(
        chatId,
        `A user failed the guardian check and was removed.`
      );
    } catch {}
    return;
  }
  clearCaptcha(key);
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
      `✅ ${mention(ctx.from)} verified.\n\n` +
        `Welcome to *COMMUNITY Coin*.\n` +
        `You can chat now. +10 points starter boost.\n\n` +
        `Try /daily · /tip · /leaderboard · /vault`,
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
    `Welcome to COMMUNITY Coin.\n\n` +
      `Community-owned. No CEO. Built by holders.\n\n` +
      `${p ? `You have *${p.points} points*.` : ""}\n\n` +
      `Commands:\n` +
      `/help — full list\n` +
      `/daily — claim daily points\n` +
      `/tip @user 50 — tip points\n` +
      `/rain 100 — rain points to active chat\n` +
      `/leaderboard — top community\n` +
      `/vault — community treasury\n` +
      `/memebattle — start a meme fight\n\n` +
      `Points are for activity only — not real tokens.`,
    { parse_mode: "Markdown" }
  );
});

bot.command("help", async (ctx) => {
  await ctx.reply(
    `*COMMUNITY Coin bot*\n\n` +
      `*Activity (points)*\n` +
      `/daily — +25 points once per day\n` +
      `/tip @user amount — send points\n` +
      `/rain amount — split points to recent chatters\n` +
      `/balance — your points\n` +
      `/leaderboard — top 10\n\n` +
      `*Culture*\n` +
      `/quiz — quick community quiz\n` +
      `/memebattle — 5-min meme contest in this chat\n` +
      `/meme your text — submit during a battle\n\n` +
      `*On-chain*\n` +
      `/vault — treasury wallet\n` +
      `/price — token data status\n` +
      `/wallet — link Solana wallet (no funds move)\n` +
      `/treasury — treasury page\n\n` +
      `*Guardian*\n` +
      `New members must solve a maths check within 3 minutes or get removed.\n\n` +
      `Points ≠ tokens. Real token tips stay disabled until secure transfers ship.`,
    { parse_mode: "Markdown" }
  );
});

bot.command("balance", async (ctx) => {
  const p = ensure(ctx);
  if (!p) return;
  await ctx.reply(
    `${display(p)}\n` +
      `Points: *${p.points}*\n` +
      `Tips sent: ${p.tipsSent} · received: ${p.tipsReceived}\n` +
      `Quiz wins: ${p.quizCorrect} · meme wins: ${p.memeWins}`,
    { parse_mode: "Markdown" }
  );
});

bot.command("daily", async (ctx) => {
  const p = ensure(ctx);
  if (!p) return;
  const result = claimDaily(p.id);
  if (!result.ok) return ctx.reply(result.error);
  await ctx.reply(
    `Daily claimed: *+${result.amount}* points.\nBalance: *${result.points}*`,
    { parse_mode: "Markdown" }
  );
});

bot.command("tip", async (ctx) => {
  const p = ensure(ctx);
  if (!p) return;
  const text = (ctx.message?.text || "").trim();
  const parts = text.split(/\s+/);
  let targetUsername: string | undefined;
  let amountStr: string | undefined;
  let targetId: string | undefined;

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
    return ctx.reply("Usage: `/tip @username 50` or reply with `/tip 50`", {
      parse_mode: "Markdown",
    });
  }

  let to = targetId ? getPlayer(targetId) : undefined;
  if (!to && targetUsername) to = findByUsername(targetUsername);
  if (!to) {
    return ctx.reply(
      "That user isn't in the system yet. They need to open the bot and press /start first."
    );
  }

  const result = transferPoints(p.id, to.id, Math.floor(amount));
  if (!result.ok) return ctx.reply(result.error);

  await ctx.reply(
    `${display(p)} tipped *${Math.floor(amount)}* points to ${display(to)}.\n` +
      `Your balance: *${getPlayer(p.id)?.points}*`,
    { parse_mode: "Markdown" }
  );
});

bot.command("rain", async (ctx) => {
  const p = ensure(ctx);
  if (!p || !ctx.chat) return;
  const parts = (ctx.message?.text || "").trim().split(/\s+/);
  const amount = Math.floor(Number(parts[1]));
  if (!Number.isFinite(amount) || amount < 10) {
    return ctx.reply("Usage: `/rain 100` (minimum 10 points)", {
      parse_mode: "Markdown",
    });
  }
  if (p.points < amount) {
    return ctx.reply(`Not enough points. You have ${p.points}.`);
  }

  const recipients = getActive(String(ctx.chat.id), p.id).slice(0, 10);
  if (recipients.length === 0) {
    return ctx.reply(
      "No recent active users to rain on. Need more chat activity first."
    );
  }

  const each = Math.floor(amount / recipients.length);
  if (each < 1) return ctx.reply("Amount too small to split.");

  const total = each * recipients.length;
  addPoints(p.id, -total);
  p.tipsSent += recipients.length;

  const names: string[] = [];
  for (const rid of recipients) {
    addPoints(rid, each);
    const rp = getPlayer(rid);
    if (rp) {
      rp.tipsReceived += 1;
      names.push(display(rp));
    }
  }

  await ctx.reply(
    `Rain from ${display(p)}: *${each}* points × ${recipients.length} people (*${total}* total)\n` +
      names.join(", "),
    { parse_mode: "Markdown" }
  );
});

bot.command("leaderboard", async (ctx) => {
  ensure(ctx);
  const top = leaderboard(10);
  if (!top.length) return ctx.reply("No players yet. Be the first — /start");
  const lines = top.map(
    (p, i) => `${i + 1}. ${display(p)} — *${p.points}* pts`
  );
  await ctx.reply(`*Community leaderboard*\n\n${lines.join("\n")}`, {
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
    q: "Vault deposits generate guaranteed yield?",
    options: ["Yes", "No — voluntary only", "Only on Fridays"],
    answer: 1,
  },
  {
    q: "What's the shared long-term vision target?",
    options: ["$1M MC", "$1B MC", "$10B MC"],
    answer: 1,
  },
];

bot.command("quiz", async (ctx) => {
  ensure(ctx);
  const item = QUIZZES[Math.floor(Math.random() * QUIZZES.length)];
  const kb = new InlineKeyboard();
  item.options.forEach((opt, i) => {
    kb.text(opt, `quiz:${i}:${item.answer}`).row();
  });
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
    await ctx.answerCallbackQuery({ text: "Correct! +15 points" });
    await ctx.editMessageText(
      `Correct. +15 points.\nBalance: *${updated.points}*`,
      { parse_mode: "Markdown" }
    );
  } else {
    await ctx.answerCallbackQuery({ text: "Not quite — try another /quiz" });
    await ctx.editMessageText("Wrong answer. Run /quiz for another question.");
  }
});

bot.command("memebattle", async (ctx) => {
  ensure(ctx);
  if (!ctx.chat) return;
  const existing = getActiveBattle(String(ctx.chat.id));
  if (existing) {
    return ctx.reply(
      "A battle is already running. Submit with:\n`/meme your caption here`\nOr wait for it to end.",
      { parse_mode: "Markdown" }
    );
  }
  const battle = startBattle(String(ctx.chat.id));
  await ctx.reply(
    `*Meme battle started* (5 minutes)\n\n` +
      `Submit: `/meme your meme text`\n` +
      `When entries are in, vote on the list that appears.\n` +
      `Winner gets *+50 points*.`,
    { parse_mode: "Markdown" }
  );

  setTimeout(async () => {
    const closed = closeBattle(battle.id);
    if (!closed || !closed.entries.length) {
      try {
        await ctx.api.sendMessage(
          ctx.chat!.id,
          "Meme battle ended — no entries."
        );
      } catch {}
      return;
    }
    const winner = closed.entries[0];
    const wp = getPlayer(winner.userId);
    const lines = closed.entries.slice(0, 5).map((e, i) => {
      const author = getPlayer(e.userId);
      return `${i + 1}. ${display(author || { name: e.userId })} (${e.votes.length} votes)\n   ${e.text}`;
    });
    try {
      await ctx.api.sendMessage(
        ctx.chat!.id,
        `*Meme battle results*\n\nWinner: ${wp ? display(wp) : winner.userId} (+50 pts)\n\n${lines.join("\n\n")}`,
        { parse_mode: "Markdown" }
      );
    } catch {}
  }, 5 * 60 * 1000);
});

bot.command("meme", async (ctx) => {
  const p = ensure(ctx);
  if (!p || !ctx.chat) return;
  const battle = getActiveBattle(String(ctx.chat.id));
  if (!battle) {
    return ctx.reply("No active battle. Start one with /memebattle");
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

  await ctx.reply(`Entry in. (${battle.entries.length} total)\n\nVote:`, {
    reply_markup: kb,
  });
});

bot.callbackQuery(/^mvote:([^:]+):(\d+)$/, async (ctx) => {
  const p = ensure(ctx);
  if (!p) return ctx.answerCallbackQuery();
  const battleId = ctx.match![1];
  const idx = Number(ctx.match![2]);
  const result = voteMeme(battleId, idx, p.id);
  if (!result.ok) return ctx.answerCallbackQuery({ text: result.error });
  await ctx.answerCallbackQuery({ text: "Vote recorded" });
});

bot.command("vault", async (ctx) => {
  await ctx.reply(
    `*Community vault*\n\n` +
      `\`${TREASURY}\`\n\n` +
      `Funds are used for *marketing* and *airdrops* — growth and community rewards.\n` +
      `Voluntary only. No yield. No guaranteed returns.\n\n` +
      `Explorer:\nhttps://explorer.solana.com/address/${TREASURY}`,
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
      note?: string;
    };
    if (!response.ok || !data.configured || !data.supply) {
      return ctx.reply(
        "Live token data unavailable. " +
          (data.message || "Mint / RPC not configured yet.")
      );
    }
    return ctx.reply(
      `*On-chain data*\nMint: \`${data.mint}\`\nSupply: ${data.supply.uiAmount}\n\n` +
        `Market price is not shown until a trusted source is connected.\n` +
        (data.note || ""),
      { parse_mode: "Markdown" }
    );
  } catch {
    return ctx.reply("Could not reach token data. Try again later.");
  }
});

bot.command("wallet", async (ctx) => {
  const keyboard = new InlineKeyboard().url(
    "Open wallet linking",
    site + "/link-wallet"
  );
  await ctx.reply(
    "Link your Solana wallet by signing a short message. This does *not* send funds. Never share a seed phrase.",
    { parse_mode: "Markdown", reply_markup: keyboard }
  );
});

bot.command("treasury", async (ctx) => {
  await ctx.reply(`Treasury page:\n${site}/treasury`);
});

bot.command("governance", async (ctx) => {
  await ctx.reply(
    `Governance page:\n${site}/governance\n\nVotes do not authorize treasury transfers.`
  );
});

bot.catch((err) => console.error("Telegram bot error:", err));

console.log("COMMUNITY Coin bot starting…");
bot.start({
  allowed_updates: [
    "message",
    "callback_query",
    "chat_member",
    "my_chat_member",
  ],
});
console.log("Bot is running (guardian captcha enabled).");
