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
    <div className='flex min-h-svh flex-col bg-gradient-to-br from-background via-background to-muted/20 transition-colors'>
      <div className="fixed top-0 left-0 right-0 z-50 px-4 pt-4 sm:px-6">
        <Card
          className="mx-auto max-w-7xl bg-white/90 dark:bg-card/90 backdrop-blur-md shadow-lg border border-border/50"
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
                className="transition-transform duration-200 hover:scale-105"
              />
              <div className="min-w-0">
                <h1 className='text-lg font-bold text-foreground tracking-tight'>OnlyWrite</h1>
                <p className='text-xs text-muted-foreground font-medium'>
                  {t('app.subtitle')}
                </p>
              </div>
              {folderName && (
                <Badge variant="secondary" className="hidden md:inline-flex shadow-sm">
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
                  <Button variant='outline' size='sm' className="md:hidden bg-white/50 hover:bg-accent">
                    <PanelLeft className="mr-1 size-4" />
                    {t('actions.openFiles')}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0">
                  <SheetHeader className="border-b border-border bg-muted/30">
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
              className="bg-white/50 hover:bg-accent border-border/80 shadow-sm hover:shadow-md transition-all duration-200"
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
              className="bg-white/50 hover:bg-accent border-border/80 shadow-sm hover:shadow-md transition-all duration-200"
            >
              {isCheckingUpdate ? t('actions.checking') : t('actions.checkUpdates')}
            </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className='flex flex-1 pt-24 overflow-hidden'>
        {!folderPath ? (
          <div className="flex flex-1 items-center justify-center px-4 sm:px-6 transition-colors">
            <div className="grid w-full max-w-5xl gap-8 p-6 md:grid-cols-[1.2fr_1fr]">
              <Card className="bg-white/80 dark:bg-card/80 backdrop-blur-sm shadow-lg border border-border/50 hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <Sparkles className="size-5 text-primary" />
                    {t('app.welcomeTitle')}
                  </CardTitle>
                  <CardDescription className="text-sm font-medium">{t('app.welcomeLead')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Button
                    onClick={openFolder}
                    size="lg"
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    <FolderOpen className="mr-2 size-5" />
                    {t('actions.selectFolder')}
                  </Button>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="inline-flex h-1.5 w-1.5 rounded-full bg-primary"></span>
                      {t('status.shortcutSave')}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="inline-flex h-1.5 w-1.5 rounded-full bg-primary"></span>
                      {t('status.viewModes')}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="inline-flex h-1.5 w-1.5 rounded-full bg-primary"></span>
                      {t('status.restoreHint')}
                    </div>
                  </div>
                </CardContent>
              </Card>
              <div className="flex flex-col gap-4">
                <Card className="flex-1 bg-white/80 dark:bg-card/80 backdrop-blur-sm shadow-md border border-border/50 hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle className="text-lg">{t('app.efficiencyTitle')}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-5 text-sm">
                    <div className="flex gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <FolderOpen className="size-4" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{t('app.efficiencyScanTitle')}</p>
                        <p className="text-muted-foreground">{t('app.efficiencyScanBody')}</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Sparkles className="size-4" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{t('app.efficiencySafeTitle')}</p>
                        <p className="text-muted-foreground">{t('app.efficiencySafeBody')}</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <FolderOpen className="size-4" />
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
                <ResizableHandle withHandle className="bg-border/50 hover:bg-border transition-colors" />
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

      <Card className="fixed bottom-0 left-0 right-0 z-50 rounded-none border-t border-border/50 bg-white/90 dark:bg-card/90 backdrop-blur-md shadow-lg">
        <CardContent className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 text-xs">
          <div className="flex items-center gap-3 text-muted-foreground">
            <span className="font-medium">{t('status.year', { year: new Date().getFullYear() })}</span>
            <Separator orientation="vertical" className="hidden h-3.5 sm:block" />
            <span className="hidden sm:inline flex items-center gap-1.5">
              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-green-500"></span>
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
