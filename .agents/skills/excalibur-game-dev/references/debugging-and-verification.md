# Debugging And Verification

Use this when Excalibur behavior fails at runtime or when visual/input changes need browser verification.

## Blank Canvas

- Check the browser console first.
- Confirm the host calls `mountGame` and awaits or handles failures.
- Confirm the target element exists and the canvas is appended.
- Confirm `engine.start()` runs and rejects are surfaced.
- Confirm canvas sizing and CSS do not collapse the play surface to zero.
- Add a temporary primitive actor directly to the engine to separate engine startup from scene/resource failures.

## Invisible Actor

- Confirm the actor is added to the active scene graph.
- Confirm it has visible graphics, not only a collider.
- Confirm position, z index, opacity, scale, and camera bounds.
- Confirm the actor is not killed immediately.
- Toggle debug drawing to see colliders and actor bounds.

## Input Not Working

- Confirm the canvas or document has focus when required.
- Confirm the input is queried during update for continuous controls.
- For movement feel, test real held-key behavior; short synthetic key taps do not prove continuous movement or lag.
- Confirm key names match Excalibur `Keys` values.
- Confirm event subscriptions are attached after engine creation and cleaned only on dispose/deactivate.
- For multiplayer, confirm input messages are sent at the intended tick rate and accepted by the server.

## Assets Not Loading

- Check browser network requests.
- Confirm asset paths are correct for the active Vite/Bun host.
- Confirm resources are added to the loader before `engine.start(loader)`.
- Confirm scene-specific resources are loaded before use.
- Add a primitive fallback graphic to verify actor setup still works.
- When art looks wrong, inspect the source asset separately from runtime overlays, tint, opacity, z-order, CSS, HUD, and debug graphics.

## Collisions Not Firing

- Confirm both actors have colliders.
- Confirm collision types and groups allow the interaction.
- Confirm actors are in the active scene.
- Confirm the event name and subscription target are correct.
- Use debug drawing to compare visual sprite bounds with collider geometry.

## Multiplayer Sync Issues

- Confirm server state is changing before debugging actor rendering.
- Confirm Colyseus callbacks are registered and cleaned up.
- Confirm actor maps use stable room/session/entity ids.
- Confirm local prediction does not overwrite newer server state.
- Confirm local prediction uses the same shared geometry/math as server authority for blockers, pickups, projectiles, generated maps, or scoring zones when those rules affect readability.
- Confirm reconnect/dispose paths do not leave duplicate callbacks or actors.

## Browser Smoke Check

- Start the web app with Bun.
- Open the app in a browser.
- Confirm the browser is serving this repo's app, not a stale page or another dev server on the same port.
- Verify the canvas is nonblank.
- Verify there is one expected canvas and its internal dimensions match the intended world or render size.
- Verify expected actors appear in-frame at desktop and narrow widths.
- Verify keyboard/pointer input changes gameplay.
- For multiplayer features, verify two distinct client identities in the same room rather than two tabs reusing one player id.
- Verify dispose/remount does not duplicate canvases, timers, or room connections.
