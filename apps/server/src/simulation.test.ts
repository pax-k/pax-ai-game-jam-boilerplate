import { expect, test } from "bun:test";
import { PlayerState } from "@ai-game-jam/protocol";
import { applyPlayerInput } from "./simulation";

test("applies only normalized authoritative movement", () => {
  const player = new PlayerState();
  player.x = 400;
  player.y = 300;

  expect(
    applyPlayerInput(
      player,
      { left: false, right: true, up: false, down: false, seq: 3 },
      0.1
    )
  ).toBe(true);
  expect(player.x).toBeGreaterThan(400);
  expect(player.lastProcessedInputSeq).toBe(3);
});
