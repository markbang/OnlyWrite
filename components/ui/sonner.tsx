"use client"

import { useEffect, useState } from "react"
import { Toaster as Sonner, ToasterProps } from "sonner"

type ThemeMode = NonNullable<ToasterProps["theme"]>

const getDocumentTheme = (): ThemeMode => {
  if (typeof document === "undefined") {
    return "system"
  }

  if (document.documentElement.classList.contains("dark")) {
    return "dark"
  }

  if (document.documentElement.classList.contains("light")) {
    return "light"
  }

  return "system"
}

const Toaster = ({ ...props }: ToasterProps) => {
  const [theme, setTheme] = useState<ThemeMode>("system")

  useEffect(() => {
    setTheme(getDocumentTheme())

    const observer = new MutationObserver(() => {
      setTheme(getDocumentTheme())
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })

    return () => observer.disconnect()
  }, [])

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
