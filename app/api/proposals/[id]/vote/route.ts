import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyTelegramInitData } from "@/lib/telegram";

export const dynamic = "force-dynamic";

export async function POST(request: Request, context: { params: { id: string } }) {
  let body: { initData?: unknown; choice?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Expected JSON with Telegram initData and a vote choice." }, { status: 400 });
  }
  if (typeof body.initData !== "string" || typeof body.choice !== "string" || !["for", "against", "abstain"].includes(body.choice)) {
    return NextResponse.json({ error: "Verified Telegram Web App initData and a valid choice (for, against, abstain) are required." }, { status: 400 });
  }
  const telegramUser = verifyTelegramInitData(body.initData);
  if (!telegramUser) return NextResponse.json({ error: "Telegram identity could not be verified. Open governance from the official Telegram Web App." }, { status: 401 });

  try {
    const proposal = await prisma.proposal.findUnique({ where: { id: context.params.id } });
    const now = new Date();
    if (!proposal) return NextResponse.json({ error: "Proposal not found." }, { status: 404 });
    if (proposal.status !== "active" || (proposal.startsAt && proposal.startsAt > now) || (proposal.endsAt && proposal.endsAt <= now)) {
      return NextResponse.json({ error: "This proposal is not currently open for voting." }, { status: 409 });
    }
    const displayName = [telegramUser.firstName, telegramUser.lastName].filter(Boolean).join(" ") || null;
    const user = await prisma.user.upsert({
      where: { telegramId: telegramUser.id },
      create: { telegramId: telegramUser.id, displayName },
      update: { displayName },
      select: { id: true },
    });
    await prisma.vote.create({ data: { proposalId: proposal.id, userId: user.id, choice: body.choice } });
    return NextResponse.json({ recorded: true, choice: body.choice }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === "P2002") {
      return NextResponse.json({ error: "You have already voted on this proposal." }, { status: 409 });
    }
    return NextResponse.json({ error: "Vote storage is unavailable. Check the database schema and connectivity." }, { status: 503 });
  }
}
