import { createMemo } from 'solid-js'
import { Moon, Sun } from 'lucide-solid'
import { useI18n } from '@/components/i18n-provider'
import { Button } from '@/components/ui'
import { applyTheme, resolveTheme, settings, settingsActions } from '@/state/settings'

export function ThemeToggle() {
  const { t } = useI18n()
  const isDark = createMemo(() => resolveTheme(settings.theme) === 'dark')

  const toggleTheme = () => {
    const nextTheme = isDark() ? 'light' : 'dark'
    settingsActions.setTheme(nextTheme)
    applyTheme(nextTheme)
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      class="relative px-2"
      aria-label={isDark() ? t('actions.switchToLight') : t('actions.switchToDark')}
      title={isDark() ? t('actions.switchToLight') : t('actions.switchToDark')}
    >
      {isDark() ? <Sun class="size-4" /> : <Moon class="size-4" />}
      <span class="sr-only">
        {isDark() ? t('actions.switchToLight') : t('actions.switchToDark')}
      </span>
    </Button>
  )
}
