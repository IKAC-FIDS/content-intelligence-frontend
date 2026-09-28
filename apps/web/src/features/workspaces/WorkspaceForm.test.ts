import { describe, expect, it } from 'vitest'
import { mergeLanguageOptions } from './WorkspaceForm'
import type { Language } from '@/features/languages/languageTypes'

describe('WorkspaceForm language options', () => {
  const language = (id: string, isActive = true): Language => ({ id, code: id, name: id, nativeName: id, direction: 'LTR', isActive, createdAt: 'now', updatedAt: 'now' })
  it('keeps an existing inactive reference visible without duplicating active options', () => {
    expect(mergeLanguageOptions([language('en')], [language('en'), language('legacy', false)])).toEqual([language('en'), language('legacy', false)])
  })
})
