'use client';

import { useCallback } from 'react';

export interface AccessibilityOptions {
  priority?: 'polite' | 'assertive';
  delay?: number;
}

/**
 * Hook for managing accessibility features and announcements
 */
export function useAccessibility() {
  /**
   * Announce a message to screen readers
   */
  const announce = useCallback((message: string, options: AccessibilityOptions = {}) => {
    const { priority = 'polite', delay = 0 } = options;
    
    const announceMessage = () => {
      const liveRegionId = priority === 'assertive' ? 'aria-live-assertive' : 'aria-live-region';
      const liveRegion = document.getElementById(liveRegionId);
      
      if (liveRegion) {
        // Clear previous message
        liveRegion.textContent = '';
        
        // Set new message after a brief delay to ensure screen readers pick it up
        setTimeout(() => {
          liveRegion.textContent = message;
        }, 10);
        
        // Clear message after 5 seconds to prevent clutter
        setTimeout(() => {
          if (liveRegion.textContent === message) {
            liveRegion.textContent = '';
          }
        }, 5000);
      }
    };
    
    if (delay > 0) {
      setTimeout(announceMessage, delay);
    } else {
      announceMessage();
    }
  }, []);
  
  /**
   * Focus an element with proper error handling
   */
  const focusElement = useCallback((elementOrSelector: HTMLElement | string, options?: FocusOptions) => {
    try {
      let element: HTMLElement | null = null;
      
      if (typeof elementOrSelector === 'string') {
        element = document.querySelector(elementOrSelector);
      } else {
        element = elementOrSelector;
      }
      
      if (element && typeof element.focus === 'function') {
        element.focus(options);
        return true;
      }
      
      console.warn('Element not found or not focusable:', elementOrSelector);
      return false;
    } catch (error) {
      console.error('Error focusing element:', error);
      return false;
    }
  }, []);
  
  /**
   * Check if user prefers reduced motion
   */
  const prefersReducedMotion = useCallback(() => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);
  
  /**
   * Check if user prefers high contrast
   */
  const prefersHighContrast = useCallback(() => {
    return window.matchMedia('(prefers-contrast: high)').matches;
  }, []);
  
  /**
   * Get the current color scheme preference
   */
  const getColorSchemePreference = useCallback(() => {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }, []);
  
  /**
   * Trap focus within a container element
   */
  const trapFocus = useCallback((container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstFocusable = focusableElements[0] as HTMLElement;
    const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstFocusable) {
            e.preventDefault();
            lastFocusable?.focus();
          }
        } else {
          if (document.activeElement === lastFocusable) {
            e.preventDefault();
            firstFocusable?.focus();
          }
        }
      }
      
      if (e.key === 'Escape') {
        // Allow escape to close modals/dialogs
        const closeButton = container.querySelector('[aria-label*="close"], [aria-label*="Close"]') as HTMLElement;
        closeButton?.click();
      }
    };
    
    container.addEventListener('keydown', handleKeyDown);
    
    // Focus first element
    firstFocusable?.focus();
    
    // Return cleanup function
    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  
  /**
   * Generate a unique ID for accessibility attributes
   */
  const generateId = useCallback((prefix: string = 'a11y') => {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);
  
  /**
   * Check if an element is visible to screen readers
   */
  const isVisibleToScreenReader = useCallback((element: HTMLElement) => {
    const style = window.getComputedStyle(element);
    
    return !(
      style.display === 'none' ||
      style.visibility === 'hidden' ||
      style.opacity === '0' ||
      element.hasAttribute('aria-hidden') ||
      element.hidden
    );
  }, []);
  
  return {
    announce,
    focusElement,
    prefersReducedMotion,
    prefersHighContrast,
    getColorSchemePreference,
    trapFocus,
    generateId,
    isVisibleToScreenReader,
  };
}

/**
 * Hook for managing keyboard navigation
 */
export function useKeyboardNavigation() {
  /**
   * Handle arrow key navigation for lists and grids
   */
  const handleArrowNavigation = useCallback((
    event: KeyboardEvent,
    items: HTMLElement[],
    currentIndex: number,
    options: {
      orientation?: 'horizontal' | 'vertical' | 'both';
      wrap?: boolean;
      columns?: number;
    } = {}
  ) => {
    const { orientation = 'vertical', wrap = true, columns = 1 } = options;
    let newIndex = currentIndex;
    
    switch (event.key) {
      case 'ArrowUp':
        if (orientation === 'vertical' || orientation === 'both') {
          event.preventDefault();
          newIndex = currentIndex - columns;
          if (newIndex < 0 && wrap) {
            newIndex = items.length - 1;
          }
        }
        break;
        
      case 'ArrowDown':
        if (orientation === 'vertical' || orientation === 'both') {
          event.preventDefault();
          newIndex = currentIndex + columns;
          if (newIndex >= items.length && wrap) {
            newIndex = 0;
          }
        }
        break;
        
      case 'ArrowLeft':
        if (orientation === 'horizontal' || orientation === 'both') {
          event.preventDefault();
          newIndex = currentIndex - 1;
          if (newIndex < 0 && wrap) {
            newIndex = items.length - 1;
          }
        }
        break;
        
      case 'ArrowRight':
        if (orientation === 'horizontal' || orientation === 'both') {
          event.preventDefault();
          newIndex = currentIndex + 1;
          if (newIndex >= items.length && wrap) {
            newIndex = 0;
          }
        }
        break;
        
      case 'Home':
        event.preventDefault();
        newIndex = 0;
        break;
        
      case 'End':
        event.preventDefault();
        newIndex = items.length - 1;
        break;
    }
    
    if (newIndex !== currentIndex && newIndex >= 0 && newIndex < items.length) {
      items[newIndex]?.focus();
      return newIndex;
    }
    
    return currentIndex;
  }, []);
  
  return {
    handleArrowNavigation,
  };
}