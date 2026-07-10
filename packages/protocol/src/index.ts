import { MapSchema, Schema, type } from "@colyseus/schema";

export const STARTER_ROOM_NAME = "starter_room";
export const PLAYER_INPUT_MESSAGE = "player:input";
export const DEFAULT_ROOM_SLUG = "starter";
export const DEFAULT_PLAYER_NAME = "Player";

export const WORLD_WIDTH = 1280;
export const WORLD_HEIGHT = 720;
export const PLAYER_RADIUS = 18;
export const PLAYER_SPEED = 260;
export const MAX_ROOM_CLIENTS = 16;

const PLAYER_COLORS = [
  "#1f7a8c",
  "#bf5b3d",
  "#775da6",
  "#477a48",
  "#a8701d",
  "#b24973"
] as const;

export type PlayerInput = {
  seq: number;
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
};

export type PlayerJoinOptions = {
  roomSlug?: string;
  playerName?: string;
  playerId?: string;
};

export type Point = {
  x: number;
  y: number;
};

export class PlayerState extends Schema {
  @type("string") id = "";
  @type("string") name = "";
  @type("string") color = "";
  @type("number") x = WORLD_WIDTH / 2;
  @type("number") y = WORLD_HEIGHT / 2;
  @type("number") lastProcessedInputSeq = 0;
}

export class GameState extends Schema {
  @type({ map: PlayerState }) players = new MapSchema<PlayerState>();
}

export function normalizePlayerInput(input: Partial<PlayerInput> | undefined): PlayerInput {
  return {
    seq: normalizeSequence(input?.seq),
    left: input?.left === true,
    right: input?.right === true,
    up: input?.up === true,
    down: input?.down === true
  };
}

export function normalizePlayerName(value: unknown) {
  const normalized = typeof value === "string" ? value.trim().replace(/\s+/g, " ") : "";
  return normalized.slice(0, 24) || DEFAULT_PLAYER_NAME;
}

export function normalizeRoomSlug(value: unknown) {
  const normalized = typeof value === "string" ? value.trim().toLowerCase() : "";
  const slug = normalized
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);

  return slug || DEFAULT_ROOM_SLUG;
}

export function normalizePlayerId(value: unknown) {
  const candidate = typeof value === "string" ? value.trim() : "";
  return /^[a-zA-Z0-9_-]{3,64}$/.test(candidate) ? candidate : crypto.randomUUID();
}

export function colorForPlayerId(id: string) {
  const hash = [...id].reduce((value, character) => (value * 31 + character.charCodeAt(0)) >>> 0, 0);
  return PLAYER_COLORS[hash % PLAYER_COLORS.length] ?? PLAYER_COLORS[0];
}

export function resolveMovement(position: Point, input: PlayerInput, deltaSeconds: number): Point {
  const directionX = Number(input.right) - Number(input.left);
  const directionY = Number(input.down) - Number(input.up);
  const magnitude = Math.hypot(directionX, directionY);

  if (magnitude === 0 || !Number.isFinite(deltaSeconds) || deltaSeconds <= 0) {
    return clampPosition(position);
  }

  const distance = PLAYER_SPEED * Math.min(deltaSeconds, 0.1);
  return clampPosition({
    x: position.x + (directionX / magnitude) * distance,
    y: position.y + (directionY / magnitude) * distance
  });
}

export function clampPosition(position: Point): Point {
  return {
    x: clamp(position.x, PLAYER_RADIUS, WORLD_WIDTH - PLAYER_RADIUS),
    y: clamp(position.y, PLAYER_RADIUS, WORLD_HEIGHT - PLAYER_RADIUS)
  };
}

export function createSpawnPoint(index: number): Point {
  const columns = 4;
  const row = Math.floor(index / columns);
  const column = index % columns;
  return clampPosition({
    x: 160 + column * 280,
    y: 150 + row * 210
  });
}

function normalizeSequence(value: unknown) {
  return typeof value === "number" && Number.isFinite(value)
    ? Math.max(0, Math.trunc(value))
    : 0;
}

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, Number.isFinite(value) ? value : minimum));
}
