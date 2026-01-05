'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { checkForAppUpdates } from '@/lib/updater';

import { open } from '@tauri-apps/plugin-dialog';
import { useTauriAppVersion } from '@/hooks/useTauriApp';
import { FileArea } from '@/components/file-area';
import { WritingArea } from '@/components/writing-area';
import { ThemeToggle } from '@/components/theme-toggle';
import { LanguageToggle } from '@/components/language-toggle';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { FolderOpen, PanelLeft, Sparkles } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useI18n } from '@/hooks/useI18n';

export default function Home() {
  const { t } = useI18n();
  const appVersion = useTauriAppVersion();

  const [isCheckingUpdate, setIsCheckingUpdate] = useState(false);
  const [folderPath, setFolderPath] = useState<string | null>(null);
  const [selectedFilePath, setSelectedFilePath] = useState<string | null>(null);
  const [isFileSheetOpen, setIsFileSheetOpen] = useState(false);

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
    setIsFileSheetOpen(false);
  };

  const folderName = useMemo(() => {
    if (!folderPath) return null;
    const parts = folderPath.split(/[\\/]/);
    return parts[parts.length - 1] || folderPath;
  }, [folderPath]);

  const fileName = useMemo(() => {
    if (!selectedFilePath) return null;
    const parts = selectedFilePath.split(/[\\/]/);
    return parts[parts.length - 1] || selectedFilePath;
  }, [selectedFilePath]);

  return (
    <div className='flex min-h-svh flex-col bg-muted transition-colors'>
      {/* 顶部导航栏 */}
      <Card
        className="rounded-none border-x-0 border-t-0 bg-background/80 shadow-subtle backdrop-blur py-0 gap-0"
        data-tauri-drag-region
      >
        <CardContent className="flex items-center justify-between gap-3 px-4 py-3">
          <div className='flex min-w-0 items-center spacing-md'>
            <Image
              src='/app-icon.svg'
              alt='OnlyWrite app icon'
              width={32}
              height={32}
              priority
            />
            <div className="min-w-0">
              <h1 className='text-lg font-bold text-foreground'>OnlyWrite</h1>
              <p className='text-xs text-muted-foreground'>
                {t('app.subtitle')}
              </p>
            </div>
            {folderName && (
              <Badge variant="secondary" className="hidden md:inline-flex">
                {folderName}
              </Badge>
            )}
            {fileName && (
              <Badge variant="outline" className="hidden lg:inline-flex">
                {fileName}
              </Badge>
            )}
          </div>

          <div className='flex items-center spacing-sm'>
          {folderPath && (
            <Sheet open={isFileSheetOpen} onOpenChange={setIsFileSheetOpen}>
              <SheetTrigger asChild>
                <Button variant='outline' size='sm' className="md:hidden">
                  <PanelLeft className="mr-1 size-4" />
                  {t('actions.openFiles')}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0">
                <SheetHeader className="border-b border-border">
                  <SheetTitle>{t('actions.openFiles')}</SheetTitle>
                </SheetHeader>
                <FileArea
                  folderPath={folderPath}
                  onFileSelect={handleFileSelect}
                  className="border-r-0 shadow-none"
                />
              </SheetContent>
            </Sheet>
          )}

          <Button
            variant='outline'
            size='sm'
            onClick={openFolder}
            className="border-border text-foreground"
          >
            <FolderOpen className="mr-1 size-4" />
            {folderPath ? t('actions.switchFolder') : t('actions.selectFolder')}
          </Button>

          <LanguageToggle />
          <ThemeToggle />

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
            {isCheckingUpdate ? t('actions.checking') : t('actions.checkUpdates')}
          </Button>
          </div>
        </CardContent>
      </Card>

      {/* 主体内容区域 */}
      <div className='flex flex-1 overflow-hidden'>
        {!folderPath ? (
          /* 欢迎页面 */
          <div className="flex flex-1 items-center justify-center bg-gradient-to-br from-background via-muted/30 to-muted transition-colors">
            <div className="grid w-full max-w-3xl gap-6 p-6 md:grid-cols-[1.2fr_1fr]">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <Sparkles className="size-5 text-primary" />
                    {t('app.welcomeTitle')}
                  </CardTitle>
                  <CardDescription>{t('app.welcomeLead')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 text-sm text-muted-foreground">
                  <Button
                    onClick={openFolder}
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    {t('actions.selectFolder')}
                  </Button>
                  <div className="grid gap-2 text-xs text-muted-foreground">
                    <div>{t('status.shortcutSave')}</div>
                    <div>{t('status.viewModes')}</div>
                    <div>{t('status.restoreHint')}</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>{t('app.efficiencyTitle')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-muted-foreground">
                  <div>
                    <p className="text-foreground">{t('app.efficiencyScanTitle')}</p>
                    <p>{t('app.efficiencyScanBody')}</p>
                  </div>
                  <div>
                    <p className="text-foreground">{t('app.efficiencySafeTitle')}</p>
                    <p>{t('app.efficiencySafeBody')}</p>
                  </div>
                  <div>
                    <p className="text-foreground">{t('app.efficiencyCrossTitle')}</p>
                    <p>{t('app.efficiencyCrossBody')}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          /* 主工作区 */
          <div className="flex flex-1 overflow-hidden">
            <div className="hidden md:flex flex-1">
              <ResizablePanelGroup direction="horizontal" className="flex-1">
                <ResizablePanel defaultSize={22} minSize={18} maxSize={35}>
                  <FileArea
                    folderPath={folderPath}
                    onFileSelect={handleFileSelect}
                  />
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={78}>
                  <div className="h-full p-3 md:p-4">
                    <WritingArea
                      folderPath={folderPath}
                      filePath={selectedFilePath}
                    />
                  </div>
                </ResizablePanel>
              </ResizablePanelGroup>
            </div>
            <div className="flex flex-1 p-3 md:hidden">
              <WritingArea
                folderPath={folderPath}
                filePath={selectedFilePath}
              />
            </div>
          </div>
        )}
      </div>

      {/* 底部状态栏 */}
      <Card className="rounded-none border-x-0 border-b-0 bg-background/80 shadow-subtle py-0 gap-0">
        <CardContent className="flex flex-wrap items-center justify-between gap-2 px-4 py-2 text-xs text-muted-foreground">
          <div className="flex items-center spacing-md">
            <span>{t('status.year', { year: new Date().getFullYear() })}</span>
            <Separator orientation="vertical" className="hidden h-3 sm:block" />
            <span className="hidden sm:inline">{t('editor.autosave')}</span>
          </div>
          <span>
            {t('status.version')} {appVersion.version}
          </span>
        </CardContent>
      </Card>
    </div>
  );
}
