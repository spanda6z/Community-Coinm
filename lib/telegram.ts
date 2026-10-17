import { createHmac, timingSafeEqual } from "node:crypto";

export type VerifiedTelegramUser = {
  id: string;
  username?: string;
  firstName?: string;
  lastName?: string;
};

export function verifyTelegramInitData(initData: string): VerifiedTelegramUser | null {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token || !initData || initData.length > 8192) return null;

  try {
    const params = new URLSearchParams(initData);
    const receivedHash = params.get("hash");
    const authDate = Number(params.get("auth_date"));
    if (!receivedHash || !/^[a-f0-9]{64}$/i.test(receivedHash)) return null;
    if (!Number.isFinite(authDate) || Math.abs(Date.now() / 1000 - authDate) > 300) return null;

    params.delete("hash");
    const dataCheckString = [...params.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join("\n");
    const secretKey = createHmac("sha256", "WebAppData").update(token).digest();
    const expectedHash = createHmac("sha256", secretKey).update(dataCheckString).digest();
    const suppliedHash = Buffer.from(receivedHash, "hex");
    if (suppliedHash.length !== expectedHash.length || !timingSafeEqual(suppliedHash, expectedHash)) return null;

    const rawUser = params.get("user");
    if (!rawUser) return null;
    const user = JSON.parse(rawUser) as { id?: number | string; username?: string; first_name?: string; last_name?: string };
    if (user.id === undefined || !/^\d+$/.test(String(user.id))) return null;
    return {
      id: String(user.id),
      username: typeof user.username === "string" ? user.username : undefined,
      firstName: typeof user.first_name === "string" ? user.first_name : undefined,
      lastName: typeof user.last_name === "string" ? user.last_name : undefined,
    };
  } catch {
    return null;
  }
}
