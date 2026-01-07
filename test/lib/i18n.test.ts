import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  formatMessage,
  detectLocale,
  persistLocale,
  getMessage,
  messages,
  type Locale,
} from '@/lib/i18n'

describe('Internationalization (i18n)', () => {
  describe('formatMessage()', () => {
    it('should return message without parameters unchanged', () => {
      expect(formatMessage('Hello world')).toBe('Hello world')
    })

    it('should replace single parameter', () => {
      const result = formatMessage('{count} files', { count: 5 })
      expect(result).toBe('5 files')
    })

    it('should replace multiple parameters', () => {
      const result = formatMessage('{name} has {count} files', {
        name: 'User',
        count: 10,
      })
      expect(result).toBe('User has 10 files')
    })

    it('should handle numeric parameters', () => {
      const result = formatMessage('Version {version}', { version: 1.5 })
      expect(result).toBe('Version 1.5')
    })

    it('should preserve unreplaced parameters', () => {
      const result = formatMessage('{count} files', { total: 5 })
      expect(result).toBe('{count} files')
    })

    it('should handle mixed replaced and unreplaced parameters', () => {
      const result = formatMessage('{count} files out of {total}', { count: 3 })
      expect(result).toBe('3 files out of {total}')
    })
  })

  describe('getMessage()', () => {
    it('should retrieve top-level message', () => {
      const result = getMessage('en', 'app.title')
      expect(result).toBe('OnlyWrite')
    })

    it('should retrieve nested message', () => {
      const result = getMessage('en', 'actions.selectFolder')
      expect(result).toBe('Select folder')
    })

    it('should retrieve deep nested message', () => {
      const result = getMessage('en', 'dashboard.welcomeSubtitle')
      expect(result).toBe("Here's what's happening with your writing")
    })

    it('should fallback to English for missing translation', () => {
      const result = getMessage('en', 'app.title')
      expect(result).toBe('OnlyWrite')
    })

    it('should return key if message not found', () => {
      const result = getMessage('en', 'nonexistent.key.path')
      expect(result).toBe('nonexistent.key.path')
    })

    it('should work for Chinese locale', () => {
      const result = getMessage('zh', 'app.title')
      expect(result).toBe('OnlyWrite')
    })

    it('should retrieve Chinese translation', () => {
      const result = getMessage('zh', 'actions.selectFolder')
      expect(result).toBe('选择文件夹')
    })
  })

  describe('detectLocale()', () => {
    let localStorageMock: Record<string, string> = {}

    beforeEach(() => {
      localStorageMock = {}
      global.localStorage = {
        getItem: (key: string) => localStorageMock[key] || null,
        setItem: (key: string, value: string) => {
          localStorageMock[key] = value
        },
        removeItem: (key: string) => {
          delete localStorageMock[key]
        },
        clear: () => {
          localStorageMock = {}
        },
        length: 0,
        key: () => null,
      }
    })

    it('should return stored locale if valid', () => {
      localStorage.setItem('onlywrite-locale', 'zh')
      expect(detectLocale()).toBe('zh')
    })

    it('should detect Chinese from navigator', () => {
      Object.defineProperty(navigator, 'languages', {
        value: ['zh-CN', 'en-US'],
        configurable: true,
      })
      expect(detectLocale()).toBe('zh')
    })

    it('should default to English if no Chinese in navigator', () => {
      Object.defineProperty(navigator, 'languages', {
        value: ['en-US', 'fr-FR'],
        configurable: true,
      })
      expect(detectLocale()).toBe('en')
    })

    it('should detect Chinese from any zh-* variant', () => {
      Object.defineProperty(navigator, 'languages', {
        value: ['zh-TW'],
        configurable: true,
      })
      expect(detectLocale()).toBe('zh')
    })

    it('should prioritize stored locale over navigator', () => {
      localStorage.setItem('onlywrite-locale', 'en')
      Object.defineProperty(navigator, 'languages', {
        value: ['zh-CN'],
        configurable: true,
      })
      expect(detectLocale()).toBe('en')
    })

    it('should ignore invalid stored locale', () => {
      localStorage.setItem('onlywrite-locale', 'invalid')
      Object.defineProperty(navigator, 'languages', {
        value: ['en-US'],
        configurable: true,
      })
      expect(detectLocale()).toBe('en')
    })
  })

  describe('persistLocale()', () => {
    let localStorageMock: Record<string, string> = {}

    beforeEach(() => {
      localStorageMock = {}
      global.localStorage = {
        getItem: (key: string) => localStorageMock[key] || null,
        setItem: (key: string, value: string) => {
          localStorageMock[key] = value
        },
        removeItem: (key: string) => {
          delete localStorageMock[key]
        },
        clear: () => {
          localStorageMock = {}
        },
        length: 0,
        key: () => null,
      }
    })

    it('should persist English locale', () => {
      persistLocale('en')
      expect(localStorage.getItem('onlywrite-locale')).toBe('en')
    })

    it('should persist Chinese locale', () => {
      persistLocale('zh')
      expect(localStorage.getItem('onlywrite-locale')).toBe('zh')
    })

    it('should overwrite existing locale', () => {
      persistLocale('en')
      expect(localStorage.getItem('onlywrite-locale')).toBe('en')
      persistLocale('zh')
      expect(localStorage.getItem('onlywrite-locale')).toBe('zh')
    })
  })

  describe('messages structure', () => {
    it('should have English messages', () => {
      expect(messages.en).toBeDefined()
      expect(messages.en).toHaveProperty('app')
      expect(messages.en).toHaveProperty('actions')
      expect(messages.en).toHaveProperty('file')
    })

    it('should have Chinese messages', () => {
      expect(messages.zh).toBeDefined()
      expect(messages.zh).toHaveProperty('app')
      expect(messages.zh).toHaveProperty('actions')
      expect(messages.zh).toHaveProperty('file')
    })

    it('should have matching structure across locales', () => {
      const enKeys = Object.keys(messages.en)
      const zhKeys = Object.keys(messages.zh)
      expect(enKeys.sort()).toEqual(zhKeys.sort())
    })
  })
})
