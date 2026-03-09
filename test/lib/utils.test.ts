import { describe, expect, it } from 'vitest'
import {
  cn,
  countWords,
  createId,
  fileExtension,
  fileNameFromPath,
  folderNameFromPath,
  getErrorMessage,
} from '@/lib/utils'

describe('utility helpers', () => {
  it('joins truthy class names', () => {
    expect(cn('base', false, undefined, 'active')).toBe('base active')
  })

  it('extracts file and folder names from paths', () => {
    expect(fileNameFromPath('/workspace/notes/draft.md')).toBe('draft.md')
    expect(folderNameFromPath('/workspace/notes')).toBe('notes')
  })

  it('reads file extensions', () => {
    expect(fileExtension('draft.md')).toBe('md')
    expect(fileExtension('archive.tar.gz')).toBe('gz')
    expect(fileExtension('README')).toBe('')
  })

  it('counts latin words and cjk characters', () => {
    expect(countWords('hello solid world')).toBe(3)
    expect(countWords('你好 Solid')).toBe(3)
  })

  it('normalizes error messages', () => {
    expect(getErrorMessage(new Error('boom'))).toBe('boom')
    expect(getErrorMessage('plain error')).toBe('plain error')
    expect(getErrorMessage({})).toBe('Something went wrong.')
  })

  it('creates prefixed ids', () => {
    expect(createId('toast')).toMatch(/^toast-/)
  })
})
