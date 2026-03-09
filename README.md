<div align="center">

# OnlyWrite

**Efficiency first · Modern writing workspace**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![Solid](https://img.shields.io/badge/Solid-1.9-2c4f7c)](https://www.solidjs.com/)
[![Vite](https://img.shields.io/badge/Vite-7.3-646cff)](https://vite.dev/)
[![Tauri](https://img.shields.io/badge/Tauri-2.4-24C8DB)](https://tauri.app/)

</div>

## Overview

OnlyWrite is a local-first desktop writing app built with **Solid**, **Vite**, **Tauri 2**, and **TypeScript**.
It focuses on a distraction-free workspace, fast file-based writing, markdown preview, bilingual UI, and desktop-friendly workflows.

## Features

- Markdown writing with live preview
- Edit / Render / Split view modes
- Local folder-based workspace
- Manual save, restore, and autosave
- Light and dark themes
- English and Chinese UI
- Optional S3 image upload configuration
- Tauri desktop packaging for Windows, macOS, and Linux

## Tech Stack

### Frontend
- Solid 1.9
- Vite 7
- Tailwind CSS 4
- Lucide Solid
- marked + DOMPurify

### Desktop
- Tauri 2
- Rust

### Testing
- Vitest
- Solid Testing Library
- Playwright

## Project Structure

```text
OnlyWrite/
├── src/                # Solid frontend
│   ├── components/     # Shared and feature components
│   ├── lib/            # Utilities and Tauri helpers
│   ├── routes/         # Route screens and route CSS
│   └── state/          # Solid stores
├── public/             # Static assets
├── src-tauri/          # Tauri shell and Rust commands
└── test/               # Unit and visual tests
```

## Scripts

```bash
# Frontend
pnpm dev
pnpm build
pnpm start
pnpm lint

# Tests
pnpm test
pnpm test:watch
pnpm test:ui
pnpm test:visual
pnpm test:visual:ui

# Desktop
pnpm tauri dev
pnpm tauri build
```

## Development

```bash
git clone https://github.com/yourusername/OnlyWrite.git
cd OnlyWrite
pnpm install
pnpm dev
```

Then open `http://localhost:3000`.

For the desktop shell:

```bash
pnpm tauri dev
```

## Testing

```bash
# Unit tests
pnpm test

# Visual regression snapshots
pnpm test:visual

# Update visual baselines
pnpm test:visual --update-snapshots
```

By default visual tests run on Chromium. To enable WebKit locally after installing its system dependencies:

```bash
PLAYWRIGHT_ENABLE_WEBKIT=1 pnpm test:visual
```

## Notes

- `pnpm lint` currently runs TypeScript checking.
- Visual snapshots live under `test/visual/theme-visual-regression.spec.ts-snapshots/`.
- The repository has been cleaned up to remove the old React / TanStack / Radix frontend.

## License

MIT
