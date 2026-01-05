import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent, waitFor } from '../utils/theme-test-utils'
import userEvent from '@testing-library/user-event'
import { Button } from '@/components/ui/button'
import { NavMain } from '@/components/nav-main'
import { NavDocuments } from '@/components/nav-documents'

describe('Interaction States Tests', () => {
  describe('Button Hover States', () => {
    it('should apply hover styles to buttons', async () => {
      const user = userEvent.setup()
      
      render(
        <Button variant="default" className="test-button">
          Test Button
        </Button>
      )
      
      const button = screen.getByRole('button', { name: 'Test Button' })
      expect(button).toBeInTheDocument()
      
      // Test hover state
      await user.hover(button)
      
      // Check if hover classes are applied
      expect(button).toHaveClass('hover:bg-primary/90')
    })

    it('should apply focus styles to buttons', async () => {
      const user = userEvent.setup()
      
      render(
        <Button variant="default">
          Test Button
        </Button>
      )
      
      const button = screen.getByRole('button')
      
      // Test focus state
      await user.tab()
      expect(button).toHaveFocus()
      
      // Check if focus styles are applied
      expect(button).toHaveClass('focus-visible:ring-2')
    })

    it('should apply active/pressed styles to buttons', async () => {
      const user = userEvent.setup()
      
      render(
        <Button variant="default">
          Test Button
        </Button>
      )
      
      const button = screen.getByRole('button')
      
      // Test active state
      fireEvent.mouseDown(button)
      
      // Button should have active styling
      expect(button).toHaveClass('active:scale-95')
    })
  })

  describe('Navigation Hover States', () => {
    it('should apply hover styles to navigation items', async () => {
      const user = userEvent.setup()
      
      const mockNavItems = [
        {
          title: 'Dashboard',
          url: '/dashboard',
          icon: 'LayoutDashboard' as const,
        },
        {
          title: 'Documents',
          url: '/documents',
          icon: 'FileText' as const,
        }
      ]
      
      render(<NavMain items={mockNavItems} />)
      
      const navLinks = screen.getAllByRole('link')
      
      for (const link of navLinks) {
        await user.hover(link)
        
        // Check if hover styles are applied
        const computedStyle = getComputedStyle(link)
        expect(computedStyle.backgroundColor).toBeTruthy()
      }
    })

    it('should apply focus styles to navigation items', async () => {
      const user = userEvent.setup()
      
      const mockNavItems = [
        {
          title: 'Dashboard',
          url: '/dashboard',
          icon: 'LayoutDashboard' as const,
        }
      ]
      
      render(<NavMain items={mockNavItems} />)
      
      const navLink = screen.getByRole('link', { name: /dashboard/i })
      
      await user.tab()
      expect(navLink).toHaveFocus()
      
      // Check if focus styles are applied
      expect(navLink).toHaveClass('focus-visible:ring-2')
    })
  })

  describe('File Area Interaction States', () => {
    it('should handle file selection states', async () => {
      const user = userEvent.setup()
      
      const mockDocuments = [
        {
          name: 'test-document.md',
          isActive: false,
        }
      ]
      
      render(<NavDocuments documents={mockDocuments} />)
      
      const documentItem = screen.getByText('test-document.md')
      
      await user.hover(documentItem)
      
      // Check if hover styles are applied
      const parentElement = documentItem.closest('[class*="hover:"]')
      if (parentElement) {
        const computedStyle = getComputedStyle(parentElement)
        expect(computedStyle.backgroundColor).toBeTruthy()
      }
    })
  })

  describe('Transition Consistency', () => {
    it('should apply consistent transition timing', () => {
      render(
        <div className="transition-colors duration-200">
          <Button variant="default">Test Button</Button>
        </div>
      )
      
      const container = screen.getByRole('button').parentElement
      if (container) {
        const computedStyle = getComputedStyle(container)
        expect(computedStyle.transitionDuration).toBe('0.2s')
      }
    })

    it('should apply smooth color transitions', async () => {
      const user = userEvent.setup()
      
      render(
        <Button variant="default" className="transition-colors">
          Hover Me
        </Button>
      )
      
      const button = screen.getByRole('button')
      const initialStyle = getComputedStyle(button)
      
      await user.hover(button)
      
      // Wait for transition
      await waitFor(() => {
        const hoverStyle = getComputedStyle(button)
        expect(hoverStyle.transitionProperty).toContain('color')
      })
    })
  })

  describe('Selection States', () => {
    it('should apply consistent selection colors', () => {
      render(
        <div className="selection:bg-primary/20 selection:text-primary-foreground">
          <p>This text can be selected</p>
        </div>
      )
      
      const textElement = screen.getByText('This text can be selected')
      expect(textElement.parentElement).toHaveClass('selection:bg-primary/20')
      expect(textElement.parentElement).toHaveClass('selection:text-primary-foreground')
    })
  })
})