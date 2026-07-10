# Project Setup: Bun + Colyseus

Use this when wiring a Colyseus server, changing package setup, or diagnosing runtime/build issues in a Bun TypeScript project.

## Default Shape

- Keep the server on Bun:
  - dev: `bun --hot ./src/index.ts`
  - build: `bun build ./src/index.ts --outdir ./dist --target bun --packages external`
  - start: `bun ./dist/index.js`
- Use `@colyseus/bun-websockets` with `defineServer()`.
- Prefer Colyseus 0.17 `routes: createRouter({ ...createEndpoint(...) })` for HTTP routes in this repo.
- Keep browser packages using `@colyseus/sdk`; keep shared protocol packages using `@colyseus/schema`.
- Use `bunx tsc --noEmit -p tsconfig.json` for type checks when a package already exposes that script.

## Required TypeScript Settings

Schema decorators need:

```json
{
  "experimentalDecorators": true,
  "useDefineForClassFields": false
}
```

Check root and package `tsconfig.json` files before adding or refactoring `@type()` fields.

## Dependency Defaults

- Server package: `colyseus`, `@colyseus/bun-websockets`, shared protocol package.
- Protocol package: `@colyseus/schema`.
- Client/game package: `@colyseus/sdk`, shared protocol package.
- Testing package only when needed: `@colyseus/testing`.
- Load testing package only when needed: `@colyseus/loadtest`.
- Command pattern package only when room logic is getting broad enough to justify it: `@colyseus/command`.

## Gotchas

- Bun WebSockets support is experimental in Colyseus. Keep transport wiring simple and verify server startup after changes.
- Do not introduce Express as the primary server abstraction in this Bun repo. Colyseus may expose compatibility layers, but local code should follow the current `createRouter` / `createEndpoint` style.
- Do not add dotenv; Bun loads env files automatically.
- Do not add npm, pnpm, yarn, vite, webpack, or esbuild workflows for Colyseus work in this repo.

## Verification

- Package shape: inspect `package.json` scripts and dependencies.
- Type checks: `bun run check-types`.
- Server tests: `bun test apps/server/src`.
- Protocol tests: `bun test packages/protocol/src`.
- Full repo when package boundaries changed: `bun test` then `bun run check-types`.
