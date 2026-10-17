import { Bot, InlineKeyboard } from "grammy";

const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
  console.error("TELEGRAM_BOT_TOKEN is required to start the bot.");
  process.exit(1);
}
const bot = new Bot(token);
const site = (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/$/, "");
bot.command("start", async (ctx) => ctx.reply(
  "Welcome to COMMUNITY Coin.\n\nCommunity first, transparency always.\n\nCommands: /help /price /wallet /governance /treasury /tip",
));
bot.command("help", async (ctx) => ctx.reply(
  "COMMUNITY Coin bot commands\n/price — token data status\n/wallet — securely link your own wallet\n/governance — community proposals\n/treasury — public treasury activity\n/tip — tipping setup status\n\nWallet linking and transfers will only be enabled after secure wallet verification and on-chain transaction checks are configured.",
));
bot.command("price", async (ctx) => {
  if (!site) return ctx.reply("Token data is not configured yet. Set NEXT_PUBLIC_SITE_URL.");
  try {
    const response = await fetch(site + "/api/token", { headers: { "Accept": "application/json" }, signal: AbortSignal.timeout(8000) });
    const data = await response.json() as { configured?: boolean; mint?: string; supply?: { uiAmount?: string }; note?: string; message?: string };
    if (!response.ok || !data.configured || !data.supply) {
      return ctx.reply("Live on-chain token data is currently unavailable. " + (data.message || "Check the mint and RPC configuration."));
    }
    return ctx.reply("COMMUNITY Coin — verified on-chain data\nMint: " + data.mint + "\nMinted supply: " + data.supply.uiAmount + "\n\nMarket price is not displayed until a trusted market-data source is configured.\n" + (data.note || ""));
  } catch {
    return ctx.reply("Could not reach the token data endpoint. Try again later.");
  }
});
bot.command("wallet", async (ctx) => {
  if (!site) return ctx.reply("Wallet linking is not configured yet. Set NEXT_PUBLIC_SITE_URL.");
  const keyboard = new InlineKeyboard().url("Open wallet linking", site + "/link-wallet");
  return ctx.reply("Link your wallet by signing a short-lived verification message. This does not send funds. Never share a seed phrase or private key.", { reply_markup: keyboard });
});
bot.command("governance", async (ctx) => {
  if (!site) return ctx.reply("Governance link is not configured yet.");
  return ctx.reply("Explore proposals and community polls. Votes do not authorize treasury transfers.\n" + site + "/governance");
});
bot.command("treasury", async (ctx) => {
  if (!site) return ctx.reply("Treasury link is not configured yet.");
  return ctx.reply("View recent confirmed native SOL activity. SPL token transfers are not yet indexed.\n" + site + "/treasury");
});
bot.command("tip", async (ctx) => ctx.reply(
  "Tipping is not enabled yet. Before transfers launch, usernames will need verified account-to-wallet links and every transfer will be signed in the user's own wallet. Never send a seed phrase or private key to a bot.",
));
bot.catch((err) => console.error("Telegram bot error:", err));
bot.start();
