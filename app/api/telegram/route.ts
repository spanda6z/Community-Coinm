import { getWebhookCallback } from "../../../bot/bot";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Telegram webhook endpoint for Vercel.
 * Set webhook to: https://YOUR_DOMAIN/api/telegram
 */
export async function POST(req: Request) {
  try {
    if (!process.env.TELEGRAM_BOT_TOKEN) {
      return new Response("Bot token not configured", { status: 503 });
    }
    const handleUpdate = getWebhookCallback();
    return await handleUpdate(req);
  } catch (e) {
    console.error("telegram webhook error", e);
    return new Response("Error", { status: 500 });
  }
}

/** Health check + setup hint */
export async function GET() {
  const configured = Boolean(process.env.TELEGRAM_BOT_TOKEN);
  return Response.json({
    ok: true,
    bot: configured ? "configured" : "missing TELEGRAM_BOT_TOKEN",
    webhook: "POST updates to this URL",
    setup:
      "curl https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://community-coinm.vercel.app/api/telegram",
  });
}
