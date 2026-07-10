# Input Events And UI

Use this when adding controls, pointer interactions, gamepad support, menus, HUD, or DOM/canvas UI.

## Keyboard

- Query continuous movement in update code with `engine.input.keyboard`.
- Use `isHeld` for movement and repeated actions.
- Use `wasPressed` or event subscriptions for one-shot actions such as fire, jump, pause, or confirm.
- If subscribing to keyboard events, store the subscription cleanup and remove it on scene or game disposal.
- Preserve key mappings as constants when more than one actor or scene needs them.

## Pointer And Touch

- Use Excalibur pointer APIs for canvas-world interactions.
- Use actor pointer events for actor-specific clicks, drags, hover, and touch.
- Use primary pointer for normal mouse/touch support; use indexed pointers only when multi-touch matters.
- Convert screen/world coordinates intentionally when spawning, aiming, or selecting in world space.
- Clean up global pointer subscriptions when scenes deactivate or the game disposes.

## Gamepad

- Enable gamepad polling only when the feature needs it.
- Query gamepads during update for continuous controls.
- Subscribe to connect/disconnect events only for UI or status behavior that needs it.
- Keep fallback keyboard/pointer controls unless the user explicitly targets controller-only play.

## UI Split

- Use Excalibur `ScreenElement` or canvas actors for UI that must live in the game world/camera/runtime.
- Use React/HTML in `apps/web` for page chrome, connection status, forms, auth, settings, and non-game overlays.
- Do not let React own actor state or run the game loop.
- Pass user choices from React into `mountGame` options or explicit game APIs.

## Multiplayer Input

- Send player intent, not trusted positions.
- Normalize input before sending.
- Send input at a bounded tick rate, not on every browser event.
- Include sequence numbers only when the server or prediction logic uses them.
- Keep client prediction optional and visually reconciled to server state.
