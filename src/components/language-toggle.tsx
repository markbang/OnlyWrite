import { useI18n } from '@/components/i18n-provider'

export function LanguageToggle() {
  const { locale, setLocale, t } = useI18n()

  return (
    <label class="flex items-center gap-2 border border-foreground bg-background px-2 text-xs font-medium text-foreground">
      <span class="sr-only">{t('actions.language')}</span>
      <select
        aria-label={t('actions.language')}
        class="h-8 bg-transparent text-xs outline-none"
        value={locale()}
        onChange={(event) => setLocale(event.currentTarget.value as 'en' | 'zh')}
      >
        <option value="zh">中文</option>
        <option value="en">English</option>
      </select>
    </label>
  )
}
