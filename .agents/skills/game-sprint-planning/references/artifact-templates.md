# Artifact Templates

Use these templates when creating or updating `docs/sprints/<game-slug>/`.

## Sprint File

Path:

```text
docs/sprints/<game-slug>/sprint.md
```

Template:

```md
# <Game Name> Sprint

## Current State

- Status: Planned
- Last updated: <YYYY-MM-DD>
- Source design: `docs/game-design/`
- Default verification: `bun test`, `bun run check-types`, `bun run build`

## Goal

<One paragraph describing the playable outcome this sprint should produce.>

## Build Order

| Order | Task | Status | Depends on | Primary skill |
| --- | --- | --- | --- | --- |
| 001 | [Protocol Contract](tasks/001-protocol-contract.md) | Planned | None | colyseus-multiplayer-engineering |
| 002 | [Server Simulation Rules](tasks/002-server-simulation-rules.md) | Planned | 001 | colyseus-multiplayer-engineering |
| 003 | [Room Integration](tasks/003-room-integration.md) | Planned | 001, 002 | colyseus-multiplayer-engineering |
| 004 | [Client Greybox Rendering](tasks/004-client-greybox-rendering.md) | Planned | 001, 003 | excalibur-game-dev |
| 005 | [React HUD](tasks/005-react-hud.md) | Planned | 001, 003, 004 | excalibur-game-dev |
| 006 | [Persistence Stats](tasks/006-persistence-stats.md) | Planned | 002, 003 | colyseus-multiplayer-engineering |
| 007 | [Browser Playtest And Tuning](tasks/007-browser-playtest-and-tuning.md) | Planned | 004, 005, 006 | excalibur-game-dev |
| 008 | [Art Pass](tasks/008-art-pass.md) | Planned | 007 | pixellab-api |

## Acceptance Summary

- <Bullet list of sprint-level acceptance checks.>

## Verification Ladder

1. Run focused tests named in each task.
2. Run `bun run check-types` after cross-package TypeScript changes.
3. Run `bun test` before browser smoke.
4. Run `bun run build` before calling the sprint implementation complete.
5. Run two-tab browser smoke for canvas, input, HUD, and round flow tasks.
6. For browser-facing playability tasks, record playable evidence separately: served app identity, canvas truth, visual truth, input truth, multiplayer truth, authority/prediction truth, and residual tooling limits.

## Out Of Scope

- <Bullet list of features intentionally excluded from this sprint.>

## Open Questions

- <Only include questions that block implementation. Prefer none.>
```

## Task File

Path:

```text
docs/sprints/<game-slug>/tasks/NNN-task-slug.md
```

Template:

```md
# NNN. <Task Title>

Status: Planned
Depends on: <None or task ids>
Primary skill: <skill name>

## Design Sources

- `docs/game-design/<source>.md`

## Affected Packages/Files

- `<package or file path>`

## Implementation Plan

- <Decision-complete implementation step.>
- <Decision-complete implementation step.>
- <Decision-complete implementation step.>

## Acceptance Checks

- <Observable behavior or artifact that proves this task is done.>
- <For browser-facing tasks, name what must be seen, interacted with, and proven in one-client or two-client smoke.>
- <For authority or prediction tasks, name the server rule and matching client readability/prediction proof.>

## Verification Commands

```sh
<focused Bun command>
<broader Bun command if needed>
```

## Out Of Scope

- <Related work this task must not include.>

## Risks / Stop Conditions

- <Condition that should stop implementation and require replanning or user input.>
```

## Default Multiplayer Game Task Intent

Use this decomposition unless the game-design docs explicitly say otherwise.

| Task | Intent |
| --- | --- |
| 001 Protocol Contract | Add shared schema, message constants, phase/status types, and tests. |
| 002 Server Simulation Rules | Add pure helpers for the first game-specific rules, scoring or goals, and reset timing. |
| 003 Room Integration | Wire helpers into `GameRoom` joins/leaves and simulation ticks while keeping the room thin. |
| 004 Client Greybox Rendering | Render the first game-specific actors, objective feedback, local-player emphasis, and greybox VFX from server state. |
| 005 React HUD | Emit a HUD view model from the existing game connection and render score, carrier, phase, and winner state in React. |
| 006 Persistence Stats | Extend SQLite repository functions and schema handling only for the game’s justified persistent outcomes. |
| 007 Browser Playtest And Tuning | Run two-tab smoke checks and tune radii, spawn margins, score target, reset delay, and readability. |
| 008 Art Pass | Plan or integrate generated art only after the greybox loop is stable. |
