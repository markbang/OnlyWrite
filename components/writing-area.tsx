'use client'

import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { MDXEditorMethods } from '@mdxeditor/editor'
import { invoke } from '@tauri-apps/api'

const MarkdownEditor = dynamic(() => import('./markdown-editor'), { ssr: false })

interface WritingAreaProps {
  rootPath: string | null
}

export function WritingArea({ rootPath }: WritingAreaProps) {
  const [markdown, setMarkdown] = useState('')
  const editorRef = React.useRef<MDXEditorMethods>(null)

  useEffect(() => {
    const handlePaste = (event: ClipboardEvent) => {
      if (!rootPath) return

      const items = event.clipboardData?.items
      if (!items) return

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile()
          if (!file) continue

          const reader = new FileReader()
          reader.onload = async (e) => {
            const base64Image = e.target?.result as string
            try {
              const imagePath = await invoke<string>('save_image', {
                base64Image,
                folderPath: rootPath,
              })
              const markdownImage = `![${file.name}](${imagePath})`
              editorRef.current?.insert(markdownImage)
            } catch (error) {
              console.error('Failed to save image:', error)
            }
          }
          reader.readAsDataURL(file)
        }
      }
    }

    document.addEventListener('paste', handlePaste)
    return () => {
      document.removeEventListener('paste', handlePaste)
    }
  }, [rootPath])

  return (
    <div className="flex h-full flex-col rounded-md border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-slate-700">Writing Area</h2>
      <div className="flex-1 overflow-y-auto">
        <MarkdownEditor
          editorRef={editorRef}
          markdown={markdown}
          onChange={(md) => setMarkdown(md)}
          placeholder="Start writing here..."
        />
      </div>
    </div>
  )
}
