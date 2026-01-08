import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

/**
 * UI Store - manages ephemeral UI state (modals, panels, toasts)
 *
 * Domain: UI components visibility and interaction state
 * Persistence: Not persisted (runtime-only state)
 */
export type ToastVariant = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  message: string
  variant: ToastVariant
  duration?: number
}

export interface UIState {
  // Modal/dialog state
  activeModal: 'settings' | 's3-config' | 'about' | null
  isCommandPaletteOpen: boolean
  isFileSheetOpen: boolean // Mobile file drawer

  // Panel state
  sidebarOpen: boolean
  inspectorOpen: boolean

  // Toast queue (managed by sonner, but we track queued toasts for coordination)
  queuedToasts: Toast[]

  // Actions
  setActiveModal: (modal: UIState['activeModal']) => void
  setCommandPaletteOpen: (open: boolean) => void
  setFileSheetOpen: (open: boolean) => void
  setSidebarOpen: (open: boolean) => void
  setInspectorOpen: (open: boolean) => void
  queueToast: (toast: Toast) => void
  removeQueuedToast: (id: string) => void

  // Keyboard shortcuts state
  shortcutsEnabled: boolean
  setShortcutsEnabled: (enabled: boolean) => void
}

export const useUIStore = create<UIState>()(
  subscribeWithSelector((set) => ({
    // Initial state
    activeModal: null,
    isCommandPaletteOpen: false,
    isFileSheetOpen: false,
    sidebarOpen: true,
    inspectorOpen: false,
    queuedToasts: [],
    shortcutsEnabled: true,

    // Actions
    setActiveModal: (modal) => set({ activeModal: modal }),
    setCommandPaletteOpen: (open) => set({ isCommandPaletteOpen: open }),
    setFileSheetOpen: (open) => set({ isFileSheetOpen: open }),
    setSidebarOpen: (open) => set({ sidebarOpen: open }),
    setInspectorOpen: (open) => set({ inspectorOpen: open }),
    setShortcutsEnabled: (enabled) => set({ shortcutsEnabled: enabled }),
    queueToast: (toast) =>
      set((state) => ({
        queuedToasts: [...state.queuedToasts, toast],
      })),
    removeQueuedToast: (id) =>
      set((state) => ({
        queuedToasts: state.queuedToasts.filter((t) => t.id !== id),
      })),
  }))
)
