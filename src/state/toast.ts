import { createStore } from 'solid-js/store'
import { createId } from '@/lib/utils'

export type ToastVariant = 'success' | 'error' | 'info'

export interface ToastItem {
  id: string
  message: string
  variant: ToastVariant
}

const [toastState, setToastState] = createStore<{ items: ToastItem[] }>({
  items: [],
})

function dismiss(id: string) {
  setToastState('items', (items) => items.filter((item) => item.id !== id))
}

function push(variant: ToastVariant, message: string, duration = 2800) {
  const id = createId('toast')
  setToastState('items', (items) => [...items, { id, message, variant }])

  window.setTimeout(() => {
    dismiss(id)
  }, duration)
}

export const toast = {
  success(message: string) {
    push('success', message)
  },
  error(message: string) {
    push('error', message, 3600)
  },
  info(message: string) {
    push('info', message)
  },
  dismiss,
}

export { toastState }
