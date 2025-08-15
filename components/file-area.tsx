import React from "react"
import {
  IconFolder,
  IconFile,
  IconChevronRight,
  IconChevronDown,
} from "@tabler/icons-react"

export interface FileNode {
  name: string
  path: string
  children?: FileNode[]
}

interface FileTreeProps {
  tree: FileNode[]
}

const FileTree: React.FC<FileTreeProps> = ({ tree }) => {
  const [openFolders, setOpenFolders] = React.useState<Record<string, boolean>>(
    {}
  )

  const toggleFolder = (path: string) => {
    setOpenFolders((prev) => ({ ...prev, [path]: !prev[path] }))
  }

  const renderNode = (node: FileNode) => {
    const isFolder = node.children !== null && node.children !== undefined
    const isOpen = openFolders[node.path]

    if (isFolder) {
      return (
        <div key={node.path}>
          <div
            className="flex cursor-pointer items-center rounded-md px-2 py-1 hover:bg-gray-100"
            onClick={() => toggleFolder(node.path)}
          >
            {isOpen ? (
              <IconChevronDown className="mr-2 h-4 w-4" />
            ) : (
              <IconChevronRight className="mr-2 h-4 w-4" />
            )}
            <IconFolder className="mr-2 h-5 w-5 text-yellow-500" />
            <span>{node.name}</span>
          </div>
          {isOpen && <div className="pl-6">{renderTree(node.children!)}</div>}
        </div>
      )
    }

    return (
      <div
        key={node.path}
        className="flex items-center rounded-md px-2 py-1 hover:bg-gray-100"
      >
        <IconFile className="mr-2 h-5 w-5 text-gray-400" />
        <span>{node.name}</span>
      </div>
    )
  }

  const renderTree = (nodes: FileNode[]) => {
    return nodes.map((node) => renderNode(node))
  }

  return <div>{renderTree(tree)}</div>
}

interface FileAreaProps {
  fileTree: FileNode[]
}

export function FileArea({ fileTree }: FileAreaProps) {
  return (
    <div className="flex h-full flex-col rounded-md border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-slate-700">Explorer</h2>
      <div className="overflow-auto">
        <FileTree tree={fileTree} />
      </div>
    </div>
  )
}
