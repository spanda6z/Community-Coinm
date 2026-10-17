import { NextResponse } from "next/server";

export async function POST() {
  // Do not accept a userId or wallet address supplied by an unauthenticated browser.
  return NextResponse.json({
    error: "Voting is disabled until verified user identity, eligibility rules, and one-vote enforcement are configured.",
  }, { status: 503 });
}
