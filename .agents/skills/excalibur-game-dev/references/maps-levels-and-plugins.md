# Maps Levels And Plugins

Use this when adding tile maps, external map tools, level loading, Tiled or LDtk plugins, Aseprite assets, or SpriteFusion workflows.

## Tile Maps

- Use Excalibur tile maps for grid-based levels, collision layers, decorative layers, and tile triggers.
- Keep tile size, map dimensions, and world bounds centralized.
- Use composite colliders for solid tile layers when the map should block movement.
- Keep trigger tiles or objects separate from solid collision.
- Use map properties or object properties for spawn points, exits, pickups, hazards, and scripted regions.

## Tiled And LDtk

- Use the official Excalibur plugin path when importing Tiled or LDtk data.
- Keep source map files and exported runtime files in predictable asset folders.
- Document whether coordinates are tile coordinates, pixels, world space, or screen space.
- Map object properties should become typed game config before actor creation.
- Validate asset paths after bundling; map files often contain relative paths that break after moving folders.

## Aseprite And SpriteFusion

- Use Aseprite exports for spritesheets and animation metadata when available.
- Preserve frame tags, slice names, durations, and pixel dimensions in import code.
- Use SpriteFusion or equivalent exports for tile layers only after confirming tile size and atlas layout.
- Keep generated metadata next to assets when it is required for import.

## Level Loading Flow

- Load raw level data before creating actors that depend on it.
- Convert level objects into scene actors in one level composition function.
- Keep one place responsible for resolving map object types to actor factories.
- Use scene activation for restarting a level from already-loaded data.

## Verification

- Start the app and confirm the map renders at the expected scale.
- Toggle debug drawing for tile collision and triggers.
- Walk the player into solids, triggers, exits, and hazards.
- Check browser network requests for missing map, tileset, or image files.
