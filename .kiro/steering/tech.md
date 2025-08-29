# Technology Stack

## Frontend
- **Next.js 15.3.0** - React framework with App Router
- **React 19** - UI library
- **TypeScript 5** - Type safety
- **Tailwind CSS 4** - Styling framework
- **shadcn/ui** - Component library (New York style)
- **Radix UI** - Headless UI primitives
- **Lucide React** - Icon library

## Desktop Framework
- **Tauri 2** - Rust-based desktop app framework
- **Rust** - Backend language for native functionality

## Key Libraries
- **@mdxeditor/editor** - Rich text editing
- **@dnd-kit** - Drag and drop functionality
- **@tanstack/react-table** - Data tables
- **react-hook-form + zod** - Form handling and validation
- **next-themes** - Theme management
- **recharts** - Data visualization

## Build System
- **pnpm** - Package manager
- **Turbopack** - Fast bundler (dev mode)
- **ESLint** - Code linting

## Common Commands

### Development
```bash
pnpm dev          # Start Next.js dev server with Turbopack
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
```

### Tauri Desktop App
```bash
pnpm tauri dev    # Run desktop app in development
pnpm tauri build  # Build desktop app for production
```

## Configuration Notes
- Uses static export (`output: 'export'`) for Tauri compatibility
- Images are unoptimized for static builds
- Path aliases configured: `@/*` maps to project root
- Excludes `src-tauri` from TypeScript compilation