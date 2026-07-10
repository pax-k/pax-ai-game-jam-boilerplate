---
name: excalibur-game-dev
description: Use this skill when building, reviewing, debugging, or extending Excalibur.js games, especially Bun, Vite, TypeScript, or Colyseus-backed game projects. Covers Excalibur engine setup, scenes, actors, lifecycle hooks, resources and loaders, graphics, audio, input, UI, physics, collisions, triggers, actions, timers, ECS, maps, plugins, browser canvas verification, and repo-specific client/server boundaries.
---

# Excalibur Game Dev

Use this skill to make Excalibur.js game changes that fit the engine lifecycle, preserve this repo's Bun workflow, and keep multiplayer authority out of the rendering client.

## First Pass

1. Inspect the repo before choosing a pattern:
   - package versions in `package.json`, `apps/*/package.json`, and `packages/*/package.json`
   - `packages/game/src` exports, engine creation, `mountGame`, and `dispose` behavior
   - `apps/web` canvas host, React lifecycle, Vite env usage, and styles around the game frame
   - asset locations, resource loading conventions, and any existing `resources.ts`
   - scenes, actors, timers, input loops, pointer listeners, room callbacks, and cleanup paths
   - protocol/server ownership when a gameplay feature touches multiplayer state
   - existing planning anchors in `docs/game-design/client-architecture.md`, `docs/game-design/mechanics.md`, `docs/game-design/asset-plan.md`, and `docs/game-design/core-loop.md`
2. Classify the task:
   - Setup, package wiring, Vite hosting, assets, or commands: read [project-setup-bun-vite.md](references/project-setup-bun-vite.md).
   - Engine, scene, actor, lifecycle, camera, or ownership design: read [architecture-and-lifecycle.md](references/architecture-and-lifecycle.md).
   - Gameplay feature flow, spawning, score, restart, pickups, enemies, or config constants: read [feature-flows.md](references/feature-flows.md).
   - Keyboard, pointer, gamepad, controls, menus, HUD, or React/canvas UI split: read [input-events-and-ui.md](references/input-events-and-ui.md).
   - React/CSS lobby, loader, HUD, scoreboard, controls, notices, banners, buttons, or responsive presentation: read [frontend-design](../frontend-design/SKILL.md).
   - Images, sprites, animations, loaders, audio, fonts, or asset failures: read [graphics-resources-and-audio.md](references/graphics-resources-and-audio.md).
   - Physics, colliders, collision events, triggers, hitboxes, damage boxes, or debug drawing: read [physics-collisions-and-triggers.md](references/physics-collisions-and-triggers.md).
   - Actions, timers, ECS components, systems, reusable behaviors, or cleanup: read [actions-timers-and-ecs.md](references/actions-timers-and-ecs.md).
   - TileMap, Tiled, LDtk, Aseprite, SpriteFusion, levels, or map object properties: read [maps-levels-and-plugins.md](references/maps-levels-and-plugins.md).
   - Runtime debugging, blank canvas, invisible actors, input failures, asset failures, or browser smoke tests: read [debugging-and-verification.md](references/debugging-and-verification.md).
   - Code review or audit: read [review-checklist.md](references/review-checklist.md), plus any relevant domain reference above.
   - Visual readability, held-key input feel, multiplayer identity, client prediction, collision readability, generated maps, or art/readability proof: read [playable-evidence-and-feedback.md](../_shared/playable-evidence-and-feedback.md).
3. If relevant `docs/game-design/*` anchors exist, read them before changing gameplay, scenes, actors, input, UI, resources, rendering, or client-side multiplayer visualization. Preserve explicit planning decisions unless the user asks to revise them.
4. Implement narrowly. Prefer existing package boundaries and local naming. Keep scene composition in Excalibur, DOM composition in React, and authoritative simulation in the server/protocol packages.
5. Verify with the smallest relevant command first, then broader repo checks if the change crosses package boundaries.

## Defaults For This Repo

- Use Bun commands: `bun install`, `bun run <script>`, `bun test`, and `bunx <tool>`.
- Keep Excalibur client code in `packages/game`; export a small mount/dispose surface to `apps/web`.
- Use `apps/web` as the Vite React host for the canvas. Do not move game simulation or actor logic into React components.
- Do not introduce Vite outside `apps/web`.
- Keep Colyseus/server-authoritative state in `apps/server` and shared message/schema contracts in `packages/protocol`.
- Let Excalibur actors visualize local or synced state; do not make client actors the source of multiplayer truth.
- Prefer `import * as ex from "excalibur"` unless the local code already uses a narrower import style.
- Centralize dimensions, speeds, scene keys, message names, and asset definitions instead of scattering literals through actors.

## Gotchas

- Actors are not drawn or updated unless they are added to the active scene graph.
- Give visible actors graphics and stable dimensions; a collider alone is not a visible graphic.
- Use scene `onInitialize` for one-time setup and `onActivate` or `onDeactivate` for per-entry state.
- Use actor lifecycle hooks for actor setup; avoid constructor work that depends on the engine or scene.
- Keep game logic out of draw hooks. Use update hooks, actions, timers, systems, or server simulation.
- Query continuous input during update loops. Use event subscriptions for discrete actions and always clean them up.
- Keep resource loading centralized with `Resources as const` and a loader when adding multiple assets.
- Treat colliders as gameplay geometry, not visual art. Tune shapes independently from sprites.
- When a visual looks wrong, distinguish sprite assets from Excalibur overlays, debug graphics, tint, opacity, z-order, CSS, and HUD before changing art.
- When local prediction exists, ensure it uses the same shared geometry/math as the authoritative server path when practical, or record why visual correction is acceptable.
- Add timers to a scene or engine-owned lifecycle and remove/cancel them on teardown.
- Clean up actors, subscriptions, callbacks, timers, room connections, and the Excalibur engine in `dispose`.
- Translate npm/npx commands from Excalibur docs to Bun commands in this repo.

## Verification Defaults

- Game package type checks: `cd packages/game && bun run check-types`.
- Web host type checks: `cd apps/web && bun run check-types`.
- Cross-package TypeScript changes: `bun run check-types`.
- Gameplay/server logic changes: `bun test`, plus targeted package tests when available.
- Bundled browser build: `bun run build`.
- Visual or input changes: run the app and perform the playable evidence gate. Confirm served app identity, one expected canvas, expected internal canvas size, visible/readable actors or terrain, no HUD occlusion, console/network health, and real held-input behavior when movement feel is involved.
- Multiplayer visual changes: prove distinct clients in the same room see expected state; do not treat two tabs sharing one browser identity as a valid two-client smoke.
- Skill packaging changes: `bunx --yes skills add . --list --full-depth`.
