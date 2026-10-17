import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

export type Player = {
  id: string; // telegram user id
  username?: string;
  name: string;
  points: number;
  lastDaily?: string; // YYYY-MM-DD UTC
  tipsSent: number;
  tipsReceived: number;
  quizCorrect: number;
  memeWins: number;
};

export type MemeBattle = {
  id: string;
  chatId: string;
  active: boolean;
  entries: { userId: string; text: string; votes: string[] }[];
  createdAt: number;
  endsAt: number;
};

type StoreData = {
  players: Record<string, Player>;
  battles: Record<string, MemeBattle>;
  chatActive: Record<string, string[]>; // chatId -> recent userIds
};

const DATA_DIR = process.env.BOT_DATA_DIR || join(process.cwd(), ".bot-data");
const DATA_FILE = join(DATA_DIR, "store.json");

function empty(): StoreData {
  return { players: {}, battles: {}, chatActive: {} };
}

function load(): StoreData {
  try {
    if (!existsSync(DATA_FILE)) return empty();
    return JSON.parse(readFileSync(DATA_FILE, "utf8")) as StoreData;
  } catch {
    return empty();
  }
}

function save(data: StoreData) {
  try {
    if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
    writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error("Failed to persist bot store", e);
  }
}

let data = load();

export function touchPlayer(
  id: string,
  username?: string,
  name?: string
): Player {
  const existing = data.players[id];
  if (existing) {
    if (username) existing.username = username.replace(/^@/, "");
    if (name) existing.name = name;
    save(data);
    return existing;
  }
  const player: Player = {
    id,
    username: username?.replace(/^@/, ""),
    name: name || username || `user_${id.slice(-4)}`,
    points: 50, // starter points
    tipsSent: 0,
    tipsReceived: 0,
    quizCorrect: 0,
    memeWins: 0,
  };
  data.players[id] = player;
  save(data);
  return player;
}

export function getPlayer(id: string): Player | undefined {
  return data.players[id];
}

export function findByUsername(username: string): Player | undefined {
  const u = username.replace(/^@/, "").toLowerCase();
  return Object.values(data.players).find(
    (p) => p.username?.toLowerCase() === u
  );
}

export function addPoints(id: string, amount: number): Player {
  const p = data.players[id];
  if (!p) throw new Error("Player not found");
  p.points = Math.max(0, p.points + amount);
  save(data);
  return p;
}

export function transferPoints(
  fromId: string,
  toId: string,
  amount: number
): { ok: true } | { ok: false; error: string } {
  const from = data.players[fromId];
  const to = data.players[toId];
  if (!from || !to) return { ok: false, error: "User not found. They need to /start first." };
  if (fromId === toId) return { ok: false, error: "You can't tip yourself." };
  if (!Number.isFinite(amount) || amount <= 0)
    return { ok: false, error: "Amount must be a positive number." };
  if (from.points < amount) return { ok: false, error: `Not enough points. You have ${from.points}.` };
  from.points -= amount;
  to.points += amount;
  from.tipsSent += 1;
  to.tipsReceived += 1;
  save(data);
  return { ok: true };
}

export function claimDaily(id: string): { ok: true; amount: number; points: number } | { ok: false; error: string } {
  const p = data.players[id];
  if (!p) return { ok: false, error: "Run /start first." };
  const today = new Date().toISOString().slice(0, 10);
  if (p.lastDaily === today) return { ok: false, error: "You already claimed today's reward. Come back tomorrow." };
  const amount = 25;
  p.lastDaily = today;
  p.points += amount;
  save(data);
  return { ok: true, amount, points: p.points };
}

export function markActive(chatId: string, userId: string) {
  const key = String(chatId);
  const list = data.chatActive[key] || [];
  const next = [userId, ...list.filter((id) => id !== userId)].slice(0, 30);
  data.chatActive[key] = next;
  save(data);
}

export function getActive(chatId: string, excludeId?: string): string[] {
  const list = data.chatActive[String(chatId)] || [];
  return list.filter((id) => id !== excludeId && data.players[id]);
}

export function leaderboard(limit = 10): Player[] {
  return Object.values(data.players)
    .sort((a, b) => b.points - a.points)
    .slice(0, limit);
}

export function startBattle(chatId: string): MemeBattle {
  const id = `${chatId}_${Date.now()}`;
  const battle: MemeBattle = {
    id,
    chatId: String(chatId),
    active: true,
    entries: [],
    createdAt: Date.now(),
    endsAt: Date.now() + 5 * 60 * 1000,
  };
  data.battles[id] = battle;
  save(data);
  return battle;
}

export function getActiveBattle(chatId: string): MemeBattle | undefined {
  return Object.values(data.battles).find(
    (b) => b.chatId === String(chatId) && b.active && b.endsAt > Date.now()
  );
}

export function addMemeEntry(
  battleId: string,
  userId: string,
  text: string
): { ok: true } | { ok: false; error: string } {
  const b = data.battles[battleId];
  if (!b || !b.active) return { ok: false, error: "No active battle." };
  if (b.entries.some((e) => e.userId === userId))
    return { ok: false, error: "You already submitted an entry." };
  if (text.length < 2 || text.length > 280)
    return { ok: false, error: "Entry must be 2–280 characters." };
  b.entries.push({ userId, text, votes: [] });
  save(data);
  return { ok: true };
}

export function voteMeme(
  battleId: string,
  entryIndex: number,
  voterId: string
): { ok: true } | { ok: false; error: string } {
  const b = data.battles[battleId];
  if (!b || !b.active) return { ok: false, error: "No active battle." };
  const entry = b.entries[entryIndex];
  if (!entry) return { ok: false, error: "Invalid entry." };
  if (entry.userId === voterId) return { ok: false, error: "Can't vote for yourself." };
  // remove previous vote
  for (const e of b.entries) {
    e.votes = e.votes.filter((v) => v !== voterId);
  }
  entry.votes.push(voterId);
  save(data);
  return { ok: true };
}

export function closeBattle(battleId: string): MemeBattle | undefined {
  const b = data.battles[battleId];
  if (!b) return;
  b.active = false;
  if (b.entries.length) {
    b.entries.sort((a, c) => c.votes.length - a.votes.length);
    const winner = b.entries[0];
    const p = data.players[winner.userId];
    if (p) {
      p.points += 50;
      p.memeWins += 1;
    }
  }
  save(data);
  return b;
}
