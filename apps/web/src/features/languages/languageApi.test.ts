import { beforeEach, describe, expect, it, vi } from 'vitest'
import { api } from '@/lib/api'
import { createLanguage, listAllSelectableLanguages, listLanguages, setLanguageActive, updateLanguage } from './languageApi'

vi.mock('@/lib/api', async (importOriginal) => { const original = await importOriginal<typeof import('@/lib/api')>(); return { ...original, api: { get: vi.fn(), post: vi.fn(), patch: vi.fn() } } })
const language = { id: 'language-1', code: 'de', name: 'German', nativeName: 'Deutsch', direction: 'LTR', isActive: true, createdAt: 'now', updatedAt: 'now' }
const page = (data: unknown[], current = 1, totalPages = 1) => ({ data: { success: true, data, meta: { total: data.length, page: current, limit: 100, totalPages, hasNext: current < totalPages, hasPrevious: current > 1 } } })

describe('Language API', () => {
  beforeEach(() => vi.clearAllMocks())
  it('separates selectable and platform-admin catalog routes', async () => {
    vi.mocked(api.get).mockResolvedValue(page([language]))
    await listLanguages({ search: 'de' }); await listLanguages({ isActive: false }, true)
    expect(api.get).toHaveBeenNthCalledWith(1, '/languages', { params: { search: 'de' } })
    expect(api.get).toHaveBeenNthCalledWith(2, '/admin/languages', { params: { isActive: false } })
  })
  it('loads all selectable pages without a hardcoded catalog', async () => {
    vi.mocked(api.get).mockResolvedValueOnce(page([language], 1, 2)).mockResolvedValueOnce(page([{ ...language, id: 'language-2', code: 'es' }], 2, 2))
    await expect(listAllSelectableLanguages()).resolves.toHaveLength(2)
  })
  it('uses real create, immutable-code update, activate and deactivate routes', async () => {
    vi.mocked(api.post).mockResolvedValue({ data: { success: true, data: language } }); vi.mocked(api.patch).mockResolvedValue({ data: { success: true, data: language } })
    await createLanguage({ code: 'de', name: 'German', nativeName: 'Deutsch', direction: 'LTR' }); await updateLanguage('language-1', { name: 'German', nativeName: 'Deutsch', direction: 'LTR' }); await setLanguageActive('language-1', false); await setLanguageActive('language-1', true)
    expect(api.post).toHaveBeenCalledWith('/admin/languages', expect.objectContaining({ code: 'de' }))
    expect(api.patch).toHaveBeenNthCalledWith(1, '/admin/languages/language-1', expect.not.objectContaining({ code: expect.anything() }))
    expect(api.patch).toHaveBeenNthCalledWith(2, '/admin/languages/language-1/deactivate')
    expect(api.patch).toHaveBeenNthCalledWith(3, '/admin/languages/language-1/activate')
  })
})
