'use client'

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { readDir, writeTextFile } from '@tauri-apps/plugin-fs';
import { join } from '@tauri-apps/api/path';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { cn } from '@/lib/utils';
import { useI18n } from '@/hooks/useI18n';

interface FileEntry {
  name: string;
  isFile: boolean;
}

interface FileAreaProps {
  folderPath: string | null;
  onFileSelect: (filePath: string) => void;
  className?: string;
}

export function FileArea({ folderPath, onFileSelect, className }: FileAreaProps) {
  const { t } = useI18n();
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const loadFiles = useCallback(async () => {
    if (!folderPath) return;
    
    try {
      const entries = await readDir(folderPath);
      const fileEntries: FileEntry[] = entries.map((entry) => ({
        name: entry.name,
        isFile: entry.isFile
      }));
      
      // 按照文件夹在前，文件在后，然后按名称排序
      fileEntries.sort((a, b) => {
        if (a.isFile !== b.isFile) {
          return a.isFile ? 1 : -1;
        }
        return a.name.localeCompare(b.name);
      });
      
      setFiles(fileEntries);
    } catch (error) {
      console.error(t('file.loadFailed'), error);
    }
  }, [folderPath, t]);

  useEffect(() => {
    if (folderPath) {
      loadFiles();
    }
  }, [folderPath, loadFiles]);

  const handleFileClick = async (fileName: string, isFile: boolean) => {
    if (folderPath && isFile) {
      const filePath = await join(folderPath, fileName);
      setSelectedFile(fileName);
      onFileSelect(filePath);
    }
  };

  const handleCreateFile = async () => {
    if (!folderPath) return;

    const fileName = prompt(t('file.promptName'));
    if (!fileName) return;

    // 确保文件名以 .md 结尾
    const finalFileName = fileName.endsWith('.md') ? fileName : `${fileName}.md`;
    
    try {
      const filePath = await join(folderPath, finalFileName);
      await writeTextFile(
        filePath,
        '# ' +
          finalFileName.replace('.md', '') +
          '\n\n' +
          t('file.newFileContent') +
          '\n'
      );
      
      // 重新加载文件列表
      await loadFiles();
      
      // 自动选择新创建的文件
      onFileSelect(filePath);
      setSelectedFile(finalFileName);
    } catch (error) {
      console.error(t('file.createFailed'), error);
      alert(t('file.createFailed') + error);
    }
  };

  const getFileIcon = (fileName: string, isFile: boolean) => {
    if (!isFile) {
      return (
        <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
        </svg>
      );
    }
    
    if (fileName.endsWith('.md')) {
      return (
        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    }
    
    return (
      <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    );
  };

  const fileCount = useMemo(
    () => files.filter((entry) => entry.isFile).length,
    [files]
  );

  const folderName = useMemo(() => {
    if (!folderPath) return t('file.noFolder');
    const parts = folderPath.split(/[\\/]/);
    return parts[parts.length - 1] || folderPath;
  }, [folderPath, t]);

  return (
    <Card
      className={cn(
        'h-full overflow-hidden bg-background/80 backdrop-blur py-0 gap-0',
        className
      )}
    >
      <CardHeader className="border-b border-border pb-4">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              {t('file.folderLabel')}
            </p>
            <CardTitle className="truncate text-sm font-semibold">
              {folderName}
            </CardTitle>
          </div>
          <div className="flex items-center gap-2">
            {folderPath && (
              <span className="text-xs text-muted-foreground">
                {t('file.filesCount', { count: fileCount })}
              </span>
            )}
            {folderPath && (
              <Button
                onClick={handleCreateFile}
                size="sm"
                variant="outline"
                className="h-8 px-3 text-xs"
              >
                {t('file.newFile')}
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <ScrollArea className="h-full">
          <div className="p-3">
            {folderPath ? (
              <div className="flex flex-col gap-1.5">
                {files.map((entry, index) => {
                  const isActive = selectedFile === entry.name && entry.isFile
                  return (
                    <Button
                      key={index}
                      variant={isActive ? 'secondary' : 'ghost'}
                      className={cn(
                        'file-list-item h-auto w-full justify-start gap-2 px-2 py-2 text-left text-sm',
                        !entry.isFile && 'opacity-60'
                      )}
                      disabled={!entry.isFile}
                      onClick={() => handleFileClick(entry.name, entry.isFile)}
                    >
                      {getFileIcon(entry.name, entry.isFile)}
                      <span className="truncate">{entry.name}</span>
                    </Button>
                  )
                })}
                {files.length === 0 && (
                  <div className="py-10 text-center text-sm text-muted-foreground">
                    {t('file.emptyFolder')}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center py-10 text-sm text-muted-foreground">
                {t('file.chooseFolder')}
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
