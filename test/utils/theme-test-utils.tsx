import type { Component, JSX } from 'solid-js'
import { render as solidRender } from '@solidjs/testing-library'
import { I18nProvider } from '@/components/i18n-provider'

export type Theme = 'light' | 'dark'

export function applyThemeClass(theme: Theme) {
  document.documentElement.classList.remove('light', 'dark')
  document.documentElement.classList.add(theme)
}

export function render(
  ui: () => JSX.Element,
  options?: {
    theme?: Theme
  }
) {
  const theme = options?.theme ?? 'light'

  const Wrapper: Component<{ children: JSX.Element }> = (props) => {
    applyThemeClass(theme)
    return <I18nProvider>{props.children}</I18nProvider>
  }

  return solidRender(ui, {
    wrapper: Wrapper,
  })
}

export function getCSSCustomProperty(property: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(property).trim()
}
