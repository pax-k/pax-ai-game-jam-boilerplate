import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const players = sqliteTable("players", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  color: text("color").notNull(),
  lastX: real("last_x").notNull(),
  lastY: real("last_y").notNull(),
  joins: integer("joins").notNull().default(0),
  online: integer("online", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
  lastSeenAt: integer("last_seen_at", { mode: "timestamp_ms" }).notNull()
});

export const roomSessions = sqliteTable("room_sessions", {
  id: text("id").primaryKey(),
  playerId: text("player_id").notNull(),
  roomSlug: text("room_slug").notNull(),
  joinedAt: integer("joined_at", { mode: "timestamp_ms" }).notNull(),
  leftAt: integer("left_at", { mode: "timestamp_ms" })
});

export type PlayerRecord = typeof players.$inferSelect;
