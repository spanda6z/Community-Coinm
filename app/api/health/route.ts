import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ status: 'ok', project: 'community-coin', integrations: { solana: 'not-configured', telegram: 'not-configured', marketData: 'not-configured' } });
}
