'use client';

import './globals.css';
import './editor-theme.css';
import { useGlobalEventListeners } from '@/hooks/useGlobalEventListeners';
import { useEffect } from 'react';

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
        {/* Skip to main content link for keyboard navigation */}
        <a href="#main-content" className="skip-to-content">
          Skip to main content
        </a>
        
        {/* ARIA live region for status announcements */}
        <div 
          id="aria-live-region" 
          aria-live="polite" 
          aria-atomic="true"
          className="sr-only"
        />
        
        {/* ARIA live region for urgent announcements */}
        <div 
          id="aria-live-assertive" 
          aria-live="assertive" 
          aria-atomic="true"
          className="sr-only"
        />
        
        <main id="main-content">
          {children}
        </main>
      </body>
    </html>
  );
}
