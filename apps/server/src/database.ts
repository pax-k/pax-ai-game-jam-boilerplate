import { createGameDatabase } from "@ai-game-jam/db";
import { fileURLToPath } from "node:url";

const defaultDatabaseFile = fileURLToPath(new URL("../../../data/game.sqlite", import.meta.url));

export const gameDatabase = createGameDatabase({
  filename: Bun.env.DB_FILE_NAME ?? defaultDatabaseFile
});
