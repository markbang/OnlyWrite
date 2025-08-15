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
} from '@mdxeditor/editor'
import '@mdxeditor/editor/style.css'
import { join } from '@tauri-apps/api/path'
import { BaseDirectory, writeBinaryFile } from '@tauri-apps/plugin-fs'

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
      await writeBinaryFile(imagePath, new Uint8Array(reader.result as ArrayBuffer))
    }

    return imagePath
  }

  return (
    <MDXEditor
      plugins={[
        toolbarPlugin({
          toolbarContents: () => (
            <>
              <BoldItalicUnderlineToggles />
            </>
          ),
        }),
        headingsPlugin(),
        listsPlugin(),
        quotePlugin(),
        thematicBreakPlugin(),
        imagePlugin({ imageUploadHandler }),
      ]}
      contentEditableClassName="prose"
      {...props}
      ref={editorRef}
    />
  )
}

export default MarkdownEditor
