import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "community-coin",
    integrations: {
      solanaRpc: Boolean(process.env.SOLANA_RPC_URL),
      tokenMint: Boolean(process.env.NEXT_PUBLIC_TOKEN_MINT),
      telegramBot: Boolean(process.env.TELEGRAM_BOT_TOKEN),
      database: Boolean(process.env.DATABASE_URL),
    },
    note: "Integration flags indicate configuration only, not that external services have been verified.",
  });
}
