import { beforeEach, describe, expect, it, vi } from 'vitest'
import { api } from '@/lib/api'
import { createIntelligenceDomain, listAllSelectableIntelligenceDomains, listIntelligenceDomains, setIntelligenceDomainActive, updateIntelligenceDomain } from './intelligenceDomainApi'

vi.mock('@/lib/api', async (importOriginal) => { const original = await importOriginal<typeof import('@/lib/api')>(); return { ...original, api: { get: vi.fn(), post: vi.fn(), patch: vi.fn() } } })
const domain = { id: 'domain-1', code: 'healthcare', name: 'Healthcare', description: null, isActive: true, createdAt: 'now', updatedAt: 'now' }
const page = (data: unknown[], current = 1, totalPages = 1) => ({ data: { success: true, data, meta: { total: data.length, page: current, limit: 100, totalPages, hasNext: current < totalPages, hasPrevious: current > 1 } } })

describe('Intelligence Domain API', () => {
  beforeEach(() => vi.clearAllMocks())
  it('separates active catalog and platform administration', async () => { vi.mocked(api.get).mockResolvedValue(page([domain])); await listIntelligenceDomains({ search: 'health' }); await listIntelligenceDomains({ isActive: false }, true); expect(api.get).toHaveBeenNthCalledWith(1, '/intelligence-domains', { params: { search: 'health' } }); expect(api.get).toHaveBeenNthCalledWith(2, '/admin/intelligence-domains', { params: { isActive: false } }) })
  it('loads all active pages dynamically', async () => { vi.mocked(api.get).mockResolvedValueOnce(page([domain],1,2)).mockResolvedValueOnce(page([{...domain,id:'domain-2',code:'finance'}],2,2)); await expect(listAllSelectableIntelligenceDomains()).resolves.toHaveLength(2) })
  it('uses create, immutable-code update, activate and deactivate endpoints', async () => { vi.mocked(api.post).mockResolvedValue({data:{success:true,data:domain}}); vi.mocked(api.patch).mockResolvedValue({data:{success:true,data:domain}}); await createIntelligenceDomain({code:'healthcare',name:'Healthcare'}); await updateIntelligenceDomain('domain-1',{name:'Health'}); await setIntelligenceDomainActive('domain-1',false); await setIntelligenceDomainActive('domain-1',true); expect(api.post).toHaveBeenCalledWith('/admin/intelligence-domains',expect.objectContaining({code:'healthcare'})); expect(api.patch).toHaveBeenNthCalledWith(1,'/admin/intelligence-domains/domain-1',expect.not.objectContaining({code:expect.anything()})); expect(api.patch).toHaveBeenNthCalledWith(2,'/admin/intelligence-domains/domain-1/deactivate'); expect(api.patch).toHaveBeenNthCalledWith(3,'/admin/intelligence-domains/domain-1/activate') })
})
