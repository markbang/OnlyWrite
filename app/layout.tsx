'use client';

import './globals.css';
import './editor-theme.css';
import { useGlobalEventListeners } from '@/hooks/useGlobalEventListeners';
import { ThemeProvider } from '@/hooks/useTheme';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useGlobalEventListeners();
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={`antialiased`}>
        <ThemeProvider
          defaultTheme="system"
          storageKey="onlywrite-theme"
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
