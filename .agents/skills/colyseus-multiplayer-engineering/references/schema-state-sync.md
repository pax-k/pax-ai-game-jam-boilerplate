# Schema State Sync

Use this when changing synced state, protocol classes, entity collections, or client state callbacks.

## What Belongs In Schema

- Durable room state that clients need to observe.
- Entities keyed by id, such as players, enemies, projectiles, objectives, and shared items.
- Small primitive fields that change often and are meaningful to clients.

## What Does Not Belong In Schema

- Transient input messages.
- Raw request payloads.
- Heavy game logic.
- Derived values clients can compute locally unless consistency matters.
- Secrets, passwords, tokens, or server-only metadata.

## Defaults

- Use `MapSchema` for entities by id. Keys are strings.
- Keep each `Schema` class mostly field definitions.
- Add methods to schemas only for small, self-contained mutations of that instance.
- Prefer numeric types intentionally if bandwidth or ranges matter; otherwise `number` is acceptable for early game-jam work.
- Keep schema changes backwards-tolerant where practical by adding optional/defaulted fields instead of renaming/removing fields casually.

## Client Sync

- Use `Callbacks.get(room)` for Colyseus SDK callback binding.
- Handle `onAdd` and `onRemove` for collection lifecycles.
- Bind field listeners for high-frequency updates.
- Store unbind functions and call them during client/game dispose.
- Mirror existing state after registering callbacks if the room may already contain entities.

## Gotchas

- Only `@type()` fields synchronize.
- `Schema` is for state only, not messages.
- Ensure `experimentalDecorators: true` and `useDefineForClassFields: false`.
- Avoid mixing element types inside `ArraySchema`.
- Do not assume non-string `MapSchema` keys.

## Verification

- Add or update protocol tests for schema defaults and collection behavior.
- Add room tests when the schema change is observable through join/message flows.
- Run `bun test packages/protocol/src` after protocol changes.
