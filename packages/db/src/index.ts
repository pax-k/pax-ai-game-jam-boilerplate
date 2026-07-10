import { Database } from "bun:sqlite";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { eq, sql } from "drizzle-orm";
import { drizzle, type BunSQLiteDatabase } from "drizzle-orm/bun-sqlite";
import * as schema from "./schema";
import { players, roomSessions } from "./schema";

export type GameDatabaseHandle = {
  db: BunSQLiteDatabase<typeof schema>;
  sqlite: Database;
  close(): void;
};

export type PlayerProfile = {
  id: string;
  name: string;
  color: string;
  lastX: number;
  lastY: number;
  joins: number;
};

const DEFAULT_DB_FILE_NAME = "data/game.sqlite";
const PLAYER_COLORS = ["#1f7a8c", "#bf5b3d", "#775da6", "#477a48", "#a8701d", "#b24973"] as const;

export function createGameDatabase(options: { filename?: string } = {}): GameDatabaseHandle {
  const filename = options.filename ?? Bun.env.DB_FILE_NAME ?? DEFAULT_DB_FILE_NAME;
  ensureDatabaseDirectory(filename);
  const sqlite = new Database(filename, { create: true });
  sqlite.exec("PRAGMA journal_mode = WAL;");
  sqlite.exec("PRAGMA foreign_keys = ON;");
  ensureSchema(sqlite);

  return {
    db: drizzle({ client: sqlite, schema }),
    sqlite,
    close() {
      sqlite.close();
    }
  };
}

export async function getOrCreatePlayerProfile(
  handle: GameDatabaseHandle,
  identity: { id?: string; name?: string }
): Promise<PlayerProfile> {
  const id = normalizePlayerId(identity.id);
  const name = normalizePlayerName(identity.name);
  const now = new Date();
  const [existing] = await handle.db.select().from(players).where(eq(players.id, id)).limit(1);

  if (existing) {
    await handle.db
      .update(players)
      .set({ name, joins: sql`${players.joins} + 1`, online: true, updatedAt: now, lastSeenAt: now })
      .where(eq(players.id, id));
  } else {
    await handle.db.insert(players).values({
      id,
      name,
      color: colorForPlayerId(id),
      lastX: 0,
      lastY: 0,
      joins: 1,
      online: true,
      createdAt: now,
      updatedAt: now,
      lastSeenAt: now
    });
  }

  const [profile] = await handle.db.select().from(players).where(eq(players.id, id)).limit(1);
  if (!profile) {
    throw new Error(`Unable to create player profile for ${id}.`);
  }
  return profile;
}

export async function recordPlayerPosition(
  handle: GameDatabaseHandle,
  input: { id: string; x: number; y: number }
) {
  await handle.db
    .update(players)
    .set({ lastX: input.x, lastY: input.y, updatedAt: new Date() })
    .where(eq(players.id, input.id));
}

export async function markPlayerOffline(handle: GameDatabaseHandle, id: string) {
  const now = new Date();
  await handle.db
    .update(players)
    .set({ online: false, updatedAt: now, lastSeenAt: now })
    .where(eq(players.id, id));
}

export async function startRoomSession(
  handle: GameDatabaseHandle,
  input: { playerId: string; roomSlug: string }
) {
  const id = crypto.randomUUID();
  await handle.db.insert(roomSessions).values({
    id,
    playerId: input.playerId,
    roomSlug: input.roomSlug,
    joinedAt: new Date(),
    leftAt: null
  });
  return id;
}

export async function endRoomSession(handle: GameDatabaseHandle, id: string) {
  await handle.db.update(roomSessions).set({ leftAt: new Date() }).where(eq(roomSessions.id, id));
}

export async function getDatabaseStats(handle: GameDatabaseHandle) {
  const [allPlayers] = await handle.db.select({ count: sql<number>`count(*)` }).from(players);
  const [onlinePlayers] = await handle.db
    .select({ count: sql<number>`count(*)` })
    .from(players)
    .where(eq(players.online, true));
  const [sessions] = await handle.db.select({ count: sql<number>`count(*)` }).from(roomSessions);
  return {
    players: allPlayers?.count ?? 0,
    onlinePlayers: onlinePlayers?.count ?? 0,
    roomSessions: sessions?.count ?? 0
  };
}

function ensureDatabaseDirectory(filename: string) {
  if (filename !== ":memory:") {
    mkdirSync(dirname(filename), { recursive: true });
  }
}

function ensureSchema(sqlite: Database) {
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS players (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      color TEXT NOT NULL,
      last_x REAL NOT NULL,
      last_y REAL NOT NULL,
      joins INTEGER NOT NULL DEFAULT 0,
      online INTEGER NOT NULL DEFAULT 0,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      last_seen_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS room_sessions (
      id TEXT PRIMARY KEY NOT NULL,
      player_id TEXT NOT NULL,
      room_slug TEXT NOT NULL,
      joined_at INTEGER NOT NULL,
      left_at INTEGER
    );
  `);
}

function normalizePlayerId(value: unknown) {
  const candidate = typeof value === "string" ? value.trim() : "";
  return /^[a-zA-Z0-9_-]{3,64}$/.test(candidate) ? candidate : crypto.randomUUID();
}

function normalizePlayerName(value: unknown) {
  const normalized = typeof value === "string" ? value.trim().replace(/\s+/g, " ") : "";
  return normalized.slice(0, 24) || "Player";
}

function colorForPlayerId(id: string) {
  const hash = [...id].reduce((value, character) => (value * 31 + character.charCodeAt(0)) >>> 0, 0);
  return PLAYER_COLORS[hash % PLAYER_COLORS.length] ?? PLAYER_COLORS[0];
}
