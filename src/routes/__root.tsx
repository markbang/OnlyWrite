import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router'
import { useEffect } from 'react'
import { useGlobalEventListeners } from '@/hooks/useGlobalEventListeners'
import { I18nProvider } from '@/components/i18n-provider'
import { AppShell } from '@/components/app-shell'
import globalStyles from './globals.css?url'
import editorThemeStyles from './editor-theme.css?url'
import fontStyles from './fonts.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'color-scheme', content: 'light dark' },
      {
        name: 'theme-color',
        content: '#ffffff',
        media: '(prefers-color-scheme: light)',
      },
      {
        name: 'theme-color',
        content: '#000000',
        media: '(prefers-color-scheme: dark)',
      },
    ],
    links: [
      { rel: 'stylesheet', href: globalStyles },
      { rel: 'stylesheet', href: editorThemeStyles },
      { rel: 'stylesheet', href: fontStyles },
      { rel: 'icon', href: '/favicon.ico' },
    ],
  }),
  shellComponent: RootDocument,
  component: RootLayout,
})

function RootLayout() {
  useGlobalEventListeners()

  useEffect(() => {
    const timer = setTimeout(() => {
      document.body.classList.remove('preload')
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  return (
    <I18nProvider>
      <AppShell>
        <Outlet />
      </AppShell>
    </I18nProvider>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="antialiased preload">
        {children}
        <Scripts />
      </body>
    </html>
  )
}
