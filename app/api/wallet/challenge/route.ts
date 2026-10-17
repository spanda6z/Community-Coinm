import { randomBytes } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { PublicKey } from "@solana/web3.js";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  if (!process.env.DATABASE_URL) return NextResponse.json({ error: "Wallet linking is not configured." }, { status: 503 });
  // A challenge is not proof of identity: production must call this only after
  // authenticating the Telegram user server-side and bind userRef to that identity.
  return NextResponse.json({ error: "Wallet linking is not enabled until Telegram identity verification is configured. Do not send a seed phrase or private key." }, { status: 503 });
}
