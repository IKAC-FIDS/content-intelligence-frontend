import { describe, expect, it } from 'vitest'
import { mergeDomainOptions, mergeLanguageOptions, mergeTopicOptions } from './WorkspaceForm'
import type { Language } from '@/features/languages/languageTypes'
import type { IntelligenceDomain } from '@/features/intelligence-domains/intelligenceDomainTypes'
import type { Topic } from '@/features/topics/topicTypes'

describe('WorkspaceForm language options', () => {
  const language = (id: string, isActive = true): Language => ({ id, code: id, name: id, nativeName: id, direction: 'LTR', isActive, createdAt: 'now', updatedAt: 'now' })
  it('keeps an existing inactive reference visible without duplicating active options', () => {
    expect(mergeLanguageOptions([language('en')], [language('en'), language('legacy', false)])).toEqual([language('en'), language('legacy', false)])
  })
})

describe('WorkspaceForm Topic options', () => {
  const topic = (id: string, isActive = true): Topic => ({ id, code: id, name: id, description: null, isActive, domains: [], aliases: [], createdAt: 'now', updatedAt: 'now' })
  it('preserves an existing inactive Topic without duplicating active options', () => { expect(mergeTopicOptions([topic('active')], [topic('legacy', false)])).toEqual([topic('active'), topic('legacy', false)]) })
})

describe('WorkspaceForm Intelligence Domain options', () => {
  const domain = (id: string, isActive = true): IntelligenceDomain => ({ id, code: id, name: id, description: null, isActive, createdAt: 'now', updatedAt: 'now' })
  it('keeps an existing inactive relation visible and deduplicates active API options', () => {
    expect(mergeDomainOptions([domain('technology')], [domain('technology'), domain('legacy', false)])).toEqual([domain('technology'), domain('legacy', false)])
  })
})
