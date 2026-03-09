import { Show, createMemo, createResource, createSignal } from 'solid-js'
import { FolderOpen, Sparkles } from 'lucide-solid'
import { FileBrowser } from '@/components/file-browser'
import { useI18n } from '@/components/i18n-provider'
import { LanguageToggle } from '@/components/language-toggle'
import { ThemeToggle } from '@/components/theme-toggle'
import { WritingArea } from '@/components/writing-area'
import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import {
  checkForAppUpdates,
  getAppVersion,
  openDirectoryPicker,
} from '@/lib/tauri'
import { getErrorMessage } from '@/lib/utils'
import { settings } from '@/state/settings'
import { toast } from '@/state/toast'
import { selectActiveFileName, selectFolderName, workspace, workspaceActions } from '@/state/workspace'

export default function HomePage() {
  const { t } = useI18n()
  const [isCheckingUpdate, setIsCheckingUpdate] = createSignal(false)
  const [sidebarWidth, setSidebarWidth] = createSignal(22)
  let splitContainerRef: HTMLDivElement | undefined

  const [appVersion] = createResource(getAppVersion)
  const folderName = createMemo(() => selectFolderName())
  const fileName = createMemo(() => selectActiveFileName())

  const handleFolderSelect = async () => {
    try {
      const result = await openDirectoryPicker()
      if (!result) return

      workspaceActions.setFolderPath(result)
      await workspaceActions.loadFiles()
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  const handleCheckUpdates = async () => {
    setIsCheckingUpdate(true)
    try {
      await checkForAppUpdates(true)
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setIsCheckingUpdate(false)
    }
  }

  const startResize = (event: PointerEvent) => {
    const container = splitContainerRef
    if (!container) return

    const handleMove = (moveEvent: PointerEvent) => {
      const rect = container.getBoundingClientRect()
      const percent = ((moveEvent.clientX - rect.left) / rect.width) * 100
      setSidebarWidth(Math.max(18, Math.min(35, percent)))
    }

    const stopResize = () => {
      window.removeEventListener('pointermove', handleMove)
      window.removeEventListener('pointerup', stopResize)
    }

    window.addEventListener('pointermove', handleMove)
    window.addEventListener('pointerup', stopResize)
    event.preventDefault()
  }

  return (
    <div class="flex min-h-svh flex-col bg-background">
      <div class="fixed left-0 right-0 top-0 z-50 px-4 pt-4 sm:px-6">
        <Card class="mx-auto max-w-7xl border-x-0 border-b border-t-0 bg-background">
          <CardContent class="flex items-center justify-between gap-3 px-4 py-3">
            <div class="flex min-w-0 items-center spacing-md">
              <img src="/app-icon.svg" alt="OnlyWrite app icon" width="32" height="32" />
              <div class="min-w-0">
                <h1 class="text-lg font-display font-bold tracking-tight text-foreground">OnlyWrite</h1>
                <p class="text-xs font-medium text-muted-foreground">{t('app.subtitle')}</p>
              </div>
            </div>

            <div class="hidden min-w-0 items-center gap-2 md:flex">
              <Show when={folderName()}>
                <Badge class="max-w-[180px] truncate">
                  <FolderOpen class="size-3" />
                  {folderName()}
                </Badge>
              </Show>
              <Show when={fileName()}>
                <Badge class="max-w-[180px] truncate">{fileName()}</Badge>
              </Show>
            </div>

            <div class="flex items-center gap-1 sm:gap-2">
              <Show when={workspace.folderPath}>
                <Button variant="outline" size="sm" onClick={() => void handleFolderSelect()}>
                  <FolderOpen class="size-4" />
                  <span class="hidden sm:inline">{t('actions.switchFolder')}</span>
                </Button>
              </Show>

              <LanguageToggle />
              <ThemeToggle />

              <Button
                variant="outline"
                size="sm"
                onClick={() => void handleCheckUpdates()}
                disabled={isCheckingUpdate()}
              >
                {isCheckingUpdate() ? t('actions.checking') : t('actions.checkUpdates')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div class="flex flex-1 overflow-hidden pb-20 pt-24">
        <Show
          when={workspace.folderPath}
          fallback={
            <div class="flex flex-1 items-center justify-center px-4 sm:px-6">
              <div class="w-full max-w-5xl gap-8 p-6">
                <div class="mb-12 flex items-center gap-4">
                  <div class="h-[8px] flex-1 bg-foreground" />
                  <div class="border-2 border-foreground p-1">
                    <div class="h-4 w-4 bg-foreground" />
                  </div>
                  <div class="h-[8px] flex-1 bg-foreground" />
                </div>

                <h2 class="mb-16 text-[5rem] font-display font-bold leading-none tracking-tighter md:text-[9rem]">
                  WRITE
                </h2>

                <div class="grid gap-8 md:grid-cols-[1.2fr_1fr]">
                  <Card class="border border-foreground bg-card p-8">
                    <CardHeader>
                      <CardTitle class="flex items-center gap-2 text-2xl font-display tracking-tight">
                        <Sparkles class="size-5 text-foreground" />
                        {t('app.welcomeTitle')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent class="space-y-6">
                      <Button onClick={() => void handleFolderSelect()} class="w-full">
                        <FolderOpen class="size-5" />
                        {t('actions.selectFolder')}
                      </Button>

                      <div class="space-y-2">
                        <div class="flex items-center gap-2 text-sm text-muted-foreground">
                          <span class="inline-flex h-1.5 w-1.5 bg-foreground" />
                          {t('status.shortcutSave')}
                        </div>
                        <div class="flex items-center gap-2 text-sm text-muted-foreground">
                          <span class="inline-flex h-1.5 w-1.5 bg-foreground" />
                          {t('status.viewModes')}
                        </div>
                        <div class="flex items-center gap-2 text-sm text-muted-foreground">
                          <span class="inline-flex h-1.5 w-1.5 bg-foreground" />
                          {t('status.restoreHint')}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card class="border border-foreground bg-card p-8">
                    <CardHeader>
                      <CardTitle class="text-2xl font-display tracking-tight">
                        {t('app.efficiencyTitle')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent class="space-y-6 text-sm font-body">
                      <div class="flex gap-3">
                        <div class="flex h-8 w-8 shrink-0 items-center justify-center border border-foreground text-foreground">
                          <FolderOpen class="size-4" />
                        </div>
                        <div>
                          <p class="font-medium text-foreground">{t('app.efficiencyScanTitle')}</p>
                          <p class="text-muted-foreground">{t('app.efficiencyScanBody')}</p>
                        </div>
                      </div>
                      <div class="flex gap-3">
                        <div class="flex h-8 w-8 shrink-0 items-center justify-center border border-foreground text-foreground">
                          <Sparkles class="size-4" />
                        </div>
                        <div>
                          <p class="font-medium text-foreground">{t('app.efficiencySafeTitle')}</p>
                          <p class="text-muted-foreground">{t('app.efficiencySafeBody')}</p>
                        </div>
                      </div>
                      <div class="flex gap-3">
                        <div class="flex h-8 w-8 shrink-0 items-center justify-center border border-foreground text-foreground">
                          <FolderOpen class="size-4" />
                        </div>
                        <div>
                          <p class="font-medium text-foreground">{t('app.efficiencyCrossTitle')}</p>
                          <p class="text-muted-foreground">{t('app.efficiencyCrossBody')}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          }
        >
          <div class="flex flex-1 px-4 sm:px-6">
            <div
              ref={splitContainerRef}
              class="mx-auto hidden w-full max-w-7xl flex-1 gap-2 md:flex"
            >
              <div class="min-w-0" style={{ width: `${sidebarWidth()}%` }}>
                <FileBrowser />
              </div>
              <button
                class="splitter-handle w-2 cursor-col-resize bg-foreground/40 transition-colors duration-100 hover:bg-foreground"
                onPointerDown={startResize}
                aria-label="Resize sidebar"
              />
              <div class="min-w-0 flex-1">
                <WritingArea />
              </div>
            </div>

            <div class="flex flex-1 flex-col gap-4 md:hidden">
              <FileBrowser />
              <div class="min-h-[60vh]">
                <WritingArea />
              </div>
            </div>
          </div>
        </Show>
      </div>

      <Card class="fixed bottom-0 left-0 right-0 z-50 border-x-0 border-b-0 border-t bg-background">
        <CardContent class="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-2.5 text-xs sm:px-6">
          <div class="flex items-center gap-3 text-muted-foreground">
            <span class="font-medium">{t('status.year', { year: new Date().getFullYear() })}</span>
            <span class="hidden sm:inline">•</span>
            <span class="hidden sm:inline">
              {settings.autosaveEnabled ? t('editor.autosave') : t('editor.autosaveOff')}
            </span>
          </div>
          <div class="flex items-center gap-2 text-muted-foreground">
            <span class="font-medium">
              {t('status.version')} {appVersion() ?? __APP_VERSION__}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
