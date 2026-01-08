import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

/**
 * Workspace Store - manages file system and workspace state
 *
 * Domain: File system navigation, selection, and workspace metadata
 * Persistence: Partial state persisted to Tauri Store
 */
export interface WorkspaceState {
  // Workspace paths
  folderPath: string | null
  selectedFilePath: string | null

  // File list state
  files: Array<{
    name: string
    isFile: boolean
  }>
  isLoadingFiles: boolean
  fileError: string | null

  // Recent files (for dashboard/history)
  recentFiles: Array<{
    path: string
    name: string
    accessedAt: number
  }>

  // Actions
  setFolderPath: (path: string | null) => void
  setSelectedFile: (path: string | null) => void
  setFiles: (files: WorkspaceState['files']) => void
  setIsLoadingFiles: (loading: boolean) => void
  setFileError: (error: string | null) => void
  addRecentFile: (file: WorkspaceState['recentFiles'][0]) => void
  clearRecentFiles: () => void
}

export const useWorkspaceStore = create<WorkspaceState>()(
  subscribeWithSelector((set) => ({
    // Initial state
    folderPath: null,
    selectedFilePath: null,
    files: [],
    isLoadingFiles: false,
    fileError: null,
    recentFiles: [],

    // Actions
    setFolderPath: (path) => set({ folderPath: path }),
    setSelectedFile: (path) => set({ selectedFilePath: path }),
    setFiles: (files) => set({ files }),
    setIsLoadingFiles: (loading) => set({ isLoadingFiles: loading }),
    setFileError: (error) => set({ fileError: error }),
    addRecentFile: (file) => set((state) => {
      // Remove existing entry if present, add to front, keep last 10
      const filtered = state.recentFiles.filter((f) => f.path !== file.path)
      const updated = [{ ...file, accessedAt: Date.now() }, ...filtered].slice(0, 10)
      return { recentFiles: updated }
    }),
    clearRecentFiles: () => set({ recentFiles: [] }),
  }))
)

// Selectors for derived state
export const selectActiveFileName = (state: WorkspaceState) => {
  if (!state.selectedFilePath) return null
  const parts = state.selectedFilePath.split(/[\\/]/)
  return parts[parts.length - 1] || state.selectedFilePath
}

export const selectFolderName = (state: WorkspaceState) => {
  if (!state.folderPath) return null
  const parts = state.folderPath.split(/[\\/]/)
  return parts[parts.length - 1] || state.folderPath
}

export const selectFileCount = (state: WorkspaceState) =>
  state.files.filter((f) => f.isFile).length
