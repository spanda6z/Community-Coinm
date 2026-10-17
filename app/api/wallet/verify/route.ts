import { NextResponse } from "next/server";
import { PublicKey } from "@solana/web3.js";
import nacl from "tweetnacl";
import { prisma } from "@/lib/prisma";
import { verifyTelegramInitData } from "@/lib/telegram";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: { initData?: unknown; challengeId?: unknown; signature?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Expected JSON with initData, challengeId and signature." }, { status: 400 });
  }
  if (typeof body.initData !== "string" || typeof body.challengeId !== "string" || typeof body.signature !== "string") {
    return NextResponse.json({ error: "Verified Telegram initData, challengeId and base64 signature are required." }, { status: 400 });
  }
  const telegramUser = verifyTelegramInitData(body.initData);
  if (!telegramUser) return NextResponse.json({ error: "Telegram identity could not be verified." }, { status: 401 });

  let signature: Buffer;
  try {
    signature = Buffer.from(body.signature, "base64");
    if (signature.length !== 64 || signature.toString("base64") !== body.signature) throw new Error("Invalid signature encoding");
  } catch {
    return NextResponse.json({ error: "Invalid signature encoding." }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({ where: { telegramId: telegramUser.id }, select: { id: true } });
    if (!user) return NextResponse.json({ error: "Start a verified Telegram session before linking a wallet." }, { status: 401 });
    const challenge = await prisma.walletLinkChallenge.findUnique({ where: { id: body.challengeId } });
    if (!challenge || challenge.userRef !== user.id || challenge.usedAt || challenge.expiresAt <= new Date()) {
      return NextResponse.json({ error: "Challenge is missing, expired, already used, or belongs to another user." }, { status: 409 });
    }

    const domain = new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").host;
    const message = [
      "COMMUNITY Coin wallet verification",
      `Domain: ${domain}`,
      `Telegram user: ${telegramUser.id}`,
      `Wallet: ${challenge.wallet}`,
      `Nonce: ${challenge.nonce}`,
      `Expires: ${challenge.expiresAt.toISOString()}`,
    ].join("\n");
    const valid = nacl.sign.detached.verify(
      new TextEncoder().encode(message),
      new Uint8Array(signature),
      new PublicKey(challenge.wallet).toBytes(),
    );
    if (!valid) return NextResponse.json({ error: "Wallet signature is invalid. Sign the exact challenge message in your wallet." }, { status: 400 });

    await prisma.$transaction(async (tx) => {
      const claimed = await tx.walletLinkChallenge.updateMany({
        where: { id: challenge.id, userRef: user.id, usedAt: null, expiresAt: { gt: new Date() } },
        data: { usedAt: new Date() },
      });
      if (claimed.count !== 1) throw new Error("CHALLENGE_ALREADY_USED");
      const owner = await tx.wallet.findUnique({ where: { address: challenge.wallet }, select: { userId: true } });
      if (owner && owner.userId !== user.id) throw new Error("WALLET_ALREADY_LINKED");
      await tx.wallet.upsert({
        where: { address: challenge.wallet },
        create: { address: challenge.wallet, userId: user.id, verifiedAt: new Date() },
        update: { userId: user.id, verifiedAt: new Date() },
      });
    });
    return NextResponse.json({ verified: true, wallet: challenge.wallet }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof Error && error.message === "CHALLENGE_ALREADY_USED") {
      return NextResponse.json({ error: "This challenge has already been used or expired." }, { status: 409 });
    }
    if (error instanceof Error && error.message === "WALLET_ALREADY_LINKED") {
      return NextResponse.json({ error: "That wallet is already linked to another account." }, { status: 409 });
    }
    return NextResponse.json({ error: "Wallet verification storage failed. Check database connectivity and schema." }, { status: 503 });
  }
}
