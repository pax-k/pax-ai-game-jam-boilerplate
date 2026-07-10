# Testing, Load, And Scaling

Use this when adding tests, diagnosing multiplayer regressions, creating load-test scripts, or planning multi-process scale-out.

## Unit Tests

- Test pure simulation helpers directly with `bun test`.
- Test schema defaults and collection behavior in the protocol package.
- Test payload normalizers with valid, partial, malformed, and boundary inputs.
- Keep fast tests close to the package they validate.

## Colyseus Room Tests

Use `@colyseus/testing` when behavior needs real room/client interaction:

- room creation
- client joins/leaves
- message delivery
- state patches
- auth/join failures
- reconnection behavior
- room identity, room slug, or matchmaking isolation
- distinct player identity across browser tabs or SDK clients

Always create fresh rooms per test and clean up between tests. Wait for server/client processing before assertions.

For browser-facing multiplayer features, pair room tests with playable evidence when practical: prove two distinct clients join the intended room, see the same authoritative state, and do not share one player id through browser storage or reused session state.

## Load Tests

Use `@colyseus/loadtest` when the question is concurrency or throughput. A useful script should:

- connect with `@colyseus/sdk`
- join or create the target room
- send representative inputs/messages
- react to state changes enough to catch errors
- log join failures, room errors, and leave codes

Prefer modest initial runs such as 25-50 clients before scaling up.

## Scaling Model

- One room belongs to one Colyseus process.
- More processes increase room capacity, not the per-room single-process limit.
- Redis-backed Presence and Driver are required for multi-process matchmaking and seat reservations.
- Each process must be publicly reachable for the WebSocket connection after seat reservation.
- Do not use Node cluster mode for Colyseus process scaling; use separate processes/ports.

## Bun Caveats

- Confirm `@colyseus/testing` and `@colyseus/loadtest` run cleanly under Bun before assuming Node examples copy directly.
- Use `bunx` for one-off tools.
- Keep load scripts deterministic enough to reproduce failures.

## Verification

- Local fast pass: `bun test packages/protocol/src` and `bun test apps/server/src`.
- Cross-package pass: `bun run check-types`.
- Load pass: start the server, then run the load-test script against `http://localhost:2567`.
