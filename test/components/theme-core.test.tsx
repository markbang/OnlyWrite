import { describe, expect, it } from 'vitest'
import { fireEvent, screen, waitFor } from '@solidjs/testing-library'
import globalsCss from '@/routes/globals.css?raw'
import { ThemeToggle } from '@/components/theme-toggle'
import { applyTheme, settingsActions } from '@/state/settings'
import { render } from '../utils/theme-test-utils'

describe('theme core', () => {
  it('applies the light theme class', () => {
    render(() => <div>theme</div>, { theme: 'light' })

    expect(document.documentElement).toHaveClass('light')
  })

  it('applies the dark theme class', () => {
    render(() => <div>theme</div>, { theme: 'dark' })

    expect(document.documentElement).toHaveClass('dark')
  })

  it('defines light and dark theme tokens in the stylesheet', () => {
    expect(globalsCss).toContain('--background: #ffffff;')
    expect(globalsCss).toContain('--foreground: #000000;')
    expect(globalsCss).toContain('.dark {')
    expect(globalsCss).toContain('--background: #000000;')
    expect(globalsCss).toContain('--foreground: #ffffff;')
  })

  it('toggles theme from the theme toggle button', async () => {
    settingsActions.setTheme('light')
    applyTheme('light')

    render(() => <ThemeToggle />)

    fireEvent.click(screen.getByRole('button'))

    await waitFor(() => expect(document.documentElement).toHaveClass('dark'))
  })
})
