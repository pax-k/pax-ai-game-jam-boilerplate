---
name: game-sprint-planning
description: Turn repo-local browser multiplayer game design docs into execution-ready sprint and task Markdown artifacts. Use when Codex needs to read docs/game-design/*, compose Colyseus, Excalibur, and Pixel Lab implementation guidance, and create or update docs/sprints game-slug sprint and numbered task files for building a game without implementing code.
---

# Game Sprint Planning

Use this skill to convert living `docs/game-design/*` anchors into repo-native sprint plans and task files that a later implementation pass can execute.

This skill creates planning artifacts only. Do not implement gameplay code, generate assets, start dev servers, run migrations, or call Pixel Lab while using this skill unless the user explicitly asks for that separate work.

## First Pass

1. Inspect the repo baseline:
   - `README.md`
   - `AGENTS.md`
   - root `package.json`
   - `apps/*/package.json`
   - `packages/*/package.json`
   - existing `docs/sprints/*`, if present
2. Read the game-design anchors:
   - `docs/game-design/README.md`
   - `docs/game-design/prototype-plan.md`
   - `docs/game-design/mechanics.md`
   - `docs/game-design/multiplayer-architecture.md`
   - `docs/game-design/client-architecture.md`
   - `docs/game-design/asset-plan.md`
   - `docs/game-design/decision-log.md`
3. Read [artifact-templates.md](references/artifact-templates.md) before creating or updating sprint/task files.
4. Load implementation skills only for the domains needed by the sprint:
   - `.agents/skills/colyseus-multiplayer-engineering/SKILL.md` for protocol, room, schema, server rules, messages, persistence, and verification.
   - `.agents/skills/excalibur-game-dev/SKILL.md` for canvas rendering, actors, input, HUD integration, cleanup, and browser smoke checks.
   - `.agents/skills/pixellab-api/SKILL.md` for asset-generation or Pixel Lab integration tasks.
   - `.agents/skills/frontend-design/SKILL.md` for React/CSS lobby, loader, HUD, notices, controls, buttons, scoreboard, or responsive layout tasks.
5. When the sprint includes browser-facing playability, input, multiplayer identity, prediction, collision, map, or art-readability tasks, read [playable-evidence-and-feedback.md](../_shared/playable-evidence-and-feedback.md).
6. Write or update `docs/sprints/<game-slug>/sprint.md` and `docs/sprints/<game-slug>/tasks/NNN-task-slug.md`.

## Planning Rules

- Preserve explicit decisions from `docs/game-design/decision-log.md` unless the user asks to revise them.
- Preserve the dependency order from `docs/game-design/prototype-plan.md`.
- Keep each task bounded enough for one focused implementation pass.
- Make every task decision-complete: a later implementer should not need to choose package boundaries, authority, artifact paths, or verification commands.
- Make acceptance checks observable. Browser-facing tasks should say what must be seen, interacted with, and proven across clients, not just which code should exist.
- Keep Colyseus/server authority, Excalibur/client rendering, React HUD, SQLite persistence, and Pixel Lab asset planning in separate task scopes unless a task needs a narrow integration seam.
- Use Bun-oriented verification commands: `bun test`, `bun run check-types`, `bun run build`, and focused package commands.
- Mark art generation and Pixel Lab API calls as planned work only; do not perform them during sprint planning.
- Prefer greybox gameplay tasks before generated art tasks.

## Output Defaults

Use `docs/sprints/<game-slug>/` for generated artifacts.

For a new game, default to a game-specific lane such as:

```text
docs/sprints/<game-slug>-v1/
  sprint.md
  tasks/
    001-protocol-contract.md
    002-server-simulation-rules.md
    003-room-integration.md
    004-client-greybox-rendering.md
    005-react-hud.md
    006-persistence-stats.md
    007-browser-playtest-and-tuning.md
    008-art-pass.md
```

## Required Task Sections

Every generated task file must include:

- Status
- Depends on
- Design sources
- Affected packages/files
- Implementation plan
- Acceptance checks
- Verification commands
- Out of scope
- Risks / stop conditions

## Quality Bar

Before finishing, inspect generated sprint/task files for:

- No unresolved template filler text.
- Clear task dependency order.
- Explicit affected packages and relevant skills.
- Concrete acceptance checks.
- Browser-facing tasks include playable evidence requirements for canvas framing, visual readability, input behavior, multiplayer identity, and authority/prediction parity when relevant.
- Verification commands that match this Bun repo.
- No source-code implementation in the planning pass.
