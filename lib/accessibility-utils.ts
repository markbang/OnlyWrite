/**
 * Accessibility utilities for testing and validation
 */

export interface ColorContrastResult {
  ratio: number;
  level: 'AAA' | 'AA' | 'A' | 'FAIL';
  passes: {
    normalAA: boolean;
    normalAAA: boolean;
    largeAA: boolean;
    largeAAA: boolean;
  };
}

/**
 * Calculate color contrast ratio between two colors
 */
export function calculateContrastRatio(color1: string, color2: string): ColorContrastResult {
  const rgb1 = parseColor(color1);
  const rgb2 = parseColor(color2);
  
  if (!rgb1 || !rgb2) {
    return {
      ratio: 0,
      level: 'FAIL',
      passes: {
        normalAA: false,
        normalAAA: false,
        largeAA: false,
        largeAAA: false,
      },
    };
  }
  
  const l1 = getRelativeLuminance(rgb1);
  const l2 = getRelativeLuminance(rgb2);
  
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  
  const ratio = (lighter + 0.05) / (darker + 0.05);
  
  const passes = {
    normalAA: ratio >= 4.5,
    normalAAA: ratio >= 7,
    largeAA: ratio >= 3,
    largeAAA: ratio >= 4.5,
  };
  
  let level: ColorContrastResult['level'] = 'FAIL';
  if (passes.normalAAA) level = 'AAA';
  else if (passes.normalAA) level = 'AA';
  else if (passes.largeAA) level = 'A';
  
  return { ratio, level, passes };
}

/**
 * Parse color string to RGB values
 */
function parseColor(color: string): { r: number; g: number; b: number } | null {
  // Handle hex colors
  if (color.startsWith('#')) {
    const hex = color.slice(1);
    if (hex.length === 3) {
      return {
        r: parseInt(hex[0] + hex[0], 16),
        g: parseInt(hex[1] + hex[1], 16),
        b: parseInt(hex[2] + hex[2], 16),
      };
    } else if (hex.length === 6) {
      return {
        r: parseInt(hex.slice(0, 2), 16),
        g: parseInt(hex.slice(2, 4), 16),
        b: parseInt(hex.slice(4, 6), 16),
      };
    }
  }
  
  // Handle rgb/rgba colors
  const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (rgbMatch) {
    return {
      r: parseInt(rgbMatch[1]),
      g: parseInt(rgbMatch[2]),
      b: parseInt(rgbMatch[3]),
    };
  }
  
  // Handle CSS color names (basic set)
  const colorNames: Record<string, { r: number; g: number; b: number }> = {
    black: { r: 0, g: 0, b: 0 },
    white: { r: 255, g: 255, b: 255 },
    red: { r: 255, g: 0, b: 0 },
    green: { r: 0, g: 128, b: 0 },
    blue: { r: 0, g: 0, b: 255 },
    yellow: { r: 255, g: 255, b: 0 },
    cyan: { r: 0, g: 255, b: 255 },
    magenta: { r: 255, g: 0, b: 255 },
    gray: { r: 128, g: 128, b: 128 },
    grey: { r: 128, g: 128, b: 128 },
  };
  
  return colorNames[color.toLowerCase()] || null;
}

/**
 * Calculate relative luminance of an RGB color
 */
function getRelativeLuminance({ r, g, b }: { r: number; g: number; b: number }): number {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Test color contrast for common UI elements
 */
export function testColorContrasts(): Record<string, ColorContrastResult> {
  const results: Record<string, ColorContrastResult> = {};
  
  // Get computed styles for common elements
  const testElements = [
    { name: 'body-text', selector: 'body' },
    { name: 'primary-button', selector: 'button[data-variant="primary"], .bg-primary' },
    { name: 'secondary-button', selector: 'button[data-variant="secondary"], .bg-secondary' },
    { name: 'link-text', selector: 'a[href]' },
    { name: 'muted-text', selector: '.text-muted-foreground' },
    { name: 'sidebar-text', selector: '[data-sidebar="sidebar"]' },
  ];
  
  testElements.forEach(({ name, selector }) => {
    const element = document.querySelector(selector);
    if (element) {
      const styles = window.getComputedStyle(element);
      const color = styles.color;
      const backgroundColor = styles.backgroundColor;
      
      if (color && backgroundColor) {
        results[name] = calculateContrastRatio(color, backgroundColor);
      }
    }
  });
  
  return results;
}

/**
 * Check if an element has proper ARIA attributes
 */
export function validateAriaAttributes(element: HTMLElement): string[] {
  const issues: string[] = [];
  
  // Check for required ARIA attributes based on role
  const role = element.getAttribute('role');
  
  if (role) {
    switch (role) {
      case 'button':
        if (!element.hasAttribute('aria-label') && !element.textContent?.trim()) {
          issues.push('Button role requires aria-label or text content');
        }
        break;
        
      case 'textbox':
        if (!element.hasAttribute('aria-label') && !element.hasAttribute('aria-labelledby')) {
          issues.push('Textbox role requires aria-label or aria-labelledby');
        }
        break;
        
      case 'dialog':
        if (!element.hasAttribute('aria-label') && !element.hasAttribute('aria-labelledby')) {
          issues.push('Dialog role requires aria-label or aria-labelledby');
        }
        if (!element.hasAttribute('aria-modal')) {
          issues.push('Dialog should have aria-modal attribute');
        }
        break;
        
      case 'tab':
        if (!element.hasAttribute('aria-selected')) {
          issues.push('Tab role requires aria-selected attribute');
        }
        if (!element.hasAttribute('aria-controls')) {
          issues.push('Tab role should have aria-controls attribute');
        }
        break;
        
      case 'tabpanel':
        if (!element.hasAttribute('aria-labelledby')) {
          issues.push('Tabpanel role should have aria-labelledby attribute');
        }
        break;
    }
  }
  
  // Check for common ARIA issues
  const ariaLabelledby = element.getAttribute('aria-labelledby');
  if (ariaLabelledby) {
    const labelElement = document.getElementById(ariaLabelledby);
    if (!labelElement) {
      issues.push(`aria-labelledby references non-existent element: ${ariaLabelledby}`);
    }
  }
  
  const ariaDescribedby = element.getAttribute('aria-describedby');
  if (ariaDescribedby) {
    const descElement = document.getElementById(ariaDescribedby);
    if (!descElement) {
      issues.push(`aria-describedby references non-existent element: ${ariaDescribedby}`);
    }
  }
  
  // Check for invalid ARIA attributes
  const ariaAttributes = Array.from(element.attributes).filter(attr => 
    attr.name.startsWith('aria-')
  );
  
  const validAriaAttributes = [
    'aria-label', 'aria-labelledby', 'aria-describedby', 'aria-hidden',
    'aria-expanded', 'aria-selected', 'aria-checked', 'aria-disabled',
    'aria-required', 'aria-invalid', 'aria-live', 'aria-atomic',
    'aria-controls', 'aria-owns', 'aria-activedescendant', 'aria-modal',
    'aria-current', 'aria-pressed', 'aria-sort', 'aria-level',
    'aria-setsize', 'aria-posinset', 'aria-orientation', 'aria-multiselectable',
  ];
  
  ariaAttributes.forEach(attr => {
    if (!validAriaAttributes.includes(attr.name)) {
      issues.push(`Invalid ARIA attribute: ${attr.name}`);
    }
  });
  
  return issues;
}

/**
 * Check keyboard accessibility of an element
 */
export function validateKeyboardAccessibility(element: HTMLElement): string[] {
  const issues: string[] = [];
  
  // Check if interactive elements are focusable
  const interactiveElements = ['button', 'a', 'input', 'select', 'textarea'];
  const role = element.getAttribute('role');
  const tagName = element.tagName.toLowerCase();
  
  const isInteractive = interactiveElements.includes(tagName) || 
    ['button', 'link', 'textbox', 'combobox', 'listbox', 'tab'].includes(role || '');
  
  if (isInteractive) {
    const tabIndex = element.getAttribute('tabindex');
    const isDisabled = element.hasAttribute('disabled') || 
      element.getAttribute('aria-disabled') === 'true';
    
    if (!isDisabled && tabIndex === '-1') {
      issues.push('Interactive element should be focusable (tabindex should not be -1)');
    }
    
    // Check for click handlers without keyboard handlers
    const hasClickHandler = element.onclick !== null || 
      element.getAttribute('onclick') !== null;
    
    if (hasClickHandler && tagName !== 'button' && tagName !== 'a') {
      // Check for keyboard event handlers
      const hasKeyHandler = element.onkeydown !== null || 
        element.onkeyup !== null || 
        element.onkeypress !== null ||
        element.getAttribute('onkeydown') !== null ||
        element.getAttribute('onkeyup') !== null ||
        element.getAttribute('onkeypress') !== null;
      
      if (!hasKeyHandler && role !== 'button') {
        issues.push('Element with click handler should also handle keyboard events');
      }
    }
  }
  
  return issues;
}

/**
 * Run comprehensive accessibility audit on the page
 */
export function auditPageAccessibility(): {
  colorContrast: Record<string, ColorContrastResult>;
  ariaIssues: Array<{ element: string; issues: string[] }>;
  keyboardIssues: Array<{ element: string; issues: string[] }>;
  summary: {
    totalIssues: number;
    criticalIssues: number;
    warnings: number;
  };
} {
  const colorContrast = testColorContrasts();
  const ariaIssues: Array<{ element: string; issues: string[] }> = [];
  const keyboardIssues: Array<{ element: string; issues: string[] }> = [];
  
  // Test all interactive elements
  const interactiveElements = document.querySelectorAll(
    'button, a[href], input, select, textarea, [role="button"], [role="link"], [role="textbox"], [tabindex]:not([tabindex="-1"])'
  );
  
  interactiveElements.forEach((element, index) => {
    const htmlElement = element as HTMLElement;
    const elementId = htmlElement.id || `element-${index}`;
    
    const ariaValidation = validateAriaAttributes(htmlElement);
    if (ariaValidation.length > 0) {
      ariaIssues.push({ element: elementId, issues: ariaValidation });
    }
    
    const keyboardValidation = validateKeyboardAccessibility(htmlElement);
    if (keyboardValidation.length > 0) {
      keyboardIssues.push({ element: elementId, issues: keyboardValidation });
    }
  });
  
  // Calculate summary
  const contrastFailures = Object.values(colorContrast).filter(
    result => !result.passes.normalAA
  ).length;
  
  const totalAriaIssues = ariaIssues.reduce((sum, item) => sum + item.issues.length, 0);
  const totalKeyboardIssues = keyboardIssues.reduce((sum, item) => sum + item.issues.length, 0);
  
  const criticalIssues = contrastFailures + totalAriaIssues;
  const warnings = totalKeyboardIssues;
  const totalIssues = criticalIssues + warnings;
  
  return {
    colorContrast,
    ariaIssues,
    keyboardIssues,
    summary: {
      totalIssues,
      criticalIssues,
      warnings,
    },
  };
}

/**
 * Generate accessibility report
 */
export function generateAccessibilityReport(): string {
  const audit = auditPageAccessibility();
  
  let report = '# Accessibility Audit Report\n\n';
  
  // Summary
  report += `## Summary\n`;
  report += `- Total Issues: ${audit.summary.totalIssues}\n`;
  report += `- Critical Issues: ${audit.summary.criticalIssues}\n`;
  report += `- Warnings: ${audit.summary.warnings}\n\n`;
  
  // Color Contrast
  report += `## Color Contrast Results\n\n`;
  Object.entries(audit.colorContrast).forEach(([name, result]) => {
    const status = result.passes.normalAA ? '✅' : '❌';
    report += `${status} **${name}**: ${result.ratio.toFixed(2)}:1 (${result.level})\n`;
  });
  report += '\n';
  
  // ARIA Issues
  if (audit.ariaIssues.length > 0) {
    report += `## ARIA Issues\n\n`;
    audit.ariaIssues.forEach(({ element, issues }) => {
      report += `**${element}**:\n`;
      issues.forEach(issue => {
        report += `- ${issue}\n`;
      });
      report += '\n';
    });
  }
  
  // Keyboard Issues
  if (audit.keyboardIssues.length > 0) {
    report += `## Keyboard Accessibility Issues\n\n`;
    audit.keyboardIssues.forEach(({ element, issues }) => {
      report += `**${element}**:\n`;
      issues.forEach(issue => {
        report += `- ${issue}\n`;
      });
      report += '\n';
    });
  }
  
  if (audit.summary.totalIssues === 0) {
    report += `## 🎉 No accessibility issues found!\n\n`;
    report += `The page appears to meet basic accessibility standards.\n`;
  }
  
  return report;
}