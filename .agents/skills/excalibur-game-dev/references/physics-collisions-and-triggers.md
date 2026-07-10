# Physics Collisions And Triggers

Use this when adding physics, colliders, collision events, triggers, hitboxes, damage boxes, or debugging collision behavior.

## Physics Choice

- Use simple movement and manual bounds checks when full physics is unnecessary.
- Use Arcade-style physics for top-down movement, simple platformers, and non-rotated rectangle-heavy collision.
- Use Realistic physics only when rotation, rigid bodies, impulses, mass, friction, or bounciness matter.
- Do not add expensive physics features for purely visual overlap checks.

## Collider Design

- Treat colliders as gameplay shapes.
- Size colliders for fairness and feel, not exact sprite pixels.
- Use boxes, circles, polygons, edges, or composite colliders based on the gameplay shape.
- Use child actors for hitboxes, damage boxes, sensors, or temporary weapon arcs when ownership differs from the main body.
- Use collision groups when many entity categories need stable filtering.

## Collision Types And Events

- Choose collision type based on desired behavior:
  - no interaction
  - event-only overlap
  - resolved physical collision with events
- Use `collisionstart` for one-time reactions when bodies first touch.
- Use `collisionend` for leaving floor, zones, ladders, or trigger areas.
- Avoid doing repeated per-frame effects in `collisionstart`; use state plus update logic when the effect must continue.
- Guard collision handlers by actor/component identity so unrelated collisions do not trigger gameplay.

## Triggers And Pickups

- Prefer event-only collision for pickups, checkpoints, pressure plates, and area triggers.
- Disable, kill, or mark a trigger as consumed after activation when it should only fire once.
- For multiplayer triggers, send or render server-confirmed state rather than trusting the local overlap.

## Debugging

- Use Excalibur debug drawing to inspect invisible collider geometry.
- Confirm both participants have colliders and collision types that can interact.
- Confirm actors are in the active scene.
- Confirm collision groups allow the pair.
- Confirm fast-moving actors are not skipping past tiny colliders.
