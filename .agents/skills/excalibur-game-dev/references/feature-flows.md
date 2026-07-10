# Feature Flows

Use this when adding common gameplay mechanics or refactoring a prototype into durable Excalibur structure.

## Add A New Actor Type

- Define the gameplay data first: size, speed, collision role, visual, lifetime, and owner.
- Create a focused actor class or factory in `packages/game/src`.
- Set graphics and colliders during actor setup.
- Add the actor through the current scene, not through unrelated host code.
- Store cleanup handles for subscriptions, timers, or room callbacks.
- Verify the actor appears in the active scene and is removed when no longer needed.

## Add A Pickup Or Collectible

- Decide whether collection is local-only or server-authoritative.
- Use a collider or trigger shape sized for gameplay, not necessarily the sprite bounds.
- Use collision start for collection, then disable or kill the pickup to prevent duplicate collection.
- For multiplayer, send intent to the server or render server-confirmed removal instead of trusting client collection.
- Keep score or inventory state in the owner that represents truth.

## Add Enemies Or Hazards

- Keep enemy movement rules in a scene system, actor update, action chain, or pure helper depending on complexity.
- Use collision groups or collision types to avoid broad collision handlers full of manual filtering.
- Separate damage boxes, hit boxes, and body colliders when the gameplay shape differs from the visual body.
- Add state transitions explicitly: idle, chase, attack, stunned, dead, or despawned.

## Add Score, Game Over, Or Restart

- Decide where truth lives: scene state for local games, protocol/server state for multiplayer games.
- Use scene activation to reset per-run actors, timers, counters, and camera state.
- Use scene transitions for menus, game over screens, and level changes.
- Avoid full engine remount for simple game restart unless host-level resources must reset.

## Add Spawning

- Keep spawn constants centralized.
- Use timers for repeated spawning with scene-owned cleanup.
- Use deterministic helpers for spawn positions or wave definitions when they should be tested.
- Clamp or validate spawn positions against the world bounds and camera expectations.

## Refactor A Prototype

- Move one-off literals into named config constants.
- Move asset declarations into resources.
- Move level composition into a scene.
- Move repeated actor behavior into actor classes, components, or helpers.
- Keep the exported mount surface stable unless the user requested an app API change.
