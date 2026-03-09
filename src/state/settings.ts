import { createStore } from 'solid-js/store'
import { readJsonStorage, writeJsonStorage } from '@/lib/storage'

export type ThemeMode = 'light' | 'dark' | 'system'

export interface SettingsState {
  theme: ThemeMode
  autosaveEnabled: boolean
  autosaveInterval: number
  fontSize: number
  lineHeight: number
  shortcuts: {
    save: string
    newFile: string
    openFolder: string
  }
}

const STORAGE_KEY = 'onlywrite-settings'

const defaults: SettingsState = {
  theme: 'system',
  autosaveEnabled: true,
  autosaveInterval: 5,
  fontSize: 16,
  lineHeight: 1.8,
  shortcuts: {
    save: 'mod+s',
    newFile: 'mod+n',
    openFolder: 'mod+o',
  },
}

const stored = readJsonStorage<Partial<SettingsState>>(STORAGE_KEY, {})

const [settings, setSettings] = createStore<SettingsState>({
  ...defaults,
  ...stored,
  shortcuts: {
    ...defaults.shortcuts,
    ...stored.shortcuts,
  },
})

function persistSettings() {
  writeJsonStorage(STORAGE_KEY, settings)
}

export function resolveTheme(theme: ThemeMode) {
  if (theme !== 'system' || typeof window === 'undefined') return theme
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function applyTheme(theme: ThemeMode) {
  if (typeof document === 'undefined') return

  const resolved = resolveTheme(theme)
  const root = document.documentElement
  root.classList.toggle('dark', resolved === 'dark')
  root.classList.toggle('light', resolved !== 'dark')
}

export const settingsActions = {
  setTheme(theme: ThemeMode) {
    setSettings('theme', theme)
    persistSettings()
  },
  setAutosaveEnabled(enabled: boolean) {
    setSettings('autosaveEnabled', enabled)
    persistSettings()
  },
  setAutosaveInterval(seconds: number) {
    setSettings('autosaveInterval', seconds)
    persistSettings()
  },
  setFontSize(size: number) {
    setSettings('fontSize', size)
    persistSettings()
  },
  setLineHeight(lineHeight: number) {
    setSettings('lineHeight', lineHeight)
    persistSettings()
  },
  reset() {
    setSettings({ ...defaults })
    persistSettings()
  },
}

export { settings }
