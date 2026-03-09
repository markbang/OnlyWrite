import { describe, expect, it } from 'vitest'
import { fireEvent, render, renderHook, screen, waitFor } from '@solidjs/testing-library'
import { I18nProvider, useI18n } from '@/components/i18n-provider'

function TestComponent() {
  const { locale, setLocale, t } = useI18n()

  return (
    <div>
      <p data-testid="locale">{locale()}</p>
      <p data-testid="message">{t('app.title')}</p>
      <button onClick={() => setLocale('zh')}>Switch to Chinese</button>
      <button onClick={() => setLocale('en')}>Switch to English</button>
    </div>
  )
}

describe('useI18n', () => {
  it('provides the detected locale and translations', async () => {
    window.localStorage.setItem('onlywrite-locale', 'en')

    render(() => (
      <I18nProvider>
        <TestComponent />
      </I18nProvider>
    ))

    await waitFor(() => expect(screen.getByTestId('locale')).toHaveTextContent('en'))
    expect(screen.getByTestId('message')).toHaveTextContent('OnlyWrite')
  })

  it('updates locale and document language when switching', async () => {
    render(() => (
      <I18nProvider>
        <TestComponent />
      </I18nProvider>
    ))

    fireEvent.click(screen.getByRole('button', { name: 'Switch to Chinese' }))

    await waitFor(() => {
      expect(screen.getByTestId('locale')).toHaveTextContent('zh')
      expect(document.documentElement.lang).toBe('zh')
    })

    expect(screen.getByTestId('message')).toHaveTextContent('OnlyWrite')
  })

  it('throws outside the provider', () => {
    expect(() => renderHook(() => useI18n())).toThrow('useI18n must be used inside I18nProvider')
  })

  it('exposes translation helpers through renderHook', () => {
    const { result } = renderHook(() => useI18n(), {
      wrapper: (props) => <I18nProvider>{props.children}</I18nProvider>,
    })

    expect(result.locale()).toMatch(/en|zh/)
    expect(result.t('actions.selectFolder')).toBeTruthy()
  })
})
