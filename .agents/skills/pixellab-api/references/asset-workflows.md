# Asset Workflows

Use this when selecting Pixellab endpoints for a requested game asset.

## Characters

- Text or reference image to 8-direction character: `POST /create-character-v3`.
- Legacy or template 4-direction character: `POST /create-character-with-4-directions`.
- Legacy or template 8-direction character: `POST /create-character-with-8-directions`.
- Pro character generation: `POST /create-character-pro`.
- Existing character state variant: `POST /create-character-state`.
- Character animation: `POST /characters/animations` or `POST /animate-character`.
- Character export: `GET /characters/{character_id}/zip`.

Prefer `/create-character-v3` for new 8-rotation character work unless the user needs a legacy endpoint or a specific documented capability.

## Rotations And Animation

- Generate 8 rotations from an image or asset: `POST /generate-8-rotations-v3`.
- Pro 8-rotation path: `POST /generate-8-rotations-v2`.
- Rotate an existing character or object: `POST /rotate`.
- Animate from text: `POST /animate-with-text-v3`, with older or Pro variants only when needed.
- Animate with skeleton: `POST /animate-with-skeleton`.
- Estimate skeleton for animation setup: `POST /estimate-skeleton`.

Preserve direction count, animation name, frame count, and source asset id in metadata.

## Tiles, Maps, And Objects

- Top-down tileset: `POST /tilesets` or `POST /create-tileset`.
- Sidescroller tileset: `POST /tilesets-sidescroller` or `POST /create-tileset-sidescroller`.
- Isometric tile: `POST /create-isometric-tile`.
- Advanced tiles: `POST /create-tiles-pro`.
- Map object: `POST /map-objects`.
- One-direction object: `POST /create-1-direction-object`.
- Eight-direction object: `POST /create-8-direction-object`.
- Object animation: `POST /objects/{object_id}/animations`.
- Object state: `POST /objects/{object_id}/states`.

For tilesets, capture tile dimensions, camera view, terrain labels, Wang/autotile intent, and target engine import assumptions.

## Image Generation And Editing

- General image generation: `POST /create-image-pixen`, `/create-image-pixflux`, or `/create-image-bitforge`.
- Pro image generation: `POST /generate-image-v2`.
- Generate with style reference: `POST /generate-with-style-v2`.
- Convert image to pixel art: `POST /image-to-pixelart` or `POST /image-to-pixelart-pro`.
- Inpaint: `POST /inpaint` or `POST /inpaint-v3`.
- Resize pixel art: `POST /resize`.
- Remove background: `POST /remove-background`.
- Edit image: `POST /edit-image` or `POST /edit-images-v2`.

For edits, preserve the source image path, mask path if any, operation prompt, and output dimensions.

## UI Assets

- UI panel or game UI asset: `POST /create-ui-asset`.
- UI generation Pro path: `POST /generate-ui-v2`.
- List or fetch UI assets: `GET /ui-assets`, `GET /ui-assets/{ui_asset_id}`.
- Delete UI asset: `DELETE /ui-assets/{ui_asset_id}`.

Record intended UI use, scale, transparent/background requirement, and nine-slice or sprite atlas expectations when relevant.
