import { api, unwrapApiData, type ApiEnvelope } from '@/lib/api'
import type { CreateIntelligenceDomainInput, IntelligenceDomain, IntelligenceDomainListParams, IntelligenceDomainPage, UpdateIntelligenceDomainInput } from './intelligenceDomainTypes'

interface PageEnvelope extends ApiEnvelope<IntelligenceDomain[]> { meta: IntelligenceDomainPage['meta'] }
export async function listIntelligenceDomains(params: IntelligenceDomainListParams = {}, admin = false): Promise<IntelligenceDomainPage> { const response = await api.get<PageEnvelope>(admin ? '/admin/intelligence-domains' : '/intelligence-domains', { params }); return { data: response.data.data, meta: response.data.meta } }
export async function listAllSelectableIntelligenceDomains() { const first = await listIntelligenceDomains({ page: 1, limit: 100 }); const data = [...first.data]; for (let page = 2; page <= first.meta.totalPages; page++) data.push(...(await listIntelligenceDomains({ page, limit: 100 })).data); return data }
export async function createIntelligenceDomain(input: CreateIntelligenceDomainInput) { return unwrapApiData((await api.post<ApiEnvelope<IntelligenceDomain>>('/admin/intelligence-domains', input)).data) }
export async function updateIntelligenceDomain(id: string, input: UpdateIntelligenceDomainInput) { return unwrapApiData((await api.patch<ApiEnvelope<IntelligenceDomain>>(`/admin/intelligence-domains/${id}`, input)).data) }
export async function setIntelligenceDomainActive(id: string, active: boolean) { return unwrapApiData((await api.patch<ApiEnvelope<IntelligenceDomain>>(`/admin/intelligence-domains/${id}/${active ? 'activate' : 'deactivate'}`)).data) }
