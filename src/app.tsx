import { createEffect, onCleanup, onMount } from 'solid-js'
import { I18nProvider } from '@/components/i18n-provider'
import { AppRouter } from '@/router'
import { applyTheme, settings } from '@/state/settings'

function AppContent() {
  createEffect(() => {
    applyTheme(settings.theme)
  })

  onMount(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      if (settings.theme === 'system') {
        applyTheme('system')
      }
    }

    media.addEventListener('change', handleChange)
    onCleanup(() => media.removeEventListener('change', handleChange))
  })

  return <AppRouter />
}

export default function App() {
  return (
    <I18nProvider>
      <AppContent />
    </I18nProvider>
  )
}
