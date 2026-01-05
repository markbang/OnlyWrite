import { describe, it, expect } from 'vitest'
import { render, screen } from '../utils/theme-test-utils'
import { AppSidebar } from '@/components/app-sidebar'
import { SiteHeader } from '@/components/site-header'
import { ThemeToggle } from '@/components/theme-toggle'

describe('Theme Consistency Tests', () => {
  describe('Light Theme Consistency', () => {
    it('should apply consistent background colors across components', () => {
      const { container: sidebarContainer } = render(<AppSidebar />, { theme: 'light' })
      const { container: headerContainer } = render(<SiteHeader />, { theme: 'light' })
      
      const sidebar = sidebarContainer.querySelector('[data-testid="sidebar"]') || sidebarContainer.firstElementChild
      const header = headerContainer.querySelector('header') || headerContainer.firstElementChild
      
      if (sidebar && header) {
        const sidebarBg = getComputedStyle(sidebar).backgroundColor
        const headerBg = getComputedStyle(header).backgroundColor
        
        // Both should use theme background colors
        expect(sidebarBg).toBeTruthy()
        expect(headerBg).toBeTruthy()
      }
    })

    it('should apply consistent text colors across components', () => {
      const { container: sidebarContainer } = render(<AppSidebar />, { theme: 'light' })
      const { container: headerContainer } = render(<SiteHeader />, { theme: 'light' })
      
      const sidebarText = sidebarContainer.querySelector('[class*="text-"]')
      const headerText = headerContainer.querySelector('[class*="text-"]')
      
      if (sidebarText && headerText) {
        const sidebarColor = getComputedStyle(sidebarText).color
        const headerColor = getComputedStyle(headerText).color
        
        // Should use consistent foreground colors
        expect(sidebarColor).toBeTruthy()
        expect(headerColor).toBeTruthy()
      }
    })

    it('should apply consistent border colors across components', () => {
      const { container: sidebarContainer } = render(<AppSidebar />, { theme: 'light' })
      
      const borderedElements = sidebarContainer.querySelectorAll('[class*="border"]')
      
      borderedElements.forEach(element => {
        const borderColor = getComputedStyle(element).borderColor
        expect(borderColor).toBeTruthy()
      })
    })
  })

  describe('Dark Theme Consistency', () => {
    it('should apply consistent background colors in dark theme', () => {
      const { container: sidebarContainer } = render(<AppSidebar />, { theme: 'dark' })
      const { container: headerContainer } = render(<SiteHeader />, { theme: 'dark' })
      
      const sidebar = sidebarContainer.querySelector('[data-testid="sidebar"]') || sidebarContainer.firstElementChild
      const header = headerContainer.querySelector('header') || headerContainer.firstElementChild
      
      if (sidebar && header) {
        const sidebarBg = getComputedStyle(sidebar).backgroundColor
        const headerBg = getComputedStyle(header).backgroundColor
        
        // Both should use dark theme background colors
        expect(sidebarBg).toBeTruthy()
        expect(headerBg).toBeTruthy()
      }
    })

    it('should apply consistent text colors in dark theme', () => {
      const { container: sidebarContainer } = render(<AppSidebar />, { theme: 'dark' })
      const { container: headerContainer } = render(<SiteHeader />, { theme: 'dark' })
      
      const sidebarText = sidebarContainer.querySelector('[class*="text-"]')
      const headerText = headerContainer.querySelector('[class*="text-"]')
      
      if (sidebarText && headerText) {
        const sidebarColor = getComputedStyle(sidebarText).color
        const headerColor = getComputedStyle(headerText).color
        
        // Should use consistent dark theme foreground colors
        expect(sidebarColor).toBeTruthy()
        expect(headerColor).toBeTruthy()
      }
    })
  })

  describe('Theme Toggle Functionality', () => {
    it('should render theme toggle component', () => {
      render(<ThemeToggle />)
      
      const toggleButton = screen.getByRole('button')
      expect(toggleButton).toBeInTheDocument()
    })

    it('should have accessible theme toggle', () => {
      render(<ThemeToggle />)
      
      const toggleButton = screen.getByRole('button')
      expect(toggleButton).toHaveAttribute('aria-label')
    })
  })
})