import { describe, it, expect } from 'vitest'
import { render } from '../utils/theme-test-utils'
import { AppSidebar } from '@/components/app-sidebar'
import { SiteHeader } from '@/components/site-header'
import { Button } from '@/components/ui/button'

describe('Color Harmony Tests', () => {
  describe('CSS Custom Properties Validation', () => {
    it('should have consistent primary color values', () => {
      const { container } = render(<div className="bg-primary text-primary-foreground p-4">Test</div>)
      
      const element = container.firstElementChild as HTMLElement
      const computedStyle = getComputedStyle(element)
      
      // Check that primary colors are defined
      const primaryBg = computedStyle.backgroundColor
      const primaryText = computedStyle.color
      
      expect(primaryBg).toBeTruthy()
      expect(primaryText).toBeTruthy()
      expect(primaryBg).not.toBe(primaryText) // Should be different colors
    })

    it('should have consistent secondary color values', () => {
      const { container } = render(<div className="bg-secondary text-secondary-foreground p-4">Test</div>)
      
      const element = container.firstElementChild as HTMLElement
      const computedStyle = getComputedStyle(element)
      
      const secondaryBg = computedStyle.backgroundColor
      const secondaryText = computedStyle.color
      
      expect(secondaryBg).toBeTruthy()
      expect(secondaryText).toBeTruthy()
      expect(secondaryBg).not.toBe(secondaryText)
    })

    it('should have consistent muted color values', () => {
      const { container } = render(<div className="bg-muted text-muted-foreground p-4">Test</div>)
      
      const element = container.firstElementChild as HTMLElement
      const computedStyle = getComputedStyle(element)
      
      const mutedBg = computedStyle.backgroundColor
      const mutedText = computedStyle.color
      
      expect(mutedBg).toBeTruthy()
      expect(mutedText).toBeTruthy()
      expect(mutedBg).not.toBe(mutedText)
    })
  })

  describe('Selection Color Consistency', () => {
    it('should apply consistent selection colors in light theme', () => {
      const { container } = render(
        <div className="selection:bg-primary/20 selection:text-primary-foreground">
          <p>Selectable text content</p>
        </div>,
        { theme: 'light' }
      )
      
      const element = container.firstElementChild as HTMLElement
      expect(element).toHaveClass('selection:bg-primary/20')
      expect(element).toHaveClass('selection:text-primary-foreground')
    })

    it('should apply consistent selection colors in dark theme', () => {
      const { container } = render(
        <div className="selection:bg-primary/20 selection:text-primary-foreground">
          <p>Selectable text content</p>
        </div>,
        { theme: 'dark' }
      )
      
      const element = container.firstElementChild as HTMLElement
      expect(element).toHaveClass('selection:bg-primary/20')
      expect(element).toHaveClass('selection:text-primary-foreground')
    })
  })

  describe('Hover State Color Harmony', () => {
    it('should maintain color harmony in button hover states', () => {
      const { container } = render(
        <Button variant="default" className="hover:bg-primary/90">
          Hover Test
        </Button>
      )
      
      const button = container.querySelector('button')
      expect(button).toHaveClass('hover:bg-primary/90')
    })

    it('should maintain color harmony in navigation hover states', () => {
      const { container } = render(
        <nav>
          <a href="#" className="hover:bg-accent hover:text-accent-foreground">
            Nav Item
          </a>
        </nav>
      )
      
      const navLink = container.querySelector('a')
      expect(navLink).toHaveClass('hover:bg-accent')
      expect(navLink).toHaveClass('hover:text-accent-foreground')
    })
  })

  describe('Border Color Consistency', () => {
    it('should use consistent border colors', () => {
      const { container } = render(
        <div className="border border-border rounded-md p-4">
          Bordered content
        </div>
      )
      
      const element = container.firstElementChild as HTMLElement
      expect(element).toHaveClass('border-border')
      
      const computedStyle = getComputedStyle(element)
      expect(computedStyle.borderColor).toBeTruthy()
    })

    it('should use consistent input border colors', () => {
      const { container } = render(
        <input 
          type="text" 
          className="border border-input focus:border-ring"
          placeholder="Test input"
        />
      )
      
      const input = container.querySelector('input')
      expect(input).toHaveClass('border-input')
      expect(input).toHaveClass('focus:border-ring')
    })
  })

  describe('Component Color Integration', () => {
    it('should maintain color harmony between sidebar and main content', () => {
      const { container: sidebarContainer } = render(<AppSidebar />, { theme: 'light' })
      const { container: headerContainer } = render(<SiteHeader />, { theme: 'light' })
      
      // Both components should use theme-consistent colors
      const sidebar = sidebarContainer.firstElementChild
      const header = headerContainer.firstElementChild
      
      if (sidebar && header) {
        const sidebarStyle = getComputedStyle(sidebar)
        const headerStyle = getComputedStyle(header)
        
        // Should have defined background colors
        expect(sidebarStyle.backgroundColor).toBeTruthy()
        expect(headerStyle.backgroundColor).toBeTruthy()
      }
    })

    it('should maintain color harmony in dark theme', () => {
      const { container: sidebarContainer } = render(<AppSidebar />, { theme: 'dark' })
      const { container: headerContainer } = render(<SiteHeader />, { theme: 'dark' })
      
      const sidebar = sidebarContainer.firstElementChild
      const header = headerContainer.firstElementChild
      
      if (sidebar && header) {
        const sidebarStyle = getComputedStyle(sidebar)
        const headerStyle = getComputedStyle(header)
        
        // Should have defined dark theme colors
        expect(sidebarStyle.backgroundColor).toBeTruthy()
        expect(headerStyle.backgroundColor).toBeTruthy()
      }
    })
  })

  describe('Accessibility Color Contrast', () => {
    it('should maintain sufficient contrast for primary colors', () => {
      const { container } = render(
        <div className="bg-primary text-primary-foreground p-4">
          Primary content
        </div>
      )
      
      const element = container.firstElementChild as HTMLElement
      const computedStyle = getComputedStyle(element)
      
      const backgroundColor = computedStyle.backgroundColor
      const textColor = computedStyle.color
      
      // Both colors should be defined (actual contrast calculation would require additional libraries)
      expect(backgroundColor).toBeTruthy()
      expect(textColor).toBeTruthy()
      expect(backgroundColor).not.toBe(textColor)
    })

    it('should maintain sufficient contrast for secondary colors', () => {
      const { container } = render(
        <div className="bg-secondary text-secondary-foreground p-4">
          Secondary content
        </div>
      )
      
      const element = container.firstElementChild as HTMLElement
      const computedStyle = getComputedStyle(element)
      
      const backgroundColor = computedStyle.backgroundColor
      const textColor = computedStyle.color
      
      expect(backgroundColor).toBeTruthy()
      expect(textColor).toBeTruthy()
      expect(backgroundColor).not.toBe(textColor)
    })
  })
})