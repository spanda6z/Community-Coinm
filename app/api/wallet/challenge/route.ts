import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

// Intentionally fail closed: this endpoint must not create wallet challenges until
// Telegram identity is verified server-side and bound to the authenticated user.
export async function POST() {
  return NextResponse.json({
    error: "Wallet linking is not enabled until verified Telegram identity and one-time challenge handling are configured. Never send a seed phrase or private key.",
  }, { status: 503 });
}
