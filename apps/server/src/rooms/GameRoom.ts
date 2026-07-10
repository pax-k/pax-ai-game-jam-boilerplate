import {
  endRoomSession,
  getOrCreatePlayerProfile,
  markPlayerOffline,
  recordPlayerPosition,
  startRoomSession,
  type PlayerProfile
} from "@ai-game-jam/db";
import {
  GameState,
  MAX_ROOM_CLIENTS,
  PLAYER_INPUT_MESSAGE,
  PlayerState,
  createSpawnPoint,
  normalizePlayerInput,
  normalizePlayerName,
  normalizeRoomSlug,
  type PlayerInput,
  type PlayerJoinOptions
} from "@ai-game-jam/protocol";
import { type Client, Room } from "colyseus";
import { gameDatabase } from "../database";
import { applyPlayerInput } from "../simulation";

const SIMULATION_INTERVAL_MS = 1000 / 60;

type StarterRoomMetadata = {
  roomSlug: string;
};

export class GameRoom extends Room<{ state: GameState; metadata: StarterRoomMetadata }> {
  override maxClients = MAX_ROOM_CLIENTS;

  private readonly clientInputs = new Map<string, PlayerInput>();
  private readonly persistenceSessions = new Map<string, string>();

  override async onCreate(options: PlayerJoinOptions = {}) {
    const roomSlug = normalizeRoomSlug(options.roomSlug);
    await this.setMetadata({ roomSlug });
    this.setState(new GameState());
    this.onMessage(PLAYER_INPUT_MESSAGE, (client, input: Partial<PlayerInput>) => {
      if (!this.state.players.has(client.sessionId)) {
        return;
      }
      this.clientInputs.set(client.sessionId, normalizePlayerInput(input));
    });
    this.setSimulationInterval((deltaMs) => this.updateSimulation(deltaMs), SIMULATION_INTERVAL_MS);
  }

  override async onAuth(_client: Client, options: PlayerJoinOptions) {
    const name = normalizePlayerName(options.playerName);
    if (isActivePlayerNameTaken(this.state.players.values(), name)) {
      throw new Error("Name already taken in this room.");
    }
    return getOrCreatePlayerProfile(gameDatabase, { id: options.playerId, name });
  }

  override async onJoin(client: Client) {
    const profile = client.auth as PlayerProfile;
    const player = new PlayerState();
    const spawn = createSpawnPoint(this.state.players.size);
    player.id = profile.id;
    player.name = profile.name;
    player.color = profile.color;
    player.x = spawn.x;
    player.y = spawn.y;
    player.lastProcessedInputSeq = 0;
    this.state.players.set(client.sessionId, player);
    this.clientInputs.set(client.sessionId, normalizePlayerInput({}));
    this.persistenceSessions.set(
      client.sessionId,
      await startRoomSession(gameDatabase, {
        playerId: profile.id,
        roomSlug: this.metadata.roomSlug
      })
    );
    await recordPlayerPosition(gameDatabase, { id: profile.id, x: player.x, y: player.y });
  }

  override async onLeave(client: Client) {
    const player = this.state.players.get(client.sessionId);
    if (player) {
      await recordPlayerPosition(gameDatabase, { id: player.id, x: player.x, y: player.y });
      await markPlayerOffline(gameDatabase, player.id);
    }
    const persistenceSession = this.persistenceSessions.get(client.sessionId);
    if (persistenceSession) {
      await endRoomSession(gameDatabase, persistenceSession);
    }
    this.persistenceSessions.delete(client.sessionId);
    this.clientInputs.delete(client.sessionId);
    this.state.players.delete(client.sessionId);
  }

  override onUncaughtException(error: Error, methodName: string) {
    console.error(`[room] ${methodName} failed`, error);
  }

  private updateSimulation(deltaMs: number) {
    const deltaSeconds = deltaMs / 1000;
    this.state.players.forEach((player, sessionId) => {
      const input = this.clientInputs.get(sessionId);
      if (input) {
        applyPlayerInput(player, input, deltaSeconds);
      }
    });
  }
}

export function isActivePlayerNameTaken(players: Iterable<PlayerState>, candidate: string) {
  const normalizedCandidate = normalizePlayerName(candidate).toLocaleLowerCase();
  return Array.from(players).some(
    (player) => player.name.toLocaleLowerCase() === normalizedCandidate
  );
}
