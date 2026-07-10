# Request Construction

Use this before writing Pixellab request bodies or debugging `422` validation errors.

## Schema Lookup

- Use `https://api.pixellab.ai/v2/openapi.json` for exact fields, enum values, examples, and response shapes.
- Inspect the operation under `paths["/endpoint"].post` or the relevant HTTP method.
- Follow `$ref` links into `components.schemas`.
- Do not infer field names from endpoint names or old examples.

When using shell commands, keep them Bun-friendly when practical:

```sh
bun -e 'const s=await fetch("https://api.pixellab.ai/v2/openapi.json").then(r=>r.json()); console.log(JSON.stringify(s.paths["/create-character-v3"].post.requestBody,null,2))'
```

## Request Body Rules

- Send JSON with `Content-Type: application/json` unless the OpenAPI operation says otherwise.
- Include `Authorization: Bearer ${PIXELLAB_API_TOKEN}` from env.
- Keep request objects minimal: required fields plus intentional optional fields.
- Use documented enums exactly as written.
- For Pro endpoints, confirm the user accepts Pro-only behavior or cost before making it the default.

## Prompts And Seeds

- Keep prompts specific enough for pixel-art output: subject, silhouette, palette, view, style, animation intent, and constraints.
- Preserve the original user prompt and any enhanced prompt returned by Pixellab.
- Use seeds when reproducibility matters; record the seed with generated assets.
- Do not silently turn on prompt enhancement if it changes cost or output semantics.

## Images And Base64

- Use the OpenAPI `Base64Image` schema for image fields.
- Confirm whether the endpoint expects a raw base64 string, an object wrapper, or a data URL prefix.
- Keep original image dimensions and path in metadata.
- For reference images, note whether the endpoint expects a south-facing character, transparent background, mask, or max dimensions.

## Sizes, Transparency, And Directions

- Check each endpoint's size schema before setting width or height.
- Prefer transparent backgrounds for sprites when the endpoint supports it.
- Record whether output is 1-direction, 4-direction, or 8-direction.
- For animations, record frame count, animation name, direction set, and any skeleton/template id.

## Validation Failures

On `422`, compare the submitted JSON against the exact OpenAPI schema, including:

- required fields
- enum spelling
- nested object wrappers
- nullable fields
- max image size
- Pro-only constraints
- mutually exclusive fields such as text mode versus reference image mode
