# Graphics Resources And Audio

Use this when adding images, sprites, animations, sounds, fonts, loaders, or asset debugging.

## Resource Defaults

- Create or update a central resources module when adding multiple loadable assets.
- Export `Resources` with `as const` for strong typing.
- Export a configured `Loader` that adds every resource.
- Start the engine with the loader when assets are required before gameplay.
- Use scene-specific preload only when assets should load per scene.

## Images And Sprites

- Use `ImageSource` for images that need to be loaded by Excalibur.
- Build sprites and spritesheets from loaded image sources.
- Use actor graphics to switch sprites, animations, rectangles, circles, or custom graphics.
- Keep pixel art crisp by checking image smoothing, sprite sizes, and display scale.
- Avoid using a collider as a substitute for visible graphics.

## Animations

- Keep frame dimensions, row/column counts, and frame durations close to the spritesheet definition.
- Use named animations for actor states such as idle, run, jump, attack, hit, and dead.
- Switch animations only when the state changes; avoid resetting the same animation every frame.
- Stop or replace animations intentionally when actors die, despawn, or change scenes.

## Audio

- Load sounds through Excalibur resources when they are part of the game start flow.
- Remember browsers require user interaction before audio can play.
- Keep volume, loop, and playback ownership close to the scene or actor that controls the sound.
- Stop looping or long-running sounds when a scene deactivates or the game disposes.

## Asset Failure Checks

- Confirm the asset path is served by the active host.
- Confirm the loader includes the resource.
- Confirm `engine.start(loader)` or scene preload is used before the asset is read.
- Check browser network errors for 404, MIME, or CORS issues.
- Add a temporary primitive graphic to distinguish an asset failure from an actor/scene failure.
