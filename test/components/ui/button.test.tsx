import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '@/components/ui/button'

describe('Button Component', () => {
  describe('Rendering', () => {
    it('should render button with text', () => {
      render(<Button>Click me</Button>)
      expect(screen.getByRole('button')).toHaveTextContent('Click me')
    })

    it('should render as child element when asChild prop is used', () => {
      render(
        <Button asChild>
          <a href="/test">Link Button</a>
        </Button>
      )
      expect(screen.getByRole('link')).toHaveTextContent('Link Button')
    })
  })

  describe('Variants', () => {
    it('should apply default variant classes', () => {
      render(<Button variant="default">Default</Button>)
      const button = screen.getByRole('button')
      expect(button.className).toContain('bg-foreground')
      expect(button.className).toContain('text-background')
    })

    it('should apply destructive variant classes', () => {
      render(<Button variant="destructive">Delete</Button>)
      const button = screen.getByRole('button')
      expect(button.className).toContain('bg-foreground')
      expect(button.className).toContain('text-background')
    })

    it('should apply outline variant classes', () => {
      render(<Button variant="outline">Outline</Button>)
      const button = screen.getByRole('button')
      expect(button.className).toContain('bg-transparent')
      expect(button.className).toContain('text-foreground')
    })

    it('should apply secondary variant classes', () => {
      render(<Button variant="secondary">Secondary</Button>)
      const button = screen.getByRole('button')
      expect(button.className).toContain('bg-background')
      expect(button.className).toContain('text-foreground')
    })

    it('should apply ghost variant classes', () => {
      render(<Button variant="ghost">Ghost</Button>)
      const button = screen.getByRole('button')
      expect(button.className).toContain('border-transparent')
      expect(button.className).toContain('bg-transparent')
    })

    it('should apply link variant classes', () => {
      render(<Button variant="link">Link</Button>)
      const button = screen.getByRole('button')
      expect(button.className).toContain('underline-offset-4')
      expect(button.className).toContain('hover:underline')
    })
  })

  describe('Sizes', () => {
    it('should apply default size classes', () => {
      render(<Button size="default">Default Size</Button>)
      const button = screen.getByRole('button')
      expect(button.className).toContain('h-10')
    })

    it('should apply small size classes', () => {
      render(<Button size="sm">Small</Button>)
      const button = screen.getByRole('button')
      expect(button.className).toContain('h-8')
    })

    it('should apply large size classes', () => {
      render(<Button size="lg">Large</Button>)
      const button = screen.getByRole('button')
      expect(button.className).toContain('h-12')
    })

    it('should apply icon size classes', () => {
      render(<Button size="icon">+</Button>)
      const button = screen.getByRole('button')
      expect(button.className).toContain('size-10')
    })
  })

  describe('States', () => {
    it('should be disabled when disabled prop is true', () => {
      render(<Button disabled>Disabled</Button>)
      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
      expect(button.className).toContain('disabled:')
    })

    it('should accept custom className', () => {
      render(<Button className="custom-class">Custom</Button>)
      const button = screen.getByRole('button')
      expect(button.className).toContain('custom-class')
    })

    it('should handle onClick event', async () => {
      const user = userEvent.setup()
      let clicked = false
      
      render(<Button onClick={() => { clicked = true }}>Click</Button>)
      const button = screen.getByRole('button')
      await user.click(button)
      expect(clicked).toBe(true)
    })

    it('should not trigger onClick when disabled', async () => {
      const user = userEvent.setup()
      let clicked = false
      
      render(<Button disabled onClick={() => { clicked = true }}>Click</Button>)
      const button = screen.getByRole('button')
      await user.click(button)
      expect(clicked).toBe(false)
    })
  })

  describe('Accessibility', () => {
    it('should have button role', () => {
      render(<Button>Button</Button>)
      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    it('should support aria-label', () => {
      render(<Button aria-label="Close dialog">×</Button>)
      expect(screen.getByLabelText('Close dialog')).toBeInTheDocument()
    })

    it('should have focus-visible classes for keyboard navigation', () => {
      render(<Button>Focus Test</Button>)
      const button = screen.getByRole('button')
      expect(button.className).toContain('focus-visible:')
    })
  })
})
