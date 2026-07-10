# Project Setup Bun Vite

Use this when wiring Excalibur into this monorepo, translating docs commands, or deciding where code belongs.

## Package Boundaries

- Keep Excalibur code in `packages/game`.
- Keep React/Vite canvas mounting in `apps/web`.
- Keep authoritative multiplayer simulation in `apps/server`.
- Keep shared room names, messages, schemas, and payload types in `packages/protocol`.
- Avoid importing `apps/web` from `packages/game`; the game package should be hostable by any browser shell.

## Bun Commands

- Use `bun install`, not npm, pnpm, or yarn.
- Use `bun run <script>` for repo scripts.
- Use `bunx <tool>` for one-off CLIs.
- Use `bun build` for Bun-built package artifacts.
- When Excalibur docs show npm/npx commands, translate them before applying them here.

## Vite Host Rules

- Vite is allowed only in `apps/web`.
- Run Vite through Bun scripts, such as `bun run dev:web` from the root or `bun run dev` inside `apps/web`.
- Use `import.meta.env.VITE_*` only in `apps/web`.
- Pass host configuration into `packages/game` through mount options instead of reading Vite env inside deep actor code.

## Canvas Mount Pattern

- Preserve a small exported mount API from `packages/game`.
- Let the host pass an `HTMLElement`; the game package creates and owns the canvas.
- Return a handle with `dispose()` and make every game-owned side effect reachable from that cleanup.
- On remount, clear the target element before appending a new canvas.

## Assets

- For Vite-served public files, use stable root-relative URLs when appropriate.
- For imported assets, verify the bundler path works from `apps/web` and `packages/game`.
- Keep generated assets and sidecar metadata out of source unless the user explicitly wants committed fixtures.
- If adding many assets, introduce a single `resources.ts` or equivalent in `packages/game/src`.

## Verification

- `cd packages/game && bun run check-types` for game-only TypeScript changes.
- `cd apps/web && bun run check-types` for host changes.
- `bun run check-types` when exports, protocol, or package boundaries change.
- `bun run build` before calling browser-host integration complete.
