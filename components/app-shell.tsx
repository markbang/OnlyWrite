"use client"

import React from "react"
import { useI18n } from "@/hooks/useI18n"

export function AppShell({ children }: { children: React.ReactNode }) {
  const { t } = useI18n()

  return (
    <>
      {/* Skip to main content link for keyboard navigation */}
      <a href="#main-content" className="skip-to-content">
        {t("a11y.skipToContent")}
      </a>

      {/* ARIA live region for status announcements */}
      <div
        id="aria-live-region"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />

      {/* ARIA live region for urgent announcements */}
      <div
        id="aria-live-assertive"
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
      />

      <main id="main-content">{children}</main>
    </>
  )
}
