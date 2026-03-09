import { getErrorMessage } from '@/lib/utils'

export type DialogFilter = {
  name: string
  extensions: string[]
}

export type DirEntry = {
  name?: string
  isFile?: boolean
  isDirectory?: boolean
}

const desktopOnlyMessage = 'This feature is only available in the Tauri desktop app.'

export function isTauri() {
  return (
    typeof window !== 'undefined' &&
    ('__TAURI_INTERNALS__' in window || '__TAURI__' in window)
  )
}

export function getDesktopOnlyMessage() {
  return desktopOnlyMessage
}

export async function invokeCommand<T>(
  command: string,
  args?: Record<string, unknown>
) {
  if (!isTauri()) {
    throw new Error(desktopOnlyMessage)
  }

  const { invoke } = await import('@tauri-apps/api/core')
  return invoke<T>(command, args)
}

export async function showMessage(message: string, title = 'OnlyWrite') {
  if (isTauri()) {
    const { message: showNativeMessage } = await import('@tauri-apps/plugin-dialog')
    await showNativeMessage(message, {
      title,
      kind: 'info',
      okLabel: 'OK',
    })
    return
  }

  window.alert(message)
}

export async function showConfirm(message: string, title = 'OnlyWrite') {
  if (isTauri()) {
    const { confirm } = await import('@tauri-apps/plugin-dialog')
    return confirm(message, {
      title,
      okLabel: 'OK',
      cancelLabel: 'Cancel',
    })
  }

  return window.confirm(message)
}

export async function openDirectoryPicker() {
  if (!isTauri()) {
    throw new Error(desktopOnlyMessage)
  }

  const { open } = await import('@tauri-apps/plugin-dialog')
  const result = await open({
    directory: true,
    multiple: false,
  })

  return typeof result === 'string' ? result : null
}

export async function openFilePicker(filters?: DialogFilter[]) {
  if (!isTauri()) {
    throw new Error(desktopOnlyMessage)
  }

  const { open } = await import('@tauri-apps/plugin-dialog')
  const result = await open({
    directory: false,
    multiple: false,
    filters,
  })

  return typeof result === 'string' ? result : null
}

export async function saveFilePicker(options?: {
  defaultPath?: string
  filters?: DialogFilter[]
}) {
  if (!isTauri()) {
    throw new Error(desktopOnlyMessage)
  }

  const { save } = await import('@tauri-apps/plugin-dialog')
  const result = await save({
    defaultPath: options?.defaultPath,
    filters: options?.filters,
  })

  return typeof result === 'string' ? result : null
}

export async function readDirectory(path: string) {
  const { readDir } = await import('@tauri-apps/plugin-fs')
  return readDir(path) as Promise<DirEntry[]>
}

export async function readText(path: string) {
  const { readTextFile } = await import('@tauri-apps/plugin-fs')
  return readTextFile(path)
}

export async function writeText(path: string, content: string) {
  const { writeTextFile } = await import('@tauri-apps/plugin-fs')
  return writeTextFile(path, content)
}

export async function readBinary(path: string) {
  const { readFile } = await import('@tauri-apps/plugin-fs')
  return readFile(path)
}

export async function writeBinary(path: string, content: Uint8Array) {
  const { writeFile } = await import('@tauri-apps/plugin-fs')
  return writeFile(path, content)
}

export async function ensureDirectory(path: string) {
  const { mkdir } = await import('@tauri-apps/plugin-fs')
  return mkdir(path, { recursive: true })
}

export async function joinPaths(...paths: string[]) {
  const { join } = await import('@tauri-apps/api/path')
  return join(...paths)
}

export async function getAppVersion() {
  if (isTauri()) {
    const { getVersion } = await import('@tauri-apps/api/app')
    return getVersion()
  }

  return __APP_VERSION__
}

export async function checkForAppUpdates(onUserClick: boolean) {
  if (!isTauri()) {
    if (onUserClick) {
      await showMessage(desktopOnlyMessage)
    }
    return false
  }

  try {
    const [{ check }, { ask, message }, { relaunch }] = await Promise.all([
      import('@tauri-apps/plugin-updater'),
      import('@tauri-apps/plugin-dialog'),
      import('@tauri-apps/plugin-process'),
    ])

    const update = await check()

    if (!update) {
      if (onUserClick) {
        await message('You are already on the latest version.', {
          title: 'OnlyWrite',
          kind: 'info',
          okLabel: 'OK',
        })
      }
      return false
    }

    const shouldInstall = await ask(
      `Update ${update.version} is available. Install it now?`,
      {
        title: 'OnlyWrite',
        kind: 'info',
        okLabel: 'Install',
        cancelLabel: 'Later',
      }
    )

    if (!shouldInstall) return false

    await update.downloadAndInstall()
    await relaunch()
    return true
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}
