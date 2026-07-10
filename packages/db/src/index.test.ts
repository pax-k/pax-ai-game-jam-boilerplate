import { afterEach, expect, test } from "bun:test";
import {
  createGameDatabase,
  endRoomSession,
  getDatabaseStats,
  getOrCreatePlayerProfile,
  markPlayerOffline,
  recordPlayerPosition,
  startRoomSession,
  type GameDatabaseHandle
} from "./index";

const handles: GameDatabaseHandle[] = [];

afterEach(() => {
  for (const handle of handles.splice(0)) {
    handle.close();
  }
});

function createTestDatabase() {
  const handle = createGameDatabase({ filename: ":memory:" });
  handles.push(handle);
  return handle;
}

test("creates reusable player profiles and records generic sessions", async () => {
  const database = createTestDatabase();
  const player = await getOrCreatePlayerProfile(database, { id: "player-alpha", name: "Alpha" });
  await recordPlayerPosition(database, { id: player.id, x: 320, y: 240 });
  const sessionId = await startRoomSession(database, { playerId: player.id, roomSlug: "starter" });
  await endRoomSession(database, sessionId);

  expect(player.color).toMatch(/^#/);
  expect(await getDatabaseStats(database)).toEqual({ players: 1, onlinePlayers: 1, roomSessions: 1 });

  await markPlayerOffline(database, player.id);
  expect(await getDatabaseStats(database)).toEqual({ players: 1, onlinePlayers: 0, roomSessions: 1 });
});
