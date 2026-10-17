import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export async function GET() {
  // Deliberately fail closed until a verified treasury address and transaction indexer are configured.
  if (!process.env.NEXT_PUBLIC_TREASURY_ADDRESS) {
    return NextResponse.json({ configured: false, activity: [], message: "Treasury address and verified activity indexer are not configured. No activity is fabricated." }, { status: 503 });
  }
  return NextResponse.json({
    configured: false,
    treasuryAddress: process.env.NEXT_PUBLIC_TREASURY_ADDRESS,
    activity: [],
    message: "Treasury address is configured, but a verified transaction indexer is still required before activity can be published.",
  }, { status: 503 });
}
