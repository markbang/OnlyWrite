<div align="center">

# OnlyWrite

**Efficiency first · Modern writing workspace**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15.4-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-61dafb)](https://reactjs.org/)
[![Tauri](https://img.shields.io/badge/Tauri-2.4-24C8DB)](https://tauri.app/)
[![pnpm](https://img.shields.io/badge/pnpm-latest-F69220)](https://pnpm.io/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

[Features](#features) · [Installation](#installation) · [Documentation](#documentation) · [Contributing](#contributing)

</div>

---

## Overview

**OnlyWrite** is a modern, distraction-free writing application built with efficiency and user experience at its core. Designed for writers, developers, and content creators who value clean interfaces and powerful functionality.

Built with cutting-edge technologies including Next.js 15, React 19, Tauri 2.4, and TypeScript, OnlyWrite delivers a native desktop experience with web-level flexibility.

## Features

### Core Writing Experience
- **Markdown Editor**: Full-featured markdown editing with live preview
- **Split View**: Edit and preview simultaneously with resizable panels
- **Auto-save**: Never lose your work with automatic 5-second intervals
- **File Management**: Organize your workspace with folder-based navigation
- **Syntax Highlighting**: Beautiful code blocks with theme integration

### User Interface
- **Dark/Light Themes**: Seamless theme switching with consistent color harmony
- **Responsive Design**: Works beautifully on desktop and mobile
- **Accessibility First**: WCAG compliant with keyboard navigation and screen reader support
- **Modern Components**: Built with Radix UI and Tailwind CSS for a polished experience

### Platform Features
- **Cross-platform**: Native desktop apps for Windows, macOS, and Linux via Tauri
- **Local-first**: All your data stays on your device
- **Fast Performance**: Optimized with Turbopack for lightning-fast dev and build times
- **Internationalization**: Support for English and Chinese (more languages coming)

### Technical Highlights
- **Type-safe**: Full TypeScript coverage for reliable code
- **Tested**: Comprehensive test suite with Vitest and Playwright
- **Modern Stack**: React 19, Next.js 15, Tailwind CSS 4
- **Developer Experience**: Hot reload, ESLint, and pre-configured dev environment

## Installation

### Prerequisites
- Node.js 20+
- pnpm (recommended package manager)
- Rust (for Tauri desktop builds)

### Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/OnlyWrite.git
cd OnlyWrite

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Open http://localhost:3000
```

### Desktop App Development

```bash
# Install Tauri CLI
cargo install tauri-cli

# Run desktop app in development
pnpm tauri dev

# Build desktop app for production
pnpm tauri build
```

## Documentation

### Project Structure

```
OnlyWrite/
├── app/                 # Next.js App Router pages and layouts
├── components/          # React components
│   ├── ui/             # Reusable UI components (Radix + Tailwind)
│   └── ...             # Feature-specific components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and helpers
├── public/             # Static assets
├── src-tauri/          # Tauri desktop shell
├── test/               # Test suites
│   ├── components/     # Component tests
│   ├── lib/            # Utility tests
│   ├── hooks/          # Hook tests
│   └── visual/         # Visual regression tests
└── ...
```

### Available Scripts

```bash
# Development
pnpm dev              # Start Next.js dev server with Turbopack
pnpm build            # Production build
pnpm start            # Serve production build
pnpm lint             # Run ESLint

# Testing
pnpm test             # Run unit tests (Vitest)
pnpm test:watch       # Run tests in watch mode
pnpm test:ui          # Open Vitest UI
pnpm test:visual      # Run visual regression tests (Playwright)
pnpm test:visual:ui   # Open Playwright UI

# Desktop
pnpm tauri dev        # Run Tauri desktop app
pnpm tauri build      # Build desktop app
```

### Coding Guidelines

- **TypeScript**: All code must be type-safe
- **Components**: Use PascalCase for component names
- **Hooks**: Prefix with `use` (e.g., `useI18n`, `useS3Config`)
- **Styling**: Use Tailwind CSS utility classes
- **Testing**: Write tests for new features and bug fixes
- **Commits**: Follow [Conventional Commits](https://www.conventionalcommits.org/)

## Technology Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4
- **Components**: Radix UI
- **Icons**: Tabler Icons + Lucide React
- **Editor**: MDXEditor

### Desktop
- **Framework**: Tauri 2.4
- **Language**: Rust

### Development
- **Language**: TypeScript 5
- **Package Manager**: pnpm
- **Build Tool**: Turbopack
- **Linting**: ESLint 9
- **Testing**: Vitest + Playwright
- **Testing Library**: React Testing Library

### Key Dependencies
- `next-themes` - Theme management
- `react-markdown` - Markdown rendering
- `react-resizable-panels` - Split view
- `@dnd-kit` - Drag and drop
- `sonner` - Toast notifications
- `zod` - Schema validation

## Testing

OnlyWrite maintains high code quality with comprehensive test coverage:

### Unit Tests (Vitest)
- Component functionality tests
- Hook behavior tests
- Utility function tests
- Theme consistency tests

### Visual Regression Tests (Playwright)
- Cross-browser screenshot comparisons
- Theme switching validation
- Responsive design verification

### Running Tests

```bash
# Run all tests
npx tsx test/run-all-tests.ts

# Run unit tests only
pnpm test

# Run visual tests only
pnpm test:visual

# Update visual snapshots
pnpm test:visual --update-snapshots
```

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) and [Code of Conduct](CODE_OF_CONDUCT.md).

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Write or update tests
5. Ensure all tests pass (`pnpm test && pnpm test:visual`)
6. Run linting (`pnpm lint`)
7. Commit your changes (`git commit -m 'feat: add amazing feature'`)
8. Push to the branch (`git push origin feature/amazing-feature`)
9. Open a Pull Request

### PR Guidelines

- Include a clear description of the changes
- Link related issues
- Add screenshots for UI changes
- Ensure tests pass and coverage is maintained
- Follow the existing code style

## Roadmap

- [ ] Cloud sync support (S3, Dropbox, etc.)
- [ ] Real-time collaboration
- [ ] Plugin system
- [ ] Custom themes
- [ ] Export to PDF/DOCX
- [ ] Version history
- [ ] Mobile apps (iOS/Android)
- [ ] More language support

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

**This project was developed with the assistance of AI tools**, including:
- Code generation and refactoring assistance
- Documentation writing
- Test case generation
- Code review suggestions

All AI-generated code has been reviewed, tested, and validated by human developers.

### Built With

- [Next.js](https://nextjs.org/) - React framework
- [Tauri](https://tauri.app/) - Desktop framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Radix UI](https://www.radix-ui.com/) - Unstyled UI primitives
- [MDXEditor](https://mdxeditor.dev/) - Markdown editor component
- [Vitest](https://vitest.dev/) - Unit testing framework
- [Playwright](https://playwright.dev/) - E2E and visual testing

---

<div align="center">

**Made with ❤️ by the OnlyWrite Team**

[Report Bug](https://github.com/yourusername/OnlyWrite/issues) · [Request Feature](https://github.com/yourusername/OnlyWrite/issues)

</div>
