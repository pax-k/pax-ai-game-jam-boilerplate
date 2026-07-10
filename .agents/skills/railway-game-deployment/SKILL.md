---
name: railway-game-deployment
description: Prepare, configure, deploy, and verify this Bun + Colyseus + Vite multiplayer game on Railway. Use when Codex needs to help with Railway deployment for this repo, including Dockerfile and .dockerignore setup, Railway game-server and web service settings, DB_FILE_NAME volume persistence, VITE_GAME_SERVER_URL wiring, Railway CLI commands, health checks, logs, smoke tests, or single-replica Colyseus deployment constraints.
---

# Railway Game Deployment

## Overview

Use this skill to turn the repo-local Railway deployment runbook into concrete
setup, code/config edits, deployment commands, and verification evidence.

The source-of-truth deployment doc is `docs/deployment/railway.md`. Read it
first when present. If it is missing or stale, use
`references/railway-runbook.md` as the bundled fallback.

## Start

1. Inspect the current repo shape before changing deployment files:
   - `AGENTS.md`
   - `README.md`
   - `docs/deployment/railway.md`
   - root `package.json`
   - `apps/server/package.json`
   - `apps/web/package.json`
   - `apps/server/src/index.ts`
   - `apps/server/src/database.ts`
   - `apps/web/src/App.tsx`
2. Confirm the server still reads `PORT` and exposes `GET /health`.
3. Confirm the web app reads `VITE_GAME_SERVER_URL` at build time and its Vite
   preview config allowlists `process.env.RAILWAY_PUBLIC_DOMAIN`.
4. Read `references/railway-runbook.md` when implementing or explaining exact
   Railway service settings, variables, volumes, commands, and smoke checks.
5. Use Bun commands only. Do not introduce npm, pnpm, yarn, dotenv, Express, or
   Node-only server runners for this deployment path.

## Deployment Model

Create two Railway services in one Railway project:

- `game-server`: long-running Bun + Colyseus WebSocket server.
- `web`: Vite client served with `vite preview`.

Deploy `game-server` first, generate its public Railway domain, then configure
`web` with `VITE_GAME_SERVER_URL=wss://${{game-server.RAILWAY_PUBLIC_DOMAIN}}`
before its first source build. The web bundle must contain the resulting
`wss://` URL before browser testing begins.

Keep `game-server` at one replica unless the user has explicitly requested and
approved a Colyseus scale-out task. Current Colyseus room state and SQLite
stats are single-process/single-volume.

## Implementation Rules

- Add or update a root `Dockerfile` only when deployment config is requested or
  missing.
- Add or update a root `.dockerignore` to exclude dependency folders, git data,
  local SQLite data, and generated web dist files.
- Add `apps/web` `start` script when Railway needs to run the web service:
  `bunx vite preview --host 0.0.0.0 --port $PORT`.
- Keep `apps/server` start behavior as `bun ./dist/index.js`.
- For a shared Dockerfile, declare `ARG VITE_GAME_SERVER_URL` and promote it to
  `ENV` before `RUN bun run build`; Railway variables otherwise are not visible
  to Vite inside the Docker build layer.
- Let the Docker image select its runtime role using
  `RAILWAY_SERVICE_NAME=web`; do not rely solely on a service start-command
  override for the shared image.
- Configure Vite `preview.allowedHosts` from
  `process.env.RAILWAY_PUBLIC_DOMAIN`; `Bun.env` is unavailable when Vite loads
  its config.
- Do not set `PORT` in Railway variables. Railway injects it.
- Set `DB_FILE_NAME=/data/game.sqlite` for `game-server` and attach a Railway
  volume mounted at `/data`.
- Set `VITE_GAME_SERVER_URL` on `web` with the `game-server` public-domain
  reference before connecting its source or triggering a build.
- Treat `VITE_GAME_SERVER_URL` as build-time config; redeploy `web` after it
  changes and assert the served JavaScript contains the expected URL.
- Treat `railway service list` in the target environment as the deployable
  source of truth. Empty project-level auto-detected service definitions do not
  replace real environment service instances.

## Verification

Before deploy or PR closeout, run the narrowest relevant local commands:

```sh
bun install
bun run check-types
bun test
bun run build
```

If only service/package commands changed, focused builds are acceptable first:

```sh
bun run --filter @ai-game-jam/server build
bun run --filter @ai-game-jam/web build
```

After Railway deployment, verify:

```sh
curl -fsS https://<game-server-domain>.railway.app/health
curl -fsSI https://<web-domain>.railway.app
railway deployment list --service game-server --json
railway deployment list --service web --json
railway environment config --json
```

Require terminal `SUCCESS` for both services at the expected commit SHA. Read
back `deploy.healthcheckPath`; if it is not `/health`, treat the Railway health
gate as incomplete even if manual `curl` passes.

Browser smoke:

1. Extract the asset path from the served HTML and assert its JavaScript
   contains the exact `wss://` server URL.
2. Open `?room=railway-smoke-<sha>&playerId=smoke-one&playerName=Smoke%20One`.
3. Open a second tab in the same room with `smoke-two` / `Smoke Two`.
4. Confirm each client sees the other, both report two players, and neither has
   console, asset, or WebSocket errors.

## Failure Triage

- `ws://localhost:2567` appears in production: inspect the served asset. Add
  Docker `ARG`/`ENV` for `VITE_GAME_SERVER_URL`, then rebuild `web`; setting a
  Railway variable alone is insufficient for a Docker build.
- Web domain returns `403` with `Blocked request. This host ... is not allowed`:
  add `RAILWAY_PUBLIC_DOMAIN` to Vite `preview.allowedHosts`, rebuild, and
  redeploy.
- `/health` fails: inspect `game-server` logs and confirm the Railway service is
  using the server start command.
- SQLite data disappears: confirm the volume is attached at `/data` and
  `DB_FILE_NAME=/data/game.sqlite`.
- WebSocket fails while `/health` passes: confirm the client uses `wss://`, the
  server domain is public, and browser console/network details do not show mixed
  content or blocked upgrade requests.
- Multiple replicas produce inconsistent rooms: scale `game-server` back to one
  replica and plan Redis-backed Colyseus `Presence`/`Driver` plus shared stats
  storage before scaling again.

## Final Response

Report:

- files changed
- Railway service settings or variables the user must apply manually
- exact verification commands and results
- deployed URLs or placeholders still needed
- residual risks, especially single-replica Colyseus and SQLite volume scope
- whether the Railway healthcheck is actually configured, not merely curlable
