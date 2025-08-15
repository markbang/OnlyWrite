# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

OnlyWrite is a desktop markdown writing application built with Next.js frontend and Tauri backend. It provides a clean interface for opening folders, viewing files, and editing markdown documents with real-time preview and image upload capabilities.

## Development Commands

### Daily Development
- `pnpm dev` - Start development server (runs both Next.js and Tauri)
- `pnpm build` - Build for production (creates Next.js build and Tauri app)
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

### Package Management
- Uses `pnpm` as the package manager
- Dependencies are managed through `package.json`

## Architecture

### Hybrid Application Structure
- **Frontend**: Next.js 15 with React 19, TypeScript, Tailwind CSS
- **Backend**: Tauri (Rust) for native desktop capabilities
- **UI Components**: Shadcn/ui with Radix UI primitives
- **Markdown Editor**: MDXEditor with plugins for rich editing

### Key Components
- `app/page.tsx` - Main application layout with resizable panels
- `components/writing-area.tsx` - Markdown editor component with save functionality
- `components/file-area.tsx` - File browser for selected folders
- `components/markdown-editor.tsx` - Rich markdown editor with image upload
- `src-tauri/src/main.rs` - Tauri backend with file system and dialog plugins

### State Management
- Uses React hooks for local state
- No global state management library
- File operations handled through Tauri APIs

### File Structure Patterns
- `/app` - Next.js App Router pages
- `/components` - React components (main components and `/ui` for primitives)
- `/hooks` - Custom React hooks
- `/lib` - Utility functions
- `/src-tauri` - Rust backend code

## Tauri Integration

### Enabled Plugins
- `dialog` - File/folder selection dialogs
- `fs` - File system operations (read/write files)
- `os` - OS type detection
- `process` - App lifecycle management
- `shell` - External command execution
- `updater` - Automatic app updates

### Custom Commands
- `scoop_update` - Windows package manager update command

## Styling and UI

### CSS Framework
- Tailwind CSS 4 with PostCSS
- CSS custom properties for theming
- Component-based styling with shadcn/ui

### Typography
- Uses Geist font family
- Prose classes for markdown content
- Chinese language support in UI text

## File Operations

### Supported Operations
- Open folders via native dialog
- Read/write text files (primarily markdown)
- Binary file writing for image uploads
- File browsing and selection

### File Handling Patterns
- Async file operations with error handling
- Path joining using Tauri's path API
- Image assets stored in `/assets` subfolder of selected folder

## Build Configuration

### Next.js Configuration
- Export mode enabled for static generation
- Image optimization disabled for Tauri compatibility
- Development proxy for Tauri integration

### Tauri Configuration
- Window settings: 800x600, resizable, transparent title bar
- Auto-updater enabled with GitHub releases
- Bundle targets: all platforms