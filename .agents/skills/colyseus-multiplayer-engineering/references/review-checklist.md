# Review Checklist

Use this for Colyseus architecture reviews, PR reviews, or implementation self-checks.

## Architecture

- Server remains authoritative for gameplay state.
- Clients send intent/input, not trusted state.
- Room class is mostly lifecycle/orchestration.
- Game rules live in testable helpers, services, commands, or ECS-style code.
- Package boundaries are preserved: server, protocol, game/client.

## Schema

- Synced schema contains only client-observable state.
- Schema classes are mostly data-only.
- No passwords, tokens, secrets, or raw request payloads in synced state.
- `MapSchema` is used for id-keyed entities.
- Decorator tsconfig flags are still correct.

## Messages

- Message names and payload types are centralized and searchable.
- Client payloads are validated or normalized before use.
- Message handlers check ownership and session/auth identity.
- Transient events are messages; durable observable facts are state.

## Lifecycle

- Join, leave, drop, reconnect, dispose, and errors have explicit behavior when relevant.
- Room timers use `this.clock`; simulation uses `setSimulationInterval`.
- Client code cleans up callbacks, actors, room connection, and browser timers.
- Reconnection and buffered messages cannot duplicate dangerous actions.

## Testing

- Pure rules have unit tests.
- Protocol/schema changes have protocol tests.
- Room/client flows use Colyseus testing where pure unit tests are insufficient.
- Load testing is planned when concurrency claims are made.

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
