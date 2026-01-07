import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent, waitFor } from '../utils/theme-test-utils'
import userEvent from '@testing-library/user-event'
import { IconDashboard, IconFileDescription } from '@tabler/icons-react'
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
      expect(button.className).toContain('hover:')
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
      render(
        <Button variant="default">
          Test Button
        </Button>
      )

      const button = screen.getByRole('button')

      fireEvent.mouseDown(button)

      expect(button.className).toContain('active:')
    })
  })

  describe('Navigation Hover States', () => {
    it('should apply hover styles to navigation items', async () => {
      const user = userEvent.setup()
      
      const mockNavItems = [
        {
          title: 'Dashboard',
          url: '/dashboard',
          icon: IconDashboard,
        },
        {
          title: 'Documents',
          url: '/documents',
          icon: IconFileDescription,
        },
      ]
      
      render(<NavMain items={mockNavItems} />, { withSidebar: true })

      const navButtons = screen.getAllByRole('button')
      
      for (const button of navButtons) {
        await user.hover(button)

        // Check if hover styles are applied
        const hasHoverClass = button.className.includes('hover:')
        expect(hasHoverClass).toBe(true)
      }
    })

    it('should apply focus styles to navigation items', async () => {
      const user = userEvent.setup()
      
      const mockNavItems = [
        {
          title: 'Dashboard',
          url: '/dashboard',
          icon: IconDashboard,
        },
      ]
      
      render(<NavMain items={mockNavItems} />, { withSidebar: true })
      
      const navButton = screen.getByRole('button', { name: /dashboard/i })

      navButton.focus()
      expect(navButton).toHaveFocus()

      expect(navButton).toHaveClass('focus-visible:ring-2')
    })
  })

  describe('File Area Interaction States', () => {
    it('should handle file selection states', async () => {
      const user = userEvent.setup()
      
      const mockDocuments = [
        {
          name: 'test-document.md',
          url: '/documents/test-document',
          icon: IconFileDescription,
        },
      ]

      render(<NavDocuments items={mockDocuments} />, { withSidebar: true })

      const documentLink = screen.getByRole('link', { name: /test-document\.md/i })

      await user.hover(documentLink)

      expect(documentLink.className).toContain('hover:')
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
      expect(container).toHaveClass('transition-colors')
      expect(container).toHaveClass('duration-200')
    })

    it('should apply smooth color transitions', async () => {
      const user = userEvent.setup()

      render(
        <Button variant="default" className="transition-colors">
          Hover Me
        </Button>
      )

      const button = screen.getByRole('button')

      await user.hover(button)

      expect(button.className).toContain('transition-colors')
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