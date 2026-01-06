'use client';

import { useI18n } from '@/hooks/useI18n';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { FileText, FolderOpen, Clock, Zap, TrendingUp, ArrowRight, Plus, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { t } = useI18n();
  const router = useRouter();

  const handleGoToHome = () => {
    router.push('/');
  };

  const stats = [
    {
      icon: <FileText className="size-5 text-primary" />,
      label: t('dashboard.totalFiles'),
      value: '24',
      change: '+12%',
      trend: 'up',
    },
    {
      icon: <FolderOpen className="size-5 text-primary" />,
      label: t('dashboard.totalFolders'),
      value: '8',
      change: '+5%',
      trend: 'up',
    },
    {
      icon: <Clock className="size-5 text-primary" />,
      label: t('dashboard.recentActivity'),
      value: '18',
      change: '+8%',
      trend: 'up',
    },
    {
      icon: <Zap className="size-5 text-primary" />,
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
    <div className="min-h-svh bg-gradient-to-br from-background via-background to-muted/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <Image
              src="/app-icon.svg"
              alt="OnlyWrite app icon"
              width={40}
              height={40}
              className="transition-transform duration-200 hover:scale-105"
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
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-all duration-200"
          >
            <Plus className="mr-2 size-4" />
            {t('dashboard.createNew')}
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="bg-white/90 dark:bg-card/90 backdrop-blur-sm shadow-md border border-border/50 hover:shadow-lg hover:border-primary/20 transition-all duration-300"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
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
          <Card className="lg:col-span-2 bg-white/90 dark:bg-card/90 backdrop-blur-sm shadow-lg border border-border/50 hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">{t('dashboard.recentFiles')}</CardTitle>
              <CardDescription className="text-sm">{t('dashboard.recentFilesDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 border border-border/50 hover:border-border transition-all duration-200 cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {file.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {file.date} · {file.size}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 dark:bg-card/90 backdrop-blur-sm shadow-lg border border-border/50 hover:shadow-xl transition-shadow duration-300">
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
                  className="w-full justify-start h-auto py-4 px-4 bg-background/50 hover:bg-accent border-border/80 shadow-sm hover:shadow-md transition-all duration-200 group"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary mr-3 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
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
                  <ArrowRight className="ml-auto size-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20 backdrop-blur-sm shadow-lg border border-primary/20">
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
                className="bg-background/50 hover:bg-background border-primary/30 hover:border-primary/50 shadow-sm hover:shadow-md transition-all duration-200 whitespace-nowrap"
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
