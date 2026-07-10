---
name: pixellab-api
description: Use this skill when building, reviewing, debugging, or integrating Pixel Lab API workflows for game-ready pixel art assets, especially in Bun or TypeScript game projects. Covers Pixellab characters, rotations, animations, tilesets, map objects, UI assets, image conversion, async jobs, credential-safe token handling, complete asset-batch manifests, output provenance, and engine integration review.
---

# Pixellab API

Use this skill to make Pixel Lab API work reliable, token-safe, and useful for game asset pipelines in this Bun repo.

## First Pass

1. Inspect the task before choosing an endpoint:
   - requested asset type, style, direction count, animation, frame size, and target engine/import format
   - whether the input is text-only, a reference image, an existing Pixellab asset id, or an image edit
   - where generated assets and metadata should be saved
   - whether an API token is available as `PIXELLAB_API_TOKEN`; never ask the user to paste it into chat
   - the complete asset contract: required directions, clips, frames, dimensions, target paths, and fallback policy
   - existing planning anchors in `docs/game-design/asset-plan.md`, `docs/game-design/characters-world.md`, and `docs/game-design/mda.md`
2. Classify the task:
   - API setup, authentication, balance, async jobs, docs, or errors: read [api-overview.md](references/api-overview.md).
   - Endpoint selection for characters, rotations, animations, tiles, objects, UI, or image operations: read [asset-workflows.md](references/asset-workflows.md).
   - Request bodies, OpenAPI schema lookup, base64 images, prompts, seeds, sizes, or Pro endpoints: read [request-construction.md](references/request-construction.md).
   - Bun `fetch` usage, env handling, output persistence, metadata, or game-engine import flow: read [integration-patterns.md](references/integration-patterns.md).
   - Code review, security review, or integration audit: read [review-checklist.md](references/review-checklist.md), plus any relevant domain reference above.
3. If relevant `docs/game-design/*` anchors exist, read them before planning or generating assets. Preserve explicit art direction, character/world, MDA, inventory, size, direction count, and provenance decisions unless the user asks to revise them.
4. Use the live OpenAPI spec for exact request and response shapes: `https://api.pixellab.ai/v2/openapi.json`.
5. Before live generation, establish the asset manifest and stop condition. Do not begin runtime integration until every required row is generated and validated, or the user accepts an explicit temporary fallback.
6. Implement or advise narrowly. Preserve prompts, seeds, returned ids, job ids, usage/cost fields, output URLs or files, and source endpoint names.
7. Verify the manifest, provenance, engine import, and visual result before reporting the asset work complete.

## Defaults For This Repo

- Use Bun commands: `bun <file>`, `bun run <script>`, `bun test`, and `bunx <tool>`.
- Use `PIXELLAB_API_TOKEN` for API auth. Never hard-code tokens or commit generated secrets.
- Treat credentials pasted into conversation as exposed. Do not repeat, quote, add to docs, metadata, commands, screenshots, or final responses. Ask the user to rotate any accidentally shared production credential, then use a replacement only through a local ignored env file.
- Before writing a token locally, confirm `.env` is ignored and verify `git status --short` does not expose it afterward. Read only the presence of `PIXELLAB_API_TOKEN`; never print its value.
- Do not add dotenv; Bun loads env files automatically.
- Do not add npm, pnpm, yarn, Node-only scripts, Express, Vite outside `apps/web`, or a Pixellab SDK dependency unless the user explicitly asks.
- Prefer direct `fetch` integration for small API calls. Add a reusable client only when multiple app surfaces need the same Pixellab behavior.
- Keep generated assets and metadata out of source code unless the user explicitly wants committed fixtures.

## Asset Batch Gate

For a multi-row character, animation, rotation, or tileset request, create or update a manifest that states every required output before submitting jobs. It must record at least the clip/kind, direction, expected frame count, dimensions, output path, job/result id, and status.

- Generate and retry only missing or failed rows. Preserve successful rows and their provenance.
- Do not silently substitute a partial batch, placeholder, or one-direction proof as final art.
- Validate atlas packing and direction/frame order before wiring `resources.ts` or an Excalibur animation controller.
- For a visual replacement request, inspect the existing committed assets and runtime overlays first. Prefer a fitting existing asset over a newly generated or hand-drawn substitute.
- Complete engine integration only after the manifest is complete, or label the task `Blocked`/`In Progress` with the missing rows and accepted fallback.

## Async Job Defaults

- Treat most generation endpoints as asynchronous unless the OpenAPI operation proves otherwise.
- Submit the generation request, capture the returned job id, and poll `GET /background-jobs/{job_id}`.
- Poll every 5-10 seconds for normal generation work.
- Stop polling when status is `completed` or `failed`; surface failed job details rather than retrying blindly.
- On completion, read results from the response payload, commonly `last_response`, then save asset ids and output locations.

## Gotchas

- Do not guess request body fields. Check the live OpenAPI schema or interactive docs before writing payloads.
- Pro endpoints may require account access or extra credits. Mention this before relying on them.
- Reference images often need base64 wrappers that match the OpenAPI `Base64Image` schema.
- Avoid logging bearer tokens, complete auth headers, or raw `.env` values.
- 4-direction and 8-direction assets have different downstream import expectations; preserve the direction count in metadata.
- For generated game assets, keep enough provenance to regenerate or audit the asset: prompt, endpoint, model/version if returned, seed, input image name, job id, and result id.
- Do not store base64 source payloads or tokens in committed metadata. Store source file paths, hashes, or asset ids instead.

## Verification Defaults

- Skill packaging changes: `bunx --yes skills add . --list --full-depth`.
- Pixellab integration code: run the narrow package tests, then `bun run check-types` when TypeScript code changed.
- Token-sensitive code review: inspect logs, error handling, env access, and saved metadata for accidental secret exposure.
- Generated asset batches: validate the manifest has no missing required rows, run atlas/import tests, then capture a browser screenshot proving the asset is visible at its intended scale and state.
