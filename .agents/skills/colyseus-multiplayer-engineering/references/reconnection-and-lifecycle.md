# Reconnection And Lifecycle

Use this when handling disconnects, reconnects, timers, cleanup, exception boundaries, or room disposal.

## Reconnection Flow

- Use `onDrop(client, code)` for unexpected disconnects.
- Call `allowReconnection(client, seconds)` inside `onDrop` when the player should be allowed back.
- Mark player state as disconnected instead of deleting it immediately when reconnection is allowed.
- Use `onReconnect(client)` to restore connected status and resume player-specific flow.
- Use `onLeave(client, code)` for permanent cleanup after consented leave or reconnection failure.

## Client Flow

- Handle `room.onDrop` to show reconnecting UI or pause local input feedback.
- Handle `room.onReconnect` to clear reconnecting UI.
- Handle `room.onLeave` to clean up and return to lobby/menu on permanent failure.
- Remember that `room.send()` may buffer during reconnect; keep input messages idempotent or sequence-numbered when needed.
- `sendUnreliable()` messages are dropped when disconnected.

## Timers And Simulation

- Use `setSimulationInterval()` for the main simulation loop.
- Use `this.clock.setTimeout()` and `this.clock.setInterval()` for room-owned timers.
- Store returned delayed handles only when later pause/resume/clear is needed.
- Do not use raw `setTimeout` or `setInterval` in rooms for room-owned work.

## Exceptions

- Add `onUncaughtException(err, methodName)` when room callback failures need logging or recovery.
- Know that uncaught `onAuth` and `onJoin` exceptions still fail the join, even if logged.
- Keep explicit try/catch in auth/join when fallback behavior is required.

## Cleanup Checklist

- Client input buffers removed.
- State deleted or marked disconnected according to reconnection policy.
- Callback/listener unbinds called.
- Actors/rendering objects destroyed.
- Custom room ids released.
- Dispatchers stopped.
- External persistence flushed or canceled.

## Verification

- Unit test cleanup helpers when possible.
- With Colyseus tests, simulate join, drop/reconnect, consented leave, and failed reconnection for important flows.
- In client code, ensure dispose can run after partial join/start failures without leaking timers or listeners.
