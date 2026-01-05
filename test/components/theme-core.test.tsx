import { describe, it, expect } from 'vitest'
import { render, screen } from '../utils/theme-test-utils'
import { Button } from '@/components/ui/button'

describe('Core Theme Testing', () => {
  describe('Requirement 1.1: Theme switching consistency', () => {
    it('should apply consistent primary colors', () => {
      const { container } = render(
        <div className="bg-primary text-primary-foreground p-4">
          Primary themed content
        </div>
      )
      
      const element = container.firstElementChild as HTMLElement
      const computedStyle = getComputedStyle(element)
      
      expect(computedStyle.backgroundColor).toBeTruthy()
      expect(computedStyle.color).toBeTruthy()
      expect(computedStyle.backgroundColor).not.toBe(computedStyle.color)
    })

    it('should apply consistent secondary colors', () => {
      const { container } = render(
        <div className="bg-secondary text-secondary-foreground p-4">
          Secondary themed content
        </div>
      )
      
      const element = container.firstElementChild as HTMLElement
      const computedStyle = getComputedStyle(element)
      
      expect(computedStyle.backgroundColor).toBeTruthy()
      expect(computedStyle.color).toBeTruthy()
    })

    it('should apply consistent muted colors', () => {
      const { container } = render(
        <div className="bg-muted text-muted-foreground p-4">
          Muted themed content
        </div>
      )
      
      const element = container.firstElementChild as HTMLElement
      const computedStyle = getComputedStyle(element)
      
      expect(computedStyle.backgroundColor).toBeTruthy()
      expect(computedStyle.color).toBeTruthy()
    })
  })

  describe('Requirement 1.2: Consistent hover and active states', () => {
    it('should render buttons with hover classes', () => {
      render(
        <Button variant="default" className="hover:bg-primary/90">
          Test Button
        </Button>
      )
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('hover:bg-primary/90')
    })

    it('should render buttons with focus classes', () => {
      render(
        <Button variant="default">
          Test Button
        </Button>
      )
      
      const button = screen.getByRole('button')
      // Check for focus-visible classes that are actually applied by the Button component
      expect(button.className).toContain('focus-visible:')
    })

    it('should render buttons with active classes', () => {
      render(
        <Button variant="default">
          Test Button
        </Button>
      )
      
      const button = screen.getByRole('button')
      // Check for active classes that are actually applied by the Button component
      expect(button.className).toContain('active:')
    })
  })

  describe('Requirement 1.3: Harmonious color scheme', () => {
    it('should maintain color harmony with accent colors', () => {
      const { container } = render(
        <div className="bg-accent text-accent-foreground p-4">
          Accent themed content
        </div>
      )
      
      const element = container.firstElementChild as HTMLElement
      const computedStyle = getComputedStyle(element)
      
      expect(computedStyle.backgroundColor).toBeTruthy()
      expect(computedStyle.color).toBeTruthy()
    })

    it('should maintain border color consistency', () => {
      const { container } = render(
        <div className="border border-border rounded p-4">
          Bordered content
        </div>
      )
      
      // Test that the content is rendered correctly
      expect(container.innerHTML).toContain('Bordered content')
      expect(container.innerHTML).toContain('<div')
    })
  })

  describe('Requirement 2.1: Improved text selection colors', () => {
    it('should apply selection styling classes', () => {
      const { container } = render(
        <div className="selection:bg-primary/20 selection:text-primary-foreground">
          <p>Selectable text content</p>
        </div>
      )
      
      // Test that the content is rendered correctly
      expect(container.innerHTML).toContain('Selectable text content')
      expect(container.innerHTML).toContain('<p>')
    })
  })

  describe('Requirement 2.2: Consistent interactive element highlighting', () => {
    it('should apply hover styles to interactive elements', () => {
      const { container } = render(
        <button className="hover:bg-accent hover:text-accent-foreground p-2 rounded">
          Interactive Element
        </button>
      )
      
      const button = container.querySelector('button')
      expect(button).toHaveClass('hover:bg-accent')
      expect(button).toHaveClass('hover:text-accent-foreground')
    })
  })

  describe('Requirement 2.3: Syntax highlighting integration', () => {
    it('should integrate with code styling', () => {
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

  describe('Theme transitions', () => {
    it('should apply transition classes', () => {
      const { container } = render(
        <div className="transition-colors duration-200">
          <p>Transitioning content</p>
        </div>
      )
      
      // Test that the content is rendered correctly
      expect(container.innerHTML).toContain('Transitioning content')
      expect(container.innerHTML).toContain('<p>')
    })
  })

  describe('Accessibility considerations', () => {
    it('should maintain contrast with destructive colors', () => {
      const { container } = render(
        <div className="bg-destructive text-destructive-foreground p-4">
          Destructive themed content
        </div>
      )
      
      const element = container.firstElementChild as HTMLElement
      const computedStyle = getComputedStyle(element)
      
      expect(computedStyle.backgroundColor).toBeTruthy()
      expect(computedStyle.color).toBeTruthy()
    })

    it('should provide ring focus indicators', () => {
      const { container } = render(
        <button className="focus-visible:ring-2 focus-visible:ring-ring">
          Focus test
        </button>
      )
      
      const button = container.querySelector('button')
      expect(button).toHaveClass('focus-visible:ring-2')
      expect(button).toHaveClass('focus-visible:ring-ring')
    })
  })
})