import { test, expect } from '@playwright/test'

test.describe('Theme Visual Regression Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    // Wait for page to load
    await page.waitForLoadState('networkidle')
  })

  test('should maintain visual consistency in light theme', async ({ page }) => {
    // Ensure light theme is active
    await page.evaluate(() => {
      document.documentElement.classList.remove('dark')
      document.documentElement.classList.add('light')
    })
    
    // Wait for theme to apply
    await page.waitForTimeout(500)
    
    // Take screenshot of main interface
    await expect(page).toHaveScreenshot('light-theme-main.png')
  })

  test('should maintain visual consistency in dark theme', async ({ page }) => {
    // Switch to dark theme
    await page.evaluate(() => {
      document.documentElement.classList.remove('light')
      document.documentElement.classList.add('dark')
    })
    
    // Wait for theme to apply
    await page.waitForTimeout(500)
    
    // Take screenshot of main interface
    await expect(page).toHaveScreenshot('dark-theme-main.png')
  })

  test('should show consistent button interactions', async ({ page }) => {
    // Test button hover states if buttons exist
    const buttons = page.locator('button').first()
    if (await buttons.isVisible()) {
      await buttons.hover()
      await expect(buttons).toHaveScreenshot('button-hover-state.png')
    }
  })

  test('should maintain color harmony', async ({ page }) => {
    // Test overall color harmony
    await expect(page).toHaveScreenshot('color-harmony-overview.png')
  })

  test('should show smooth theme transitions', async ({ page }) => {
    // Start in light theme
    await page.evaluate(() => {
      document.documentElement.classList.remove('dark')
      document.documentElement.classList.add('light')
    })
    await page.waitForTimeout(200)
    
    // Switch to dark theme
    await page.evaluate(() => {
      document.documentElement.classList.remove('light')
      document.documentElement.classList.add('dark')
    })
    
    // Wait for transition to complete
    await page.waitForTimeout(500)
    
    // Take after screenshot
    await expect(page).toHaveScreenshot('after-theme-transition.png')
  })
})