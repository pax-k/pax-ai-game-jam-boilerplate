---
name: game-sprint-execution
description: Execute repo-local browser multiplayer game sprint tasks after game-sprint-planning has produced docs/sprints artifacts. Use when Codex needs to pick or implement a docs/sprints game task file, continue the next ready task, update sprint/task status and completion evidence, run Bun verification, or implement planned Colyseus, Excalibur, React HUD, SQLite, or Pixel Lab work from the sprint queue.
---

# Game Sprint Execution

## Overview

Use this skill to turn `docs/sprints/<game-slug>/tasks/NNN-*.md` into narrowly scoped code, asset, test, and documentation changes. It is the implementation counterpart to `game-sprint-planning`; if sprint or task files are missing, unresolved, or not decision-complete, repair them with `game-sprint-planning` before implementing.

Execute one task at a time unless the user explicitly asks for a batch. Preserve dependency order, task scope, and the repo's Bun-first workflow.

## Start

1. Inspect the repo baseline before choosing an implementation path:
   - `AGENTS.md`
   - `README.md`
   - root `package.json`
   - `apps/*/package.json`
   - `packages/*/package.json`
   - the active `docs/sprints/<game-slug>/sprint.md`
   - the target `docs/sprints/<game-slug>/tasks/NNN-*.md`
2. If the user names a task, load that task. If not, choose the first ready task in numeric order.
3. Read every `Design Sources` file named by the task before editing code or assets.
4. Inspect the files listed in `Affected Packages/Files`, plus nearby tests and package scripts.
5. Load the task's `Primary skill`, then follow that skill's reference routing:
   - `.agents/skills/colyseus-multiplayer-engineering/SKILL.md` for protocol, room, server simulation, messages, persistence-adjacent server work, lifecycle, and multiplayer verification.
   - `.agents/skills/excalibur-game-dev/SKILL.md` for Excalibur rendering, React/canvas integration, input, HUD, resources, cleanup, browser smoke, and visual verification.
   - `.agents/skills/pixellab-api/SKILL.md` for Pixel Lab API calls, generated game assets, asset metadata, token handling, and art integration.
   - `.agents/skills/frontend-design/SKILL.md` for React/CSS lobby, loader, HUD, notices, controls, buttons, scoreboard, or responsive layout work.
6. Load secondary skills only when the task actually crosses domains. The task's primary skill owns the implementation center of gravity.
7. When the task touches canvas rendering, input feel, room identity, multiplayer sync, client prediction, collision, generated maps, room seeds, or art readability, read [playable-evidence-and-feedback.md](../_shared/playable-evidence-and-feedback.md) before editing.

## Readiness Gate

Treat a task as ready only when all of these are true:

- Its `Depends on` tasks are marked `Completed` in their task files or have verified completion evidence. If `sprint.md` disagrees with a task file, inspect both and sync the sprint row after the evidence is clear.
- Its `Status` is `Planned`, `Ready`, or `In Progress`. If it is `Completed`, do not re-implement unless the user explicitly asks for a redo or follow-up.
- The task has no active `Risks / Stop Conditions`.
- The implementation plan is decision-complete enough to avoid inventing package boundaries, authority rules, asset paths, or verification commands.
- For Pixel Lab work, `PIXELLAB_API_TOKEN` is available before live generation. If the token is missing and generated art is required, stop and record the task as blocked unless the user approves a temporary local-asset fallback.

If no task is ready, report `no-ready-task` with the blocking dependency or missing decision. Do not skip ahead in the sprint to avoid a blocker.

## Execution Rules

- Update the target task status to `In Progress` when starting non-trivial implementation, and keep the matching `sprint.md` row in sync.
- Implement only the target task's `Implementation Plan` and required supporting tests. Keep `Out Of Scope` out of the diff.
- Prefer existing package boundaries and naming. Do not move simulation into rendering, rendering into React, or authoritative rules into clients.
- Keep Colyseus/server authority in `apps/server` and shared contracts in `packages/protocol`.
- Keep Excalibur game rendering and client-side visualization in `packages/game`; use `apps/web` as the Vite React host only.
- Keep React HUD code connected to the existing game connection; do not create a second Colyseus room join for HUD state.
- Keep SQLite persistence in the existing DB/server boundaries. Do not introduce external database clients when Bun or existing repo helpers cover the need.
- Use Bun commands: `bun install`, `bun run <script>`, `bun test`, `bun build`, and `bunx <tool>`. Do not add npm, yarn, pnpm, Node-only runners, Express, dotenv, `ws`, or Vite outside `apps/web`.
- Add or update focused tests in the same pass when the task changes deterministic rules, protocol contracts, persistence behavior, or package APIs.
- For visual, input, multiplayer identity, prediction, collision, map, or art-readability behavior, perform the playable evidence gate from [playable-evidence-and-feedback.md](../_shared/playable-evidence-and-feedback.md). Verify the served app identity, nonblank correctly framed canvas, visual readability, input behavior, multiplayer identity when relevant, and client/server parity when authority changes.
- For Pixel Lab generation, preserve provenance next to generated assets: prompt, endpoint, seed if used, job id, asset id, output file, and notes. Never log or commit bearer tokens or raw `.env` values.
- If live code proves the task plan wrong, make the smallest defensible adjustment and record the deviation in completion evidence. Stop for replanning when the deviation changes task scope, dependencies, or user-visible game design.

## Verification

Run the task's `Verification Commands` first. Prefer the narrowest command that proves the change before broad checks.

Default ladder:

1. Focused package or file tests named by the task, such as `bun test packages/protocol/src` or `bun test apps/server/src`.
2. Focused package type checks, such as `cd packages/game && bun run check-types`, when package scripts exist.
3. `bun run check-types` after cross-package TypeScript changes.
4. `bun test` when shared protocol, server behavior, DB behavior, or multiple packages changed.
5. `bun run build` before marking the sprint or a browser-facing task complete.
6. `bun run dev` plus two-tab browser smoke for multiplayer canvas, input, HUD, round flow, and art/readability tasks.
7. For browser-facing changes, capture evidence categories separately: automated checks, browser smoke, visual evidence, multiplayer evidence, and residual tooling limits.

Do not mark a task complete while required verification is failing. If a command cannot be run in the environment, record that as residual risk instead of presenting the task as fully verified.

## Evidence And Status

After implementation and verification:

- Set the task `Status` to `Completed` only when acceptance checks pass and required verification has run.
- Add `## Completion Evidence` if missing. Append concise dated bullets covering changed behavior, important files or APIs, and exact verification commands with pass/fail results.
- For playable tasks, distinguish automated checks from browser smoke, visual evidence, multiplayer evidence, and any residual tooling limits. Do not let green tests substitute for unverified user-visible game feel.
- Set the matching `sprint.md` build-order row to `Completed`.
- Update `sprint.md` `Last updated` to the current date. If every task is complete, set sprint `Status` to `Completed`; otherwise keep it `In Progress`.
- If blocked, set task `Status` to `Blocked`, leave the sprint row `Blocked`, and add dated evidence naming the stop condition and the next required decision or credential.
- Preserve existing evidence. Do not rewrite old completion bullets except to correct factual drift.

## Final Response

Report the task id and status, the meaningful files changed, the verification commands and results, and any residual risk or follow-up task. If implementation stopped, lead with the blocker and the exact task or dependency that needs attention.
