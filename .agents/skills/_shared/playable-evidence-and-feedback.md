# Playable Evidence And Feedback

Use this reference when game work touches visual readability, canvas layout, input feel, multiplayer identity, client prediction, server authority, collisions, room seeds, maps, or art.

## Playable Evidence Gate

Before claiming browser-facing game work is complete, gather evidence for the surfaces the task changed:

- Served app identity: confirm the browser is loading this repo's app, not a stale dev server or another Vite page on the same port.
- Canvas truth: confirm one expected canvas mounts, is nonblank, has the expected internal dimensions, and is framed without HUD overlap at the relevant viewport.
- Visual truth: confirm expected actors, terrain, overlays, sprites, and blockers are visible and readable in a screenshot or pixel/sample inspection.
- Input truth: confirm continuous input uses held-key behavior and one-shot input uses pressed/event behavior; do not treat short synthetic key taps as proof of held movement.
- Multiplayer truth: confirm two clients are distinct browser/session identities in the same room and see the same authoritative state when the feature depends on multiplayer behavior.
- Authority truth: confirm server state enforces the gameplay rule, then confirm the client prediction/readability path does not visibly contradict that rule.

If tooling cannot prove one of these, record the limitation and add an alternate proof path or residual risk instead of upgrading the claim.

## Client And Server Parity

When server authority changes movement, collision, projectile hits, pickups, scoring zones, room seeds, generated maps, or spawn selection:

- Put deterministic shared math/config in `packages/protocol` when both server and client need it.
- Keep the server authoritative in `apps/server`.
- Make client prediction or local readability use the same shared helper when practical.
- Add tests that prove the server rule and, when local prediction exists, the matching client prediction path.
- Do not rely on server correction alone when the player can visibly pass through blockers, pickups, or other authoritative geometry before correction.

## Runtime Triage

For user-reported playtest symptoms, classify the failure before editing:

- Design mismatch: implemented behavior is technically correct but not the intended game feel.
- Render mismatch: state exists but visuals, overlays, scale, z-order, or asset loading hide or misrepresent it.
- Client prediction mismatch: local display disagrees with authoritative server behavior.
- Server authority bug: the authoritative state accepts an invalid action or misses a rule.
- Runtime mismatch: stale server, wrong localhost app, cached asset, or old tab/session is being inspected.
- Identity/session bug: two tabs or clients reuse the same player id, room id, storage, or seat.
- Tooling limit: browser automation cannot prove the relevant interaction.

If the user says "let's discuss" or asks for a plan after reporting symptoms, inspect the relevant code path and discuss the classification before changing files.

## Asset Versus Overlay

When a visual looks wrong, inspect both the source asset and the runtime overlay:

- Check whether circles, markers, tints, shadows, or labels come from sprites, Excalibur graphics, CSS, HUD, debug drawing, or generated assets.
- Verify z-order and opacity before regenerating art.
- Keep gameplay collision geometry independent from sprite dimensions unless the design explicitly couples them.

## Evidence Wording

Completion evidence should separate:

- automated checks: tests, type checks, builds, linters
- browser smoke: URL, room/client setup, canvas checks, console/network state
- visual evidence: screenshot, canvas pixels, actor counts, visible dimensions
- multiplayer evidence: distinct clients, same room, expected state changes
- residual risk: any check skipped or weakened by tooling limits
