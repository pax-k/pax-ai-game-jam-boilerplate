import { expect, test } from "bun:test";
import {
  DEFAULT_ROOM_SLUG,
  GameState,
  PLAYER_INPUT_MESSAGE,
  PLAYER_RADIUS,
  STARTER_ROOM_NAME,
  WORLD_HEIGHT,
  WORLD_WIDTH,
  PlayerState,
  normalizePlayerInput,
  normalizePlayerName,
  normalizeRoomSlug,
  resolveMovement
} from "./index";

test("exports a small synchronized starter state", () => {
  const state = new GameState();
  const player = new PlayerState();
  player.id = "player-a";
  player.name = "Alpha";
  state.players.set("session-a", player);

  expect(STARTER_ROOM_NAME).toBe("starter_room");
  expect(PLAYER_INPUT_MESSAGE).toBe("player:input");
  expect(state.players.get("session-a")?.name).toBe("Alpha");
});

test("normalizes room, player, and movement input values", () => {
  expect(normalizeRoomSlug("  My First Room!  ")).toBe("my-first-room");
  expect(normalizeRoomSlug("***")).toBe(DEFAULT_ROOM_SLUG);
  expect(normalizePlayerName("  Ada   Lovelace ")).toBe("Ada Lovelace");
  expect(normalizePlayerInput({ right: true, seq: 4.9 })).toEqual({
    left: false,
    right: true,
    up: false,
    down: false,
    seq: 4
  });
});

test("shares normalized and bounded movement math", () => {
  const next = resolveMovement(
    { x: WORLD_WIDTH - PLAYER_RADIUS - 1, y: WORLD_HEIGHT - PLAYER_RADIUS - 1 },
    { left: false, right: true, up: false, down: true, seq: 1 },
    1
  );

  expect(next.x).toBe(WORLD_WIDTH - PLAYER_RADIUS);
  expect(next.y).toBe(WORLD_HEIGHT - PLAYER_RADIUS);
});
