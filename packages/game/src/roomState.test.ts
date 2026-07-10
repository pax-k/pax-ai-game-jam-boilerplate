import { expect, test } from "bun:test";
import { forEachAvailablePlayer, getAvailablePlayer } from "./roomState";

test("waits for an initial player collection before iterating it", () => {
  const observed: string[] = [];
  forEachAvailablePlayer<string>(undefined, (player) => observed.push(player));
  expect(observed).toEqual([]);

  forEachAvailablePlayer(new Map([["session-a", "Alpha"]]), (player) => observed.push(player));
  expect(observed).toEqual(["Alpha"]);
});

test("does not read a player before the first state collection exists", () => {
  expect(getAvailablePlayer(undefined, "session-a")).toBeUndefined();
  expect(getAvailablePlayer(new Map([["session-a", "Alpha"]]), "session-a")).toBe("Alpha");
});
