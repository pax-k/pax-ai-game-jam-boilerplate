---
name: colyseus-multiplayer-engineering
description: Use this skill when building, reviewing, debugging, or extending Colyseus multiplayer games, especially TypeScript or Bun projects. Covers authoritative rooms, schema state sync, message validation, matchmaking, room access recipes, reconnection, timing, testing, load testing, and scaling patterns.
---

# Colyseus Multiplayer Engineering

Use this skill to make Colyseus multiplayer changes that preserve server authority, keep synced state small, and fit this repo's Bun/TypeScript workflow.

## First Pass

1. Inspect the repo before choosing a pattern:
   - package versions in `package.json`, `apps/*/package.json`, and `packages/*/package.json`
   - server entrypoint, room registration, and HTTP routes
   - `Room` classes and room lifecycle methods
   - shared protocol/schema package
   - client SDK usage and state callback cleanup
   - `tsconfig.json` decorator settings
   - existing planning anchors in `docs/game-design/multiplayer-architecture.md`, `docs/game-design/mechanics.md`, and `docs/game-design/core-loop.md`
2. Classify the task:
   - Setup or runtime wiring: read [project-setup-bun.md](references/project-setup-bun.md).
   - Room/game feature: read [architecture-and-room-flow.md](references/architecture-and-room-flow.md).
   - Synced state or protocol change: read [schema-state-sync.md](references/schema-state-sync.md).
   - Client/server messages: read [messages-and-validation.md](references/messages-and-validation.md).
   - Private rooms, passwords, custom room ids, auth, or denied joins: read [room-access-recipes.md](references/room-access-recipes.md).
   - Disconnects, reconnection, cleanup, timers, or exceptions: read [reconnection-and-lifecycle.md](references/reconnection-and-lifecycle.md).
   - Tests, load tests, deploy scale-out, Redis presence, or drivers: read [testing-load-scaling.md](references/testing-load-scaling.md).
   - Code review or audit: read [review-checklist.md](references/review-checklist.md), plus any relevant domain reference above.
   - Authoritative movement, collision, projectiles, pickups, room seeds, generated maps, room identity, reconnect behavior, or client prediction/readability: read [playable-evidence-and-feedback.md](../_shared/playable-evidence-and-feedback.md).
3. If relevant `docs/game-design/*` anchors exist, read them before changing protocol, room behavior, server-authoritative mechanics, persistence, matchmaking, or client/server messages. Preserve explicit planning decisions unless the user asks to revise them.
4. Implement narrowly. Prefer existing package boundaries and local naming. Keep reusable game rules outside `Room` classes when possible.
5. Verify with the smallest relevant command first, then broader repo checks if the change crosses package boundaries.

## Defaults For This Repo

- Use Bun commands: `bun install`, `bun run <script>`, `bun test`, and `bunx <tool>`.
- Prefer `@colyseus/bun-websockets` for server transport in this Bun repo.
- Use `defineServer`, `defineRoom`, `createRouter`, and `createEndpoint` for Colyseus 0.17-style server wiring.
- Keep shared protocol constants, message types, and `@colyseus/schema` classes in the protocol package.
- Keep simulation math and deterministic game rules in plain TypeScript helpers that can be unit tested without a running room.
- Use `@colyseus/sdk` callbacks on the client and always clean up listeners/actors/timers on dispose.
- Put deterministic authority inputs that the client must mirror, such as generated arena geometry or collision math, in shared protocol helpers instead of duplicating them separately in server and client code.

## Gotchas

- Do not use `Schema` classes for transient messages. Use plain TypeScript payloads and validate/normalize them.
- Keep `Schema` classes mostly data-only. Do not bury heavy game rules in synced state classes.
- Keep `Room` classes small. Delegate commands, simulation, validation, persistence, or matchmaking policy to focused helpers when they grow.
- Use `this.clock` for room-owned timers. Use `setSimulationInterval` for simulation ticks. Avoid raw `setTimeout` or `setInterval` inside rooms.
- When room identity, player identity, matchmaking, or reconnect logic changes, prove distinct clients can join the intended room without sharing a player id or leaking state across room slugs.
- When server authority changes movement, collision, pickup, projectile, scoring-zone, spawn, or generated-map rules, verify that client prediction/readability does not visibly contradict the server rule.
- Bun WebSockets support in Colyseus is still experimental; prefer simple, well-tested transport wiring and document any workaround.
- Confirm `experimentalDecorators: true` and `useDefineForClassFields: false` remain set when adding schema decorators.
- Do not add a public `skills/` mirror, `skills.sh.json`, `agents/openai.yaml`, `assets/`, or `scripts/` unless the user asks for a later publishing or automation pass.

## Verification Defaults

- Protocol/schema changes: `bun test packages/protocol/src`.
- Server room changes: `bun test apps/server/src` and `bun run check-types`.
- Client SDK/game changes: `bun run check-types`; add playable evidence checks when room identity, multiplayer sync, prediction, collision readability, or user-visible state changes.
- Multi-client features: verify room isolation and distinct client identity with either two real browser sessions or an explicit SDK client plus browser proof; record the exact method used.
- Skill packaging changes: `bunx --yes skills add . --list --full-depth`.
