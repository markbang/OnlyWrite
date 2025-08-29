# Project Structure

## Root Directory
```
onlywrite-app/
├── app/                    # Next.js App Router pages
├── components/             # React components
├── hooks/                  # Custom React hooks
├── lib/                    # Utility libraries
├── public/                 # Static assets
├── src-tauri/              # Tauri Rust backend
└── .kiro/                  # Kiro AI assistant configuration
```

## Frontend Structure

### `/app` - Next.js App Router
- `layout.tsx` - Root layout with global styles and event listeners
- `page.tsx` - Home page component
- `globals.css` - Global styles and Tailwind imports
- `editor-theme.css` - Editor-specific styling
- `dashboard/` - Dashboard-related pages
- `login/` - Authentication pages

### `/components` - React Components
- **UI Components**: Located in `components/ui/` (shadcn/ui)
- **Feature Components**: Top-level components for specific features
  - `app-sidebar.tsx` - Main application sidebar
  - `markdown-editor.tsx` - Writing/editing interface
  - `data-table.tsx` - Table components
  - `nav-*.tsx` - Navigation components
  - `*-area.tsx` - Content area components

### `/hooks` - Custom Hooks
- `useGlobalEventListeners.ts` - Global event handling
- `useTauriApp.ts` - Tauri-specific functionality
- `useTheme.ts/tsx` - Theme management
- `use-mobile.ts` - Mobile detection

### `/lib` - Utilities
- `utils.ts` - General utility functions (includes cn() for class merging)
- `updater.ts` - Auto-updater functionality

## Backend Structure (`/src-tauri`)
- `src/` - Rust source code
- `Cargo.toml` - Rust dependencies and metadata
- `tauri.conf.json` - Tauri configuration
- `icons/` - Application icons for different platforms

## Configuration Files
- `components.json` - shadcn/ui configuration
- `next.config.ts` - Next.js configuration with Tauri optimizations
- `tsconfig.json` - TypeScript configuration with path aliases
- `tailwind.config.js` - Tailwind CSS configuration
- `package.json` - Node.js dependencies and scripts

## Naming Conventions
- **Components**: PascalCase for component files and exports
- **Hooks**: camelCase starting with "use"
- **Utilities**: camelCase for functions, kebab-case for files
- **Pages**: kebab-case for directories, lowercase for files
- **CSS**: kebab-case for custom classes, following Tailwind conventions

## Import Patterns
- Use `@/` alias for imports from project root
- Prefer named imports over default imports where possible
- Group imports: external libraries first, then internal modules