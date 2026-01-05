'use client';

import './globals.css';
import './editor-theme.css';
import { useGlobalEventListeners } from '@/hooks/useGlobalEventListeners';
import { useEffect } from 'react';
import { I18nProvider } from '@/components/i18n-provider';
import { AppShell } from '@/components/app-shell';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useGlobalEventListeners();
  
  useEffect(() => {
    // Remove preload class after initial render to enable transitions
    const timer = setTimeout(() => {
      document.body.classList.remove('preload');
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="light dark" />
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#0f0f0f" media="(prefers-color-scheme: dark)" />
      </head>
      <body className={`antialiased preload`}>
        <I18nProvider>
          <AppShell>{children}</AppShell>
        </I18nProvider>
      </body>
    </html>
  );
}
