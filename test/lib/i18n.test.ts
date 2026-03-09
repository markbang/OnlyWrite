import { beforeEach, describe, expect, it } from 'vitest'
import { detectLocale, formatMessage, getMessage, messages, persistLocale } from '@/lib/i18n'

describe('i18n utilities', () => {
  beforeEach(() => {
    window.localStorage.clear()
    Object.defineProperty(window.navigator, 'languages', {
      configurable: true,
      value: ['en-US'],
    })
  })

  describe('formatMessage', () => {
    it('replaces message parameters', () => {
      expect(formatMessage('{count} files', { count: 5 })).toBe('5 files')
      expect(formatMessage('{name} - {count}', { name: 'Draft', count: 2 })).toBe('Draft - 2')
    })

    it('keeps unknown placeholders intact', () => {
      expect(formatMessage('{count} files', { total: 9 })).toBe('{count} files')
    })
  })

  describe('getMessage', () => {
    it('reads nested English messages', () => {
      expect(getMessage('en', 'dashboard.welcomeSubtitle')).toBe('A quick look at your current workspace')
    })

    it('reads nested Chinese messages', () => {
      expect(getMessage('zh', 'actions.selectFolder')).toBe('选择文件夹')
    })

    it('falls back to the key for unknown messages', () => {
      expect(getMessage('en', 'missing.key')).toBe('missing.key')
    })
  })

  describe('detectLocale and persistLocale', () => {
    it('prefers stored locales', () => {
      persistLocale('zh')
      expect(detectLocale()).toBe('zh')
    })

    it('detects Chinese from navigator languages', () => {
      Object.defineProperty(window.navigator, 'languages', {
        configurable: true,
        value: ['zh-CN', 'en-US'],
      })

      expect(detectLocale()).toBe('zh')
    })

    it('defaults to English when no locale is stored', () => {
      expect(detectLocale()).toBe('en')
    })
  })

  it('keeps the same top-level message structure across locales', () => {
    expect(Object.keys(messages.en).sort()).toEqual(Object.keys(messages.zh).sort())
  })
})
