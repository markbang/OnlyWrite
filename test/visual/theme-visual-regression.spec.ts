import { expect, test, type Page } from '@playwright/test'

const FIXED_NOW = '2026-03-09T12:00:00.000Z'

type SeedOptions = {
  theme?: 'light' | 'dark'
  locale?: 'en' | 'zh'
  workspace?: {
    folderPath: string | null
    selectedFilePath: string | null
    recentFiles: Array<{
      path: string
      name: string
      accessedAt: number
    }>
  }
}

async function seedApp(page: Page, options: SeedOptions = {}) {
  const {
    theme = 'light',
    locale = 'en',
    workspace = {
      folderPath: null,
      selectedFilePath: null,
      recentFiles: [],
    },
  } = options

  await page.addInitScript(
    ({ fixedNow, nextTheme, nextLocale, nextWorkspace }) => {
      const originalDate = Date
      const fixedTime = new originalDate(fixedNow).valueOf()

      class MockDate extends originalDate {
        constructor(...args: ConstructorParameters<DateConstructor>) {
          if (args.length === 0) {
            super(fixedTime)
            return
          }

          super(...args)
        }

        static now() {
          return fixedTime
        }
      }

      MockDate.parse = originalDate.parse
      MockDate.UTC = originalDate.UTC
      Object.defineProperty(window, 'Date', {
        configurable: true,
        writable: true,
        value: MockDate,
      })

      window.localStorage.clear()
      window.localStorage.setItem('onlywrite-locale', nextLocale)
      window.localStorage.setItem(
        'onlywrite-settings',
        JSON.stringify({
          theme: nextTheme,
          autosaveEnabled: true,
          autosaveInterval: 5,
          fontSize: 16,
          lineHeight: 1.8,
          shortcuts: {
            save: 'mod+s',
            newFile: 'mod+n',
            openFolder: 'mod+o',
          },
        })
      )
      window.localStorage.setItem('onlywrite-workspace', JSON.stringify(nextWorkspace))
    },
    {
      fixedNow: FIXED_NOW,
      nextTheme: theme,
      nextLocale: locale,
      nextWorkspace: workspace,
    }
  )
}

async function openStablePage(page: Page, path: string) {
  await page.goto(path)
  await page.waitForLoadState('networkidle')
  await page.evaluate(async () => {
    if ('fonts' in document) {
      await document.fonts.ready
    }
  })
  await page.waitForTimeout(150)
}

test.describe('Theme visual regression', () => {
  test('landing page in light theme', async ({ page }) => {
    await seedApp(page, { theme: 'light', locale: 'en' })
    await openStablePage(page, '/')

    await expect(page).toHaveScreenshot('landing-light.png', {
      animations: 'disabled',
      fullPage: true,
    })
  })

  test('landing page in dark theme', async ({ page }) => {
    await seedApp(page, { theme: 'dark', locale: 'en' })
    await openStablePage(page, '/')

    await expect(page).toHaveScreenshot('landing-dark.png', {
      animations: 'disabled',
      fullPage: true,
    })
  })

  test('login page in chinese', async ({ page }) => {
    await seedApp(page, { theme: 'light', locale: 'zh' })
    await openStablePage(page, '/login')

    await expect(page).toHaveScreenshot('login-zh.png', {
      animations: 'disabled',
      fullPage: true,
    })
  })

  test('dashboard with seeded workspace data', async ({ page }) => {
    await seedApp(page, {
      theme: 'dark',
      locale: 'en',
      workspace: {
        folderPath: '/workspace/onlywrite',
        selectedFilePath: null,
        recentFiles: [
          {
            path: '/workspace/onlywrite/draft.md',
            name: 'draft.md',
            accessedAt: new Date('2026-03-09T08:00:00.000Z').valueOf(),
          },
          {
            path: '/workspace/onlywrite/outline.md',
            name: 'outline.md',
            accessedAt: new Date('2026-03-08T19:30:00.000Z').valueOf(),
          },
        ],
      },
    })
    await openStablePage(page, '/dashboard')

    await expect(page).toHaveScreenshot('dashboard-dark.png', {
      animations: 'disabled',
      fullPage: true,
    })
  })

  test('landing primary action hover state', async ({ page }) => {
    await seedApp(page, { theme: 'light', locale: 'en' })
    await openStablePage(page, '/')

    const button = page.getByRole('button', { name: 'Select folder' })
    await button.hover()

    await expect(button).toHaveScreenshot('landing-select-folder-hover.png', {
      animations: 'disabled',
    })
  })
})
