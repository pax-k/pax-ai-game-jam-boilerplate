# AI Game Jam Boilerplate

A Bun-first multiplayer browser-game template: Colyseus provides server authority, Excalibur renders the canvas, React owns the lobby, and SQLite/Drizzle records lightweight player and room-session data.

Use GitHub’s **Use this template** action to begin a new game. The checked-in starter intentionally contains only a shared room with colored placeholder players and authoritative directional movement. Replace it with your game; do not build a second game into the template.

## Start in five minutes

```sh
bun install --frozen-lockfile
bun run dev
```

Open [http://localhost:5173](http://localhost:5173), enter a player and room name, then open a second browser session with another player name. Both clients should see the same room and synchronized movement.

The server listens on `http://localhost:2567`; the web client uses `ws://localhost:2567` unless `VITE_GAME_SERVER_URL` is supplied. Copy `.env.example` to `.env` only when changing the defaults. Bun loads `.env` itself.

## Where your code belongs

| Area | Owner |
| --- | --- |
| Shared messages, schemas, world bounds, deterministic movement | `packages/protocol` |
| Authoritative simulation, rooms, validation, and HTTP health | `apps/server` |
| Canvas actors, client prediction, and network rendering | `packages/game` |
| Lobby, page UI, connection status, and CSS | `apps/web` |
| SQLite schema and repository functions | `packages/db` |

The client sends intent, never positions. Keep rules the server must enforce in `apps/server` and share deterministic movement or geometry through `packages/protocol` when client prediction needs the same math.

## Commands

```sh
bun run dev
bun run dev:server
bun run dev:web
bun run check-types
bun run test
bun run build
bun run verify
bun run build:itch
```

`bun run build:itch` creates a static Vite build with relative asset paths. It needs `VITE_GAME_SERVER_URL=wss://<public-server>` when preparing an itch.io release.

## Design and assets

Fill in `docs/game-design/` before adding game rules, rendering, or assets. The repository-local skills cover Colyseus, Excalibur, frontend design, Pixel Lab, sprint planning, Railway, and itch.io workflows.

Keep generated art, provenance metadata, releases, browser captures, caches, and local databases out of Git unless a file is deliberately a reusable fixture. The generic Pixel Lab helpers in `scripts/pixellab/` sanitize metadata, validate required OpenAPI paths, and assemble a supplied frame set into an atlas; they never include credentials or generated assets.

## Deploying

Use [Railway](docs/deployment/railway.md) for a single-replica server plus web service, and [itch.io](docs/deployment/itch-io.md) for a static HTML5 client build. Both paths are opt-in: this template has no maintained public demo deployment.

## License

[MIT](LICENSE)
