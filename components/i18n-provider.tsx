"use client"

import React, { useCallback, useEffect, useMemo, useState } from "react"
import {
  detectLocale,
  formatMessage,
  getMessage,
  persistLocale,
  type Locale,
} from "@/lib/i18n"

type I18nContextValue = {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string, params?: Record<string, string | number>) => string
}

export const I18nContext = React.createContext<I18nContextValue | null>(null)

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en")

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    persistLocale(next)
  }, [])

  const t = useCallback(
    (key: string, params?: Record<string, string | number>) => {
      const message = getMessage(locale, key)
      return formatMessage(message, params)
    },
    [locale]
  )

  useEffect(() => {
    setLocaleState(detectLocale())
  }, [])

  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      t,
    }),
    [locale, setLocale, t]
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}
