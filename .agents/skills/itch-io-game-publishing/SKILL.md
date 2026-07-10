---
name: itch-io-game-publishing
description: Package, publish, update, and verify this Bun + Vite + Colyseus browser multiplayer game on itch.io. Use when Codex needs to help prepare an itch.io HTML5 build, add build:itch or package:itch scripts, build with VITE_GAME_SERVER_URL and Vite --base ./, create the HTML5 ZIP, use butler, configure the itch.io project page, run iframe smoke checks, or troubleshoot itch.io asset paths, WebSocket, wss, indexing, draft, restricted, public, or release checklist issues.
---

# itch.io Game Publishing

## Overview

Use this skill to publish the static browser client to itch.io while keeping the
live Colyseus server on Railway. The itch.io upload should contain only
`apps/web/dist` client files; the server remains externally hosted.

The source-of-truth publishing doc is `docs/deployment/itch-io.md`. Read it
first when present. If it is missing or stale, use
`references/itch-io-runbook.md` as the bundled fallback.

## Start

1. Inspect the current repo and docs before editing:
   - `AGENTS.md`
   - `README.md`
   - `docs/deployment/itch-io.md`
   - `docs/deployment/railway.md`
   - root `package.json`
   - `apps/web/package.json`
   - `apps/web/vite.config.ts`
   - `apps/web/src/App.tsx`
2. Confirm whether the Railway `game-server` URL is available. If not, tell the
   user that itch.io publishing needs a live `wss://` server URL first; use
   `railway-game-deployment` for that setup when appropriate.
3. Confirm the web client still reads `VITE_GAME_SERVER_URL` at build time.
4. Read `references/itch-io-runbook.md` when implementing or explaining exact
   build commands, ZIP packaging, butler commands, page settings, and smoke
   checks.
5. Resolve the Butler executable before using it. Prefer `command -v butler`,
   then test `$HOME/.bin/butler` and `$HOME/bin/butler`; store the resolved
   path in `BUTLER_BIN`. Do not assume a non-interactive shell has the user's
   interactive `PATH`.
6. Run `"$BUTLER_BIN" login` before any `status`, `push`, or `push-preview`
   operation, and complete authentication in the intended itch.io account. Do
   not infer account identity or API access from a Butler credentials file.
7. Obtain an explicit itch target, `<itch-user>/<game-slug>`, from the user,
   an existing project URL, or the authenticated itch.io dashboard. Never
   guess it from a game title or an example in this skill.
8. Confirm the account's email is verified before the first upload. An
   unverified account cannot create a remote Butler build.
9. Use Bun commands only. Do not introduce npm, pnpm, yarn, or dotenv.

## Publishing Model

Use itch.io to host the static HTML5 client. Use Railway to host the multiplayer
server.

```text
itch.io HTML5 iframe
  -> uploaded apps/web/dist files
  -> wss://<game-server-domain>.railway.app
  -> Railway game-server
```

Do not publish the itch.io project as only an external link to the Railway web
site. Prefer an uploaded playable HTML5 build so the page is eligible for normal
itch.io discovery behavior.

## Implementation Rules

- Add `apps/web` `build:itch` when missing:
  `bunx vite build --base ./`.
- Add a root `package:itch` script only when the user wants repeatable local
  packaging automation.
- Always build with
  `VITE_GAME_SERVER_URL=wss://<game-server-domain>.railway.app`.
- Treat `VITE_GAME_SERVER_URL` as build-time config; rebuild before every itch
  upload if the server URL changes.
- Require relative asset paths in `apps/web/dist/index.html`; do not publish
  builds containing `/assets/...`.
- Package the contents of `apps/web/dist`, not the `dist` folder itself.
- Keep `index.html` at the ZIP root.
- Do not include server files, SQLite files, Docker/Railway config, repo source
  files, or `node_modules` in the itch ZIP.
- Prefer Draft or Restricted visibility until iframe smoke checks pass.
- Do not read or reuse Butler's credentials file as an itch.io public API key.
- Treat a first `web` channel as asynchronous: after pushing, poll
  `"$BUTLER_BIN" status <itch-user>/<game-slug>:web` until it shows a build.

## Commands

Build for itch:

```sh
VITE_GAME_SERVER_URL=wss://<game-server-domain>.railway.app bun run --filter @ai-game-jam/web build:itch
```

Fallback without a `build:itch` script:

```sh
VITE_GAME_SERVER_URL=wss://<game-server-domain>.railway.app bun run --filter @ai-game-jam/web build -- --base ./
```

Package ZIP:

```sh
mkdir -p release/itch
cd apps/web/dist
zip -r ../../../release/itch/<game-slug>-html5.zip .
```

Butler update:

```sh
BUTLER_BIN="$(command -v butler || true)"
test -n "$BUTLER_BIN" || BUTLER_BIN="$HOME/.bin/butler"
test -x "$BUTLER_BIN" || BUTLER_BIN="$HOME/bin/butler"
test -x "$BUTLER_BIN"

"$BUTLER_BIN" version
"$BUTLER_BIN" login
"$BUTLER_BIN" push apps/web/dist <itch-user>/<game-slug>:web --userversion <version>
"$BUTLER_BIN" status <itch-user>/<game-slug>:web
```

Use `butler push-preview` before updating a public page when the user wants to
inspect changed files.

## Verification

Before upload:

```sh
test -f apps/web/dist/index.html
rg 'src="./assets|href="./assets' apps/web/dist/index.html
curl -fsS https://<game-server-domain>.railway.app/health
"$BUTLER_BIN" auditzip release/itch/<game-slug>-html5.zip
```

On the itch.io draft or restricted page:

1. Launch the embedded game.
2. Confirm the footer shows the Railway `wss://` server URL.
3. Enter a player name and room name in the lobby.
4. Confirm status becomes `online`.
5. Use `Copy room link`.
6. Open the copied `?room=<slug>` invite in a second browser session.
7. Join with a different player name.
8. Confirm both clients see the same room, carrier state, scores, and match
   phase.
9. Check the browser console for missing assets, mixed content, and WebSocket
   errors.

## Failure Triage

- `ws://localhost:2567` appears in the footer: rebuild with
  `VITE_GAME_SERVER_URL`.
- Requests for `/assets/...` fail: rebuild with `--base ./`.
- Mixed content or WebSocket blocked: use `wss://`, not `ws://`.
- ZIP opens to a directory listing or missing game: ensure `index.html` is at
  ZIP root.
- `butler: command not found`: resolve `BUTLER_BIN` from `$HOME/.bin/butler`
  or `$HOME/bin/butler`, or repair the shell `PATH` and open a new shell.
- Butler asks for authentication or uses the wrong account: run
  `"$BUTLER_BIN" login` and complete the browser flow before retrying.
- `Please verify your account's email address before uploading a build`:
  verify that account's email on itch.io, then rerun the exact push command.
- `No channel web found` immediately after a first push: wait briefly and poll
  `"$BUTLER_BIN" status <itch-user>/<game-slug>:web`; the remote build is
  still processing.
- The page is not discoverable: ensure the project is Public, has a cover image,
  and is playable in browser or has direct files uploaded.
- Multiplayer fails only on itch.io: verify Railway health and public
  networking first, then inspect browser console/network details.

## Final Response

Report:

- files changed
- build and packaging commands run
- path to the generated ZIP, if created
- itch.io project settings the user must apply manually
- smoke-check results and remaining blockers
- residual risks, especially external Railway server availability and
  single-replica Colyseus behavior
