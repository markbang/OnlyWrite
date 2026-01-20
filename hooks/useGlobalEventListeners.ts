'use client';

import { useEffect } from 'react';

// Handler for disabling context menu
const handleContextMenu = (e: MouseEvent) => {
  e.preventDefault();
};

// Handler for disabling key
const handleKeyDown = (e: KeyboardEvent) => {
  // Disable F12
  if (e.key === 'F12') {
    e.preventDefault();
  }
};

/**
 * Custom Hook to add global event listeners for application-wide effects,
 * like disabling context menu and developer tools outside development.
 */
export function useGlobalEventListeners() {
  useEffect(() => {
    // --- Always add context menu listener ---
    window.addEventListener('contextmenu', handleContextMenu);

    // --- Conditionally add keydown listener (only NOT in development) ---
    let isKeyDownListenerAdded = false;
    const isDev = import.meta.env.DEV
    if (!isDev) {
      window.addEventListener('keydown', handleKeyDown)
      isKeyDownListenerAdded = true
    }

    // --- Cleanup function ---
    // This runs when the component using the hook unmounts.
    // In _app.js or root layout, this effectively means when the app closes or during hot reload.
    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
      console.log('Global context menu listener removed.');

      if (isKeyDownListenerAdded) {
        window.removeEventListener('keydown', handleKeyDown);
        console.log('Global keydown listener removed.');
      }
    };
  }, []); // Empty dependency array ensures this runs only once on mount
}
