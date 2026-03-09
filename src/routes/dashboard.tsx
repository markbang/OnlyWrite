import { For, Show, createMemo } from 'solid-js'
import { useNavigate } from '@solidjs/router'
import {
  ArrowRight,
  Clock3,
  FileText,
  FolderOpen,
  Plus,
  Settings,
  Sparkles,
} from 'lucide-solid'
import { useI18n } from '@/components/i18n-provider'
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui'
import { getErrorMessage } from '@/lib/utils'
import { toast } from '@/state/toast'
import { workspace, workspaceActions } from '@/state/workspace'
import { openDirectoryPicker } from '@/lib/tauri'

export default function DashboardPage() {
  const { t } = useI18n()
  const navigate = useNavigate()

  const stats = createMemo(() => [
    {
      icon: <FileText class="size-5 text-foreground" />,
      label: t('dashboard.totalFiles'),
      value: String(workspace.files.filter((item) => item.isFile).length),
    },
    {
      icon: <FolderOpen class="size-5 text-foreground" />,
      label: t('dashboard.totalFolders'),
      value: workspace.folderPath ? '1' : '0',
    },
    {
      icon: <Clock3 class="size-5 text-foreground" />,
      label: t('dashboard.recentActivity'),
      value: String(workspace.recentFiles.length),
    },
    {
      icon: <Sparkles class="size-5 text-foreground" />,
      label: t('dashboard.streak'),
      value: workspace.folderPath ? 'ON' : '—',
    },
  ])

  const handleOpenFolder = async () => {
    try {
      const result = await openDirectoryPicker()
      if (!result) return
      workspaceActions.setFolderPath(result)
      await workspaceActions.loadFiles()
      navigate('/')
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  return (
    <div class="min-h-svh bg-background">
      <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div class="mb-8 flex items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <img src="/app-icon.svg" alt="OnlyWrite app icon" width="40" height="40" />
            <div>
              <h1 class="text-2xl font-bold tracking-tight text-foreground">{t('dashboard.welcome')}</h1>
              <p class="text-sm font-medium text-muted-foreground">{t('dashboard.welcomeSubtitle')}</p>
            </div>
          </div>
          <Button onClick={() => navigate('/')}>
            <Plus class="size-4" />
            {t('dashboard.createNew')}
          </Button>
        </div>

        <div class="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <For each={stats()}>
            {(stat) => (
              <Card class="border border-foreground bg-card">
                <CardContent class="p-6">
                  <div class="flex items-start justify-between">
                    <div class="flex items-center gap-3">
                      <div class="flex h-10 w-10 items-center justify-center border border-foreground">
                        {stat.icon}
                      </div>
                      <div>
                        <p class="text-sm font-medium text-muted-foreground">{stat.label}</p>
                        <p class="mt-1 text-2xl font-bold text-foreground">{stat.value}</p>
                      </div>
                    </div>
                    <Badge>{stat.value}</Badge>
                  </div>
                </CardContent>
              </Card>
            )}
          </For>
        </div>

        <div class="mb-8 grid gap-6 lg:grid-cols-3">
          <Card class="border border-foreground bg-card lg:col-span-2">
            <CardHeader>
              <CardTitle>{t('dashboard.recentFiles')}</CardTitle>
              <CardDescription>{t('dashboard.recentFilesDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <Show
                when={workspace.recentFiles.length > 0}
                fallback={<p class="text-sm text-muted-foreground">{t('dashboard.noRecentFiles')}</p>}
              >
                <div class="space-y-3">
                  <For each={workspace.recentFiles}>
                    {(file) => (
                      <button
                        class="group flex w-full items-center justify-between border border-foreground bg-background p-3 text-left transition-colors duration-100 hover:bg-foreground hover:text-background"
                        onClick={() => {
                          workspaceActions.setSelectedFile(file.path)
                          navigate('/')
                        }}
                      >
                        <div class="flex items-center gap-3">
                          <FileText class="size-4 text-muted-foreground transition-colors duration-100 group-hover:text-background" />
                          <div>
                            <p class="text-sm font-medium text-foreground">{file.name}</p>
                            <p class="text-xs text-muted-foreground group-hover:text-background">
                              {new Date(file.accessedAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <ArrowRight class="size-4 text-muted-foreground transition-colors duration-100 group-hover:text-background" />
                      </button>
                    )}
                  </For>
                </div>
              </Show>
            </CardContent>
          </Card>

          <Card class="border border-foreground bg-card">
            <CardHeader>
              <CardTitle>{t('dashboard.quickActions')}</CardTitle>
              <CardDescription>{t('dashboard.quickActionsDesc')}</CardDescription>
            </CardHeader>
            <CardContent class="space-y-3">
              <Button class="h-auto w-full justify-start px-4 py-4" onClick={() => navigate('/')}>
                <Plus class="size-4" />
                <div class="text-left">
                  <p class="text-sm font-medium">{t('dashboard.newDocument')}</p>
                  <p class="text-xs text-background/80">{t('dashboard.newDocumentDesc')}</p>
                </div>
              </Button>

              <Button
                variant="outline"
                class="h-auto w-full justify-start px-4 py-4"
                onClick={() => void handleOpenFolder()}
              >
                <FolderOpen class="size-4" />
                <div class="text-left">
                  <p class="text-sm font-medium">{t('dashboard.openFolder')}</p>
                  <p class="text-xs text-muted-foreground">{t('dashboard.openFolderDesc')}</p>
                </div>
              </Button>

              <Button variant="outline" class="h-auto w-full justify-start px-4 py-4" onClick={() => navigate('/')}>
                <ArrowRight class="size-4" />
                <div class="text-left">
                  <p class="text-sm font-medium">{t('dashboard.editorHome')}</p>
                  <p class="text-xs text-muted-foreground">{t('dashboard.editorHomeDesc')}</p>
                </div>
              </Button>

              <Button variant="outline" class="h-auto w-full justify-start px-4 py-4" onClick={() => navigate('/')}>
                <Settings class="size-4" />
                <div class="text-left">
                  <p class="text-sm font-medium">{t('dashboard.settings')}</p>
                  <p class="text-xs text-muted-foreground">{t('dashboard.settingsDesc')}</p>
                </div>
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card class="border border-foreground bg-background">
          <CardContent class="p-6">
            <div class="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div class="space-y-2">
                <h3 class="text-lg font-semibold text-foreground">{t('dashboard.proFeatureTitle')}</h3>
                <p class="max-w-lg text-sm text-muted-foreground">{t('dashboard.proFeatureDesc')}</p>
              </div>
              <Button variant="outline" class="whitespace-nowrap" onClick={() => navigate('/')}>
                {t('actions.learnMore')}
                <ArrowRight class="size-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
