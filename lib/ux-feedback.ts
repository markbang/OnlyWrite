import { toast } from 'sonner'
import { save, open, message, confirm } from '@tauri-apps/plugin-dialog'

/**
 * UX Feedback Utility
 *
 * Provides consistent desktop-friendly user feedback mechanisms
 * - Replaces browser alert/prompt/confirm with native dialogs
 * - Uses Sonner toast notifications for non-blocking feedback
 */

export class UXFeedback {
  static success(msg: string) {
    toast.success(msg)
  }

  static error(msg: string) {
    toast.error(msg)
  }

  static warning(msg: string) {
    toast.warning(msg)
  }

  static info(msg: string) {
    toast.info(msg)
  }

  static async showSaveDialog(options?: {
    defaultPath?: string
    filters?: Array<{ name: string; extensions: string[] }>
  }): Promise<string | null> {
    try {
      const result = await save({
        defaultPath: options?.defaultPath,
        filters: options?.filters || [
          {
            name: 'Markdown',
            extensions: ['md'],
          },
        ],
      })

      if (typeof result === 'string') {
        return result
      }

      return null
    } catch (error) {
      console.error('Failed to show save dialog:', error)
      this.error('Failed to open save dialog')
      return null
    }
  }

  static async showOpenDialog(options?: {
    directory?: boolean
    multiple?: boolean
    filters?: Array<{ name: string; extensions: string[] }>
  }): Promise<string | string[] | null> {
    try {
      const result = await open({
        directory: options?.directory || false,
        multiple: options?.multiple || false,
        filters: options?.filters,
      })

      if (typeof result === 'string' || Array.isArray(result)) {
        return result
      }

      return null
    } catch (error) {
      console.error('Failed to show open dialog:', error)
      this.error('Failed to open dialog')
      return null
    }
  }

  static async showConfirm(options: {
    title: string
    message?: string
    okLabel?: string
    cancelLabel?: string
  }): Promise<boolean> {
    try {
      const confirmed = await confirm(options.title, {
        type: 'warning',
        okLabel: options?.okLabel || 'OK',
        cancelLabel: options?.cancelLabel || 'Cancel',
      })

      return confirmed
    } catch (error) {
      console.error('Failed to show confirm dialog:', error)
      return false
    }
  }

  static async showMessage(options: {
    title: string
    message: string
  }): Promise<void> {
    try {
      await message(options.title, {
        type: 'info',
        okLabel: 'OK',
      })
    } catch (error) {
      console.error('Failed to show message dialog:', error)
    }
  }

  static handleError(error: unknown, context?: string): void {
    console.error(context ? `${context}:` : 'Error:', error)

    const message = error instanceof Error ? error.message : 'An error occurred'
    this.error(message)
  }

  static error(msg: string) {
    toast.error(msg)
  }
}
