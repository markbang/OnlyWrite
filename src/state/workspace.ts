import { createStore } from 'solid-js/store'
import { readJsonStorage, writeJsonStorage } from '@/lib/storage'
import { readDirectory } from '@/lib/tauri'
import { fileNameFromPath, folderNameFromPath, getErrorMessage } from '@/lib/utils'

export interface FileEntry {
  name: string
  isFile: boolean
}

export interface RecentFile {
  path: string
  name: string
  accessedAt: number
}

export interface WorkspaceState {
  folderPath: string | null
  selectedFilePath: string | null
  files: FileEntry[]
  isLoadingFiles: boolean
  fileError: string | null
  recentFiles: RecentFile[]
}

const STORAGE_KEY = 'onlywrite-workspace'

const persisted = readJsonStorage<
  Pick<WorkspaceState, 'folderPath' | 'selectedFilePath' | 'recentFiles'>
>(STORAGE_KEY, {
  folderPath: null,
  selectedFilePath: null,
  recentFiles: [],
})

const [workspace, setWorkspace] = createStore<WorkspaceState>({
  folderPath: persisted.folderPath,
  selectedFilePath: persisted.selectedFilePath,
  files: [],
  isLoadingFiles: false,
  fileError: null,
  recentFiles: persisted.recentFiles,
})

function persistWorkspace() {
  writeJsonStorage(STORAGE_KEY, {
    folderPath: workspace.folderPath,
    selectedFilePath: workspace.selectedFilePath,
    recentFiles: workspace.recentFiles,
  })
}

export const workspaceActions = {
  setFolderPath(path: string | null) {
    setWorkspace({
      folderPath: path,
      selectedFilePath: null,
      fileError: null,
      files: path === workspace.folderPath ? workspace.files : [],
    })
    persistWorkspace()
  },
  setSelectedFile(path: string | null) {
    setWorkspace('selectedFilePath', path)
    persistWorkspace()
  },
  setFiles(files: FileEntry[]) {
    setWorkspace('files', files)
  },
  setFileError(error: string | null) {
    setWorkspace('fileError', error)
  },
  setRecentFiles(files: RecentFile[]) {
    setWorkspace('recentFiles', files)
    persistWorkspace()
  },
  addRecentFile(path: string) {
    const name = fileNameFromPath(path) ?? path
    const nextFile: RecentFile = {
      path,
      name,
      accessedAt: Date.now(),
    }

    setWorkspace('recentFiles', (items) =>
      [nextFile, ...items.filter((item) => item.path !== path)].slice(0, 10)
    )
    persistWorkspace()
  },
  async loadFiles() {
    if (!workspace.folderPath) {
      setWorkspace({ files: [], isLoadingFiles: false, fileError: null })
      return
    }

    setWorkspace({ isLoadingFiles: true, fileError: null })

    try {
      const entries = await readDirectory(workspace.folderPath)
      const files = entries
        .map((entry) => ({
          name: entry.name ?? '',
          isFile: Boolean(entry.isFile),
        }))
        .filter((entry) => entry.name.length > 0)
        .sort((left, right) => {
          if (left.isFile !== right.isFile) {
            return left.isFile ? 1 : -1
          }
          return left.name.localeCompare(right.name)
        })

      setWorkspace({ files, isLoadingFiles: false, fileError: null })
    } catch (error) {
      setWorkspace({
        isLoadingFiles: false,
        fileError: getErrorMessage(error),
      })
    }
  },
  reset() {
    setWorkspace({
      folderPath: null,
      selectedFilePath: null,
      files: [],
      isLoadingFiles: false,
      fileError: null,
      recentFiles: [],
    })
    persistWorkspace()
  },
}

export function selectActiveFileName() {
  return fileNameFromPath(workspace.selectedFilePath)
}

export function selectFolderName() {
  return folderNameFromPath(workspace.folderPath)
}

export function selectFileCount() {
  return workspace.files.filter((file) => file.isFile).length
}

export { workspace }
