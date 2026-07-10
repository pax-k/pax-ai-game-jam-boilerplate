import {
  DEFAULT_PLAYER_NAME,
  DEFAULT_ROOM_SLUG,
  normalizePlayerName,
  normalizeRoomSlug
} from "@ai-game-jam/protocol";
import {
  type ConnectionState,
  type GameHandle,
  mountGame
} from "@ai-game-jam/game";
import { type FormEvent, useEffect, useRef, useState } from "react";

const DEFAULT_SERVER_URL = "ws://localhost:2567";
const PLAYER_ID_STORAGE_KEY = "ai-game-jam.playerId";
const PLAYER_NAME_STORAGE_KEY = "ai-game-jam.playerName";
const serverUrl = import.meta.env.VITE_GAME_SERVER_URL ?? DEFAULT_SERVER_URL;

type JoinState = {
  playerName: string;
  roomSlug: string;
};

export function App() {
  const stageRef = useRef<HTMLDivElement>(null);
  const gameHandleRef = useRef<GameHandle | undefined>(undefined);
  const [join, setJoin] = useState<JoinState>(readJoinState);
  const [activeJoin, setActiveJoin] = useState<JoinState | undefined>(readActiveJoinState);
  const [connection, setConnection] = useState<ConnectionState>("offline");
  const [playerCount, setPlayerCount] = useState(0);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    if (!activeJoin || !stageRef.current) {
      return;
    }

    let cancelled = false;
    let handle: GameHandle | undefined;
    setConnection("connecting");
    setError(undefined);

    void mountGame(stageRef.current, {
      serverUrl,
      playerId: getOrCreatePlayerId(),
      playerName: activeJoin.playerName,
      roomSlug: activeJoin.roomSlug,
      onConnectionChange(state, message) {
        if (!cancelled) {
          setConnection(state);
          setError(message);
        }
      },
      onPlayerCountChange(count) {
        if (!cancelled) {
          setPlayerCount(count);
        }
      }
    })
      .then(async (nextHandle) => {
        if (cancelled) {
          await nextHandle.dispose();
          return;
        }
        handle = nextHandle;
        gameHandleRef.current = nextHandle;
      })
      .catch((reason: unknown) => {
        if (!cancelled) {
          setConnection("offline");
          setError(reason instanceof Error ? reason.message : "Unable to start the game.");
        }
      });

    return () => {
      cancelled = true;
      gameHandleRef.current = undefined;
      void handle?.dispose();
    };
  }, [activeJoin]);

  function joinRoom(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextJoin = {
      playerName: normalizePlayerName(join.playerName),
      roomSlug: normalizeRoomSlug(join.roomSlug)
    };
    globalThis.sessionStorage?.setItem(PLAYER_NAME_STORAGE_KEY, nextJoin.playerName);
    const url = new URL(window.location.href);
    url.searchParams.set("room", nextJoin.roomSlug);
    window.history.replaceState({}, "", url);
    setJoin(nextJoin);
    setActiveJoin(nextJoin);
  }

  function leaveRoom() {
    setActiveJoin(undefined);
    setPlayerCount(0);
    setConnection("offline");
  }

  return (
    <main className="app-shell">
      <header className="site-header">
        <div>
          <p className="eyebrow">Bun · Colyseus · Excalibur · React</p>
          <h1>Multiplayer Game Starter</h1>
        </div>
        <a href="https://github.com/pax-k/pax-ai-game-jam-boilerplate">View source</a>
      </header>

      {!activeJoin ? (
        <section className="join-panel" aria-labelledby="join-title">
          <div>
            <p className="eyebrow">Start here</p>
            <h2 id="join-title">Join a shared room</h2>
            <p>
              This is intentionally just an authoritative movement reference. Replace it with your own game rules, actors, UI, and assets.
            </p>
          </div>
          <form onSubmit={joinRoom}>
            <label>
              Player name
              <input
                value={join.playerName}
                onChange={(event) => setJoin((current) => ({ ...current, playerName: event.target.value }))}
                maxLength={24}
                required
              />
            </label>
            <label>
              Room name
              <input
                value={join.roomSlug}
                onChange={(event) => setJoin((current) => ({ ...current, roomSlug: event.target.value }))}
                maxLength={48}
                required
              />
            </label>
            <button type="submit">Join room</button>
          </form>
        </section>
      ) : (
        <section className="game-layout" aria-label="Game room">
          <aside className="room-panel">
            <p className="eyebrow">Room</p>
            <h2>{activeJoin.roomSlug}</h2>
            <dl>
              <div><dt>Status</dt><dd data-status={connection}>{connection}</dd></div>
              <div><dt>Players</dt><dd>{playerCount}</dd></div>
              <div><dt>Controls</dt><dd>WASD or arrows</dd></div>
            </dl>
            {error ? <p className="error" role="alert">{error}</p> : null}
            <button className="secondary" type="button" onClick={leaveRoom}>Leave room</button>
          </aside>
          <div className="game-stage" ref={stageRef} />
        </section>
      )}
    </main>
  );
}

function readJoinState(): JoinState {
  const url = new URL(window.location.href);
  return {
    playerName: globalThis.sessionStorage?.getItem(PLAYER_NAME_STORAGE_KEY) ?? DEFAULT_PLAYER_NAME,
    roomSlug: url.searchParams.get("room") ?? DEFAULT_ROOM_SLUG
  };
}

function readActiveJoinState() {
  const url = new URL(window.location.href);
  const roomSlug = url.searchParams.get("room");
  const playerName = globalThis.sessionStorage?.getItem(PLAYER_NAME_STORAGE_KEY);
  return roomSlug && playerName ? { roomSlug: normalizeRoomSlug(roomSlug), playerName: normalizePlayerName(playerName) } : undefined;
}

function getOrCreatePlayerId() {
  const existing = globalThis.sessionStorage?.getItem(PLAYER_ID_STORAGE_KEY);
  if (existing) {
    return existing;
  }
  const id = crypto.randomUUID();
  globalThis.sessionStorage?.setItem(PLAYER_ID_STORAGE_KEY, id);
  return id;
}
