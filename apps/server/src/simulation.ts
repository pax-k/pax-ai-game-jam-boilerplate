import {
  type PlayerInput,
  type PlayerState,
  resolveMovement
} from "@ai-game-jam/protocol";

export function applyPlayerInput(
  player: PlayerState,
  input: PlayerInput,
  deltaSeconds: number
) {
  const next = resolveMovement(player, input, deltaSeconds);
  const moved = next.x !== player.x || next.y !== player.y;
  player.x = next.x;
  player.y = next.y;
  player.lastProcessedInputSeq = input.seq;
  return moved;
}
