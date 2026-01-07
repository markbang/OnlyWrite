import { describe, it, expect } from 'vitest'
import { cn } from '@/lib/utils'

describe('Utility Functions', () => {
  describe('cn() - className merger', () => {
    it('should merge single className', () => {
      expect(cn('text-primary')).toBe('text-primary')
    })

    it('should merge multiple classNames', () => {
      const result = cn('text-primary', 'bg-secondary')
      expect(result).toContain('text-primary')
      expect(result).toContain('bg-secondary')
    })

    it('should handle conditional classNames', () => {
      const isActive = true
      const result = cn('base-class', isActive && 'active-class')
      expect(result).toContain('base-class')
      expect(result).toContain('active-class')
    })

    it('should handle falsy conditional classNames', () => {
      const isActive = false
      const result = cn('base-class', isActive && 'active-class')
      expect(result).toBe('base-class')
      expect(result).not.toContain('active-class')
    })

    it('should merge conflicting Tailwind classes correctly', () => {
      const result = cn('p-4', 'p-8')
      expect(result).toBe('p-8')
      expect(result).not.toContain('p-4')
    })

    it('should handle arrays of classNames', () => {
      const result = cn(['text-primary', 'bg-secondary'])
      expect(result).toContain('text-primary')
      expect(result).toContain('bg-secondary')
    })

    it('should handle empty input', () => {
      expect(cn()).toBe('')
    })

    it('should handle undefined and null', () => {
      const result = cn('base', undefined, null, 'other')
      expect(result).toContain('base')
      expect(result).toContain('other')
    })

    it('should handle complex real-world scenarios', () => {
      const variant = 'primary'
      const size = 'lg'
      const disabled = false
      
      const result = cn(
        'button-base',
        variant === 'primary' && 'bg-primary text-primary-foreground',
        size === 'lg' && 'px-8 py-4',
        disabled && 'opacity-50 cursor-not-allowed'
      )
      
      expect(result).toContain('button-base')
      expect(result).toContain('bg-primary')
      expect(result).toContain('px-8')
      expect(result).not.toContain('opacity-50')
    })
  })
})
