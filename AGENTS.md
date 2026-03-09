# Repository Guidelines

## Project Structure & Module Organization
- `src/`: Solid frontend application.
  - `src/components/`: shared Solid UI and feature components.
  - `src/routes/`: route-level screens and global route styles.
  - `src/state/`: app state stores.
  - `src/lib/`: utilities, Tauri helpers, markdown helpers, and i18n.
- `public/`: static assets served by Vite.
- `src-tauri/`: Tauri desktop shell and Rust commands.
- `test/`: Vitest and Playwright coverage, helpers, and docs.

## Build, Test, and Development Commands
- `pnpm dev`: start the Solid + Vite dev server.
- `pnpm build`: production build and TypeScript check.
- `pnpm start`: preview the production build.
- `pnpm lint`: run TypeScript checking.
- `pnpm test`: run Vitest once.
- `pnpm test:watch`: Vitest watch mode.
- `pnpm test:ui`: Vitest UI.
- `pnpm test:visual`: Playwright visual regression tests.
- `pnpm test:visual:ui`: Playwright UI runner.
- `pnpm tauri dev`: run the desktop shell in development.
- `pnpm tauri build`: build the desktop app.

## Coding Style & Naming Conventions
- TypeScript + Solid. Keep diffs focused and consistent with nearby files.
- Indentation: 2 spaces in TS/TSX and CSS.
- Components: `PascalCase` exports; filenames are typically kebab-case or grouped by feature.
- Shared state lives in `src/state/`; generic helpers live in `src/lib/`.
- Prefer small composable helpers over framework-heavy abstractions.

## Testing Guidelines
- Unit and integration tests live in `test/components`, `test/hooks`, and `test/lib`.
- Visual regression tests live in `test/visual/*.spec.ts`.
- Use `test/setup.ts` and `test/utils/` for shared test setup.
- If visuals change intentionally, update snapshots with `pnpm test:visual --update-snapshots`.
- WebKit snapshots are optional locally and can be enabled with `PLAYWRIGHT_ENABLE_WEBKIT=1`.

## Commit & Pull Request Guidelines
- Commit messages follow conventional commits: `type(scope): subject`.
- PRs should include a concise description, linked issue if any, and screenshots for UI changes.
- Mention validation in the PR body, for example `pnpm test`, `pnpm test:visual`, or `pnpm build`.

## Configuration Notes
- Frontend config lives in `vite.config.ts`, `vitest.config.ts`, and `playwright.config.ts`.
- Tauri config lives in `src-tauri/tauri.conf.json` and `src-tauri/Cargo.toml`.
- Prefer `pnpm` for dependency changes and keep `pnpm-lock.yaml` in sync.
