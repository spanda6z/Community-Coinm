import { NextResponse } from "next/server";
import { PublicKey } from "@solana/web3.js";
export const dynamic = "force-dynamic";
export async function GET() {
  const address = process.env.NEXT_PUBLIC_TREASURY_ADDRESS;
  if (!address) return NextResponse.json({ configured: false, activity: [], message: "Treasury address and verified activity indexer are not configured. No activity is fabricated." }, { status: 503 });
  try { new PublicKey(address); } catch { return NextResponse.json({ configured: false, activity: [], message: "The configured treasury address is not a valid Solana public key. Verify it before publishing." }, { status: 503 }); }
  return NextResponse.json({ configured: false, treasuryAddress: address, activity: [], message: "Treasury address is configured, but a verified transaction indexer is still required before activity can be published." }, { status: 503 });
}
