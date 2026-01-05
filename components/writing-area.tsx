'use client'

import React, { useState, useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { MDXEditorMethods } from '@mdxeditor/editor'
import { Button } from './ui/button'
import { save } from '@tauri-apps/plugin-dialog'
import { writeTextFile, readTextFile } from '@tauri-apps/plugin-fs'
import { ToggleGroup, ToggleGroupItem } from './ui/toggle-group'
import { Badge } from './ui/badge'
import { ScrollArea } from './ui/scroll-area'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Columns2, Eye, RefreshCw, Save } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useI18n } from '@/hooks/useI18n'

const MarkdownEditor = dynamic(() => import('./markdown-editor'), { ssr: false })

interface WritingAreaProps {
  folderPath: string | null
  filePath: string | null
}

export function WritingArea({ folderPath, filePath }: WritingAreaProps) {
  const { t } = useI18n()
  const [markdown, setMarkdown] = useState('')
  const [currentFilePath, setCurrentFilePath] = useState<string | null>(null)
  const [isModified, setIsModified] = useState(false)
  const [lastSavedMarkdown, setLastSavedMarkdown] = useState('')
  const [wordCount, setWordCount] = useState(0)
  const [isSaving, setIsSaving] = useState(false)
  const [viewMode, setViewMode] = useState<'edit' | 'render' | 'split'>('edit')
  const editorRef = React.useRef<MDXEditorMethods>(null)

  // 计算字数
  const calculateWordCount = useCallback((text: string) => {
    const words = text.trim().split(/\s+/).filter(word => word.length > 0)
    return words.length
  }, [])

  useEffect(() => {
    if (filePath) {
      setCurrentFilePath(filePath)
      readTextFile(filePath)
        .then((content) => {
          setMarkdown(content)
          setLastSavedMarkdown(content)
          setWordCount(calculateWordCount(content))
          setIsModified(false)
          editorRef.current?.setMarkdown(content)
        })
        .catch(console.error)
    }
  }, [filePath, calculateWordCount])

  // 自动保存功能
  useEffect(() => {
    if (!isModified || !currentFilePath) return;

    const autoSaveTimer = setTimeout(async () => {
      try {
        const currentContent = editorRef.current?.getMarkdown() || markdown;
        await writeTextFile(currentFilePath, currentContent);
        setLastSavedMarkdown(currentContent);
        setIsModified(false);
        console.log('自动保存:', currentFilePath);
      } catch (error) {
        console.error('自动保存失败:', error);
      }
    }, 5000); // 5秒后自动保存

    return () => {
      clearTimeout(autoSaveTimer);
    };
  }, [isModified, currentFilePath, markdown]);

  // 快捷键支持
  const handleSave = useCallback(async () => {
    if (isSaving) return;
    
    setIsSaving(true);
    try {
      // 从编辑器获取最新内容
      const currentContent = editorRef.current?.getMarkdown() || markdown;
      let savePath = currentFilePath;

      if (!savePath) {
        savePath = await save({
          filters: [
            {
              name: 'Markdown',
              extensions: ['md'],
            },
          ],
        });
      }

      if (savePath) {
        await writeTextFile(savePath, currentContent);
        setCurrentFilePath(savePath);
        setMarkdown(currentContent);
        setLastSavedMarkdown(currentContent);
        setIsModified(false);
        setWordCount(calculateWordCount(currentContent));
        console.log('文件已保存:', savePath);
      }
    } catch (error) {
      console.error(t('editor.saveFailed'), error);
      alert(t('editor.saveFailed') + error);
    } finally {
      setIsSaving(false);
    }
  }, [isSaving, markdown, currentFilePath, calculateWordCount, t]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 's') {
        event.preventDefault();
        handleSave();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleSave]);

  const handleRestore = useCallback(async () => {
    if (!currentFilePath) return;

    try {
      const content = await readTextFile(currentFilePath);
      setMarkdown(content);
      setLastSavedMarkdown(content);
      setIsModified(false);
      setWordCount(calculateWordCount(content));
      editorRef.current?.setMarkdown(content);
    } catch (error) {
      console.error(t('editor.restoreFailed'), error);
      alert(t('editor.restoreFailed') + error);
    }
  }, [currentFilePath, calculateWordCount, t]);

  const handleContentChange = (content: string) => {
    setMarkdown(content)
    setIsModified(content !== lastSavedMarkdown)
    setWordCount(calculateWordCount(content))
  }

  const showEditor = viewMode !== 'render'
  const showPreview = viewMode !== 'edit'
  const previewSource =
    markdown.trim().length === 0 ? t('editor.previewEmpty') : markdown
  const fileName = currentFilePath
    ? currentFilePath.split(/[\\/]/).pop()
    : t('editor.untitled')

  return (
    <Card className="flex h-full flex-col overflow-hidden py-0 gap-0">
      {/* 顶部工具栏 */}
      <CardHeader className="gap-3 border-b border-border pb-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center spacing-sm">
            <CardTitle className="truncate text-lg">
              {fileName}
            </CardTitle>
            {isModified ? (
              <Badge variant="secondary">{t('editor.unsaved')}</Badge>
            ) : (
              <Badge variant="outline">{t('editor.saved')}</Badge>
            )}
          </div>
          <div className="text-xs text-muted-foreground">
            {t('editor.wordCount', { count: wordCount })} ·{' '}
            {currentFilePath ? currentFilePath : t('editor.notSavedToDisk')}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <ToggleGroup
            type="single"
            variant="outline"
            size="sm"
            value={viewMode}
            onValueChange={(value) => {
              if (value) setViewMode(value as typeof viewMode)
            }}
          >
            <ToggleGroupItem value="edit" aria-label={t('actions.edit')}>
              {t('actions.edit')}
            </ToggleGroupItem>
            <ToggleGroupItem value="render" aria-label={t('actions.render')}>
              <Eye className="size-3" />
              {t('actions.render')}
            </ToggleGroupItem>
            <ToggleGroupItem value="split" aria-label={t('actions.split')}>
              <Columns2 className="size-3" />
              {t('actions.split')}
            </ToggleGroupItem>
          </ToggleGroup>
          <Button
            onClick={handleRestore}
            disabled={!currentFilePath}
            size="sm"
            variant="outline"
          >
            <RefreshCw className="mr-1 size-3" />
            {t('actions.restore')}
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            size="sm"
            className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 ease-in-out hover:scale-105 active:scale-95 disabled:hover:scale-100"
          >
            <Save className="mr-1 size-3" />
            {isSaving ? t('actions.saving') : t('actions.save')}
          </Button>
        </div>
      </div>
      </CardHeader>

      {/* 编辑器区域 */}
      <CardContent className="flex-1 min-h-0 bg-background p-0">
        <div
          className={`h-full ${showEditor && showPreview ? 'grid grid-cols-1 lg:grid-cols-2' : 'flex'}`}
        >
          {showEditor && (
            <div className="h-full min-h-0">
              <MarkdownEditor
                editorRef={editorRef}
                markdown={markdown}
                onChange={handleContentChange}
                placeholder={t('editor.placeholder')}
                folderPath={folderPath}
              />
            </div>
          )}
          {showPreview && (
            <ScrollArea className="h-full w-full border-t border-border lg:border-t-0 lg:border-l bg-muted/20">
              <div className="markdown-preview p-6">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {previewSource}
                </ReactMarkdown>
              </div>
            </ScrollArea>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
