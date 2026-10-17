import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { PublicKey } from "@solana/web3.js";
import { prisma } from "@/lib/prisma";
import { verifyTelegramInitData } from "@/lib/telegram";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: { initData?: unknown; wallet?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Expected JSON with initData and wallet." }, { status: 400 });
  }
  if (typeof body.initData !== "string" || typeof body.wallet !== "string") {
    return NextResponse.json({ error: "Verified Telegram initData and a wallet public address are required." }, { status: 400 });
  }
  const telegramUser = verifyTelegramInitData(body.initData);
  if (!telegramUser) return NextResponse.json({ error: "Telegram identity could not be verified." }, { status: 401 });

  let wallet: string;
  try {
    wallet = new PublicKey(body.wallet).toBase58();
  } catch {
    return NextResponse.json({ error: "Invalid Solana wallet address." }, { status: 400 });
  }

  try {
    const user = await prisma.user.upsert({
      where: { telegramId: telegramUser.id },
      create: { telegramId: telegramUser.id, displayName: [telegramUser.firstName, telegramUser.lastName].filter(Boolean).join(" ") || null },
      update: {},
      select: { id: true },
    });
    const existing = await prisma.wallet.findUnique({ where: { address: wallet }, select: { userId: true } });
    if (existing && existing.userId !== user.id) {
      return NextResponse.json({ error: "That wallet is already linked to another account." }, { status: 409 });
    }
    const nonce = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
    const challenge = await prisma.walletLinkChallenge.create({
      data: { nonce, wallet, userRef: user.id, expiresAt },
    });
    const domain = new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").host;
    const message = [
      "COMMUNITY Coin wallet verification",
      `Domain: ${domain}`,
      `Telegram user: ${telegramUser.id}`,
      `Wallet: ${wallet}`,
      `Nonce: ${nonce}`,
      `Expires: ${expiresAt.toISOString()}`,
    ].join("\n");
    return NextResponse.json({ challengeId: challenge.id, wallet, message, expiresAt: expiresAt.toISOString() }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Wallet challenge storage is unavailable. Check DATABASE_URL and database schema." }, { status: 503 });
  }
}
