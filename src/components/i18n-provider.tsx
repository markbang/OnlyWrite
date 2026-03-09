import {
  createContext,
  createMemo,
  createSignal,
  onMount,
  ParentProps,
  useContext,
} from 'solid-js'
import {
  detectLocale,
  formatMessage,
  getMessage,
  persistLocale,
  type Locale,
} from '@/lib/i18n'

type I18nContextValue = {
  locale: () => Locale
  setLocale: (locale: Locale) => void
  t: (key: string, params?: Record<string, string | number>) => string
}

const I18nContext = createContext<I18nContextValue>()

export function I18nProvider(props: ParentProps) {
  const [locale, setLocaleState] = createSignal<Locale>('en')

  const setLocale = (next: Locale) => {
    setLocaleState(next)
    persistLocale(next)
    if (typeof document !== 'undefined') {
      document.documentElement.lang = next
    }
  }

  const t = createMemo(
    () =>
      (key: string, params?: Record<string, string | number>) => {
        const message = getMessage(locale(), key)
        return formatMessage(message, params)
      }
  )

  onMount(() => {
    const next = detectLocale()
    setLocaleState(next)
    document.documentElement.lang = next
  })

  return (
    <I18nContext.Provider
      value={{
        locale,
        setLocale,
        t: (key, params) => t()(key, params),
      }}
    >
      {props.children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useI18n must be used inside I18nProvider')
  }
  return context
}
