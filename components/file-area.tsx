import React, { useEffect, useState } from 'react';
import { readDir } from '@tauri-apps/plugin-fs';
import { join } from '@tauri-apps/api/path';

interface FileAreaProps {
  folderPath: string | null;
  onFileSelect: (filePath: string) => void;
}

export function FileArea({ folderPath, onFileSelect }: FileAreaProps) {
  const [files, setFiles] = useState<string[]>([]);

  useEffect(() => {
    if (folderPath) {
      readDir(folderPath)
        .then((entries) => {
          const fileNames = entries.map((entry) => entry.name);
          setFiles(fileNames);
        })
        .catch(console.error);
    }
  }, [folderPath]);

  const handleFileClick = async (fileName: string) => {
    if (folderPath) {
      const filePath = await join(folderPath, fileName);
      onFileSelect(filePath);
    }
  };

  return (
    <div className='flex h-full flex-col rounded-md border border-slate-200 bg-white p-4 shadow-sm'>
      <h2 className='mb-4 text-lg font-semibold text-slate-700'>File Area</h2>
      <ul className='space-y-1 overflow-y-auto'>
        {files.map((fileName, index) => (
          <li
            key={index}
            className='cursor-pointer rounded-md px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-800'
            onClick={() => handleFileClick(fileName)}
          >
            {fileName}
          </li>
        ))}
      </ul>
    </div>
  );
}
