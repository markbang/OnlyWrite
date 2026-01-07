import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useI18n } from '@/hooks/useI18n'
import { I18nProvider } from '@/components/i18n-provider'

function TestComponent() {
  const { t, locale, setLocale } = useI18n()
  
  return (
    <div>
      <p data-testid="locale">{locale}</p>
      <p data-testid="message">{t('app.title')}</p>
      <button onClick={() => setLocale('zh')}>Switch to Chinese</button>
      <button onClick={() => setLocale('en')}>Switch to English</button>
    </div>
  )
}

describe('useI18n Hook', () => {
  it('should provide default locale', () => {
    render(
      <I18nProvider>
        <TestComponent />
      </I18nProvider>
    )
    
    const localeElement = screen.getByTestId('locale')
    expect(localeElement.textContent).toMatch(/^(en|zh)$/)
  })

  it('should translate messages', () => {
    render(
      <I18nProvider>
        <TestComponent />
      </I18nProvider>
    )
    
    const messageElement = screen.getByTestId('message')
    expect(messageElement.textContent).toBe('OnlyWrite')
  })

  it('should throw error when used outside provider', () => {
    const consoleError = console.error
    console.error = () => {}
    
    expect(() => {
      render(<TestComponent />)
    }).toThrow('useI18n must be used within I18nProvider')
    
    console.error = consoleError
  })

  it('should allow locale switching', async () => {
    const user = userEvent.setup()
    
    render(
      <I18nProvider>
        <TestComponent />
      </I18nProvider>
    )
    
    const switchButton = screen.getByText('Switch to Chinese')
    await user.click(switchButton)
    
    const localeElement = screen.getByTestId('locale')
    expect(localeElement.textContent).toBeTruthy()
  })
})
