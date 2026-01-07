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
    <div className='flex min-h-svh flex-col bg-background'>
      <div className="fixed top-0 left-0 right-0 z-50 px-4 pt-4 sm:px-6">
        <Card
          className="mx-auto max-w-7xl bg-background border-b border-foreground border-x-0 border-t-0"
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
                <h1 className='text-lg font-display font-bold text-foreground tracking-tight'>OnlyWrite</h1>
                <p className='text-xs text-muted-foreground font-medium'>
                  {t('app.subtitle')}
                </p>
              </div>
              {folderName && (
                <Badge variant="secondary" className="hidden md:inline-flex">
                  <FolderOpen className="mr-1 size-3" />
                  {folderName}
                </Badge>
              )}
              {fileName && (
                <Badge variant="outline" className="hidden lg:inline-flex">
                  {fileName}
                </Badge>
              )}
            </div>

            <div className='flex items-center gap-2 sm:gap-3'>
            {folderPath && (
              <Sheet open={isFileSheetOpen} onOpenChange={setIsFileSheetOpen}>
                <SheetTrigger asChild>
                  <Button variant='outline' size='sm' className="md:hidden">
                    <PanelLeft className="mr-1 size-4" />
                    {t('actions.openFiles')}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0">
                  <SheetHeader className="border-b border-foreground bg-background">
                    <SheetTitle className="px-4 py-3">{t('actions.openFiles')}</SheetTitle>
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
            >
              <FolderOpen className="mr-1.5 size-4" />
              <span className="hidden sm:inline">
                {folderPath ? t('actions.switchFolder') : t('actions.selectFolder')}
              </span>
            </Button>

            <div className="flex items-center gap-1 sm:gap-2">
              <LanguageToggle />
              <ThemeToggle />
            </div>

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
              {isCheckingUpdate ? t('actions.checking') : t('actions.checkUpdates')}
            </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className='flex flex-1 pt-24 overflow-hidden'>
        {!folderPath ? (
          <div className="flex flex-1 items-center justify-center px-4 sm:px-6">
            <div className="w-full max-w-5xl gap-8 p-6">
              <div className="mb-12 flex items-center gap-4">
                <div className="h-[8px] flex-1 bg-foreground"></div>
                <div className="border-2 border-foreground p-1">
                  <div className="w-4 h-4 bg-foreground"></div>
                </div>
                <div className="h-[8px] flex-1 bg-foreground"></div>
              </div>

              <h2 className="text-[8rem] md:text-[10rem] font-display font-bold leading-none tracking-tighter mb-16">
                WRITE
              </h2>

              <div className="grid md:grid-cols-[1.2fr_1fr] gap-8">
                <Card className="bg-card border border-foreground p-8">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-2xl font-display tracking-tight">
                      <Sparkles className="size-5 text-foreground" strokeWidth={1.5} />
                      {t('app.welcomeTitle')}
                    </CardTitle>
                    <CardDescription className="text-sm font-medium font-body">{t('app.welcomeLead')}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <Button onClick={openFolder} className="w-full">
                      <FolderOpen className="mr-2 size-5" strokeWidth={1.5} />
                      {t('actions.selectFolder')}
                    </Button>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="inline-flex h-1.5 w-1.5 bg-foreground"></span>
                        {t('status.shortcutSave')}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="inline-flex h-1.5 w-1.5 bg-foreground"></span>
                        {t('status.viewModes')}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="inline-flex h-1.5 w-1.5 bg-foreground"></span>
                        {t('status.restoreHint')}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card border border-foreground p-6 flex-1">
                  <CardHeader>
                    <CardTitle className="text-lg font-display tracking-tight">{t('app.efficiencyTitle')}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-5 text-sm font-body">
                    <div className="flex gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center border border-foreground text-foreground">
                        <FolderOpen className="size-4" strokeWidth={1.5} />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{t('app.efficiencyScanTitle')}</p>
                        <p className="text-muted-foreground">{t('app.efficiencyScanBody')}</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center border border-foreground text-foreground">
                        <Sparkles className="size-4" strokeWidth={1.5} />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{t('app.efficiencySafeTitle')}</p>
                        <p className="text-muted-foreground">{t('app.efficiencySafeBody')}</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center border border-foreground text-foreground">
                        <FolderOpen className="size-4" strokeWidth={1.5} />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{t('app.efficiencyCrossTitle')}</p>
                        <p className="text-muted-foreground">{t('app.efficiencyCrossBody')}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-1 px-4 sm:px-6 pb-6">
            <div className="mx-auto w-full max-w-7xl hidden md:flex">
              <ResizablePanelGroup direction="horizontal" className="flex-1 gap-2">
                <ResizablePanel defaultSize={22} minSize={18} maxSize={35} className="min-w-0">
                  <FileArea
                    folderPath={folderPath}
                    onFileSelect={handleFileSelect}
                  />
                </ResizablePanel>
                <ResizableHandle withHandle className="bg-foreground/40 hover:bg-foreground transition-colors duration-100" />
                <ResizablePanel defaultSize={78} className="min-w-0">
                  <div className="h-full p-2">
                    <WritingArea
                      folderPath={folderPath}
                      filePath={selectedFilePath}
                    />
                  </div>
                </ResizablePanel>
              </ResizablePanelGroup>
            </div>
            <div className="flex flex-1 p-2 md:hidden">
              <WritingArea
                folderPath={folderPath}
                filePath={selectedFilePath}
              />
            </div>
          </div>
        )}
      </div>

      <Card className="fixed bottom-0 left-0 right-0 z-50 border-t border-foreground border-x-0 border-b-0 bg-background">
        <CardContent className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 text-xs">
          <div className="flex items-center gap-3 text-muted-foreground">
            <span className="font-medium">{t('status.year', { year: new Date().getFullYear() })}</span>
            <Separator orientation="vertical" className="hidden h-3.5 sm:block" />
            <span className="hidden sm:inline flex items-center gap-1.5">
              <span className="inline-flex h-1.5 w-1.5 bg-foreground"></span>
              {t('editor.autosave')}
            </span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="font-medium">
              {t('status.version')} {appVersion.version}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
