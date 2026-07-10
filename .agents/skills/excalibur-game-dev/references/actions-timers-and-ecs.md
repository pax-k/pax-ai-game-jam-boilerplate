# Actions Timers And ECS

Use this when adding scripted movement, delayed behavior, repeated work, ECS components, systems, or reusable actor behavior.

## Actions

- Use actions for scripted actor behavior: move, rotate, scale, blink, fade, delay, repeat, patrol, or scripted sequences.
- Chain actions when behavior is local to one actor and easy to express sequentially.
- Clear or interrupt actions when actor state changes, scenes reset, or the actor dies.
- Avoid actions for authoritative multiplayer simulation unless they only affect client-side presentation.

## Timers

- Use Excalibur timers for scene-owned delays, spawn waves, countdowns, and repeated local work.
- Add timers to the scene or engine lifecycle that owns them.
- Stop or remove timers when scenes deactivate if they should not continue in the background.
- Avoid raw browser intervals inside scenes unless they are part of host integration and cleaned by `dispose`.

## ECS Components

- Use a component when many actors need the same data or marker.
- Keep components small and data-oriented.
- Avoid placing large behavior methods on components unless using a deliberate systemless pattern.
- Remove components when the behavior no longer applies.

## ECS Systems

- Use a system when logic should process all entities matching a component set.
- Put repeated movement, status effects, AI perception, health regen, cooldowns, or cleanup scans in systems when actor methods would duplicate logic.
- Keep systems deterministic and easy to test when possible.
- Register systems through the scene or world that owns the entities.

## Systemless Components

- Use systemless components only for simple reusable behavior where colocating event handlers improves clarity.
- Store subscriptions and unregister them when the component is removed or the entity is killed.
- Prefer a real system once behavior needs ordering, queries, or shared update logic.

## Decision Guide

- Actor method: one actor type owns the behavior.
- Action: one actor needs a short scripted sequence.
- Timer: scene-owned delayed or repeated event.
- Component: reusable state or marker.
- System: reusable update logic across entities.
- Plain helper: deterministic calculation independent from Excalibur runtime.
