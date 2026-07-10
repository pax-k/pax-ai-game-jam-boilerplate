# Messages And Validation

Use this when adding client-to-server messages, server-to-client messages, broadcast flows, or reusable message handlers.

## Message Design

- Use messages for transient actions and events.
- Use schema state for durable observable state.
- Put message names and TypeScript payload types in the protocol package.
- Normalize or validate every client-originated payload before mutating state.
- Ignore, reject, or clamp invalid input deliberately; do not trust client values.

## Default Flow

1. Add a protocol constant for the message name.
2. Add a plain TypeScript payload type.
3. Register the handler in the room.
4. Normalize/validate the payload near the room boundary.
5. Delegate game-rule mutation to a helper or command.
6. Add tests for malformed and valid messages when behavior is important.

## Validation Options

- For simple game-jam inputs, hand-written normalization is fine.
- For structured user text, room options, chat, inventory actions, or security-sensitive payloads, use schema validation such as Zod with Colyseus `validate()`.
- Use `Messages<R>` for reusable, type-safe handler groups when several rooms share message behavior.
- Use regular `function` handlers, not arrows, when a validated/composed handler needs the room `this` context.

## Broadcasts

- Prefer state patches when clients need durable shared state.
- Use `room.broadcast()` for transient notifications such as chat, effects, countdowns, or match events.
- Use targeted client messages for private feedback such as denied action reasons.
- Consider unreliable messages only for high-frequency data that can be dropped without corrupting gameplay.

## Gotchas

- Do not put `Schema` objects in message payloads.
- Do not let client-provided ids decide ownership without checking `client.sessionId` or authenticated user data.
- Keep message names stable and searchable.
- If messages are buffered during reconnection, make sure repeated buffered actions are safe or sequence-checked.

## Verification

- Test pure normalizers directly.
- With room tests, send messages from simulated clients and wait for the server to process before asserting state.
- Check both server room state and client-observed state for important message flows.
