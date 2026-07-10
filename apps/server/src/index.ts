import { BunWebSockets } from "@colyseus/bun-websockets";
import { getDatabaseStats } from "@ai-game-jam/db";
import { STARTER_ROOM_NAME } from "@ai-game-jam/protocol";
import { createEndpoint, createRouter, defineRoom, defineServer } from "colyseus";
import { gameDatabase } from "./database";
import { GameRoom } from "./rooms/GameRoom";

const port = readPort();

const routes = createRouter({
  health: createEndpoint("/health", { method: "GET" }, async () =>
    Response.json({
      ok: true,
      service: "@ai-game-jam/server",
      database: await getDatabaseStats(gameDatabase)
    })
  )
});

export const server = defineServer({
  transport: new BunWebSockets({}),
  rooms: {
    [STARTER_ROOM_NAME]: defineRoom(GameRoom).filterBy(["roomSlug"])
  },
  routes
});

await server.listen(port);
console.log(`[server] listening on http://localhost:${port}`);

function readPort() {
  const value = Number.parseInt(Bun.env.PORT ?? "", 10);
  return Number.isFinite(value) ? value : 2567;
}
