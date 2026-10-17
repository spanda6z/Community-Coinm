import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyTelegramInitData } from "@/lib/telegram";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: { initData?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Expected JSON with Telegram Web App initData." }, { status: 400 });
  }
  if (typeof body.initData !== "string") {
    return NextResponse.json({ error: "Telegram Web App initData is required." }, { status: 400 });
  }
  const telegramUser = verifyTelegramInitData(body.initData);
  if (!telegramUser) {
    return NextResponse.json({ error: "Telegram identity could not be verified. Open the official Web App from Telegram and try again." }, { status: 401 });
  }

  try {
    const displayName = [telegramUser.firstName, telegramUser.lastName].filter(Boolean).join(" ") || null;
    const user = await prisma.user.upsert({
      where: { telegramId: telegramUser.id },
      create: { telegramId: telegramUser.id, displayName },
      update: { displayName },
      select: { id: true, displayName: true, telegramId: true },
    });
    return NextResponse.json({ authenticated: true, user }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Identity storage is unavailable. Check DATABASE_URL and run Prisma migrations/push." }, { status: 503 });
  }
}
