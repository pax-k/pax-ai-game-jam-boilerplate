import { expect, test } from "bun:test";
import { PlayerState } from "@ai-game-jam/protocol";
import { isActivePlayerNameTaken } from "./GameRoom";

test("scopes duplicate player names to the active room", () => {
  const player = new PlayerState();
  player.name = "Pax";
  expect(isActivePlayerNameTaken([player], " pax ")).toBe(true);
  expect(isActivePlayerNameTaken([player], "Ada")).toBe(false);
});
