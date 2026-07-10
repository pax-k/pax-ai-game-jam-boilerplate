# Architecture And Lifecycle

Use this when adding scenes, actors, engine setup, cameras, lifecycle hooks, or deciding between Actor and ECS.

## Default Architecture

- Treat `Engine` as the canvas runtime container.
- Treat `Scene` as the composition root for a screen, level, menu, or mode.
- Treat `Actor` as the default unit for visible, moving, colliding game objects.
- Use ECS components and systems when behavior must apply across many entities or needs data-oriented reuse.
- Keep `main` or `mountGame` small: create the engine, register scenes, start with a loader, bind external state, and return cleanup.

## Scene Lifecycle

- Put one-time scene construction in `onInitialize`.
- Put per-entry reset, subscriptions, or spawn refresh in `onActivate`.
- Put pause, unsubscribe, and temporary cleanup in `onDeactivate`.
- Use scene keys consistently when calling `engine.add` and `engine.goToScene`.
- Prefer scene classes when a level or screen has its own actors, timers, camera, or transitions.

## Actor Lifecycle

- Use actor lifecycle hooks for setup that depends on the engine, scene, graphics, physics, or events.
- Keep constructors limited to configuration and stable data.
- Use `onPostUpdate` or `update` for behavior that changes each frame. If overriding `update`, preserve base behavior with `super.update(engine, delta)`.
- Kill actors or remove them from their scene when they are no longer part of gameplay.

## Ownership

- Scene owns scene actors, scene timers, camera behavior, and screen-local state.
- Actor owns its graphics, local input response, collider setup, and actor-local subscriptions.
- Host app owns DOM outside the canvas, env configuration, and mount/dispose timing.
- Server owns authoritative multiplayer state. Client actors should render or predict state, not define truth.

## Decision Tree

- Use a scene when the work is a level, menu, overlay, transition, or resettable gameplay mode.
- Use an actor when the work is visible, moves, collides, receives pointer input, or needs graphics.
- Use a component when the work is reusable state attached to many entities.
- Use a system when the work processes many entities with the same components each frame.
- Use a plain helper when the work is deterministic game math, scoring, spawning, or validation that should be unit tested.

## Common Failure Modes

- Adding actors before registering or activating the intended scene.
- Recreating actors every React render instead of inside the Excalibur lifecycle.
- Storing engine-owned objects in React state.
- Putting reset logic in `onInitialize` when it must run every time a scene is entered.
- Moving authoritative multiplayer rules into client-only actor updates.
