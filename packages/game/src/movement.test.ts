import { expect, test } from "bun:test";
import { predictPosition, reconcilePosition, shouldSendPlayerInput } from "./movement";

test("predicts movement and sends only changed held input", () => {
  const input = { left: false, right: true, up: false, down: false, seq: 1 };
  expect(predictPosition({ x: 100, y: 100 }, input, 0.1).x).toBeGreaterThan(100);
  expect(shouldSendPlayerInput(undefined, input)).toBe(true);
  expect(shouldSendPlayerInput(input, { ...input, seq: 2 })).toBe(false);
});

test("reconciles small corrections and snaps large authority gaps", () => {
  expect(reconcilePosition({ x: 0, y: 0 }, { x: 10, y: 0 }, 0.1).x).toBe(10);
  expect(reconcilePosition({ x: 0, y: 0 }, { x: 400, y: 0 }, 0.1)).toEqual({ x: 400, y: 0 });
});
