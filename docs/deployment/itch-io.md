# itch.io HTML5 publishing

itch.io hosts only the static `apps/web/dist` client. Host the Colyseus server elsewhere first, then build with its public `wss://` URL:

```sh
VITE_GAME_SERVER_URL=wss://<game-server-domain> bun run build:itch
```

Upload the contents of `apps/web/dist` with `index.html` at the ZIP root. Verify relative asset URLs, the WebSocket connection, and two distinct players in one room before making the page public. Do not commit generated release ZIPs.
