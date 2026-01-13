'use client'

import React, { useEffect, useCallback } from 'react'
import { readDir, writeTextFile } from '@tauri-apps/plugin-fs'
import { join } from '@tauri-apps/api/path'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { ScrollArea } from './ui/scroll-area'
import { Badge } from './ui/badge'
import { FolderOpen, File as FileIcon, Plus, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useI18n } from '@/hooks/useI18n'
import { useWorkspaceStore } from '@/lib/stores'
import { selectFileCount, selectActiveFileName, selectFolderName } from '@/lib/stores/workspace-store'
import { UXFeedback } from '@/lib/ux-feedback'

export function FileArea({ className }: { className?: string }) {
  const { t } = useI18n()

  const workspaceState = useWorkspaceStore()

  const fileCount = selectFileCount(workspaceState)
  const activeFileName = selectActiveFileName(workspaceState)
  const folderName = selectFolderName(workspaceState)

  const {
    folderPath,
    files,
    isLoadingFiles,
    fileError,
    setFiles,
    setSelectedFile,
    setIsLoadingFiles,
    setFileError,
  } = workspaceState

  const loadFiles = useCallback(async () => {
    if (!folderPath) return

    setIsLoadingFiles(true)
    setFileError(null)

    try {
      const entries = await readDir(folderPath)
      const fileEntries = entries.map((entry) => ({
        name: entry.name,
        isFile: entry.isFile,
      }))

      fileEntries.sort((a, b) => {
        if (a.isFile !== b.isFile) {
          return a.isFile ? 1 : -1
        }
        return a.name.localeCompare(b.name)
      })

      setFiles(fileEntries)
    } catch (error) {
      UXFeedback.handleError(error, 'Failed to load files')
    }
  }, [folderPath, setFiles, setIsLoadingFiles, setFileError])

  useEffect(() => {
    loadFiles()
  }, [folderPath, loadFiles])

  const handleFileClick = useCallback(
    async (fileName: string, isFile: boolean) => {
      if (folderPath && isFile) {
        const filePath = await join(folderPath, fileName)
        setSelectedFile(filePath)
      }
    },
    [folderPath, setSelectedFile],
  )

  const handleCreateFile = useCallback(async () => {
    if (!folderPath) return

    try {
      const fileName = await UXFeedback.showSaveDialog({
        filters: [
          {
            name: 'Markdown',
            extensions: ['md'],
          },
        ],
      })

      if (!fileName) return

      const finalFileName = fileName.endsWith('.md') ? fileName : `${fileName}.md`

      const filePath = await join(folderPath, finalFileName)

      await writeTextFile(
        filePath,
        '# ' + finalFileName.replace('.md', '') + '\n\n' + (t('file.newFileContent') || 'Start writing here...') + '\n'
      )

      await loadFiles()
      setSelectedFile(filePath)
      UXFeedback.success(t('file.created') || `Created ${finalFileName}`)
    } catch (error) {
      UXFeedback.handleError(error, 'Failed to create file')
    }
  }, [folderPath, loadFiles, setSelectedFile, t])

  const getFileIcon = (fileName: string, isFile: boolean) => {
    if (!isFile) {
      return (
        <svg className="w-4 h-4 text-foreground" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2-2H4a2 2 0 01-2-2V6z" />
        </svg>
      )
    }

    if (fileName.endsWith('.md')) {
      return <FileIcon className="w-4 h-4 text-foreground" strokeWidth={1.5} />
    }

    return <FileIcon className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
  }

  return (
    <Card
      className={cn(
        'h-full overflow-hidden bg-card border border-foreground py-0 gap-0',
        className
      )}
    >
      <CardHeader className="border-b border-foreground bg-background pb-4">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-wide text-muted-foreground font-medium">
              {t('file.folderLabel') || 'FOLDER'}
            </p>
            <CardTitle className="truncate text-sm font-semibold">
              {folderName || (t('file.noFolder') || 'No folder selected')}
            </CardTitle>
          </div>
          <div className="flex items-center gap-2">
            {folderPath && (
              <Badge variant="outline" className="text-xs">
                {t('file.filesCount', { count: fileCount }) || `${fileCount} files`}
              </Badge>
            )}
            {folderPath && (
              <Button
                onClick={handleCreateFile}
                size="sm"
                variant="outline"
                className="h-8 px-3 text-xs"
              >
                <Plus className="mr-1.5 size-3" />
                {t('file.newFile') || 'New'}
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {isLoadingFiles ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="size-8 text-muted-foreground animate-spin" />
            <p className="text-sm text-muted-foreground ml-3">
              {t('file.loading') || 'Loading files...'}
            </p>
          </div>
        ) : fileError ? (
          <div className="flex flex-col items-center justify-center py-12">
            <FolderOpen className="size-8 text-destructive mb-2" />
            <p className="text-sm text-destructive text-center">
              {fileError}
            </p>
            <Button
              onClick={loadFiles}
              variant="outline"
              size="sm"
              className="mt-4"
            >
              {t('file.retry') || 'Retry'}
            </Button>
          </div>
        ) : (
          <ScrollArea className="h-full">
            <div className="p-2.5">
              {folderPath ? (
                <div className="flex flex-col gap-1">
                  {files.map((entry, index) => {
                    const isEntryActive = entry.isFile && entry.name === activeFileName
                    return (
                      <Button
                        key={index}
                        variant={isEntryActive ? 'secondary' : 'ghost'}
                        className={cn(
                          'h-auto w-full justify-start gap-2.5 px-3 py-2.5 text-left text-sm bg-transparent border-transparent hover:bg-foreground hover:text-background transition-colors duration-100',
                          !entry.isFile && 'opacity-50 cursor-not-allowed',
                          isEntryActive && 'bg-foreground text-background border-foreground'
                        )}
                        disabled={!entry.isFile}
                        onClick={() => handleFileClick(entry.name, entry.isFile)}
                      >
                        {getFileIcon(entry.name, entry.isFile)}
                        <span className="truncate font-medium">{entry.name}</span>
                      </Button>
                    )
                  })}
                  {files.length === 0 && (
                    <div className="py-12 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <FolderOpen className="size-8 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          {t('file.emptyFolder') || 'Empty folder'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <FolderOpen className="size-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground text-center">
                    {t('file.chooseFolder') || 'Choose a folder'}
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}
