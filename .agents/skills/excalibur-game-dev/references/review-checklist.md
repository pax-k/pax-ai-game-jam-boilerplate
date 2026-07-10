# Review Checklist

Use this for Excalibur architecture reviews, PR reviews, or implementation self-checks.

## Architecture

- Excalibur code stays in `packages/game`.
- React hosts the canvas and page UI; it does not own actor lifecycle or game-loop state.
- Server-authoritative gameplay stays in `apps/server` and `packages/protocol`.
- Engine creation, scene registration, room binding, and cleanup remain easy to trace from `mountGame`.
- New helpers match existing package boundaries and naming.

## Lifecycle

- Scenes use `onInitialize`, `onActivate`, and `onDeactivate` intentionally.
- Actors use lifecycle hooks for engine/scene-dependent setup.
- Actors are added to the active scene and removed or killed when done.
- Timers, subscriptions, room callbacks, pointer handlers, and browser intervals are cleaned up.
- Restart/reset behavior lives in the lifecycle hook that matches how often it should run.

## Resources And Graphics

- Loadable assets are centralized when more than one feature needs them.
- Loader usage matches when assets are read.
- Actors have explicit graphics and gameplay-sized colliders.
- Animations are not restarted every frame.
- Audio accounts for browser user-action unlock and scene cleanup.

## Input And UI

- Continuous input is queried during update.
- Discrete input uses `wasPressed` or subscriptions intentionally.
- Pointer and keyboard subscriptions have cleanup paths.
- DOM UI belongs in `apps/web`; game-world UI belongs in Excalibur.
- Multiplayer clients send intent/input, not trusted state.

## Physics And Maps

- Physics mode and collision types match the behavior.
- Collision groups or typed guards avoid broad accidental handlers.
- Triggers are consumed or deactivated when needed.
- Tile/map object properties are converted into typed game config.
- Debug drawing has been used or recommended for collision-heavy changes.

## Testing And Verification

- Pure helpers have unit tests when new game rules are added.
- Package type checks are run for changed TypeScript surfaces.
- Browser canvas checks are run for visual, input, sizing, or lifecycle changes.
- Build is run when bundling, assets, exports, or Vite behavior changed.

## Output Format

When reporting a review, use:

```markdown
## Findings
- [severity] File/path or surface: issue, impact, and fix.

## Verification
- Commands run or recommended.

## Notes
- Assumptions, tradeoffs, or follow-up checks.
```
