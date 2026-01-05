"use client"

import { useI18n } from "@/hooks/useI18n"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function LanguageToggle() {
  const { locale, setLocale, t } = useI18n()

  return (
    <Select value={locale} onValueChange={(value) => setLocale(value as typeof locale)}>
      <SelectTrigger className="h-8 w-[88px]" aria-label={t('actions.language')}>
        <SelectValue placeholder={t('actions.language')} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="zh">中文</SelectItem>
        <SelectItem value="en">English</SelectItem>
      </SelectContent>
    </Select>
  )
}
