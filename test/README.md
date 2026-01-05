# Theme Consistency Testing Suite

This directory contains comprehensive tests for theme consistency, color harmony, and visual regression testing for the OnlyWrite application.

## Test Structure

### Unit Tests (Vitest + React Testing Library)

- **`theme-consistency.test.tsx`** - Tests theme consistency across components in light and dark modes
- **`interaction-states.test.tsx`** - Tests hover, focus, and active states for interactive elements
- **`color-harmony.test.tsx`** - Validates color harmony and CSS custom property usage
- **`comprehensive-theme.test.tsx`** - Complete test suite covering all theme-related requirements

### Visual Regression Tests (Playwright)

- **`visual/theme-visual-regression.spec.ts`** - Screenshot-based visual regression tests for theme consistency

### Utilities

- **`utils/theme-test-utils.tsx`** - Custom render utilities with theme provider support
- **`setup.ts`** - Test environment setup and mocks
- **`run-all-tests.ts`** - Comprehensive test runner script

## Requirements Coverage

The test suite covers all requirements from the app-style-optimization spec:

### Requirement 1.1 - Theme Switching Consistency
- ✅ Tests color consistency when switching between light and dark themes
- ✅ Validates text highlighting colors match theme palette
- ✅ Ensures all UI elements use consistent color values

### Requirement 1.2 - Consistent Hover and Active States  
- ✅ Tests hover state consistency across components
- ✅ Validates active state styling
- ✅ Ensures interaction feedback is consistent

### Requirement 1.3 - Harmonious Color Scheme
- ✅ Tests color harmony between sidebar, editor, and main content
- ✅ Validates component color integration
- ✅ Ensures visual consistency across the application

### Requirement 2.1 - Improved Text Selection
- ✅ Tests text selection background colors
- ✅ Validates selection contrast ratios
- ✅ Ensures theme-appropriate selection styling

### Requirement 2.2 - Interactive Element Highlighting
- ✅ Tests hover colors for interactive elements
- ✅ Validates highlight color consistency
- ✅ Ensures proper visual feedback

### Requirement 2.3 - Syntax Highlighting Integration
- ✅ Tests code block color integration
- ✅ Validates syntax highlighting theme consistency
- ✅ Ensures editor theme alignment

## Running Tests

### Individual Test Suites

```bash
# Run theme consistency tests
pnpm test test/components/theme-consistency.test.tsx

# Run interaction state tests  
pnpm test test/components/interaction-states.test.tsx

# Run color harmony tests
pnpm test test/components/color-harmony.test.tsx

# Run comprehensive theme tests
pnpm test test/components/comprehensive-theme.test.tsx

# Run visual regression tests
pnpm test:visual
```

### All Tests

```bash
# Run all unit tests
pnpm test

# Run all tests including visual regression
pnpm test && pnpm test:visual

# Run comprehensive test suite with reporting
npx tsx test/run-all-tests.ts
```

### Watch Mode

```bash
# Run tests in watch mode
pnpm test:watch

# Run visual tests with UI
pnpm test:visual:ui
```

## Test Configuration

### Vitest Configuration (`vitest.config.ts`)
- Configured with React plugin and jsdom environment
- Path aliases matching the main application
- Global test utilities and setup

### Playwright Configuration (`playwright.config.ts`)
- Configured for visual regression testing
- Multiple browser support (Chromium, WebKit)
- Automatic dev server startup

### Test Setup (`test/setup.ts`)
- React Testing Library configuration
- Mock implementations for browser APIs
- Global test utilities

## Visual Regression Testing

Visual regression tests capture screenshots of components in different states and themes:

- **Theme consistency** - Screenshots of components in light/dark themes
- **Interaction states** - Screenshots of hover, focus, and active states
- **Color harmony** - Overall application color scheme validation
- **Transition smoothness** - Theme switching visual validation

Screenshots are stored in `test-results/` and compared against baseline images.

## Accessibility Testing

The test suite includes accessibility validation:

- Color contrast ratio testing
- Focus indicator visibility
- Keyboard navigation support
- Screen reader compatibility

## Continuous Integration

Tests are designed to run in CI environments:

- Deterministic visual regression testing
- Headless browser support
- Comprehensive error reporting
- Exit codes for build pipeline integration

## Troubleshooting

### Common Issues

1. **Visual regression test failures**
   - Update baseline screenshots: `pnpm test:visual --update-snapshots`
   - Check for theme transition timing issues

2. **Component rendering issues**
   - Verify theme provider setup in test utilities
   - Check for missing CSS custom properties

3. **Interaction test failures**
   - Ensure proper user event simulation
   - Verify component accessibility attributes

### Debug Mode

```bash
# Run tests with debug output
pnpm test --reporter=verbose

# Run visual tests with debug UI
pnpm test:visual:ui
```