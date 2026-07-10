---
name: frontend-design
description: Design, build, or reshape distinctive React and CSS interfaces for this browser multiplayer game. Use when changing the lobby, loader, HUD, scoreboard, controls, notices, banners, buttons, responsive layouts, or other DOM-facing game presentation where visual hierarchy, intentional styling, accessibility, and browser screenshot review matter.
---

# Frontend Design

Use this skill for the React and CSS surfaces around the Excalibur canvas. Make the interface reinforce the game’s readable, competitive top-down arena rather than compete with it.

## First Pass

1. Inspect `apps/web/src/App.tsx`, `apps/web/src/styles.css`, the relevant HUD presentation helpers, and the canvas host contract in `packages/game`.
2. Read the relevant `docs/game-design/*` anchors, especially `client-architecture.md`, `mechanics.md`, and `asset-plan.md`.
3. Read [playable evidence and feedback](../_shared/playable-evidence-and-feedback.md) when the change affects visible gameplay, HUD framing, input, multiplayer state, or responsive layout.
4. Identify the surface’s single job and its priority relative to the canvas: persistent information, an actionable control, a transient notice, or an entry/blocked state.
5. Reuse an existing component or shared presentation helper when the same UI appears in more than one place. Do not duplicate markup and let styles drift.

## Design Rules

- Keep the canvas as the visual primary. Use compact overlay islands and reserve large central treatments for explicit match events only.
- Derive color, icon, terminology, and tone from existing game assets and design anchors. Do not introduce generic dashboard styling or unrelated visual motifs.
- Give each visible element one job. Do not use decorative bars, badges, rings, gradients, or animation unless they communicate game state or improve hierarchy.
- Keep HUD controls legible at desktop and narrow mobile sizes. Interactive DOM elements must retain pointer events; non-interactive overlay layers must not block canvas input.
- Make focus, hover, pressed, disabled, loading, empty, and error states intentional. Respect `prefers-reduced-motion` for nonessential movement.
- For event banners and notices, define priority, duration, interruption/coalescing behavior, and wrap behavior before adding another event type.
- Do not create a second room connection for the HUD. Use the existing game-to-web presentation contract.

## Implementation Boundaries

- Keep canvas actors, world-space markers, camera behavior, and gameplay VFX in `packages/game` with `excalibur-game-dev`.
- Keep React composition, DOM accessibility, and CSS layout in `apps/web`.
- Keep server-authoritative state, scoring, and transient game events in `apps/server` and `packages/protocol` with `colyseus-multiplayer-engineering`.
- If a proposed DOM change needs gameplay data that is not already exposed, define the smallest presentation contract; do not move simulation into React.

## Visual Review Gate

Before calling a visible change complete:

1. Run the relevant type checks and production build.
2. Inspect the actual app at the affected viewport(s), including a narrow viewport for persistent HUD/control changes.
3. Confirm no canvas occlusion, clipped text, accidental pointer-event interception, console errors, or broken keyboard focus.
4. Capture a screenshot or equivalent visual evidence for changed presentation. For multiplayer notices or scores, prove the intended state with distinct clients in one room.
5. If a browser state cannot be reached deterministically, record the residual risk and create a local-only scenario fixture or alternate proof path; do not substitute green TypeScript checks for visual proof.

## Verification Defaults

- Web-only: `cd apps/web && bun run check-types`.
- Cross-package presentation contract: `bun run check-types`.
- Browser bundle: `bun run build`.
- Browser-facing UI: run the playable evidence gate and report automated, browser, visual, multiplayer, and residual-risk evidence separately.
