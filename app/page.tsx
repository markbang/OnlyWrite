'use client';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { checkForAppUpdates } from '@/lib/updater';

import { invoke } from '@tauri-apps/api/core';
import { message } from '@tauri-apps/plugin-dialog';
import { useTauriAppVersion, useTauriOsType } from '@/hooks/useTauriApp';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { FileArea } from '@/components/file-area';
import { WritingArea } from '@/components/writing-area';

export default function Home() {
  const appVersion = useTauriAppVersion();
  const osType = useTauriOsType();

  const [isCheckingUpdate, setIsCheckingUpdate] = useState(false);
  // 新增状态追踪 scoop 更新过程
  const [isUpdatingScoop, setIsUpdatingScoop] = useState(false);

  // 使用 useEffect 在组件挂载时检查更新和获取操作系统类型
  useEffect(() => {
    checkForAppUpdates(false);
  }, []);

  // 将 scoopUpdate 移动到组件内部
  const scoopUpdate = () => {
    if (osType !== 'windows') {
      message('仅支持 Windows 系统的 Scoop 更新');
      return;
    }
    setIsUpdatingScoop(true);
    invoke('scoop_update')
      .then(() => {
        message('Scoop 更新完成');
      })
      .catch((error) => {
        console.error(error);
        message('更新失败，请检查 Scoop 是否安装');
      })
      .finally(() => {
        setIsUpdatingScoop(false);
      });
  };

  return (
    <div className='flex h-screen flex-col bg-slate-50'>
      {/* 顶部导航栏 */}
      <header
        className='flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3'
        data-tauri-drag-region
      >
        <div className='flex items-center gap-3'>
          <Image
            src='/app-icon.svg'
            alt='Onlywrite app icon'
            width={36}
            height={36}
            priority
          />
          <h1 className='text-xl font-semibold text-slate-800'>OnlyWrite</h1>
        </div>
        <div className='flex items-center gap-2'>
          <Button
            variant='ghost'
            size='sm'
            onClick={scoopUpdate}
            disabled={isUpdatingScoop}
          >
            {isUpdatingScoop ? (
              <>
                <span className='mr-2 h-4 w-4 animate-spin'>◌</span>
                更新中...
              </>
            ) : (
              'Update Scoop App'
            )}
          </Button>
          <Button variant='ghost' size='sm'>
            帮助
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={() => {
              setIsCheckingUpdate(true);
              checkForAppUpdates(true).finally(() => {
                setIsCheckingUpdate(false);
              });
            }}
            disabled={isCheckingUpdate}
          >
            {isCheckingUpdate ? (
              <>
                <span className='mr-2 h-4 w-4 animate-spin'>◌</span>
                检查中...
              </>
            ) : (
              '检查更新'
            )}
          </Button>
        </div>
      </header>

      {/* 主体内容区域 */}
      <div className='flex flex-1 overflow-hidden'>
        {/* 侧边栏 */}
        <aside className='w-64 border-r border-slate-200 bg-white p-4'>
          <div className='mb-6'>
            <h3 className='mb-3 font-medium text-slate-500'>快速访问</h3>
            <div className='space-y-1'>
              <Button
                variant='ghost'
                className='w-full justify-start'
                size='sm'
              >
                <svg
                  className='mr-2 h-4 w-4'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M12 4v16m8-8H4'
                  />
                </svg>
                新建文档
              </Button>
              <Button
                variant='ghost'
                className='w-full justify-start'
                size='sm'
              >
                <svg
                  className='mr-2 h-4 w-4'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z'
                  />
                </svg>
                打开项目
              </Button>
              <Button
                variant='ghost'
                className='w-full justify-start'
                size='sm'
              >
                <svg
                  className='mr-2 h-4 w-4'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z'
                  />
                </svg>
                收藏夹
              </Button>
            </div>
          </div>
          <div>
            <h3 className='mb-3 font-medium text-slate-500'>最近文档</h3>
            <div className='space-y-1'>
              <Button
                variant='ghost'
                className='w-full justify-start text-left'
                size='sm'
              >
                <svg
                  className='mr-2 h-4 w-4'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z'
                  />
                </svg>
                我的第一篇文章.md
              </Button>
              <Button
                variant='ghost'
                className='w-full justify-start text-left'
                size='sm'
              >
                <svg
                  className='mr-2 h-4 w-4'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z'
                  />
                </svg>
                项目规划.md
              </Button>
            </div>
          </div>
        </aside>

        {/* 主内容区 */}
        <main className='flex-1 flex flex-col overflow-hidden'>
          <ResizablePanelGroup direction='horizontal' className='flex-1'>
            <ResizablePanel defaultSize={25} minSize={15}>
              <FileArea />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={75} minSize={30}>
              <WritingArea />
            </ResizablePanel>
          </ResizablePanelGroup>
        </main>
      </div>

      {/* 底部状态栏 */}
      <footer className='border-t border-slate-200 bg-white px-6 py-2 text-sm text-slate-500'>
        <div className='flex items-center justify-between'>
          <span>© {new Date().getFullYear()} OnlyWrite</span>
          <span>版本 {appVersion.version}</span>
        </div>
      </footer>
    </div>
  );
}
