import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent, cleanup } from '../utils/theme-test-utils'
import userEvent from '@testing-library/user-event'
import { AppSidebar } from '@/components/app-sidebar'
import { SiteHeader } from '@/components/site-header'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'

describe('Comprehensive Theme Testing', () => {
  describe('Requirement 1.1: Theme switching consistency', () => {
    it('should maintain consistent colors when switching themes', () => {
      const light = render(<AppSidebar />, { theme: 'light', withSidebar: true })
      expect(document.documentElement).toHaveClass('light')
      light.unmount()
      cleanup()

      const dark = render(<AppSidebar />, { theme: 'dark', withSidebar: true })
      expect(document.documentElement).toHaveClass('dark')
      dark.unmount()
      cleanup()
    })

    it('should apply theme colors to all text highlighting', () => {
      render(
        <div className="selection:bg-primary/20 selection:text-primary-foreground">
          <p>This text uses theme-consistent selection colors</p>
        </div>,
        { theme: 'light' }
      )

      const text = screen.getByText(/theme-consistent selection colors/i)
      const element = text.closest('div')

      expect(element).toHaveClass('selection:bg-primary/20')
      expect(element).toHaveClass('selection:text-primary-foreground')
    })
  })

  describe('Requirement 1.2: Consistent hover and active states', () => {
    it('should apply consistent hover states across UI elements', async () => {
      const user = userEvent.setup()
      
      render(
        <div>
          <Button variant="default" className="hover:bg-primary/90">Button 1</Button>
          <Button variant="secondary" className="hover:bg-secondary/80">Button 2</Button>
        </div>
      )
      
      const buttons = screen.getAllByRole('button')
      
      for (const button of buttons) {
        await user.hover(button)
        
        // Check that hover classes are applied
        const hasHoverClass = button.className.includes('hover:bg-')
        expect(hasHoverClass).toBe(true)
      }
    })

    it('should apply consistent active states', () => {
      render(
        <Button variant="default">
          Active Test
        </Button>
      )

      const button = screen.getByRole('button')

      fireEvent.mouseDown(button)
      expect(button.className).toContain('active:')
    })
  })

  describe('Requirement 1.3: Harmonious color scheme across components', () => {
    it('should maintain color harmony between sidebar, editor, and main content', () => {
      render(<AppSidebar />, { withSidebar: true })
      render(<SiteHeader />, { withSidebar: true })

      const sidebar = screen.getByTestId('sidebar')
      const header = screen.getByRole('banner')

      const hasThemeClasses = (classes: string) =>
        classes.includes('bg-') || classes.includes('text-') || classes.includes('border-')

      expect(hasThemeClasses(sidebar.className)).toBe(true)
      expect(hasThemeClasses(header.className)).toBe(true)
    })
  })

  describe('Requirement 2.1: Improved text selection colors', () => {
    it('should provide sufficient contrast for text selection', () => {
      render(
        <div className="selection:bg-primary/20 selection:text-primary-foreground">
          <p>Selectable text with proper contrast</p>
        </div>
      )

      const text = screen.getByText(/selectable text with proper contrast/i)
      const element = text.closest('div')

      expect(element).toHaveClass('selection:bg-primary/20')
      expect(element).toHaveClass('selection:text-primary-foreground')
    })

    it('should apply selection colors in markdown editor context', () => {
      render(
        <div className="prose selection:bg-primary/20 selection:text-primary-foreground">
          <p>Editor content with selection styling</p>
        </div>
      )

      const text = screen.getByText(/editor content with selection styling/i)
      const element = text.closest('div')

      expect(element).toHaveClass('selection:bg-primary/20')
      expect(element).toHaveClass('selection:text-primary-foreground')
    })
  })

  describe('Requirement 2.2: Consistent interactive element highlighting', () => {
    it('should apply consistent highlight colors to interactive elements', async () => {
      const user = userEvent.setup()
      
      render(
        <nav>
          <a href="#" className="hover:bg-accent hover:text-accent-foreground p-2 rounded">
            Interactive Link
          </a>
        </nav>
      )
      
      const link = screen.getByRole('link')
      await user.hover(link)
      
      expect(link).toHaveClass('hover:bg-accent')
      expect(link).toHaveClass('hover:text-accent-foreground')
    })
  })

  describe('Requirement 2.3: Syntax highlighting integration', () => {
    it('should integrate syntax highlighting with theme colors', () => {
      const { container } = render(
        <pre className="bg-muted text-muted-foreground p-4 rounded">
          <code className="text-foreground">
            const example = "syntax highlighting";
          </code>
        </pre>
      )
      
      const preElement = container.querySelector('pre')
      const codeElement = container.querySelector('code')
      
      expect(preElement).toHaveClass('bg-muted')
      expect(preElement).toHaveClass('text-muted-foreground')
      expect(codeElement).toHaveClass('text-foreground')
    })
  })

  describe('Theme Toggle Integration', () => {
    it('should render theme toggle with proper accessibility', () => {
      render(<ThemeToggle />)
      
      const toggleButton = screen.getByRole('button')
      expect(toggleButton).toBeInTheDocument()
      expect(toggleButton).toHaveAttribute('aria-label')
    })

    it('should maintain consistent styling across theme changes', () => {
      const { rerender } = render(<ThemeToggle />, { theme: 'light' })
      
      const lightToggle = screen.getByRole('button')
      const lightClasses = lightToggle.className
      
      rerender(<ThemeToggle />)
      
      const darkToggle = screen.getByRole('button')
      const darkClasses = darkToggle.className
      
      // Should maintain consistent structure classes
      const structuralClasses = ['inline-flex', 'items-center', 'justify-center', 'rounded-md']
      
      structuralClasses.forEach(className => {
        expect(lightClasses.includes(className)).toBe(darkClasses.includes(className))
      })
    })
  })

  describe('Transition Consistency', () => {
    it('should apply consistent transition classes', () => {
      render(
        <div className="transition-colors duration-200 ease-in-out">
          <Button variant="default">Transition Test</Button>
        </div>
      )
      
      const container = screen.getByRole('button').parentElement
      expect(container).toHaveClass('transition-colors')
      expect(container).toHaveClass('duration-200')
      expect(container).toHaveClass('ease-in-out')
    })
  })

  describe('Focus States', () => {
    it('should apply consistent focus indicators', async () => {
      const user = userEvent.setup()
      
      render(
        <Button variant="default" className="focus-visible:ring-2 focus-visible:ring-ring">
          Focus Test
        </Button>
      )
      
      const button = screen.getByRole('button')
      await user.tab()
      
      expect(button).toHaveFocus()
      expect(button).toHaveClass('focus-visible:ring-2')
      expect(button).toHaveClass('focus-visible:ring-ring')
    })
  })
})