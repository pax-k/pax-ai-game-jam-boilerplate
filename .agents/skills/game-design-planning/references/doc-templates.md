# Game Design Doc Templates

Create `docs/game-design/README.md` first, then add only the files needed for the current planning pass.

## `docs/game-design/README.md`

```md
# Game Design

## Current State

- Status:
- Last updated:
- Planning confidence:

## Index

- [Vision](vision.md)
- [Game Form](game-form.md)
- [Core Loop](core-loop.md)
- [MDA](mda.md)
- [Characters And World](characters-world.md)
- [Mechanics](mechanics.md)
- [Multiplayer Architecture](multiplayer-architecture.md)
- [Client Architecture](client-architecture.md)
- [Asset Plan](asset-plan.md)
- [Prototype Plan](prototype-plan.md)
- [Decision Log](decision-log.md)

## Build Rule

Before implementing gameplay, protocol, client, or asset changes, read the relevant files in this folder and preserve explicit decisions unless the user asks to revise them.
```

## `vision.md`

```md
# Vision

## One-Sentence Pitch

## Player Fantasy

## Target Player Experience

## Design Pillars

## Non-Goals

## Smallest Playable Proof

## Assumptions

## Open Questions
```

## `game-form.md`

```md
# Game Form

| Field | Decision |
| --- | --- |
| Genre or type | |
| Camera | |
| Session shape | |
| Player count | |
| Input style | |
| Platform | Browser |
| Scope | |

## Primary Player Verbs

## Support Verbs

## Constraints

## Stretch Ideas
```

## `core-loop.md`

```md
# Core Loop

## Moment Loop

## Short Loop

## Session Loop

## Progression Loop

## Loop Support Matrix

| Feature | Loop improved | Why it matters |
| --- | --- | --- |
```

## `mda.md`

```md
# MDA

| Desired player experience | Dynamics that create it | Mechanics we can build |
| --- | --- | --- |

## Design Risks

## Playtest Questions
```

## `characters-world.md`

```md
# Characters And World

## Player Avatar

## Enemy Or Rival Archetypes

## NPCs Or Allies

## World Premise

## Level Or World Structure

## Mechanics-Relevant Lore
```

## `mechanics.md`

```md
# Mechanics

## Mechanic Inventory

| Mechanic | Purpose | Ownership | MVP |
| --- | --- | --- | --- |

## Mechanic Cards

### Mechanic Name

Purpose:

Player input:

Rules:

Feedback:

Server authority:

Client feel:

Assets:

Tests:

Playable evidence:
```

## `multiplayer-architecture.md`

```md
# Multiplayer Architecture

## Room Model

## Server Authority Rules

## Synced State

| State | Schema owner | Update source | Notes |
| --- | --- | --- | --- |

## Transient Messages

| Message | Direction | Payload | Validation |
| --- | --- | --- | --- |

## Persistence

## Reconnection And Leave Behavior

## Risks
```

## `client-architecture.md`

```md
# Client Architecture

## Excalibur Scene Model

## Actors

## Input

## Camera

## HUD And React Split

## Resource Loading

## Cleanup Requirements

## Browser Smoke Checks

## Client Feel And Prediction
```

## `asset-plan.md`

```md
# Asset Plan

## Visual Direction

## Pixel Lab Prompt Base

## Asset Inventory

| Asset | Type | Size | Directions | Animation states | Priority |
| --- | --- | --- | --- | --- | --- |

## Provenance Fields

- prompt
- endpoint
- seed
- job id
- asset id
- source image
- output file
- notes

## Greybox vs Generated Assets
```

## `prototype-plan.md`

```md
# Prototype Plan

## Build Slices

| Slice | Goal | Acceptance check | Verification |
| --- | --- | --- | --- |

## Playtest Plan

## Playable Evidence

## Cut List

## Verification Commands
```

## `decision-log.md`

```md
# Decision Log

| Date | Decision | Reason | Status |
| --- | --- | --- | --- |

## Assumptions

## Open Questions
```
