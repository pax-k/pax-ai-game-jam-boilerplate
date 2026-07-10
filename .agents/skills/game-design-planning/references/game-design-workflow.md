# Game Design Workflow

Use this workflow to turn a rough idea into a buildable game plan.

## 1. Vision

Capture the smallest useful statement of intent:

- One-sentence pitch: player, action, conflict, payoff.
- Player fantasy: who the player is pretending to be or what power they get to express.
- Target feeling: tension, mastery, fellowship, discovery, expression, speed, comfort, chaos, etc.
- Design pillars: 3-5 elements or emotions that every major feature should support.
- Non-goals: attractive ideas that are explicitly out of scope.
- Smallest playable proof: the smallest prototype that can prove the core loop is worth building.

Good pillars are decision filters. If a feature does not strengthen a pillar or core loop, cut it or mark it as stretch.

## 2. Game Form

Choose constraints before designing systems:

| Field | Capture |
| --- | --- |
| Genre or type | RPG, racing, arena shooter, tactics, party, survival, roguelite, cozy sim, puzzle, etc. |
| Camera | top-down, side-view, isometric, fixed-screen, arena, scrolling |
| Session shape | 2-minute match, 10-minute run, level, persistent world, drop-in room |
| Player count | solo, co-op, competitive, asymmetric, local, online |
| Input style | keyboard, mouse, gamepad, touch |
| Platform | browser-first, desktop browser, mobile browser, embedded demo |
| Scope | game-jam MVP, prototype, vertical slice, production candidate |

Use genre as a useful constraint, not a cage. If the game crosses genres, name the primary loop first.

## 3. Player Verbs

List what players actually do:

- Move, aim, dodge, jump, block, drift, gather, build, trade, talk, command, upgrade, race, fight, hide, reveal.
- Separate primary verbs from support verbs.
- Tie each verb to feedback: what the player sees, hears, earns, risks, or learns.
- Remove verbs that do not affect the core loop.

## 4. Core Loops

Define loops at multiple timescales:

| Loop | Purpose | Example |
| --- | --- | --- |
| Moment | repeated second-to-second actions | aim -> shoot -> dodge -> reposition |
| Short | one encounter or objective | scout -> engage -> collect -> escape |
| Session | one match or run | queue -> play -> score -> reward -> rematch |
| Progression | longer-term growth | earn -> unlock -> specialize -> face harder challenge |

Every major feature should name which loop it improves. If it competes with the primary loop, cut it or move it to stretch.

## 5. MDA

Use MDA to translate desired experience into buildable mechanics:

| Desired player experience | Dynamics that create it | Mechanics we can build |
| --- | --- | --- |
| Tension | scarcity, nearby threat, time pressure | limited ammo, warning radius, shrinking arena |
| Fellowship | shared goals, rescue moments | revive, team score, role abilities |
| Mastery | readable challenge, skill expression | telegraphed attacks, dash timing, combo windows |

Start from the feeling, then define the dynamic, then choose mechanics. Do not start with disconnected feature ideas.

## 6. Characters And World

Keep worldbuilding functional for game-jam planning:

- Player avatar: role, silhouette, movement identity, abilities, readability.
- Enemies or rivals: archetype, behavior, threat, counterplay, synced state needs.
- NPCs or allies: purpose, interaction loop, whether they need authority or persistence.
- World premise: what justifies the mechanics and visual direction.
- Level/world structure: arena, lanes, rooms, track, hub, overworld, procedural space.

Do not write lore that cannot affect mechanics, art direction, UI, levels, or progression.

## 7. Mechanic Cards

Document each mechanic in a compact card:

```md
## Mechanic Name

Purpose:
What player experience or loop this improves.

Player input:
Keys, mouse, gamepad, touch, or automatic trigger.

Rules:
Precise behavior, cooldowns, limits, costs, scoring, and failure cases.

Feedback:
Visual, audio, UI, camera, animation, hit pause, particles, text.

Server authority:
Client-only visual, client input/server result, shared schema, transient message, or persistent DB state.

Client feel:
Prediction, interpolation, animation, camera, HUD, control responsiveness.

Assets:
Sprites, tiles, UI, VFX, SFX, Pixel Lab prompt notes, frame size, direction count.

Tests:
Unit, room, browser smoke, playtest checks.

Playable evidence:
What must be visible, interactive, synchronized, or felt in a live browser session before the mechanic counts as working.
```

If a mechanic needs multiplayer trust, keep the authoritative rules on the server and let Excalibur visualize local or synced state.

## 8. Multiplayer Ownership

Classify each feature:

| Ownership | Use for |
| --- | --- |
| Client-only visual | animation, particles, camera shake, hover state |
| Client input, server result | movement, dash, attack intent, interact intent |
| Shared schema state | player position, score, health, match phase |
| Transient message | input, emote, one-shot action request |
| Persistent DB state | profile, unlocks, long-term stats, saved loadout |

Keep synced state small. Do not put transient messages or heavy rules into schema classes.

## 9. Client Architecture

Map the design into Excalibur-facing concepts:

- Scenes: boot, match, results, menu, loading, test scene.
- Actors: player, enemies, pickups, projectiles, zones, props, UI actors where appropriate.
- Input: continuous movement vs discrete actions.
- Camera: locked arena, follow player, shake, zoom, bounds.
- HUD and DOM split: canvas gameplay vs React menus/status outside canvas.
- Resource loading: centralized images, audio, fonts, sprite sheets, loader.
- Cleanup: actors, callbacks, timers, room connections, engine disposal.
- Client feel and prediction: where local feedback must match server authority closely enough to avoid misleading the player.

Keep React as host UI and Excalibur as the game surface.

## 10. Asset Plan

Plan Pixel Lab work before generating:

- Style: pixel density, palette, mood, camera angle, lighting, outline, proportions.
- Inventory: characters, enemies, tiles, props, UI icons, VFX, backgrounds.
- Technical target: frame size, direction count, animation states, transparent background, import path.
- Prompt base: common wording reused across assets for consistency.
- Provenance: prompt, endpoint, seed, job id, asset id, source image, output file, license notes.
- Timing: greybox first unless visuals are needed to validate readability or fantasy.

Do not call Pixel Lab during design planning unless the user explicitly requests asset generation.

## 11. Prototype Slices

Prefer this order:

1. Greybox arena/level and player movement.
2. Server-authoritative player state.
3. One primary mechanic.
4. One opponent, obstacle, pickup, or objective.
5. Win/loss and restart loop.
6. Minimal HUD and feedback.
7. Art import pass.
8. Juice pass.
9. Playtest, tune, cut, repeat.

Each slice should include acceptance checks and the smallest useful verification command.
For browser-facing slices, acceptance should include playable evidence: served app identity, canvas framing, visual readability, input behavior, multiplayer identity when relevant, and any authority/prediction parity the slice depends on.
