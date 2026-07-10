# Room Access Recipes

Use this when implementing custom room ids, password/private rooms, join denial, auth, invites, or matchmaking policy.

## Custom Room IDs

- Generate ids server-side in `onCreate`.
- Register ids through Presence before exposing them.
- Remove ids from Presence in `onDispose`.
- For multi-process scale-out, use Redis-backed Presence.
- Keep the id generation helper isolated and testable.

## Password Or Private Rooms

- Include the relevant matchmaking field in `defineRoom(...).filterBy([...])`.
- If a password or invite-only option is present, call `this.setPrivate()` in `onCreate`.
- Do not store plaintext passwords in synced state.
- Keep private room discovery separate from direct invite/join flows.

## Denying Joins

- Prefer `onAuth` for identity, entitlement, password, and room-access checks.
- Throw a clear error for denied access; the client should handle the failed join promise.
- Do not create player state in `onJoin` until auth/access is complete.
- Keep user records or auth payloads in `client.auth` / `client.userData` as appropriate, not in global mutable state.

## Matchmaking Defaults

- Use `joinOrCreate` for quick game-jam flows.
- Use `create` plus direct room id/invite when the user explicitly wants private rooms.
- Use `joinById` only when the client already has a room id from a trusted path.
- Use `maxClients` and explicit room metadata to shape matchmaking.

## Gotchas

- A custom room id recipe based on random ids can still have a race if two rooms generate the same id before registering it. Presence reduces practical risk; use stronger atomic/id policy if collisions are unacceptable.
- Password-protected rooms should be unlisted/private; otherwise matchmaking can expose them.
- Do not trust client-provided `playerName`, room id, or password fields beyond the exact policy they are meant to satisfy.

## Verification

- Test denied joins reject on the client side.
- Test private/password room creation does not appear in public room lists if listing is part of the app.
- Test custom ids are released on dispose.
