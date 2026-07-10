---
name: game-design-planning
description: Use this skill when brainstorming, defining, scoping, documenting, or planning a browser multiplayer game before implementation. Covers game vision, design pillars, genre and game type selection, player verbs, core loops, MDA, characters, world, mechanics, multiplayer ownership, Excalibur client architecture, Colyseus server authority, Pixel Lab asset planning, prototype slices, game design documents, GDD-style Markdown anchors, and docs/game-design planning artifacts.
---

# Game Design Planning

Use this skill to turn a rough game idea into durable `docs/game-design/*` Markdown anchors that future implementation work can use.

## First Pass

1. Inspect the repo and current planning state:
   - `README.md`, `AGENTS.md`, package layout, and available game packages
   - existing `docs/game-design/*` files, if present
   - `.agents/skills/colyseus-multiplayer-engineering/SKILL.md`
   - `.agents/skills/excalibur-game-dev/SKILL.md`
   - `.agents/skills/pixellab-api/SKILL.md`
2. Read [game-design-workflow.md](references/game-design-workflow.md) before drafting or revising a game plan.
3. Read [doc-templates.md](references/doc-templates.md) before creating or updating `docs/game-design/*`.
4. For playtest feedback, browser-facing mechanics, input feel, multiplayer identity, prediction, collisions, maps, or art readability, read [playable-evidence-and-feedback.md](../_shared/playable-evidence-and-feedback.md).
5. Ask only blocking creative or product questions. If the user gives a thin prompt, proceed with clearly labeled assumptions instead of stalling.
6. Write or update the smallest useful set of `docs/game-design/*` files. Keep them searchable, practical, and easy to revise.
7. Stop before code implementation unless the user explicitly asks to build.

## Design Funnel

Plan in this order:

1. Vision: fantasy, player feeling, design pillars, non-goals, smallest playable proof.
2. Game form: genre, camera, session shape, player count, input style, platform constraints.
3. Player verbs: what the player repeatedly does minute to minute.
4. Core loops: moment loop, short loop, session loop, progression loop.
5. MDA: desired aesthetics, runtime dynamics, implementable mechanics.
6. Characters and world: roles, silhouettes, readable behavior, mechanics-relevant lore.
7. Mechanics: mechanic cards with input, rules, tuning, feedback, ownership, and assets.
8. Multiplayer ownership: client-only visual, client input/server result, shared schema, transient message, persistent DB state.
9. Client architecture: Excalibur scenes, actors, input, camera, HUD, resource loading, cleanup.
10. Asset plan: Pixel Lab-ready style, inventory, prompts, direction counts, metadata, provenance.
11. Prototype plan: greybox loop, one mechanic, one opponent/objective, win/loss, art pass, juice pass, playtest fixes.
12. Playable evidence: what a user must see, feel, and verify in browser smoke or playtest for the feature to count as working.

## Composition Rules

- Use this skill for pre-build design and documentation. Use the Colyseus, Excalibur, and Pixel Lab skills for implementation details after the plan exists.
- Do not duplicate detailed Colyseus, Excalibur, or Pixel Lab API guidance here. Instead, point future work to the relevant planning doc and implementation skill.
- Treat `docs/game-design/*` as living anchors, not a giant frozen GDD.
- Prefer concrete examples, tables, and mechanic cards over broad prose.
- Mark uncertain choices as `Assumption`, `Open question`, or `Decision needed`.
- Convert user playtest symptoms into classified design or implementation questions before revising docs: design mismatch, render mismatch, prediction mismatch, server authority bug, runtime mismatch, identity/session bug, or tooling limit.
- Keep game-jam scope tight. Cut features that do not support the core loop or design pillars.

## Output Defaults

- Create `docs/game-design/README.md` as the index when creating the first planning docs.
- Use separate Markdown files for stable anchors instead of one large document.
- Include implementation-facing sections only where they prevent ambiguity for later coding.
- Do not generate assets, call Pixel Lab, start servers, or change game code during planning unless the user explicitly asks.
- Use Bun-oriented verification commands in prototype plans: `bun run check-types`, `bun test`, `bun run build`, and focused package commands when relevant.
