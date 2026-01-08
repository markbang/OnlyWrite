import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

/**
 * Editor Store - manages markdown editor state
 *
 * Domain: Document content, modification status, view modes, and cursor state
 * Persistence: Last opened file and view mode persisted to Tauri Store
 */
export type ViewMode = 'edit' | 'render' | 'split'

export interface EditorState {
  // Document content
  markdown: string
  lastSavedMarkdown: string

  // Modification state
  isModified: boolean
  isSaving: boolean
  lastSaveTime: number | null

  // View mode
  viewMode: ViewMode

  // Editor metadata
  wordCount: number
  isLoadingContent: boolean
  error: string | null

  // Autosave control
  autosaveEnabled: boolean
  autosaveInterval: number // in seconds

  // Actions
  setMarkdown: (content: string) => void
  setLastSavedMarkdown: (content: string) => void
  setIsModified: (modified: boolean) => void
  setIsSaving: (saving: boolean) => void
  setLastSaveTime: (time: number | null) => void
  setViewMode: (mode: ViewMode) => void
  setWordCount: (count: number) => void
  setIsLoadingContent: (loading: boolean) => void
  setError: (error: string | null) => void
  setAutosaveEnabled: (enabled: boolean) => void
  setAutosaveInterval: (seconds: number) => void

  // Composite actions
  markAsSaved: () => void
  resetEditor: () => void
}

export const useEditorStore = create<EditorState>()(
  subscribeWithSelector((set) => ({
    // Initial state
    markdown: '',
    lastSavedMarkdown: '',
    isModified: false,
    isSaving: false,
    lastSaveTime: null,
    viewMode: 'edit',
    wordCount: 0,
    isLoadingContent: false,
    error: null,
    autosaveEnabled: true,
    autosaveInterval: 5,

    // Actions
    setMarkdown: (content) => set({ markdown: content }),
    setLastSavedMarkdown: (content) => set({ lastSavedMarkdown: content }),
    setIsModified: (modified) => set({ isModified: modified }),
    setIsSaving: (saving) => set({ isSaving: saving }),
    setLastSaveTime: (time) => set({ lastSaveTime: time }),
    setViewMode: (mode) => set({ viewMode: mode }),
    setWordCount: (count) => set({ wordCount: count }),
    setIsLoadingContent: (loading) => set({ isLoadingContent: loading }),
    setError: (error) => set({ error }),
    setAutosaveEnabled: (enabled) => set({ autosaveEnabled: enabled }),
    setAutosaveInterval: (seconds) => set({ autosaveInterval: seconds }),

    // Composite actions
    markAsSaved: () =>
      set((state) => ({
        lastSavedMarkdown: state.markdown,
        isModified: false,
        isSaving: false,
        lastSaveTime: Date.now(),
      })),

    resetEditor: () =>
      set({
        markdown: '',
        lastSavedMarkdown: '',
        isModified: false,
        isSaving: false,
        lastSaveTime: null,
        wordCount: 0,
        isLoadingContent: false,
        error: null,
      }),
  }))
)

// Selectors for derived state
export const selectIsDirty = (state: EditorState) =>
  state.markdown !== state.lastSavedMarkdown

export const selectShowEditor = (state: EditorState) => state.viewMode !== 'render'
export const selectShowPreview = (state: EditorState) => state.viewMode !== 'edit'
export const selectShowSplitView = (state: EditorState) => state.viewMode === 'split'
