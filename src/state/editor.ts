import { createStore } from 'solid-js/store'
import { countWords } from '@/lib/utils'

export type ViewMode = 'edit' | 'render' | 'split'

export interface EditorState {
  markdown: string
  lastSavedMarkdown: string
  isModified: boolean
  isSaving: boolean
  lastSaveTime: number | null
  viewMode: ViewMode
  wordCount: number
  isLoadingContent: boolean
  error: string | null
}

const [editor, setEditor] = createStore<EditorState>({
  markdown: '',
  lastSavedMarkdown: '',
  isModified: false,
  isSaving: false,
  lastSaveTime: null,
  viewMode: 'edit',
  wordCount: 0,
  isLoadingContent: false,
  error: null,
})

export const editorActions = {
  updateMarkdown(content: string) {
    setEditor({
      markdown: content,
      isModified: content !== editor.lastSavedMarkdown,
      wordCount: countWords(content),
    })
  },
  loadMarkdown(content: string) {
    setEditor({
      markdown: content,
      lastSavedMarkdown: content,
      isModified: false,
      isSaving: false,
      lastSaveTime: Date.now(),
      wordCount: countWords(content),
      isLoadingContent: false,
      error: null,
    })
  },
  markAsSaved(content = editor.markdown) {
    setEditor({
      markdown: content,
      lastSavedMarkdown: content,
      isModified: false,
      isSaving: false,
      lastSaveTime: Date.now(),
      wordCount: countWords(content),
      error: null,
    })
  },
  setSaving(saving: boolean) {
    setEditor('isSaving', saving)
  },
  setLoading(loading: boolean) {
    setEditor('isLoadingContent', loading)
  },
  setError(error: string | null) {
    setEditor('error', error)
  },
  setViewMode(viewMode: ViewMode) {
    setEditor('viewMode', viewMode)
  },
  reset() {
    setEditor({
      markdown: '',
      lastSavedMarkdown: '',
      isModified: false,
      isSaving: false,
      lastSaveTime: null,
      wordCount: 0,
      isLoadingContent: false,
      error: null,
    })
  },
}

export function showEditor() {
  return editor.viewMode !== 'render'
}

export function showPreview() {
  return editor.viewMode !== 'edit'
}

export { editor }
