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

interface MarkdownEditorProps extends MDXEditorProps {
  editorRef?: React.ForwardedRef<MDXEditorMethods>
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  editorRef,
  ...props
}) => {
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
        imagePlugin(),
      ]}
      contentEditableClassName="prose"
      {...props}
      ref={editorRef}
    />
  )
}

export default MarkdownEditor
