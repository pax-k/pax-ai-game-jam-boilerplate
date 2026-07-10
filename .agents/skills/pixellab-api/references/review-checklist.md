# Review Checklist

Use this for Pixellab integration reviews, PR reviews, or implementation self-checks.

## Security

- `PIXELLAB_API_TOKEN` is read only from trusted server-side env.
- No bearer token, full auth header, or `.env` value is logged, committed, or sent to the browser.
- Client/browser code cannot call Pixellab directly with the server token.
- Saved request metadata has secrets removed.
- If a credential was shared in chat, the review records it as exposed without reproducing it and recommends rotation.
- `.env` is ignored and absent from `git status --short`.

## API Correctness

- Endpoint selection matches the asset workflow.
- Request bodies were checked against the live OpenAPI schema.
- Pro endpoints are intentional and called out.
- `422` handling exposes validation detail without hiding the response.
- Management operations such as delete, dismiss, or promote are not called accidentally.

## Async Jobs

- Generation code captures the returned job id.
- Polling uses `GET /background-jobs/{job_id}` with a bounded timeout.
- Polling stops on `completed` or `failed`.
- Failed jobs surface status and details.
- Generation submissions are not retried blindly in ways that may spend credits.

## Asset Provenance

- Output metadata records prompt, endpoint, job id, result id, seed, input files, direction count, dimensions, and usage/cost when available.
- Downloaded files or URLs are connected to their metadata.
- Direction order and animation frame counts are preserved for engine import.
- Reference image and mask provenance is tracked when used.
- Metadata stores input paths, hashes, or asset ids, not raw base64 payloads.

## Asset Batch Completeness

- A manifest enumerates every required direction, clip, frame count, size, and output path before generation.
- Every required manifest row is `completed`, or the task explicitly remains `Blocked`/`In Progress` with the accepted fallback named.
- Atlas packing validates direction order, frame order, and dimensions before runtime wiring.
- Successful rows retain their job/result ids when missing rows are retried.
- Browser evidence proves the imported asset is visible, correctly scaled, and not hidden by a runtime overlay or z-order mistake.

## Repo Fit

- Commands use Bun: `bun`, `bun run`, `bun test`, and `bunx`.
- No npm, pnpm, yarn, Node-only script, or dotenv dependency was added.
- No `agents/openai.yaml`, `assets/`, `scripts/`, `skills.sh.json`, or public `skills/` mirror was added for skill-only changes.

## Output Format

When reporting a review, use:

```markdown
## Findings
- [severity] File/path or surface: issue, impact, and fix.

## Verification
- Commands run or recommended.

## Notes
- Assumptions, cost considerations, or follow-up checks.
```
