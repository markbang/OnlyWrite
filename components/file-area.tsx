import React from 'react';

export function FileArea() {
  const dummyFiles = [
    'document1.md',
    'notes.txt',
    'project-ideas.docx',
    'research-paper.pdf',
    'image.png',
  ];

  return (
    <div className='flex h-full flex-col rounded-md border border-slate-200 bg-white p-4 shadow-sm'>
      <h2 className='mb-4 text-lg font-semibold text-slate-700'>File Area</h2>
      <ul className='space-y-1 overflow-y-auto'>
        {dummyFiles.map((fileName, index) => (
          <li
            key={index}
            className='cursor-pointer rounded-md px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-800'
          >
            {fileName}
          </li>
        ))}
      </ul>
    </div>
  );
}
