'use client';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { checkForAppUpdates } from '@/lib/updater';

import { open } from '@tauri-apps/plugin-dialog';
import { useTauriAppVersion } from '@/hooks/useTauriApp';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { FileArea } from '@/components/file-area';
import { WritingArea } from '@/components/writing-area';
import { ThemeToggle } from '@/components/theme-toggle';

export default function Home() {
  const appVersion = useTauriAppVersion();

  const [isCheckingUpdate, setIsCheckingUpdate] = useState(false);
  const [folderPath, setFolderPath] = useState<string | null>(null);
  const [selectedFilePath, setSelectedFilePath] = useState<string | null>(null);

  // 使用 useEffect 在组件挂载时检查更新
  useEffect(() => {
    checkForAppUpdates(false);
  }, []);

  const openFolder = async () => {
    const result = await open({
      directory: true,
      multiple: false,
    });

    if (typeof result === 'string') {
      setFolderPath(result);
      setSelectedFilePath(null);
    }
  };

  const handleFileSelect = (filePath: string) => {
    setSelectedFilePath(filePath);
  };

  return (
    <div className='flex h-screen flex-col bg-muted transition-colors'>
      {/* 顶部导航栏 */}
      <header
        className='interface-section-header flex items-center justify-between shadow-medium transition-colors'
        data-tauri-drag-region
      >
        <div className='flex items-center spacing-md'>
          <Image
            src='/app-icon.svg'
            alt='OnlyWrite app icon'
            width={32}
            height={32}
            priority
          />
          <div>
            <h1 className='text-lg font-bold text-foreground'>OnlyWrite</h1>
            <p className='text-xs text-muted-foreground'>专注写作的 Markdown 编辑器</p>
          </div>
        </div>
        
        <div className='flex items-center spacing-md'>
          {folderPath && (
            <div className="flex items-center spacing-sm text-sm text-muted-foreground">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
              <span className="truncate max-w-48">{folderPath.split(/[\\/]/).pop()}</span>
            </div>
          )}
          
          <ThemeToggle />
          
          <Button variant='ghost' size='sm' className="text-muted-foreground">
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
            className="border-border text-foreground"
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
        {!folderPath ? (
          /* 欢迎页面 */
          <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-background to-muted transition-colors">
            <div className="interface-section text-center max-w-md padding-3xl rounded-lg">
              <div className="margin-2xl">
                <Image
                  src='/app-icon.svg'
                  alt='OnlyWrite'
                  width={64}
                  height={64}
                  className="mx-auto margin-lg opacity-60 dark:opacity-80"
                />
                <h2 className="text-2xl font-bold text-foreground margin-sm">欢迎使用 OnlyWrite</h2>
                <p className="text-muted-foreground margin-2xl">
                  一个简洁优雅的 Markdown 写作应用<br />
                  开始你的写作之旅吧
                </p>
              </div>
              
              <Button
                onClick={openFolder}
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground padding-lg text-lg transition-all duration-200 ease-in-out hover:scale-105 active:scale-95 shadow-medium"
              >
                <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
                选择工作文件夹
              </Button>
              
              <div className="margin-2xl text-sm text-muted-foreground">
                <p>快捷键提示：</p>
                <div className="margin-sm spacing-xs flex flex-col">
                  <div><kbd className="padding-xs bg-muted rounded text-xs">Ctrl + S</kbd> 保存文件</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* 主工作区 */
          <ResizablePanelGroup direction='horizontal' className='flex-1'>
            <ResizablePanel defaultSize={25} minSize={20} maxSize={40}>
              <FileArea
                folderPath={folderPath}
                onFileSelect={handleFileSelect}
              />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={75} minSize={60}>
              <WritingArea
                folderPath={folderPath}
                filePath={selectedFilePath}
              />
            </ResizablePanel>
          </ResizablePanelGroup>
        )}
      </div>

      {/* 底部状态栏 */}
      <footer className='border-t border-border bg-background padding-sm text-xs text-muted-foreground transition-colors shadow-subtle'>
        <div className='flex items-center justify-between'>
          <div className="flex items-center spacing-lg">
            <span>© {new Date().getFullYear()} OnlyWrite</span>
            {folderPath && (
              <Button
                variant="ghost"
                size="sm"
                onClick={openFolder}
                className="h-6 padding-xs text-xs text-muted-foreground hover:text-foreground"
              >
                切换文件夹
              </Button>
            )}
          </div>
          <span>版本 {appVersion.version}</span>
        </div>
      </footer>
    </div>
  );
}
