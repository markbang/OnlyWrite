'use client'

import React, { useState } from 'react'
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
import { useS3Config } from '@/hooks/useS3Config'
import { toast } from 'sonner'

interface MarkdownEditorProps extends MDXEditorProps {
  editorRef?: React.ForwardedRef<MDXEditorMethods>
  folderPath: string | null
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  editorRef,
  folderPath,
  ...props
}) => {
  const { hasConfig, uploadImage } = useS3Config()
  const [uploading, setUploading] = useState(false)

  const imageUploadHandler = async (image: File) => {
    setUploading(true)
    try {
      if (hasConfig()) {
        const imageName = `${Date.now()}-${image.name}`
        const fileData = await image.arrayBuffer()
        const url = await uploadImage(imageName, fileData)
        toast.success('Image uploaded to S3 successfully')
        return url
      } else if (folderPath) {
        const imageName = `${Date.now()}-${image.name}`
        const imagePath = await join(folderPath, 'assets', imageName)

        const reader = new FileReader()
        reader.readAsArrayBuffer(image)
        await new Promise((resolve, reject) => {
          reader.onload = async () => {
            try {
              await writeFile(imagePath, new Uint8Array(reader.result as ArrayBuffer))
              resolve(undefined)
            } catch (e) {
              reject(e)
            }
          }
          reader.onerror = reject
        })

        return imagePath
      } else {
        toast.error('No S3 configuration or folder path available')
        return ''
      }
    } catch (error) {
      toast.error(`Failed to upload image: ${error}`)
      return ''
    } finally {
      setUploading(false)
    }
  }

  if (uploading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-2 text-sm text-muted-foreground">Uploading image...</p>
        </div>
      </div>
    )
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
