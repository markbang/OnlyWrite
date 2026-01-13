import { invoke } from '@tauri-apps/api/core'
import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

export interface SettingsData {
  theme: 'light' | 'dark' | 'system'
  locale: string
  fontSize: number
  lineHeight: number
  tabWidth: number
  showLineNumbers: boolean
  wordWrap: boolean
  spellCheck: boolean
  autosaveEnabled: boolean
  autosaveInterval: number
  shortcuts: {
    save: string
    newFile: string
    openFile: string
    toggleSidebar: string
    toggleCommandPalette: string
  }
  rememberWindowSize: boolean
  showMinimap: boolean
}

export interface SettingsState extends SettingsData {
  setTheme: (theme: SettingsData['theme']) => void
  setLocale: (locale: string) => void
  setFontSize: (size: number) => void
  setLineHeight: (height: number) => void
  setTabWidth: (width: number) => void
  setShowLineNumbers: (show: boolean) => void
  setWordWrap: (wrap: boolean) => void
  setSpellCheck: (check: boolean) => void
  setAutosaveEnabled: (enabled: boolean) => void
  setAutosaveInterval: (seconds: number) => void
  setShortcuts: (newShortcuts: Partial<SettingsData['shortcuts']>) => void
  setRememberWindowSize: (remember: boolean) => void
  setShowMinimap: (show: boolean) => void
  loadSettings: () => Promise<void>
  saveSettings: () => Promise<void>
  resetSettings: () => void
}

const defaultSettingsData: SettingsData = {
  theme: 'system',
  locale: 'en',
  fontSize: 16,
  lineHeight: 1.6,
  tabWidth: 4,
  showLineNumbers: false,
  wordWrap: true,
  spellCheck: false,
  autosaveEnabled: true,
  autosaveInterval: 5,
  shortcuts: {
    save: 'mod+s',
    newFile: 'mod+n',
    openFile: 'mod+o',
    toggleSidebar: 'mod+b',
    toggleCommandPalette: 'mod+shift+p',
  },
  rememberWindowSize: true,
  showMinimap: false,
}

export const useSettingsStore = create<SettingsState>()(
  subscribeWithSelector((set, get) => ({
    ...defaultSettingsData,

    setTheme: (theme) => set({ theme }),
    setLocale: (locale) => set({ locale }),
    setFontSize: (size) => set({ fontSize: size }),
    setLineHeight: (height) => set({ lineHeight: height }),
    setTabWidth: (width) => set({ tabWidth: width }),
    setShowLineNumbers: (show) => set({ showLineNumbers: show }),
    setWordWrap: (wrap) => set({ wordWrap: wrap }),
    setSpellCheck: (check) => set({ spellCheck: check }),
    setAutosaveEnabled: (enabled) => set({ autosaveEnabled: enabled }),
    setAutosaveInterval: (seconds) => set({ autosaveInterval: seconds }),
    setShortcuts: (newShortcuts) =>
      set((state) => ({
        shortcuts: { ...state.shortcuts, ...newShortcuts },
      })),
    setRememberWindowSize: (remember) => set({ rememberWindowSize: remember }),
    setShowMinimap: (show) => set({ showMinimap: show }),
    resetSettings: () => set({ ...defaultSettingsData }),

    loadSettings: async () => {
      if (typeof window === 'undefined') return

      try {
        const stored = await invoke<Partial<SettingsData> | null>('get_settings')

        if (stored) {
          set({ ...defaultSettingsData, ...stored })
        }

        if (stored?.theme) {
          const root = document.documentElement
          const isDark = stored.theme === 'dark' || (stored.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
          root.classList.toggle('dark', isDark)
          root.classList.toggle('light', !isDark)
        }
      } catch (error) {
        console.error('Failed to load settings:', error)
      }
    },

    saveSettings: async () => {
      try {
        const state = get()

        const persistable: SettingsData = {
          theme: state.theme,
          locale: state.locale,
          fontSize: state.fontSize,
          lineHeight: state.lineHeight,
          tabWidth: state.tabWidth,
          showLineNumbers: state.showLineNumbers,
          wordWrap: state.wordWrap,
          spellCheck: state.spellCheck,
          autosaveEnabled: state.autosaveEnabled,
          autosaveInterval: state.autosaveInterval,
          shortcuts: state.shortcuts,
          rememberWindowSize: state.rememberWindowSize,
          showMinimap: state.showMinimap,
        }

        await invoke('save_settings', { settings: persistable })
      } catch (error) {
        console.error('Failed to save settings:', error)
      }
    },
  }))
);

let saveTimeout: NodeJS.Timeout | null = null
export const persistSettings = () => {
  if (saveTimeout) clearTimeout(saveTimeout)
  saveTimeout = setTimeout(() => {
    useSettingsStore.getState().saveSettings()
  }, 500)
}

if (typeof window !== 'undefined') {
  useSettingsStore.getState().loadSettings()
}
