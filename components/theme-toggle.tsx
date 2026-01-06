'use client'

import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { useI18n } from '@/hooks/useI18n'

export function ThemeToggle() {
  const { t } = useI18n()
  const [theme, setTheme] = useState<'dark' | 'light'>('light')

  useEffect(() => {
    // 从本地存储获取主题设置
    const savedTheme = localStorage.getItem('onlywrite-theme') as 'dark' | 'light'
    if (savedTheme) {
      setTheme(savedTheme)
    } else {
      // 检查系统主题偏好
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      setTheme(systemTheme)
    }
  }, [])

  useEffect(() => {
    // 更新文档类
    const root = document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(theme)
    
    // 保存到本地存储
    localStorage.setItem('onlywrite-theme', theme)
  }, [theme])

  const toggleTheme = () => {
    // Add a brief delay to prevent flash during theme transition
    document.body.style.transition = 'none';
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
    
    // Re-enable transitions after theme change
    requestAnimationFrame(() => {
      document.body.style.transition = '';
    });
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="relative transition-colors duration-100"
      aria-label={
        theme === 'light' ? t('actions.switchToDark') : t('actions.switchToLight')
      }
      title={
        theme === 'light' ? t('actions.switchToDark') : t('actions.switchToLight')
      }
    >
      <svg
        className={`h-4 w-4 transition-opacity duration-100 ${
          theme === 'dark' ? 'opacity-0' : 'opacity-100'
        }`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="12" r="5" />
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
      </svg>
      <svg
        className={`absolute h-4 w-4 transition-opacity duration-100 ${
          theme === 'dark' ? 'opacity-100' : 'opacity-0'
        }`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z" />
      </svg>
      <span className="sr-only">
        {theme === 'light' ? t('actions.switchToDark') : t('actions.switchToLight')}
      </span>
    </Button>
  )
}
