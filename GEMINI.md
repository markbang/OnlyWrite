# Project Overview

This is a Next.js and Tauri application called "OnlyWrite". It's a desktop application for writing and managing documents. The frontend is built with Next.js, React, and TypeScript, and the backend is powered by Tauri.

## Technologies Used

*   **Frontend:**
    *   Next.js
    *   React
    *   TypeScript
    *   Tailwind CSS
    *   Shadcn/ui
*   **Backend:**
    *   Tauri (Rust)

## Building and Running

To build and run the application, you'll need to have Node.js, pnpm, and Rust installed.

**Development:**

To run the application in development mode, use the following command:

```bash
pnpm dev
```

This will start the Next.js development server and the Tauri application.

**Production:**

To build the application for production, use the following command:

```bash
pnpm build
```

This will create a production build of the Next.js application and the Tauri application.

## Development Conventions

*   The project uses `pnpm` as the package manager.
*   The code is formatted with Prettier and linted with ESLint.
*   The project uses conventional commits.
