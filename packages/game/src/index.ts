import {
  Callbacks,
  Client,
  type Room
} from "@colyseus/sdk";
import {
  DEFAULT_PLAYER_NAME,
  DEFAULT_ROOM_SLUG,
  GameState,
  PLAYER_INPUT_MESSAGE,
  PLAYER_RADIUS,
  STARTER_ROOM_NAME,
  WORLD_HEIGHT,
  WORLD_WIDTH,
  type PlayerInput,
  type PlayerState
} from "@ai-game-jam/protocol";
import * as ex from "excalibur";
import { predictPosition, reconcilePosition, shouldSendPlayerInput } from "./movement";
import { forEachAvailablePlayer, getAvailablePlayer } from "./roomState";

const DEFAULT_SERVER_URL = "ws://localhost:2567";
const INPUT_SEND_INTERVAL_MS = 1000 / 30;

export type ConnectionState = "connecting" | "online" | "reconnecting" | "offline";

export type MountGameOptions = {
  serverUrl?: string;
  playerId?: string;
  playerName?: string;
  roomSlug?: string;
  onConnectionChange?: (state: ConnectionState, message?: string) => void;
  onPlayerCountChange?: (count: number) => void;
};

export type GameHandle = {
  unlockAudio(): Promise<boolean>;
  dispose(): Promise<void>;
};

type PlayerActor = {
  actor: ex.Actor;
  target: { x: number; y: number };
  unbind?: () => void;
};

export async function mountGame(host: HTMLElement, options: MountGameOptions = {}): Promise<GameHandle> {
  host.replaceChildren();
  const canvas = document.createElement("canvas");
  canvas.setAttribute("aria-label", "Multiplayer game canvas");
  host.append(canvas);

  const engine = new ex.Engine({
    width: WORLD_WIDTH,
    height: WORLD_HEIGHT,
    displayMode: ex.DisplayMode.FitContainer,
    canvasElement: canvas,
    backgroundColor: ex.Color.fromHex("#f4f1ea")
  });
  await engine.start();

  let disposed = false;
  let room: Room<GameState> | undefined;
  let inputSeq = 0;
  let previousInput: PlayerInput | undefined;
  let lastSendAtMs = 0;
  const actors = new Map<string, PlayerActor>();
  const unbind: Array<() => void> = [];
  const client = new Client(options.serverUrl ?? DEFAULT_SERVER_URL);

  options.onConnectionChange?.("connecting");
  try {
    room = await client.joinOrCreate<GameState>(STARTER_ROOM_NAME, {
      roomSlug: options.roomSlug ?? DEFAULT_ROOM_SLUG,
      playerName: options.playerName ?? DEFAULT_PLAYER_NAME,
      playerId: options.playerId
    });
  } catch (error) {
    engine.dispose();
    canvas.remove();
    const message = error instanceof Error ? error.message : "Unable to join the room.";
    options.onConnectionChange?.("offline", message);
    throw error;
  }

  const activeRoom = room;
  const callbacks = Callbacks.get(activeRoom);
  const addPlayer = (player: PlayerState, sessionId: string) => {
    const existing = actors.get(sessionId);
    if (existing) {
      existing.target = { x: player.x, y: player.y };
      return existing;
    }
    const actor = new ex.Actor({
      x: player.x,
      y: player.y,
      radius: PLAYER_RADIUS,
      color: ex.Color.fromHex(player.color)
    });
    engine.currentScene.add(actor);
    const entry: PlayerActor = { actor, target: { x: player.x, y: player.y } };
    entry.unbind = callbacks.onChange(player, () => {
      entry.target = { x: player.x, y: player.y };
      options.onPlayerCountChange?.(activeRoom.state.players.size);
    });
    actors.set(sessionId, entry);
    return entry;
  };

  const removePlayer = (sessionId: string) => {
    const entry = actors.get(sessionId);
    entry?.unbind?.();
    entry?.actor.kill();
    actors.delete(sessionId);
    options.onPlayerCountChange?.(activeRoom.state.players.size);
  };

  unbind.push(
    callbacks.onAdd("players", addPlayer),
    callbacks.onRemove("players", (_player, sessionId) => removePlayer(sessionId)),
    callbacks.onChange("players", (sessionId) => {
      const player = activeRoom.state.players.get(sessionId);
      if (player) {
        addPlayer(player, sessionId);
      }
    })
  );
  const initialPlayers = activeRoom.state.players;
  forEachAvailablePlayer(initialPlayers, addPlayer);
  options.onPlayerCountChange?.(initialPlayers?.size ?? 0);

  const frameSubscription = engine.on("postupdate", (event) => {
    if (disposed) {
      return;
    }
    const input = readInput(engine, ++inputSeq);
    const local = actors.get(activeRoom.sessionId);
    const localState = getAvailablePlayer(activeRoom.state.players, activeRoom.sessionId);
    const deltaSeconds = event.elapsed / 1000;

    if (local && localState) {
      const predicted = predictPosition({ x: local.actor.pos.x, y: local.actor.pos.y }, input, deltaSeconds);
      local.actor.pos = new ex.Vector(predicted.x, predicted.y);
      const reconciled = reconcilePosition(local.actor.pos, local.target, deltaSeconds);
      local.actor.pos = new ex.Vector(
        reconciled.x,
        reconciled.y
      );
    }

    for (const [sessionId, entry] of actors) {
      if (sessionId === activeRoom.sessionId) {
        continue;
      }
      const next = reconcilePosition(entry.actor.pos, entry.target, deltaSeconds);
      entry.actor.pos = new ex.Vector(next.x, next.y);
    }

    const now = performance.now();
    if (shouldSendPlayerInput(previousInput, input) || now - lastSendAtMs >= INPUT_SEND_INTERVAL_MS) {
      activeRoom.send(PLAYER_INPUT_MESSAGE, input);
      previousInput = input;
      lastSendAtMs = now;
    }
  });
  unbind.push(() => frameSubscription.close());

  const onLeave = (_: number, reason?: string) => {
    if (!disposed) {
      options.onConnectionChange?.("offline", reason);
    }
  };
  const onReconnect = () => options.onConnectionChange?.("online");
  const onDrop = () => options.onConnectionChange?.("reconnecting");
  activeRoom.onLeave(onLeave);
  activeRoom.onReconnect(onReconnect);
  activeRoom.onDrop(onDrop);
  unbind.push(
    () => activeRoom.onLeave.remove(onLeave),
    () => activeRoom.onReconnect.remove(onReconnect),
    () => activeRoom.onDrop.remove(onDrop)
  );
  options.onConnectionChange?.("online");

  return {
    async unlockAudio() {
      const AudioContextConstructor = globalThis.AudioContext;
      if (!AudioContextConstructor) {
        return false;
      }
      const context = new AudioContextConstructor();
      await context.resume();
      await context.close();
      return true;
    },
    async dispose() {
      if (disposed) {
        return;
      }
      disposed = true;
      for (const stop of unbind.splice(0)) {
        stop();
      }
      for (const entry of actors.values()) {
        entry.unbind?.();
        entry.actor.kill();
      }
      actors.clear();
      await activeRoom.leave(true).catch(() => undefined);
      engine.dispose();
      canvas.remove();
    }
  };
}

function readInput(engine: ex.Engine, seq: number): PlayerInput {
  const keyboard = engine.input.keyboard;
  return {
    seq,
    left: keyboard.isHeld(ex.Keys.Left) || keyboard.isHeld(ex.Keys.A),
    right: keyboard.isHeld(ex.Keys.Right) || keyboard.isHeld(ex.Keys.D),
    up: keyboard.isHeld(ex.Keys.Up) || keyboard.isHeld(ex.Keys.W),
    down: keyboard.isHeld(ex.Keys.Down) || keyboard.isHeld(ex.Keys.S)
  };
}
