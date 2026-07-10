# Integration Patterns

Use this when adding Pixellab calls to app code or designing the generated asset pipeline.

## Credential Intake

- Never request a token in chat. Tell the user to place it in the repo-local ignored `.env` as `PIXELLAB_API_TOKEN=...`.
- If a token was pasted into the conversation, do not reproduce it. Treat it as exposed and recommend rotation before using a replacement.
- Before using a local token, confirm `.env` is ignored with `git check-ignore -q .env`; after setup, confirm `git status --short` does not list it.
- Check only whether `Bun.env.PIXELLAB_API_TOKEN` is present. Never print or serialize the value, including in thrown errors, test output, sidecar metadata, or screenshots.

## Bun Fetch Pattern

Use Bun's built-in runtime and web APIs. Do not add dotenv or Node-only helper scripts.

```ts
const token = Bun.env.PIXELLAB_API_TOKEN;
if (!token) {
  throw new Error("PIXELLAB_API_TOKEN is required");
}

const response = await fetch("https://api.pixellab.ai/v2/balance", {
  headers: { Authorization: `Bearer ${token}` },
});

if (!response.ok) {
  throw new Error(`Pixellab request failed: ${response.status} ${await response.text()}`);
}
```

Do not log `token`, complete headers, or raw env values. Log endpoint names, job ids, status codes, and sanitized response bodies instead.

## Async Polling

- Poll background jobs with a bounded timeout and a 5-10 second interval.
- Stop on `completed` or `failed`.
- Avoid retrying generation submissions automatically; repeated submissions may spend credits.
- Retrying a status poll is usually safe when a network error or `5xx` occurs.

## Saving Outputs

For every generated asset, save or return:

- source endpoint
- request metadata without secrets
- user prompt and enhanced prompt if present
- seed and size settings
- input file names or asset ids
- background job id
- result asset id
- output URL or downloaded file path
- usage/cost fields

Use sidecar JSON metadata near downloaded images or zips when assets are written to disk.

Never save raw bearer tokens, authorization headers, or base64 image payloads in sidecars. Record an input file path, content hash, or previously issued asset id instead.

## Asset Batch Manifest

For an asset family, create a manifest before generation with one row per required output:

- kind or clip
- direction or variant
- required frames and dimensions
- output path
- job id, result id, and status
- prompt/seed provenance reference

Validate that every required row is complete before generating an atlas or changing runtime resources. Retry only rows marked failed or missing, preserving successful result ids. If a required row cannot be obtained, stop before integration unless the user explicitly accepts a named temporary fallback.

## Game Engine Import Notes

- Character rotations should keep a stable direction order in metadata.
- Tilesets should capture tile size, terrain labels, and top-down, sidescroller, or isometric assumptions.
- UI assets should capture intended scale and transparency requirements.
- Pixel art resizing should preserve crisp edges; avoid image smoothing in consuming renderers.
- Before replacing a runtime visual, inspect the existing sprite and its overlays in the browser. Use the existing asset when it satisfies the requested meaning; do not generate art merely to compensate for incorrect scale, z-order, or state routing.

## Where Code Belongs

- Keep server-side Pixellab calls on trusted server surfaces. Do not expose bearer tokens to browser code.
- Keep shared request/response TypeScript types near the integration if they are app-specific.
- Add a reusable Pixellab client only after at least two call sites need shared auth, polling, or error handling.
- Keep generated asset fixtures out of source control unless the user explicitly wants committed examples.
