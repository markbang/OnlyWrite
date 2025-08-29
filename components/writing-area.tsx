'use client'

import React, { useState, useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { MDXEditorMethods } from '@mdxeditor/editor'
import { Button } from './ui/button'
import { save } from '@tauri-apps/plugin-dialog'
import { writeTextFile, readTextFile } from '@tauri-apps/plugin-fs'

const MarkdownEditor = dynamic(() => import('./markdown-editor'), { ssr: false })

interface WritingAreaProps {
  folderPath: string | null
  filePath: string | null
}

export function WritingArea({ folderPath, filePath }: WritingAreaProps) {
  const [markdown, setMarkdown] = useState('')
  const [currentFilePath, setCurrentFilePath] = useState<string | null>(null)
  const [isModified, setIsModified] = useState(false)
  const [wordCount, setWordCount] = useState(0)
  const [isSaving, setIsSaving] = useState(false)
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
        setIsModified(false);
        setWordCount(calculateWordCount(currentContent));
        console.log('文件已保存:', savePath);
      }
    } catch (error) {
      console.error('保存失败:', error);
      alert('保存失败: ' + error);
    } finally {
      setIsSaving(false);
    }
  }, [isSaving, markdown, currentFilePath, calculateWordCount]);

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

  const handleContentChange = (content: string) => {
    setMarkdown(content)
    setIsModified(true)
    setWordCount(calculateWordCount(content))
  }

  return (
    <div className="interface-section flex h-full flex-col">
      {/* 顶部工具栏 */}
      <div className="interface-section-header flex items-center justify-between">
        <div className="flex items-center spacing-lg">
          <h2 className="text-lg font-semibold text-foreground">
            {currentFilePath ? currentFilePath.split(/[\\/]/).pop() : '未命名文档'}
            {isModified && <span className="text-amber-600 dark:text-amber-400 ml-1">*</span>}
          </h2>
          <div className="text-sm text-muted-foreground">
            {wordCount} 字
          </div>
        </div>
        <div className="flex items-center spacing-sm">
          <Button 
            onClick={handleSave} 
            disabled={isSaving}
            size="sm"
            className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 ease-in-out hover:scale-105 active:scale-95 disabled:hover:scale-100"
          >
            {isSaving ? '保存中...' : '保存 (Ctrl+S)'}
          </Button>
        </div>
      </div>

      {/* 编辑器区域 */}
      <div className="flex-1 overflow-hidden bg-background transition-colors">
        <MarkdownEditor
          editorRef={editorRef}
          markdown={markdown}
          onChange={handleContentChange}
          placeholder="开始写作..."
          folderPath={folderPath}
        />
      </div>
    </div>
  )
}
