import { Bot, InlineKeyboard, Context } from "grammy";
import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import {
  getPlayer,
  claimDaily,
  leaderboard,
  type Player,
} from "./store";

export type MenuDeps = {
  site: string;
  treasury: string;
  ensure: (ctx: Context) => Player | null;
  isPrivate: (ctx: Context) => boolean;
  isGroup: (ctx: Context) => boolean;
  display: (p: { username?: string; name: string }) => string;
};

export function registerMenu(bot: Bot, d: MenuDeps) {
  const { site, treasury: TREASURY, ensure, isPrivate, isGroup, display } = d;

  function mainMenuKeyboard() {
    return new InlineKeyboard()
      .text("🎁 Daily", "menu:daily")
      .text("👤 Points", "menu:balance")
      .row()
      .text("🏆 Board", "menu:leaderboard")
      .text("🏦 Vault", "menu:vault")
      .row()
      .text("🧠 Quiz", "menu:quiz")
      .text("💼 Wallet", "menu:wallet")
      .row()
      .text("❓ Help", "menu:help")
      .text("↻ Refresh", "menu:home")
      .row()
      .url("🌐 Site", site)
      .url(
        "💬 Chat",
        process.env.NEXT_PUBLIC_TELEGRAM_URL || "https://t.me/communitycoinchatt"
      );
  }

  function walletMenuKeyboard() {
    return new InlineKeyboard()
      .text("➕ Create", "wallet:create")
      .text("📥 Import help", "wallet:import_help")
      .row()
      .text("📋 Status", "wallet:status")
      .text("« Back", "menu:home");
  }

  function homeText(p: Player | null) {
    const pts = p ? p.points : 0;
    const w = p?.walletAddress
      ? "`" +
        p.walletAddress.slice(0, 4) +
        "…" +
        p.walletAddress.slice(-4) +
        "` (" +
        p.walletSource +
        ")"
      : "_none — open Wallet_";
    return (
      "*COMMUNITY Coin*\n" +
      "Community-owned · Solana\n\n" +
      "Points: *" +
      pts +
      "*\n" +
      "Wallet: " +
      w +
      "\n\n" +
      "Pick a button below.\n" +
      "_Points are for activity only — not tokens._"
    );
  }

  async function editOrReply(
    ctx: Context,
    text: string,
    keyboard?: InlineKeyboard
  ) {
    try {
      await ctx.editMessageText(text, {
        parse_mode: "Markdown",
        reply_markup: keyboard,
      });
    } catch {
      await ctx.reply(text, {
        parse_mode: "Markdown",
        reply_markup: keyboard,
      });
    }
  }

  bot.command("start", async (ctx) => {
    if (isGroup(ctx)) return;
    const p = ensure(ctx);
    await ctx.reply(homeText(p), {
      parse_mode: "Markdown",
      reply_markup: mainMenuKeyboard(),
    });
  });

  bot.command("menu", async (ctx) => {
    if (isGroup(ctx)) return;
    const p = ensure(ctx);
    await ctx.reply(homeText(p), {
      parse_mode: "Markdown",
      reply_markup: mainMenuKeyboard(),
    });
  });

  bot.callbackQuery(
    /^menu:(home|daily|balance|leaderboard|help|vault|wallet|quiz)$/,
    async (ctx) => {
      const action = ctx.match![1];
      const p = ensure(ctx);
      if (!isPrivate(ctx)) {
        await ctx.answerCallbackQuery({
          text: "Open the bot in private chat for the full menu.",
          show_alert: true,
        });
        return;
      }

      if (action === "home") {
        await ctx.answerCallbackQuery();
        await editOrReply(ctx, homeText(p), mainMenuKeyboard());
        return;
      }

      if (action === "daily") {
        if (!p) return ctx.answerCallbackQuery();
        const result = claimDaily(p.id);
        await ctx.answerCallbackQuery({
          text: result.ok
            ? `+${result.amount} → ${result.points} pts`
            : result.error.slice(0, 180),
          show_alert: true,
        });
        const refreshed = getPlayer(p.id) || p;
        await editOrReply(
          ctx,
          homeText(refreshed) +
            (result.ok
              ? `\n\n✅ Daily claimed: *+${result.amount}*`
              : `\n\n⏳ ${result.error}`),
          mainMenuKeyboard()
        );
        return;
      }

      if (action === "balance") {
        if (!p) return ctx.answerCallbackQuery();
        await ctx.answerCallbackQuery({ text: `${p.points} points` });
        const lines =
          `*Your profile*\n\n` +
          `Name: ${display(p)}\n` +
          `Points: *${p.points}*\n` +
          `Tips: ${p.tipsSent} sent · ${p.tipsReceived} received\n` +
          `Quiz correct: ${p.quizCorrect} · Meme wins: ${p.memeWins}\n` +
          (p.walletAddress
            ? `Wallet:\n\`${p.walletAddress}\`\n_(${p.walletSource})_`
            : `Wallet: not linked`);
        await editOrReply(
          ctx,
          lines,
          new InlineKeyboard().text("« Menu", "menu:home")
        );
        return;
      }

      if (action === "leaderboard") {
        const top = leaderboard(10);
        await ctx.answerCallbackQuery();
        if (!top.length) {
          await editOrReply(
            ctx,
            "*Leaderboard*\n\nNo players yet. Claim daily to appear.",
            new InlineKeyboard().text("« Menu", "menu:home")
          );
          return;
        }
        const lines = top.map(
          (player, i) => `${i + 1}. ${display(player)} — *${player.points}*`
        );
        await editOrReply(
          ctx,
          `*Leaderboard*\n\n${lines.join("\n")}`,
          new InlineKeyboard().text("« Menu", "menu:home")
        );
        return;
      }

      if (action === "vault") {
        await ctx.answerCallbackQuery({ text: "Loading vault…" });
        let bal = "—";
        try {
          const rpc =
            process.env.SOLANA_RPC_URL || "https://api.mainnet-beta.solana.com";
          const conn = new Connection(rpc, "confirmed");
          const lamports = await conn.getBalance(new PublicKey(TREASURY));
          bal = (lamports / LAMPORTS_PER_SOL).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 4,
          });
        } catch {}
        const text =
          `*Community vault*\n\n` +
          `Balance: *${bal} SOL*\n\n` +
          `\`${TREASURY}\`\n\n` +
          `Marketing & airdrops only.\nVoluntary. No yield.`;
        await editOrReply(
          ctx,
          text,
          new InlineKeyboard()
            .url("Explorer", `https://explorer.solana.com/address/${TREASURY}`)
            .url("Support", site + "/donate")
            .row()
            .text("« Menu", "menu:home")
        );
        return;
      }

      if (action === "wallet") {
        await ctx.answerCallbackQuery();
        const text =
          `*Wallet*\n\n` +
          (p?.walletAddress
            ? `Linked:\n\`${p.walletAddress}\`\nSource: *${p.walletSource}*\n\n`
            : `No wallet linked yet.\n\n`) +
          `• *Create* — new Solana key (backup shown once)\n` +
          `• *Import* — public address only (never seed phrases)\n\n` +
          `Or type:\n\`/wallet create\`\n\`/wallet import <address>\``;
        await editOrReply(ctx, text, walletMenuKeyboard());
        return;
      }

      if (action === "quiz") {
        await ctx.answerCallbackQuery();
        const pool = [
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
        const item = pool[Math.floor(Math.random() * pool.length)];
        const kb = new InlineKeyboard();
        item.options.forEach((opt, i) =>
          kb.text(opt, `quiz:${i}:${item.answer}`).row()
        );
        kb.text("« Menu", "menu:home");
        await editOrReply(ctx, `*Quiz*\n${item.q}`, kb);
        return;
      }

      if (action === "help") {
        await ctx.answerCallbackQuery();
        await editOrReply(
          ctx,
          `*Help*\n\n` +
            `*Activity*\n/daily · /tip · /rain · /leaderboard\n/quiz · /memebattle · /meme\n\n` +
            `*Vault*\n/vault — live SOL balance\n\n` +
            `*Wallet (DM)*\n/wallet create · import · clear\n\n` +
            `*Groups*\ntip · rain · board · quiz · memes · vault\nPersonal menus stay in DM.\n\n` +
            `Never paste seed phrases into the bot.`,
          new InlineKeyboard().text("« Menu", "menu:home")
        );
      }
    }
  );
}
