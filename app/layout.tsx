'use client';

import './globals.css';
import './editor-theme.css';
import { useGlobalEventListeners } from '@/hooks/useGlobalEventListeners';
import { useEffect } from 'react';
import { I18nProvider } from '@/components/i18n-provider';
import { AppShell } from '@/components/app-shell';
import {
  JetBrains_Mono,
  Playfair_Display,
  Source_Serif_4,
} from 'next/font/google';

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display-family',
});

const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body-family',
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono-family',
});

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
    <html
      lang='en'
      suppressHydrationWarning
      className={`${playfairDisplay.variable} ${sourceSerif.variable} ${jetBrainsMono.variable}`}
    >
      <head>
        <meta name="color-scheme" content="light dark" />
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#000000" media="(prefers-color-scheme: dark)" />
      </head>
      <body className="antialiased preload">
        <I18nProvider>
          <AppShell>{children}</AppShell>
        </I18nProvider>
      </body>
    </html>
  );
}
