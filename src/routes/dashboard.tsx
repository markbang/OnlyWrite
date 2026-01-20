import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useI18n } from '@/hooks/useI18n';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, FolderOpen, Clock, Zap, TrendingUp, ArrowRight, Plus, Star } from 'lucide-react';

export const Route = createFileRoute('/dashboard')({
  component: DashboardPage,
})


export default function DashboardPage() {
  const { t } = useI18n();
  const navigate = useNavigate();

  const handleGoToHome = () => {
    navigate({ to: '/' });
  };

  const stats = [
    {
      icon: <FileText className="size-5 text-foreground" strokeWidth={1.5} />,
      label: t('dashboard.totalFiles'),
      value: '24',
      change: '+12%',
      trend: 'up',
    },
    {
      icon: <FolderOpen className="size-5 text-foreground" strokeWidth={1.5} />,
      label: t('dashboard.totalFolders'),
      value: '8',
      change: '+5%',
      trend: 'up',
    },
    {
      icon: <Clock className="size-5 text-foreground" strokeWidth={1.5} />,
      label: t('dashboard.recentActivity'),
      value: '18',
      change: '+8%',
      trend: 'up',
    },
    {
      icon: <Zap className="size-5 text-foreground" strokeWidth={1.5} />,
      label: t('dashboard.streak'),
      value: '7',
      change: 'days',
      trend: 'neutral',
    },
  ];

  const recentFiles = [
    { name: 'Project Proposal.md', date: '2 hours ago', size: '24 KB' },
    { name: 'Meeting Notes.md', date: '5 hours ago', size: '12 KB' },
    { name: 'Research Paper.md', date: 'Yesterday', size: '156 KB' },
    { name: 'Quick Ideas.md', date: '2 days ago', size: '8 KB' },
  ];

  const quickActions = [
    {
      icon: <Plus className="size-5" />,
      title: t('dashboard.newDocument'),
      description: t('dashboard.newDocumentDesc'),
      action: handleGoToHome,
      variant: 'default' as const,
    },
    {
      icon: <FolderOpen className="size-5" />,
      title: t('dashboard.openFolder'),
      description: t('dashboard.openFolderDesc'),
      action: handleGoToHome,
      variant: 'outline' as const,
    },
    {
      icon: <Star className="size-5" />,
      title: t('dashboard.starred'),
      description: t('dashboard.starredDesc'),
      action: () => {},
      variant: 'outline' as const,
    },
    {
      icon: <TrendingUp className="size-5" />,
      title: t('dashboard.statistics'),
      description: t('dashboard.statisticsDesc'),
      action: () => {},
      variant: 'outline' as const,
    },
  ];

  return (
    <div className="min-h-svh bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <img
              src="/app-icon.svg"
              alt="OnlyWrite app icon"
              width={40}
              height={40}
            />
            <div>
              <h1 className="text-2xl font-bold text-foreground tracking-tight">
                {t('dashboard.welcome')}
              </h1>
              <p className="text-sm text-muted-foreground font-medium">
                {t('dashboard.welcomeSubtitle')}
              </p>
            </div>
          </div>
          <Button
            onClick={handleGoToHome}
          >
            <Plus className="mr-2 size-4" />
            {t('dashboard.createNew')}
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="bg-card border border-foreground"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center border border-foreground">
                      {stat.icon}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {stat.label}
                      </p>
                      <p className="text-2xl font-bold text-foreground mt-1">
                        {stat.value}
                      </p>
                    </div>
                  </div>
                  {stat.trend === 'up' && (
                    <Badge variant="secondary" className="text-xs">
                      {stat.change}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3 mb-8">
          <Card className="lg:col-span-2 bg-card border border-foreground">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">{t('dashboard.recentFiles')}</CardTitle>
              <CardDescription className="text-sm">{t('dashboard.recentFilesDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border border-foreground bg-background hover:bg-foreground hover:text-background transition-colors duration-100 cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="size-4 text-muted-foreground group-hover:text-background transition-colors duration-100" />
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {file.name}
                        </p>
                        <p className="text-xs text-muted-foreground group-hover:text-background">
                          {file.date} · {file.size}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="size-4 text-muted-foreground group-hover:text-background transition-colors duration-100" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border border-foreground">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">{t('dashboard.quickActions')}</CardTitle>
              <CardDescription className="text-sm">{t('dashboard.quickActionsDesc')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant={action.variant}
                  onClick={action.action}
                  className="w-full justify-start h-auto py-4 px-4 group"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center border border-foreground text-foreground mr-3 group-hover:bg-foreground group-hover:text-background transition-colors duration-100">
                    {action.icon}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-foreground">
                      {action.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {action.description}
                    </p>
                  </div>
                  <ArrowRight className="ml-auto size-4 text-muted-foreground group-hover:text-background transition-colors duration-100" />
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card className="bg-background border border-foreground">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">
                  {t('dashboard.proFeatureTitle')}
                </h3>
                <p className="text-sm text-muted-foreground max-w-lg">
                  {t('dashboard.proFeatureDesc')}
                </p>
              </div>
              <Button
                variant="outline"
                className="whitespace-nowrap"
              >
                {t('dashboard.learnMore')}
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
