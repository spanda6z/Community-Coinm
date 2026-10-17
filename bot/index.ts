/**
 * Local long-polling mode (optional).
 * On Vercel, use the webhook at /api/telegram instead.
 *
 *   TELEGRAM_BOT_TOKEN=xxx npm run bot
 */
import { createBot } from "./bot";

const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
  console.error("TELEGRAM_BOT_TOKEN is required");
  process.exit(1);
}

const bot = createBot();

console.log("COMMUNITY Coin bot starting (polling)…");
bot.start({
  allowed_updates: [
    "message",
    "callback_query",
    "chat_member",
    "my_chat_member",
  ],
});
console.log("Bot is running (polling mode).");
