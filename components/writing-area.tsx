'use client'

import React, { useState } from 'react'
import dynamic from 'next/dynamic'
import { MDXEditorMethods } from '@mdxeditor/editor'

const MarkdownEditor = dynamic(() => import('./markdown-editor'), { ssr: false })

export function WritingArea() {
  const [markdown, setMarkdown] = useState('')
  const editorRef = React.useRef<MDXEditorMethods>(null)

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
