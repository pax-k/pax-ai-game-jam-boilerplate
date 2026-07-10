# Railway Runbook Reference

Use this reference for exact Railway settings and command examples when
`docs/deployment/railway.md` is unavailable or when a compact checklist is
needed.

## Service Layout

Deploy two Railway services from the same repository:

- `game-server`: Bun + Colyseus authoritative WebSocket server.
- `web`: Vite React client served by `vite preview`.

Deploy order:

1. Deploy `game-server`.
2. Generate the `game-server` public domain.
3. Set `VITE_GAME_SERVER_URL=wss://${{game-server.RAILWAY_PUBLIC_DOMAIN}}` on
   `web` before its first source build.
4. Deploy or redeploy `web`, then assert its served JavaScript contains the
   resulting `wss://` URL.

## Repo Prep

Root `Dockerfile`:

```dockerfile
FROM oven/bun:1.3.14-slim

WORKDIR /app

ARG VITE_GAME_SERVER_URL
ENV VITE_GAME_SERVER_URL=$VITE_GAME_SERVER_URL

COPY package.json bun.lock ./
COPY apps/server/package.json apps/server/package.json
COPY apps/web/package.json apps/web/package.json
COPY packages/db/package.json packages/db/package.json
COPY packages/game/package.json packages/game/package.json
COPY packages/protocol/package.json packages/protocol/package.json

RUN bun install --frozen-lockfile

COPY . .

RUN bun run build

CMD ["sh", "-c", "if [ \"$RAILWAY_SERVICE_NAME\" = \"web\" ]; then bun run --filter @ai-game-jam/web start; else bun run --filter @ai-game-jam/server start; fi"]
```

Root `.dockerignore`:

```gitignore
node_modules
apps/*/node_modules
packages/*/node_modules
.git
apps/server/data
apps/web/dist
```

`apps/web/package.json` start script:

```json
{
  "scripts": {
    "start": "bunx vite preview --host 0.0.0.0 --port $PORT"
  }
}
```

Vite preview must allow Railway's public hostname:

```ts
const railwayPublicDomain = process.env.RAILWAY_PUBLIC_DOMAIN;

preview: {
  port: 4173,
  allowedHosts: railwayPublicDomain ? [railwayPublicDomain] : []
}
```

Use `process.env` rather than `Bun.env` in Vite config. The Docker `ARG`/`ENV`
pair is mandatory for Vite build-time values; Railway variables do not enter a
Docker `RUN` layer unless declared as `ARG`.

## game-server Settings

```text
Name: game-server
Root Directory: /
Dockerfile Path: /Dockerfile
Start Command: leave unset; Dockerfile selects the server
Healthcheck Path: /health
Public Networking: Generate Domain
Replicas: 1
```

Variables:

```text
DB_FILE_NAME=/data/game.sqlite
NODE_ENV=production
```

Do not set `PORT`; Railway injects it.

Attach a Railway volume:

```text
Mount Path: /data
```

Without the `/data` volume plus `DB_FILE_NAME=/data/game.sqlite`, the SQLite
stats database is disposable container-local state.

## web Settings

```text
Name: web
Root Directory: /
Dockerfile Path: /Dockerfile
Start Command: leave unset; Dockerfile selects Vite preview for `web`
Public Networking: Generate Domain
Replicas: 1
```

Variables:

```text
VITE_GAME_SERVER_URL=wss://${{game-server.RAILWAY_PUBLIC_DOMAIN}}
NODE_ENV=production
```

Set this before the first web source build. Redeploy `web` after changing it,
then inspect its served JavaScript for the exact expected `wss://` URL.

## Commands

Local preflight:

```sh
bun install
bun run check-types
bun test
bun run build
```

Focused builds:

```sh
bun run --filter @ai-game-jam/server build
bun run --filter @ai-game-jam/web build
```

Railway CLI:

```sh
railway login
railway link
railway up --service game-server
railway up --service web
railway logs --service game-server
railway logs --service web
```

Use `railway service list` in the target environment as the source of truth;
project-level auto-detected definitions without an environment instance are
inert. Require `SUCCESS` at the expected commit SHA for both deployments, then
read back `railway environment config --json`. If `deploy.healthcheckPath` is
not `/health`, configure it in the dashboard and report it as incomplete.

Smoke:

```sh
curl -fsS https://<game-server-domain>.railway.app/health
curl -fsSI https://<web-domain>.railway.app
```

Expected health shape:

```json
{
  "ok": true,
  "service": "@ai-game-jam/server",
  "database": {
    "players": 0,
    "onlinePlayers": 0,
    "roomSessions": 0
  }
}
```

## Scaling Constraint

Keep `game-server` at one replica for this deployment path.

Current constraints:

- Colyseus room state is process-local.
- Default Colyseus driver and presence are single-process.
- SQLite persistence is local to the attached volume.
- One Colyseus room belongs to one process.

Scale-out needs:

- Redis-backed Colyseus `Presence` and `Driver`.
- Public address handling for WebSocket seat reservations.
- Shared stats storage or an explicit single-volume stats policy.
- Load testing starting around 25-50 clients.
