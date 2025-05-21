import React from 'react';

export function WritingArea() {
  return (
    <div className='flex h-full flex-col rounded-md border border-slate-200 bg-white p-4 shadow-sm'>
      <h2 className='mb-4 text-lg font-semibold text-slate-700'>Writing Area</h2>
      <textarea
        className='flex-1 resize-none rounded-md border border-slate-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
        placeholder='Start writing here...'
      />
    </div>
  );
}
