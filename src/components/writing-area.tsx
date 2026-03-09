import {
  Show,
  createEffect,
  createMemo,
  createResource,
  createSignal,
  onCleanup,
} from 'solid-js'
import {
  Columns2,
  Eye,
  Heading2,
  ImagePlus,
  Link2,
  MessageSquareQuote,
  RefreshCw,
  Save,
  Settings,
  Type,
  WholeWord,
} from 'lucide-solid'
import { useI18n } from '@/components/i18n-provider'
import { S3ConfigDialog } from '@/components/s3-config-dialog'
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Textarea,
} from '@/components/ui'
import { renderMarkdown } from '@/lib/markdown'
import { loadS3Config, uploadImageToS3 } from '@/lib/s3'
import {
  ensureDirectory,
  getDesktopOnlyMessage,
  joinPaths,
  openFilePicker,
  readBinary,
  readText,
  saveFilePicker,
  writeBinary,
  writeText,
} from '@/lib/tauri'
import { fileNameFromPath, getErrorMessage } from '@/lib/utils'
import { editor, editorActions, showEditor, showPreview, type ViewMode } from '@/state/editor'
import { settings } from '@/state/settings'
import { toast } from '@/state/toast'
import { workspace, workspaceActions } from '@/state/workspace'

const imageFilters = [
  {
    name: 'Images',
    extensions: ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'],
  },
]

export function WritingArea() {
  const { t } = useI18n()
  const [isS3DialogOpen, setIsS3DialogOpen] = createSignal(false)
  const [s3Config, { refetch: refetchS3Config }] = createResource(async () => {
    try {
      return await loadS3Config()
    } catch {
      return null
    }
  })
  let textareaRef: HTMLTextAreaElement | undefined

  createEffect(() => {
    const path = workspace.selectedFilePath

    void (async () => {
      if (!path) {
        editorActions.reset()
        return
      }

      editorActions.setLoading(true)
      editorActions.setError(null)

      try {
        const content = await readText(path)
        editorActions.loadMarkdown(content)
        workspaceActions.addRecentFile(path)
      } catch (error) {
        editorActions.setLoading(false)
        editorActions.setError(getErrorMessage(error))
        toast.error(t('editor.loadFailed'))
      }
    })()
  })

  createEffect(() => {
    if (!settings.autosaveEnabled || !workspace.selectedFilePath || !editor.isModified) {
      return
    }

    const timeout = window.setTimeout(() => {
      void handleSave(false)
    }, settings.autosaveInterval * 1000)

    onCleanup(() => window.clearTimeout(timeout))
  })

  createEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
        event.preventDefault()
        void handleSave()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    onCleanup(() => window.removeEventListener('keydown', handleKeyDown))
  })

  const previewSource = createMemo(() =>
    editor.markdown.trim().length > 0 ? editor.markdown : t('editor.previewEmpty')
  )
  const previewHtml = createMemo(() => renderMarkdown(previewSource()))
  const currentFileName = createMemo(
    () => fileNameFromPath(workspace.selectedFilePath) ?? t('editor.untitled')
  )

  function replaceSelection(
    builder: (selected: string) => {
      text: string
      selectFrom?: number
      selectTo?: number
    }
  ) {
    const textarea = textareaRef
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selected = editor.markdown.slice(start, end)
    const next = builder(selected)
    const nextValue =
      editor.markdown.slice(0, start) + next.text + editor.markdown.slice(end)

    editorActions.updateMarkdown(nextValue)

    requestAnimationFrame(() => {
      textarea.focus()
      const selectionStart = start + (next.selectFrom ?? next.text.length)
      const selectionEnd = start + (next.selectTo ?? next.text.length)
      textarea.setSelectionRange(selectionStart, selectionEnd)
    })
  }

  function insertHeading() {
    replaceSelection((selected) => {
      const content = selected || t('editor.placeholderHeading')
      return {
        text: `## ${content}`,
        selectFrom: 3,
        selectTo: 3 + content.length,
      }
    })
  }

  function insertBold() {
    replaceSelection((selected) => {
      const content = selected || t('editor.placeholderBold')
      return {
        text: `**${content}**`,
        selectFrom: 2,
        selectTo: 2 + content.length,
      }
    })
  }

  function insertItalic() {
    replaceSelection((selected) => {
      const content = selected || t('editor.placeholderItalic')
      return {
        text: `*${content}*`,
        selectFrom: 1,
        selectTo: 1 + content.length,
      }
    })
  }

  function insertQuote() {
    replaceSelection((selected) => {
      const content = selected || t('editor.placeholderQuote')
      return {
        text: `> ${content}`,
        selectFrom: 2,
        selectTo: 2 + content.length,
      }
    })
  }

  function insertCodeBlock() {
    replaceSelection((selected) => {
      const content = selected || t('editor.placeholderCode')
      return {
        text: `\n\`\`\`\n${content}\n\`\`\`\n`,
        selectFrom: 5,
        selectTo: 5 + content.length,
      }
    })
  }

  function insertLink() {
    const url = window.prompt(t('editor.linkPrompt'), 'https://')
    if (!url) return

    replaceSelection((selected) => {
      const label = selected || t('editor.placeholderLink')
      return {
        text: `[${label}](${url})`,
        selectFrom: 1,
        selectTo: 1 + label.length,
      }
    })
  }

  async function insertImage() {
    try {
      const sourcePath = await openFilePicker(imageFilters)
      if (!sourcePath) return

      const sourceFileName = fileNameFromPath(sourcePath) ?? `image-${Date.now()}.png`
      const fileData = await readBinary(sourcePath)

      let markdownPath = sourceFileName
      if (s3Config()) {
        markdownPath = await uploadImageToS3(`${Date.now()}-${sourceFileName}`, fileData)
      } else if (workspace.folderPath) {
        const targetName = `${Date.now()}-${sourceFileName}`
        const assetsDirectory = await joinPaths(workspace.folderPath, 'assets')
        const targetPath = await joinPaths(assetsDirectory, targetName)
        await ensureDirectory(assetsDirectory)
        await writeBinary(targetPath, fileData)
        markdownPath = `assets/${targetName}`
      } else {
        throw new Error(t('editor.imageNeedsWorkspace'))
      }

      const altText = sourceFileName.replace(/\.[^.]+$/, '')
      replaceSelection(() => ({
        text: `![${altText}](${markdownPath})`,
      }))
      toast.success(t('editor.imageInserted'))
    } catch (error) {
      const message = getErrorMessage(error)
      toast.error(message === getDesktopOnlyMessage() ? message : t('editor.imageFailed'))
    }
  }

  async function handleSave(showToast = true) {
    if (editor.isSaving) return false

    editorActions.setSaving(true)
    editorActions.setError(null)

    try {
      let savePath = workspace.selectedFilePath

      if (!savePath) {
        const defaultPath = workspace.folderPath
          ? await joinPaths(workspace.folderPath, 'untitled.md')
          : 'untitled.md'
        savePath = await saveFilePicker({
          defaultPath,
          filters: [
            {
              name: 'Markdown',
              extensions: ['md'],
            },
          ],
        })

        if (!savePath) {
          editorActions.setSaving(false)
          return false
        }

        workspaceActions.setSelectedFile(savePath)
      }

      await writeText(savePath, editor.markdown)
      editorActions.markAsSaved(editor.markdown)
      workspaceActions.addRecentFile(savePath)

      if (workspace.folderPath) {
        await workspaceActions.loadFiles()
      }

      if (showToast) {
        toast.success(t('editor.savedToast'))
      }

      return true
    } catch (error) {
      editorActions.setSaving(false)
      editorActions.setError(getErrorMessage(error))
      toast.error(t('editor.saveFailed'))
      return false
    }
  }

  async function handleRestore() {
    if (!workspace.selectedFilePath) return

    editorActions.setLoading(true)
    editorActions.setError(null)

    try {
      const content = await readText(workspace.selectedFilePath)
      editorActions.loadMarkdown(content)
      toast.success(t('editor.restored'))
    } catch (error) {
      editorActions.setLoading(false)
      editorActions.setError(getErrorMessage(error))
      toast.error(t('editor.restoreFailed'))
    }
  }

  const setViewMode = (viewMode: ViewMode) => {
    editorActions.setViewMode(viewMode)
  }

  return (
    <>
      <Card class="flex h-full min-h-[420px] flex-col overflow-hidden bg-card py-0">
        <CardHeader class="border-b border-foreground bg-background pb-4">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div class="min-w-0">
              <div class="flex items-center gap-2 sm:gap-3">
                <CardTitle class="truncate text-base sm:text-lg font-semibold">
                  {currentFileName()}
                </CardTitle>
                <Show when={editor.isLoadingContent} fallback={
                  <Badge tone={editor.isModified ? 'muted' : 'outline'}>
                    {editor.isModified ? t('editor.unsaved') : t('editor.saved')}
                  </Badge>
                }>
                  <Badge>{t('editor.loading')}</Badge>
                </Show>
              </div>
              <div class="mt-1 text-xs text-muted-foreground">
                {t('editor.wordCount', { count: editor.wordCount })} ·{' '}
                {workspace.selectedFilePath ?? t('editor.notSavedToDisk')}
              </div>
            </div>

            <div class="flex flex-wrap items-center gap-2">
              <div class="flex items-center gap-1 border border-foreground p-1">
                <Button
                  size="sm"
                  variant={editor.viewMode === 'edit' ? 'primary' : 'ghost'}
                  onClick={() => setViewMode('edit')}
                  class="px-2"
                  aria-label={t('actions.edit')}
                >
                  <Type class="size-3.5" />
                  <span class="hidden sm:inline">{t('actions.edit')}</span>
                </Button>
                <Button
                  size="sm"
                  variant={editor.viewMode === 'render' ? 'primary' : 'ghost'}
                  onClick={() => setViewMode('render')}
                  class="px-2"
                  aria-label={t('actions.render')}
                >
                  <Eye class="size-3.5" />
                  <span class="hidden sm:inline">{t('actions.render')}</span>
                </Button>
                <Button
                  size="sm"
                  variant={editor.viewMode === 'split' ? 'primary' : 'ghost'}
                  onClick={() => setViewMode('split')}
                  class="px-2"
                  aria-label={t('actions.split')}
                >
                  <Columns2 class="size-3.5" />
                  <span class="hidden sm:inline">{t('actions.split')}</span>
                </Button>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => void handleRestore()}
                disabled={!workspace.selectedFilePath || editor.isLoadingContent}
              >
                <RefreshCw class="size-4" />
                <span class="hidden sm:inline">{t('actions.restore')}</span>
              </Button>

              <Button
                size="sm"
                onClick={() => void handleSave()}
                disabled={editor.isSaving || editor.isLoadingContent}
              >
                <Save class="size-4" />
                {editor.isSaving ? t('actions.saving') : t('actions.save')}
              </Button>

              <Button variant="outline" size="sm" onClick={() => setIsS3DialogOpen(true)}>
                <Settings class="size-4" />
                <span class="hidden sm:inline">S3</span>
              </Button>
            </div>
          </div>

          <Show when={editor.error}>
            <div class="mt-3 border border-destructive bg-destructive/10 px-4 py-2 text-sm text-destructive">
              {editor.error}
            </div>
          </Show>
        </CardHeader>

        <CardContent class="flex min-h-0 flex-1 flex-col bg-background p-0">
          <Show
            when={!editor.isLoadingContent}
            fallback={
              <div class="flex h-full items-center justify-center gap-3 text-sm text-muted-foreground">
                <RefreshCw class="size-5 animate-spin" />
                {t('editor.loadingFile')}
              </div>
            }
          >
            <div class="editor-toolbar flex flex-wrap gap-2 border-b border-foreground bg-background px-3 py-2">
              <Button variant="ghost" size="sm" onClick={insertHeading} aria-label={t('editor.toolbarHeading')}>
                <Heading2 class="size-3.5" />
              </Button>
              <Button variant="ghost" size="sm" onClick={insertBold} aria-label={t('editor.toolbarBold')}>
                <WholeWord class="size-3.5" />
              </Button>
              <Button variant="ghost" size="sm" onClick={insertItalic} aria-label={t('editor.toolbarItalic')}>
                <Type class="size-3.5 italic" />
              </Button>
              <Button variant="ghost" size="sm" onClick={insertQuote} aria-label={t('editor.toolbarQuote')}>
                <MessageSquareQuote class="size-3.5" />
              </Button>
              <Button variant="ghost" size="sm" onClick={insertCodeBlock} aria-label={t('editor.toolbarCode')}>
                {'</>'}
              </Button>
              <Button variant="ghost" size="sm" onClick={insertLink} aria-label={t('editor.toolbarLink')}>
                <Link2 class="size-3.5" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => void insertImage()} aria-label={t('editor.toolbarImage')}>
                <ImagePlus class="size-3.5" />
              </Button>
            </div>

            <div
              class={`flex min-h-0 flex-1 ${
                showEditor() && showPreview() ? 'flex-col lg:grid lg:grid-cols-2' : 'flex-col'
              }`}
            >
              <Show when={showEditor()}>
                <div class="min-h-0 flex-1">
                  <Textarea
                    ref={textareaRef}
                    class="editor-textarea h-full min-h-[340px] border-0 p-6 text-base"
                    style={{
                      'font-size': `${settings.fontSize}px`,
                      'line-height': String(settings.lineHeight),
                    }}
                    value={editor.markdown}
                    placeholder={t('editor.placeholder')}
                    onInput={(event) => editorActions.updateMarkdown(event.currentTarget.value)}
                  />
                </div>
              </Show>

              <Show when={showPreview()}>
                <div class={`min-h-0 overflow-auto border-foreground ${showEditor() ? 'border-t lg:border-l lg:border-t-0' : 'border-t-0'}`}>
                  <div class="markdown-preview p-6 prose prose-sm max-w-none sm:prose-base" innerHTML={previewHtml()} />
                </div>
              </Show>
            </div>
          </Show>
        </CardContent>
      </Card>

      <S3ConfigDialog
        open={isS3DialogOpen()}
        onOpenChange={setIsS3DialogOpen}
        onSaved={() => void refetchS3Config()}
      />
    </>
  )
}
