# Railway deployment

Deploy two services from this repository: `game-server` runs the Bun and Colyseus server, and `web` runs the built Vite client.

1. Deploy `game-server` first with one replica, `DB_FILE_NAME=/data/game.sqlite`, and a Railway volume mounted at `/data`.
2. Set the web build variable `VITE_GAME_SERVER_URL=wss://${{game-server.RAILWAY_PUBLIC_DOMAIN}}` before building `web`.
3. Set `RAILWAY_SERVICE_NAME=web` only on the web service. Railway provides `PORT`; do not set it manually.
4. Verify `https://<game-server>/health`, the web response, the embedded `wss://` URL, and two distinct browser clients in the same room.

The shared Dockerfile builds both services. SQLite and in-memory Colyseus rooms require the game server to stay at one replica until shared presence and storage are introduced.
