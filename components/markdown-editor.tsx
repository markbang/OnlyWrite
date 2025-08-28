'use client'

import React from 'react'
import {
  MDXEditor,
  type MDXEditorMethods,
  type MDXEditorProps,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
  BoldItalicUnderlineToggles,
  imagePlugin,
  linkPlugin,
  linkDialogPlugin,
  tablePlugin,
  InsertTable,
  BlockTypeSelect,
  CreateLink,
  UndoRedo,
  codeBlockPlugin,
  codeMirrorPlugin,
  InsertCodeBlock,
} from '@mdxeditor/editor'
import '@mdxeditor/editor/style.css'
import { join } from '@tauri-apps/api/path'
import { writeFile } from '@tauri-apps/plugin-fs'

interface MarkdownEditorProps extends MDXEditorProps {
  editorRef?: React.ForwardedRef<MDXEditorMethods>
  folderPath: string | null
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  editorRef,
  folderPath,
  ...props
}) => {
  const imageUploadHandler = async (image: File) => {
    if (!folderPath) {
      return ''
    }
    const imageName = `${Date.now()}-${image.name}`
    const imagePath = await join(folderPath, 'assets', imageName)

    const reader = new FileReader()
    reader.readAsArrayBuffer(image)
    reader.onload = async () => {
      await writeFile(imagePath, new Uint8Array(reader.result as ArrayBuffer))
    }

    return imagePath
  }

  return (
    <div className="h-full w-full overflow-auto">
      <MDXEditor
        plugins={[
          toolbarPlugin({
            toolbarContents: () => (
              <div className="flex flex-wrap items-center gap-1 p-2 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 sticky top-0 z-10">
                <UndoRedo />
                <div className="w-px h-6 bg-slate-300 dark:bg-slate-600 mx-2" />
                <BlockTypeSelect />
                <div className="w-px h-6 bg-slate-300 dark:bg-slate-600 mx-2" />
                <BoldItalicUnderlineToggles />
                <div className="w-px h-6 bg-slate-300 dark:bg-slate-600 mx-2" />
                <CreateLink />
                <div className="w-px h-6 bg-slate-300 dark:bg-slate-600 mx-2" />
                <InsertTable />
                <InsertCodeBlock />
              </div>
            ),
          }),
          headingsPlugin(),
          listsPlugin(),
          quotePlugin(),
          thematicBreakPlugin(),
          linkPlugin(),
          linkDialogPlugin(),
          tablePlugin(),
          codeBlockPlugin({ defaultCodeBlockLanguage: 'js' }),
          codeMirrorPlugin({ 
            codeBlockLanguages: {
              js: 'JavaScript',
              ts: 'TypeScript',
              tsx: 'TypeScript React',
              css: 'CSS',
              html: 'HTML',
              python: 'Python',
              rust: 'Rust',
              go: 'Go',
              java: 'Java',
              c: 'C',
              cpp: 'C++',
              sh: 'Shell',
              json: 'JSON',
              yaml: 'YAML',
              xml: 'XML',
              sql: 'SQL',
              md: 'Markdown',
            }
          }),
          imagePlugin({ imageUploadHandler }),
        ]}
        contentEditableClassName="prose prose-slate dark:prose-invert max-w-none p-6 min-h-screen focus:outline-none bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
        {...props}
        ref={editorRef}
        className="h-full overflow-auto"
      />
    </div>
  )
}

export default MarkdownEditor
