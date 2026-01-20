'use client'

import React, { useEffect, useCallback, useRef, Suspense } from 'react'
import { MDXEditorMethods } from '@mdxeditor/editor'
import { Button } from './ui/button'
import { writeTextFile, readTextFile } from '@tauri-apps/plugin-fs'
import { ToggleGroup, ToggleGroupItem } from './ui/toggle-group'
import { Badge } from './ui/badge'
import { ScrollArea } from './ui/scroll-area'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Columns2, Eye, RefreshCw, Save, Settings } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useI18n } from '@/hooks/useI18n'
import { useS3Config } from '@/hooks/useS3Config'
import { useWorkspaceStore, useEditorStore, useSettingsStore } from '@/lib/stores'
import { selectShowEditor, selectShowPreview } from '@/lib/stores/editor-store'
import { selectActiveFileName } from '@/lib/stores/workspace-store'
import { toast } from 'sonner'
import { useHotkeys } from 'react-hotkeys-hook'
import { S3ConfigDialog } from './s3-config-dialog'

const MarkdownEditor = React.lazy(() => import('./markdown-editor'))

export function WritingArea() {
  const { t } = useI18n()
  const { reloadConfig } = useS3Config()

  const editorRef = useRef<MDXEditorMethods>(null)

  const {
    markdown,
    isModified,
    isSaving,
    viewMode,
    wordCount,
    isLoadingContent,
    error,
    setMarkdown,
    setIsModified,
    setIsSaving,
    setViewMode,
    setWordCount,
    setIsLoadingContent,
    setError,
    markAsSaved,
  } = useEditorStore()

  const { folderPath, selectedFilePath } = useWorkspaceStore()
  const { shortcuts } = useSettingsStore()

  const editorState = useEditorStore.getState()
  const showEditor = selectShowEditor(editorState)
  const showPreview = selectShowPreview(editorState)
  const workspaceState = useWorkspaceStore.getState()
  const fileName = selectActiveFileName(workspaceState)

  const calculateWordCount = useCallback((text: string) => {
    const words = text.trim().split(/\s+/).filter((word: string) => word.length > 0)
    return words.length
  }, [])

  const loadFileContent = useCallback(async () => {
    if (!selectedFilePath) {
      setMarkdown('')
      setError(null)
      setIsModified(false)
      return
    }

    setIsLoadingContent(true)
    setError(null)

    try {
      const content = await readTextFile(selectedFilePath)
      setMarkdown(content)
      markAsSaved()
      setWordCount(calculateWordCount(content))
      editorRef.current?.setMarkdown(content)
    } catch (error) {
      console.error('Failed to load file:', error)
      const errorMessage = t('editor.loadFailed') || 'Failed to load file'
      setError(errorMessage)
      toast.error(errorMessage)
     } finally {
       setIsLoadingContent(false)
     }
   }, [selectedFilePath, setMarkdown, setIsModified, markAsSaved, setWordCount, setIsLoadingContent, setError, calculateWordCount, t])
 
   useEffect(() => {
     loadFileContent()
   }, [loadFileContent])

  const handleContentChange = useCallback((content: string) => {
    setMarkdown(content)
    setIsModified(content !== useEditorStore.getState().lastSavedMarkdown)
    setWordCount(calculateWordCount(content))
  }, [setMarkdown, setIsModified, setWordCount, calculateWordCount])

  const handleSave = useCallback(async () => {
    if (isSaving) return

    setIsSaving(true)
    setError(null)

    try {
      const currentContent = editorRef.current?.getMarkdown() || markdown
      let savePath = selectedFilePath

      if (!savePath) {
        const { save } = await import('@tauri-apps/plugin-dialog')
        savePath = await save({
          filters: [
            {
              name: 'Markdown',
              extensions: ['md'],
            },
          ],
        })

        if (savePath) {
          const { setSelectedFile } = useWorkspaceStore.getState()
          setSelectedFile(savePath)
        }
      }

      if (savePath) {
        await writeTextFile(savePath, currentContent)
        setMarkdown(currentContent)
        markAsSaved()
        setWordCount(calculateWordCount(currentContent))
        toast.success(t('editor.saved') || 'File saved')
      }
    } catch (error) {
      console.error('Failed to save file:', error)
      const errorMessage = t('editor.saveFailed') || 'Failed to save file'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsSaving(false)
    }
  }, [isSaving, markdown, selectedFilePath, setMarkdown, markAsSaved, setWordCount, setIsSaving, setError, calculateWordCount, t])

  const handleRestore = useCallback(async () => {
    if (!selectedFilePath) return

    setIsLoadingContent(true)
    setError(null)

    try {
      const content = await readTextFile(selectedFilePath)
      setMarkdown(content)
      markAsSaved()
      setWordCount(calculateWordCount(content))
      editorRef.current?.setMarkdown(content)
      toast.success(t('editor.restored') || 'File restored')
    } catch (error) {
      console.error('Failed to restore file:', error)
      const errorMessage = t('editor.restoreFailed') || 'Failed to restore file'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoadingContent(false)
    }
  }, [selectedFilePath, setMarkdown, markAsSaved, setWordCount, setIsLoadingContent, setError, calculateWordCount, t])

  useHotkeys(shortcuts.save, (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault()
      handleSave()
    }
  })

  const previewSource = markdown.trim().length === 0
    ? t('editor.previewEmpty') || 'Start writing to see preview...'
    : markdown

  return (
    <Card className="flex h-full flex-col overflow-hidden bg-card border border-foreground py-0 gap-0">
      <CardHeader className="gap-3 border-b border-foreground bg-background pb-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 sm:gap-3">
              <CardTitle className="truncate text-base sm:text-lg font-semibold">
                {fileName || (t('editor.untitled') || 'Untitled')}
              </CardTitle>
              {isLoadingContent ? (
                <Badge variant="outline" className="text-xs animate-pulse">
                  {t('editor.loading') || 'Loading...'}
                </Badge>
              ) : isModified ? (
                <Badge variant="secondary" className="text-xs">
                  {t('editor.unsaved') || 'Unsaved'}
                </Badge>
              ) : (
                <Badge variant="outline" className="text-xs">
                  {t('editor.saved') || 'Saved'}
                </Badge>
              )}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {t('editor.wordCount', { count: wordCount })} ·{' '}
              {selectedFilePath
                ? selectedFilePath
                : t('editor.notSavedToDisk') || 'Not saved to disk'}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <ToggleGroup
              type="single"
              variant="outline"
              size="sm"
              value={viewMode}
              onValueChange={(value) => {
                if (value) setViewMode(value as 'edit' | 'render' | 'split')
              }}
              className="border-foreground"
            >
              <ToggleGroupItem
                value="edit"
                aria-label={t('actions.edit') || 'Edit'}
                className="hover:bg-foreground hover:text-background"
              >
                {t('actions.edit') || 'Edit'}
              </ToggleGroupItem>
              <ToggleGroupItem
                value="render"
                aria-label={t('actions.render') || 'Render'}
                className="hover:bg-foreground hover:text-background"
              >
                <Eye className="size-3" />
                <span className="hidden sm:inline">
                  {t('actions.render') || 'Render'}
                </span>
              </ToggleGroupItem>
              <ToggleGroupItem
                value="split"
                aria-label={t('actions.split') || 'Split'}
                className="hover:bg-foreground hover:text-background"
              >
                <Columns2 className="size-3" />
                <span className="hidden sm:inline">
                  {t('actions.split') || 'Split'}
                </span>
              </ToggleGroupItem>
            </ToggleGroup>
            <Button
              onClick={handleRestore}
              disabled={!selectedFilePath || isLoadingContent}
              size="sm"
              variant="outline"
            >
              <RefreshCw className="mr-1.5 size-4" />
              <span className="hidden sm:inline">
                {t('actions.restore') || 'Restore'}
              </span>
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving || isLoadingContent}
              size="sm"
            >
              <Save className="mr-1.5 size-4" />
              {isSaving
                ? (t('actions.saving') || 'Saving...')
                : (t('actions.save') || 'Save')
              }
            </Button>
            <S3ConfigDialog
              trigger={
                <Button
                  size="sm"
                  variant="outline"
                >
                  <Settings className="mr-1.5 size-4" />
                  <span className="hidden sm:inline">S3 Settings</span>
                </Button>
              }
              onConfigSaved={reloadConfig}
            />
          </div>
        </div>
        {error && (
          <div className="mt-3 px-4 py-2 bg-destructive/10 text-destructive text-sm border border-destructive rounded">
            {error}
          </div>
        )}
      </CardHeader>

      <CardContent className="flex-1 min-h-0 bg-background p-0">
        {isLoadingContent ? (
          <div className="flex h-full items-center justify-center gap-3">
            <RefreshCw className="size-8 text-muted-foreground animate-spin" />
            <p className="text-sm text-muted-foreground">
              {t('editor.loadingFile') || 'Loading file...'}
            </p>
          </div>
        ) : (
          <div
            className={`h-full ${showEditor && showPreview ? 'grid grid-cols-1 lg:grid-cols-2' : 'flex'}`}
          >
            {showEditor && (
              <div className="h-full min-h-0">
                <Suspense fallback={null}>
                  <MarkdownEditor
                    editorRef={editorRef}
                    markdown={markdown}
                    onChange={handleContentChange}
                    placeholder={t('editor.placeholder') || 'Start writing...'}
                    folderPath={folderPath}
                  />
                </Suspense>
              </div>
            )}
            {showPreview && (
              <ScrollArea className="h-full w-full border-t border-foreground lg:border-t-0 lg:border-l bg-background">
                <div className="markdown-preview p-6 prose prose-sm sm:prose-base max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {previewSource}
                  </ReactMarkdown>
                </div>
              </ScrollArea>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
