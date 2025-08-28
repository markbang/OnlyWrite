'use client'

import React, { useEffect, useState, useCallback } from 'react';
import { readDir, writeTextFile } from '@tauri-apps/plugin-fs';
import { join } from '@tauri-apps/api/path';
import { Button } from './ui/button';

interface FileEntry {
  name: string;
  isFile: boolean;
}

interface FileAreaProps {
  folderPath: string | null;
  onFileSelect: (filePath: string) => void;
}

export function FileArea({ folderPath, onFileSelect }: FileAreaProps) {
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
      console.error('加载文件失败:', error);
    }
  }, [folderPath]);

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

    const fileName = prompt('请输入文件名 (例如: new-note.md)');
    if (!fileName) return;

    // 确保文件名以 .md 结尾
    const finalFileName = fileName.endsWith('.md') ? fileName : `${fileName}.md`;
    
    try {
      const filePath = await join(folderPath, finalFileName);
      await writeTextFile(filePath, '# ' + finalFileName.replace('.md', '') + '\n\n开始写作...\n');
      
      // 重新加载文件列表
      await loadFiles();
      
      // 自动选择新创建的文件
      onFileSelect(filePath);
      setSelectedFile(finalFileName);
    } catch (error) {
      console.error('创建文件失败:', error);
      alert('创建文件失败: ' + error);
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

  return (
    <div className='flex h-full flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 transition-colors'>
      {/* 头部 */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
        <h2 className='text-sm font-semibold text-slate-700 dark:text-slate-300'>文件浏览</h2>
        {folderPath && (
          <Button
            onClick={handleCreateFile}
            size="sm"
            variant="ghost"
            className="text-xs h-7 px-2 dark:text-slate-300 dark:hover:text-slate-100"
          >
            + 新建
          </Button>
        )}
      </div>

      {/* 文件列表 */}
      <div className="flex-1 overflow-y-auto">
        {folderPath ? (
          <ul className='p-2 space-y-1'>
            {files.map((entry, index) => (
              <li
                key={index}
                className={`flex items-center gap-2 cursor-pointer rounded-md px-3 py-2 text-sm transition-colors
                  ${selectedFile === entry.name && entry.isFile 
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100 font-medium' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200'
                  }
                  ${!entry.isFile ? 'opacity-60' : ''}
                `}
                onClick={() => handleFileClick(entry.name, entry.isFile)}
              >
                {getFileIcon(entry.name, entry.isFile)}
                <span className="truncate">{entry.name}</span>
              </li>
            ))}
            {files.length === 0 && (
              <li className="text-center text-sm text-slate-400 dark:text-slate-500 py-8">
                文件夹为空
              </li>
            )}
          </ul>
        ) : (
          <div className="flex items-center justify-center h-full text-sm text-slate-400 dark:text-slate-500">
            请先选择一个文件夹
          </div>
        )}
      </div>
    </div>
  );
}
