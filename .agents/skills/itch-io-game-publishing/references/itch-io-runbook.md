# itch.io Runbook Reference

Use this reference for exact itch.io publishing settings and commands when
`docs/deployment/itch-io.md` is unavailable or when a compact checklist is
needed.

## Deployment Shape

```text
Player browser
  -> itch.io HTML5 iframe
  -> uploaded apps/web/dist client files
  -> wss://<game-server-domain>.railway.app
  -> Railway game-server
```

Publish the static HTML5 client to itch.io. Keep the Colyseus server on Railway.

## Preconditions

- Railway `game-server` is deployed and healthy.
- `https://<game-server-domain>.railway.app/health` returns `ok: true`.
- The Railway WebSocket URL is
  `wss://<game-server-domain>.railway.app`.
- itch.io project title, slug, cover image, and screenshots are ready before
  first public publish.
- The exact itch target, `<itch-user>/<game-slug>`, is known; do not guess it
  from the game title or an example command.
- The itch.io account email is verified. Butler cannot create a build for an
  unverified account.

## Repo Prep

Add `apps/web/package.json` script:

```json
{
  "scripts": {
    "build:itch": "bunx vite build --base ./"
  }
}
```

Optional root script:

```json
{
  "scripts": {
    "package:itch": "bun run --filter @ai-game-jam/web build:itch && mkdir -p release/itch && cd apps/web/dist && zip -r ../../../release/itch/<game-slug>-html5.zip ."
  }
}
```

Use `--base ./` so Vite emits relative asset paths for itch.io's HTML5 CDN
subdirectory.

## Build

Preferred:

```sh
VITE_GAME_SERVER_URL=wss://<game-server-domain>.railway.app bun run --filter @ai-game-jam/web build:itch
```

Fallback with existing `build`:

```sh
VITE_GAME_SERVER_URL=wss://<game-server-domain>.railway.app bun run --filter @ai-game-jam/web build -- --base ./
```

Verify generated asset paths:

```sh
rg 'src="./assets|href="./assets' apps/web/dist/index.html
```

Do not publish if `apps/web/dist/index.html` contains `/assets/...`.

## Package

```sh
mkdir -p release/itch
cd apps/web/dist
zip -r ../../../release/itch/<game-slug>-html5.zip .
```

Expected ZIP root:

```text
index.html
assets/index-....js
assets/index-....css
assets/index-....png
```

Do not include:

- `apps/server`
- SQLite database files
- Railway Dockerfile or service config
- repo source files
- `node_modules`

## Manual itch.io Setup

Recommended first publish settings:

```text
Kind of project: HTML
Upload: release/itch/<game-slug>-html5.zip
Launch mode: Click to launch in fullscreen
Mobile Friendly: leave disabled unless mobile smoke passes
Visibility: Draft or Restricted until smoke checks pass
```

After upload:

1. Select the ZIP as the playable browser file.
2. Confirm the page is `HTML`, not only `Downloadable`.
3. Add a cover image.
4. Add 3-5 screenshots or GIFs if available.
5. Add controls, multiplayer note, credits, and support/contact details.
6. Add Railway or project homepage links only as secondary external links.
7. Save before previewing.

Suggested description sections:

```text
About
Controls
Multiplayer
Known Issues
Credits
```

## Butler

Resolve the standalone Butler installed in a user-owned directory. On macOS,
the official installation guide permits any extracted directory; this project
commonly uses `$HOME/.bin/butler`. Do not assume a non-interactive shell has it
on `PATH`.

```sh
BUTLER_BIN="$(command -v butler || true)"
test -n "$BUTLER_BIN" || BUTLER_BIN="$HOME/.bin/butler"
test -x "$BUTLER_BIN" || BUTLER_BIN="$HOME/bin/butler"
test -x "$BUTLER_BIN"

"$BUTLER_BIN" version
"$BUTLER_BIN" login
```

Complete the browser login using the itch.io account that owns the target.
Do not use Butler's credentials file as a generic itch.io API key or infer the
account/project from its presence.

Push:

```sh
"$BUTLER_BIN" push apps/web/dist <itch-user>/<game-slug>:web --userversion <version>
```

Example:

```sh
"$BUTLER_BIN" push apps/web/dist <itch-user>/<game-slug>:web --userversion 0.1.0
```

The first upload may report that the build is processing. Poll the channel,
not the bare project target, until Butler reports a build:

```sh
"$BUTLER_BIN" status <itch-user>/<game-slug>:web
```

After the first push, verify in the itch.io Edit game page:

- page kind is `HTML`
- `web` channel is tagged `HTML5 / Playable in browser`
- playable file is visible
- page remains Draft or Restricted until smoke checks pass

Preview changed files:

```sh
"$BUTLER_BIN" push-preview apps/web/dist <itch-user>/<game-slug>:web
```

## Smoke Checks

Server:

```sh
curl -fsS https://<game-server-domain>.railway.app/health
```

Static files:

```sh
test -f apps/web/dist/index.html
rg 'src="./assets|href="./assets' apps/web/dist/index.html
"$BUTLER_BIN" auditzip release/itch/<game-slug>-html5.zip
```

itch.io iframe:

1. Open the draft or restricted page.
2. Launch the embedded game.
3. Confirm footer server is `wss://<game-server-domain>.railway.app`.
4. Enter a player name and room name in the lobby.
5. Confirm status becomes `online`.
6. Copy room link.
7. Open copied `?room=<slug>` invite in a second browser session.
8. Join with a different player name.
9. Confirm both clients see the same room and match state.
10. Check browser console for missing assets, mixed content, and WebSocket
    errors.

## Release Checklist

Before Public:

- Railway server health passes.
- itch.io iframe smoke passes with two players.
- Cover image exists.
- Screenshots or GIFs exist.
- Metadata and tags are accurate.
- Generative AI asset use is disclosed if applicable.
- Page is not only an external link.
- Game is only submitted to relevant jams.

When ready:

1. Set visibility to `Public`.
2. Save the page.
3. Check public page in a private browser window.
4. Submit to a relevant jam only if rules match.

## Common Failures

- `ws://localhost:2567`: missing build-time `VITE_GAME_SERVER_URL`.
- `/assets/...`: missing Vite `--base ./`.
- Mixed content: server URL uses `ws://` instead of `wss://`.
- ZIP root is wrong: `index.html` is nested inside `dist/`.
- `butler: command not found`: set `BUTLER_BIN` to the executable, checking
  `$HOME/.bin/butler` then `$HOME/bin/butler` on macOS, or repair `PATH` and
  open a fresh shell.
- `Please verify your account's email address before uploading a build`: verify
  the itch.io account email, then retry the push.
- `No channel web found` just after a first push: the build is still processing;
  rerun `"$BUTLER_BIN" status <itch-user>/<game-slug>:web` after a brief wait.
- Page not indexed: project is not Public, lacks cover image, or is not
  playable/downloadable on itch.io.
