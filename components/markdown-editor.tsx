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
import { Separator } from './ui/separator'

interface MarkdownEditorProps extends MDXEditorProps {
  editorRef?: React.ForwardedRef<MDXEditorMethods>
  folderPath: string | null
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  editorRef,
  folderPath,
  ...props
}) => {
  const uploadImageToS3 = async (image: File) => {
    const formData = new FormData()
    formData.append('file', image)

    const response = await fetch('/api/upload-image', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error('Failed to upload image')
    }

    const data = (await response.json()) as { url: string }
    return data.url
  }

  const imageUploadHandler = async (image: File) => {
    if (!folderPath) {
      try {
        return await uploadImageToS3(image)
      } catch (error) {
        console.error('S3 upload failed', error)
        return ''
      }
    }

    const safeName = image.name.replace(/[^\w.-]/g, '-')
    const imageName = `${Date.now()}-${safeName}`
    const imagePath = await join(folderPath, 'assets', imageName)

    const buffer = await image.arrayBuffer()
    await writeFile(imagePath, new Uint8Array(buffer))

    return imagePath
  }

  return (
    <div className="h-full w-full overflow-hidden">
      <MDXEditor
        plugins={[
          toolbarPlugin({
            toolbarContents: () => (
              <div className="flex flex-wrap items-center gap-1 border-b border-border bg-background/90 px-3 py-2 backdrop-blur sticky top-0 z-10">
                <UndoRedo />
                <Separator orientation="vertical" className="mx-2 h-6" />
                <BlockTypeSelect />
                <Separator orientation="vertical" className="mx-2 h-6" />
                <BoldItalicUnderlineToggles />
                <Separator orientation="vertical" className="mx-2 h-6" />
                <CreateLink />
                <Separator orientation="vertical" className="mx-2 h-6" />
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
        contentEditableClassName="markdown-editor max-w-none p-6 min-h-screen focus:outline-none bg-background text-foreground"
        {...props}
        ref={editorRef}
        className="h-full overflow-auto"
      />
    </div>
  )
}

export default MarkdownEditor
