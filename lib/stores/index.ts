/**
 * Stores Module
 *
 * This module exports all Zustand stores for the application.
 * Each store represents a domain of state:
 * - workspace: File system and navigation state
 * - editor: Document and editor state
 * - ui: Ephemeral UI state (modals, panels)
 * - settings: User preferences and app settings
 *
 * Architecture:
 * - Domain-based separation (no god store)
 * - Type-safe with TypeScript
 * - Selectors for derived state
 * - Tauri Store persistence for long-lived state
 * - Ephemeral state stays in-memory
 */

export { useWorkspaceStore, selectActiveFileName, selectFolderName, selectFileCount } from './workspace-store'
export { useEditorStore, selectIsDirty, selectShowEditor, selectShowPreview, selectShowSplitView } from './editor-store'
export { useUIStore } from './ui-store'
export { useSettingsStore, persistSettings } from './settings-store'

export type { WorkspaceState } from './workspace-store'
export type { EditorState, ViewMode } from './editor-store'
export type { UIState, Toast } from './ui-store'
export type { SettingsState } from './settings-store'
