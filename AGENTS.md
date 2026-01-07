# Repository Guidelines

## Project Structure & Module Organization
- `app/`: Next.js App Router pages, layouts, and global styles (`app/globals.css`, `app/editor-theme.css`).
- `components/`: shared UI components and providers.
- `hooks/`: reusable React hooks (keep hook names `useThing`).
- `lib/`: utilities and shared helpers.
- `public/`: static assets served by Next.js.
- `test/`: unit and visual tests plus utilities and setup.
- `src-tauri/`: Tauri desktop shell and Rust configuration.

## Build, Test, and Development Commands
- `pnpm dev`: start the Next.js dev server (Turbopack).
- `pnpm build`: production build.
- `pnpm start`: serve the production build.
- `pnpm lint`: run ESLint (`next lint`).
- `pnpm test`: run Vitest once.
- `pnpm test:watch`: Vitest watch mode.
- `pnpm test:ui`: Vitest UI.
- `pnpm test:visual`: Playwright visual regression tests.
- `pnpm test:visual:ui`: Playwright UI runner.
- `npx tsx test/run-all-tests.ts`: run the full test suite with reporting.

## Coding Style & Naming Conventions
- TypeScript + React (Next.js). Follow existing file patterns and keep diffs minimal.
- Indentation: 2 spaces in TS/TSX; align JSX props vertically when multi-line.
- Components: `PascalCase` exports; files are typically kebab-case (match the folder).
- Hooks: functions named `useThing`, stored in `hooks/`.
- Linting: follow ESLint rules from `eslint.config.mjs`; fix lint before PRs.

## Testing Guidelines
- Unit tests live in `test/components/*.test.tsx` (Vitest + React Testing Library).
- Visual regression tests live in `test/visual/*.spec.ts` (Playwright).
- Use `test/setup.ts` and `test/utils/` for shared helpers.
- If visuals change intentionally, update snapshots: `pnpm test:visual --update-snapshots`.

## Commit & Pull Request Guidelines
- Commit messages follow conventional commits: `type(scope): subject`.
  Examples: `chore(deps): ...`, `ci(test): ...`.
- PRs should include: a concise description, linked issue (if any), and screenshots for UI changes.
- Note test coverage in the PR body (e.g., `pnpm test`, `pnpm test:visual`).

## Configuration Notes
- App config is in `next.config.ts`; tooling config in `vitest.config.ts` and `playwright.config.ts`.
- Prefer `pnpm` for dependency changes; keep `pnpm-lock.yaml` in sync.
