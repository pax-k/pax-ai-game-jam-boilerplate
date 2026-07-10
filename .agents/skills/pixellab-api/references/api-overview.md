# API Overview

Use this when setting up Pixellab API access, diagnosing auth or job status, or explaining the core API model.

## Sources Of Truth

- LLM docs: `https://api.pixellab.ai/v2/llms.txt`
- OpenAPI spec: `https://api.pixellab.ai/v2/openapi.json`
- Interactive docs: `https://api.pixellab.ai/v2/docs`
- Account and token page: `https://pixellab.ai/account`
- Base URL: `https://api.pixellab.ai/v2`

Do not snapshot the full OpenAPI spec into this repo. Fetch or inspect it live when exact schemas matter.

## Authentication

- Send every API request with `Authorization: Bearer ${PIXELLAB_API_TOKEN}`.
- Read the token from `Bun.env.PIXELLAB_API_TOKEN` in Bun code.
- Never hard-code tokens, commit `.env` values, or print full auth headers.
- If the token is missing, fail before making an API call and tell the operator which env var is required.

## Balance And Cost Awareness

- Use `GET /balance` before expensive generation when practical.
- Preserve returned `usage`, credit, or cost fields from generation and job responses.
- Mention when the selected endpoint is marked Pro or may require extra credits.

## Async Background Jobs

Most generation endpoints return a job id. The normal flow is:

1. Submit a generation request.
2. Capture the returned `background_job_id` or equivalent job id field.
3. Poll `GET /background-jobs/{job_id}`.
4. Stop on `completed` or `failed`.
5. Read completed output from the response payload, commonly `last_response`.

The Pixellab docs recommend polling every 5-10 seconds while jobs are processing. Character creation often takes 30-60 seconds; animations may take longer.

## Common HTTP Failures

- `401`: token is missing, invalid, expired, or lacks access.
- `404`: resource or job id does not exist, or belongs to another user.
- `422`: request body does not match the OpenAPI schema.
- `429`: rate limit; back off and avoid tight polling loops.
- `5xx`: service failure; surface the response and retry only when the operation is safe to repeat.

## Minimum Result Metadata

Record the endpoint, prompt, request body minus secrets, input file names, seed, job id, result asset id, direction count, output URLs or file paths, usage/cost, and timestamp.
