import { For, Show, createEffect } from 'solid-js'
import { FileText, FolderClosed, FolderOpen, Plus, RefreshCw } from 'lucide-solid'
import { useI18n } from '@/components/i18n-provider'
import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { joinPaths, saveFilePicker, writeText } from '@/lib/tauri'
import { getErrorMessage } from '@/lib/utils'
import {
  selectActiveFileName,
  selectFileCount,
  selectFolderName,
  workspace,
  workspaceActions,
} from '@/state/workspace'
import { toast } from '@/state/toast'

export function FileBrowser() {
  const { t } = useI18n()

  createEffect(() => {
    if (!workspace.folderPath) {
      workspaceActions.setFiles([])
      return
    }

    void workspaceActions.loadFiles()
  })

  const handleSelectFile = async (name: string, isFile: boolean) => {
    if (!workspace.folderPath || !isFile) return

    try {
      const path = await joinPaths(workspace.folderPath, name)
      workspaceActions.setSelectedFile(path)
      workspaceActions.addRecentFile(path)
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  const handleCreateFile = async () => {
    if (!workspace.folderPath) return

    try {
      const defaultPath = await joinPaths(workspace.folderPath, 'untitled.md')
      const filePath = await saveFilePicker({
        defaultPath,
        filters: [
          {
            name: 'Markdown',
            extensions: ['md'],
          },
        ],
      })

      if (!filePath) return

      const fileName = filePath.split(/[\\/]/).pop() ?? 'untitled.md'
      await writeText(
        filePath,
        `# ${fileName.replace(/\.md$/i, '')}\n\n${t('file.newFileContent')}\n`
      )
      workspaceActions.setSelectedFile(filePath)
      workspaceActions.addRecentFile(filePath)
      await workspaceActions.loadFiles()
      toast.success(t('file.created'))
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  return (
    <Card class="flex h-full min-h-[320px] flex-col overflow-hidden bg-card">
      <CardHeader class="border-b border-foreground bg-background pb-4">
        <div class="flex items-center justify-between gap-3">
          <div class="min-w-0">
            <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {t('file.folderLabel')}
            </p>
            <CardTitle class="truncate text-sm font-semibold">
              {selectFolderName() ?? t('file.noFolder')}
            </CardTitle>
          </div>
          <div class="flex items-center gap-2">
            <Show when={workspace.folderPath}>
              <Badge>{t('file.filesCount', { count: selectFileCount() })}</Badge>
              <Button variant="outline" size="sm" onClick={() => void workspaceActions.loadFiles()}>
                <RefreshCw class="size-3.5" />
                {t('actions.refresh')}
              </Button>
              <Button variant="outline" size="sm" onClick={() => void handleCreateFile()}>
                <Plus class="size-3.5" />
                {t('file.newFile')}
              </Button>
            </Show>
          </div>
        </div>
      </CardHeader>

      <CardContent class="min-h-0 flex-1 overflow-auto p-2.5">
        <Show
          when={!workspace.isLoadingFiles}
          fallback={
            <div class="flex items-center justify-center py-12 text-sm text-muted-foreground">
              <RefreshCw class="mr-2 size-5 animate-spin" />
              {t('file.loading')}
            </div>
          }
        >
          <Show
            when={!workspace.fileError}
            fallback={
              <div class="flex flex-col items-center justify-center gap-3 py-12 text-center">
                <FolderOpen class="size-8 text-destructive" />
                <p class="text-sm text-destructive">{workspace.fileError}</p>
                <Button variant="outline" size="sm" onClick={() => void workspaceActions.loadFiles()}>
                  {t('file.retry')}
                </Button>
              </div>
            }
          >
            <Show
              when={workspace.folderPath}
              fallback={
                <div class="flex flex-col items-center justify-center gap-3 py-12 text-center text-sm text-muted-foreground">
                  <FolderClosed class="size-8" />
                  <p>{t('file.chooseFolder')}</p>
                </div>
              }
            >
              <Show
                when={workspace.files.length > 0}
                fallback={
                  <div class="flex flex-col items-center justify-center gap-3 py-12 text-center text-sm text-muted-foreground">
                    <FolderOpen class="size-8" />
                    <p>{t('file.emptyFolder')}</p>
                  </div>
                }
              >
                <div class="flex flex-col gap-1">
                  <For each={workspace.files}>
                    {(entry) => {
                      const isActive = entry.isFile && entry.name === selectActiveFileName()
                      return (
                        <button
                          class={`file-list-item flex w-full items-center gap-2.5 border px-3 py-2.5 text-left text-sm transition-colors duration-100 ${
                            isActive
                              ? 'border-foreground bg-foreground text-background'
                              : 'border-transparent bg-transparent text-foreground hover:border-foreground hover:bg-foreground hover:text-background'
                          } ${entry.isFile ? '' : 'cursor-not-allowed opacity-50'}`}
                          disabled={!entry.isFile}
                          onClick={() => void handleSelectFile(entry.name, entry.isFile)}
                        >
                          {entry.isFile ? (
                            <FileText class="size-4" />
                          ) : (
                            <FolderOpen class="size-4" />
                          )}
                          <span class="truncate font-medium">{entry.name}</span>
                        </button>
                      )
                    }}
                  </For>
                </div>
              </Show>
            </Show>
          </Show>
        </Show>
      </CardContent>
    </Card>
  )
}
