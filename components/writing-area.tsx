'use client'

import React, { useState, useEffect } from 'react'
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
  const editorRef = React.useRef<MDXEditorMethods>(null)

  useEffect(() => {
    if (filePath) {
      setCurrentFilePath(filePath)
      readTextFile(filePath)
        .then((content) => {
          setMarkdown(content)
          editorRef.current?.setMarkdown(content)
        })
        .catch(console.error)
    }
  }, [filePath])

  const handleSave = async () => {
    let savePath = currentFilePath

    if (!savePath) {
      savePath = await save({
        filters: [
          {
            name: 'Markdown',
            extensions: ['md'],
          },
        ],
      })
    }

    if (savePath) {
      await writeTextFile(savePath, markdown)
      setCurrentFilePath(savePath)
    }
  }

  return (
    <div className="flex h-full flex-col rounded-md border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-700">Writing Area</h2>
        <Button onClick={handleSave}>Save</Button>
      </div>
      <div className="flex-1 overflow-y-auto">
        <MarkdownEditor
          editorRef={editorRef}
          markdown={markdown}
          onChange={(md) => setMarkdown(md)}
          placeholder="Start writing here..."
          folderPath={folderPath}
        />
      </div>
    </div>
  )
}
