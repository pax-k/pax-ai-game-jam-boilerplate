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
