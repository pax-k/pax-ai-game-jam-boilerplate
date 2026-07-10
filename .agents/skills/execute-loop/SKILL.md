---
name: execute-loop
description: Generate copyable pursue-goal prompts for building repo-local game sprints end to end. Use when Codex should return a prompt the user will manually paste into pursue goal mode, instructing a later run to follow a docs/sprints sprint file task by task using game-sprint-execution for every task until the game is built, verified, completed, or blocked.
---

# Execute Loop

## Overview

Use this skill to generate a copyable pursue-goal prompt. Do not implement sprint tasks, edit game code, run verification, start dev servers, call Pixel Lab, or create/update a Codex goal while using this skill.

The generated prompt should make a later pursue-goal run build the game end to end from the sprint file by repeatedly loading `$game-sprint-execution` for the next ready task.

## First Pass

1. Inspect only enough repo context to produce an accurate prompt:
   - `AGENTS.md`
   - `.agents/skills/game-sprint-execution/SKILL.md`
   - `docs/sprints/*/sprint.md`
   - the task files under the selected sprint's `tasks/` directory
2. Select the sprint:
   - Use the sprint path named by the user when provided.
   - Otherwise use the only non-completed sprint under `docs/sprints/`.
   - If several non-completed sprints exist and the user did not name one, ask a concise clarification before generating the prompt.
3. Capture the sprint title, status, current build order, completed tasks, planned tasks, verification ladder, and any open sprint-level blockers.
4. If `.agents/skills/game-sprint-execution/SKILL.md` is missing, return a blocker instead of a pursue-goal prompt.

## Output Rules

- Return only the prompt the user should copy, in one fenced `text` code block.
- Do not include analysis, explanation, implementation notes, or a second alternative prompt outside the code block.
- Keep the prompt specific to the selected sprint path and current sprint status.
- Preserve exact file paths and skill names.
- Do not include angle-bracket placeholders unless sprint selection is genuinely ambiguous and the user asked for a generic template.

## Prompt Requirements

The generated prompt must include these instructions for the later pursue-goal run:

- Pursue the concrete goal of building the game end to end according to the selected `docs/sprints/.../sprint.md`.
- Use `$game-sprint-execution` for every task implementation pass.
- Re-read `AGENTS.md`, the sprint file, and task files at the start of each loop iteration so resumes continue from live state.
- Pick the first ready non-completed task in sprint build order; never skip dependencies to make progress.
- For each task, load `$game-sprint-execution`, then let that skill load the task's primary implementation skill and relevant references.
- Implement one task at a time, run the task verification commands, update task completion evidence, and sync the sprint row before moving on.
- Continue until all sprint build-order tasks are `Completed` and the sprint status is `Completed`, or until a real blocker prevents progress.
- Treat failing verification, missing required credentials, unclear task authority, or `no-ready-task` as stop conditions that must be reported clearly.
- Follow Bun-only repo rules from `AGENTS.md`.
- Before final completion, run the sprint verification ladder and browser smoke checks required by the sprint.

## Prompt Shape

Use this structure, filling in real sprint details:

```text
Pursue this goal: Build <game title> end to end according to <sprint path>.

Use $game-sprint-execution for every task implementation pass. Work from the live sprint and task files, not from memory.

Loop:
1. Re-read AGENTS.md, <sprint path>, and the task files under <tasks path>.
2. Select the first ready non-completed task in sprint build order.
3. Use $game-sprint-execution to execute exactly that task.
4. Run the task verification commands and any broader checks required by the task.
5. Update the task status/completion evidence and the sprint build-order row.
6. Repeat until the sprint is complete or blocked.

Stop only when:
- every build-order task is Completed and the sprint is marked Completed, after the sprint verification ladder and required browser smoke checks pass; or
- a concrete blocker prevents progress, such as failing verification that cannot be fixed within the task scope, missing required credentials, unclear task authority, or no-ready-task.

Preserve the sprint dependency order. Do not skip planned tasks, do not batch unrelated tasks, and do not implement out-of-scope features.
```

Tailor the final generated prompt to include current completed/planned task ids when that helps the later pursue-goal run resume cleanly.
