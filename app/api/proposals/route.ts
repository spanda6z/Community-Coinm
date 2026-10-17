import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ configured: false, proposals: [], message: "Governance storage is not configured yet." }, { status: 503 });
  }
  try {
    const proposals = await prisma.proposal.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      include: { _count: { select: { votes: true } } },
    });
    return NextResponse.json({ configured: true, proposals: proposals.map(p => ({
      id: p.id, title: p.title, description: p.description, status: p.status,
      startsAt: p.startsAt, endsAt: p.endsAt, createdAt: p.createdAt, voteCount: p._count.votes,
    })) }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ configured: true, proposals: [], message: "Governance database is unavailable. No demo proposals are shown." }, { status: 503 });
  }
}

export async function POST(request: NextRequest) {
  // Creating binding proposals is disabled until verified user authentication is configured.
  return NextResponse.json({ error: "Proposal creation requires verified community authentication and rate limiting, which are not configured." }, { status: 503 });
}
