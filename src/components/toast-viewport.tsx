import { For } from 'solid-js'
import { cn } from '@/lib/utils'
import { toast, toastState } from '@/state/toast'

const toneClass = {
  success: 'border-foreground bg-background text-foreground',
  error: 'border-destructive bg-background text-destructive',
  info: 'border-foreground bg-muted text-foreground',
}

export function ToastViewport() {
  return (
    <div class="pointer-events-none fixed right-4 top-4 z-[100] flex max-w-sm flex-col gap-2">
      <For each={toastState.items}>
        {(item) => (
          <div
            role="status"
            aria-live="polite"
            class={cn(
              'pointer-events-auto flex items-start justify-between gap-3 border px-4 py-3 text-sm font-medium shadow-none',
              toneClass[item.variant]
            )}
          >
            <span>{item.message}</span>
            <button
              class="text-xs uppercase tracking-wide text-muted-foreground hover:text-foreground"
              onClick={() => toast.dismiss(item.id)}
            >
              ×
            </button>
          </div>
        )}
      </For>
    </div>
  )
}
