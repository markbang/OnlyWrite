'use client'

import { LoginForm } from "@/components/login-form"
import Image from "next/image"
import { useI18n } from "@/hooks/useI18n"
import { LanguageToggle } from "@/components/language-toggle"

export default function LoginPage() {
  const { t } = useI18n()

  return (
    <div className="flex min-h-svh items-center justify-center bg-background px-4 sm:px-6 py-10">
      <div className="flex w-full max-w-md flex-col gap-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Image
              src="/app-icon.svg"
              alt="OnlyWrite app icon"
              width={32}
              height={32}
            />
            <div>
              <div className="text-lg font-display font-bold text-foreground tracking-tight">OnlyWrite</div>
              <div className="text-xs text-muted-foreground font-medium">{t('app.subtitle')}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <LanguageToggle />
          </div>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
