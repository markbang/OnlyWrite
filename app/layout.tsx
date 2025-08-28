'use client';

import './globals.css';
import './editor-theme.css';
import { useGlobalEventListeners } from '@/hooks/useGlobalEventListeners';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useGlobalEventListeners();
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={`antialiased`}>
        {children}
      </body>
    </html>
  );
}
