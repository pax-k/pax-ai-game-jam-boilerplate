import { type PlayerInput, type Point, resolveMovement } from "@ai-game-jam/protocol";

export function shouldSendPlayerInput(previous: PlayerInput | undefined, next: PlayerInput) {
  return (
    !previous ||
    previous.left !== next.left ||
    previous.right !== next.right ||
    previous.up !== next.up ||
    previous.down !== next.down
  );
}

export function reconcilePosition(current: Point, target: Point, deltaSeconds: number): Point {
  const distance = Math.hypot(target.x - current.x, target.y - current.y);
  if (distance > 180) {
    return target;
  }
  const ratio = Math.min(1, deltaSeconds * 12);
  return {
    x: current.x + (target.x - current.x) * ratio,
    y: current.y + (target.y - current.y) * ratio
  };
}

export function predictPosition(position: Point, input: PlayerInput, deltaSeconds: number) {
  return resolveMovement(position, input, deltaSeconds);
}
