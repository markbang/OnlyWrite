import '@testing-library/jest-dom/vitest'
import '@/styles.css'
import { afterEach, beforeAll, vi } from 'vitest'
import { cleanup } from '@solidjs/testing-library'
import { editorActions } from '@/state/editor'
import { applyTheme, settingsActions } from '@/state/settings'
import { workspaceActions } from '@/state/workspace'

beforeAll(() => {
  ;(globalThis as { __APP_VERSION__?: string }).__APP_VERSION__ = '0.2.0'

  if (!globalThis.ResizeObserver) {
    globalThis.ResizeObserver = class ResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
  }

  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })

  window.alert = vi.fn()
  window.confirm = vi.fn(() => true)
  window.prompt = vi.fn(() => null)
})

afterEach(() => {
  cleanup()
  editorActions.reset()
  workspaceActions.reset()
  settingsActions.reset()
  applyTheme('light')
  window.localStorage.clear()
  document.documentElement.lang = 'en'
  document.body.className = 'antialiased preload'
})
