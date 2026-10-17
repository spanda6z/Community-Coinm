import { Bot } from "grammy";

const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
  console.error("TELEGRAM_BOT_TOKEN is required to start the bot.");
  process.exit(1);
}
const bot = new Bot(token);
bot.command("start", async (ctx) => ctx.reply(
  "Welcome to COMMUNITY Coin.\n\nCommunity first, transparency always.\n\nCommands: /help /price /tip",
));
bot.command("help", async (ctx) => ctx.reply(
  "COMMUNITY Coin bot commands\n/price — token data status\n/tip — tipping setup status\n\nWallet linking and transfers will only be enabled after secure wallet verification and on-chain transaction checks are configured.",
));
bot.command("price", async (ctx) => {
  if (!process.env.NEXT_PUBLIC_TOKEN_MINT || !process.env.SOLANA_RPC_URL) {
    return ctx.reply("Live token data is not configured yet. No price is shown rather than inventing one.");
  }
  return ctx.reply("Token mint and RPC are configured. Visit the project website for verified on-chain supply data. Live market pricing requires a trusted market-data source.");
});
bot.command("tip", async (ctx) => ctx.reply(
  "Tipping is not enabled yet. Before transfers launch, usernames will need verified account-to-wallet links and every transfer will be signed in the user's own wallet. Never send a seed phrase or private key to a bot.",
));
bot.catch((err) => console.error("Telegram bot error:", err));
bot.start();
