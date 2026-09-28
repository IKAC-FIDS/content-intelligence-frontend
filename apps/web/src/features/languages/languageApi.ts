import { api, unwrapApiData, type ApiEnvelope } from '@/lib/api'
import type { CreateLanguageInput, Language, LanguageListParams, LanguagePage, UpdateLanguageInput } from './languageTypes'

interface PageEnvelope extends ApiEnvelope<Language[]> { meta: LanguagePage['meta'] }
export async function listLanguages(params: LanguageListParams = {}, admin = false): Promise<LanguagePage> { const response = await api.get<PageEnvelope>(admin ? '/admin/languages' : '/languages', { params }); return { data: response.data.data, meta: response.data.meta } }
export async function listAllSelectableLanguages() { const first = await listLanguages({ page: 1, limit: 100 }); const data = [...first.data]; for (let page = 2; page <= first.meta.totalPages; page++) data.push(...(await listLanguages({ page, limit: 100 })).data); return data }
export async function createLanguage(input: CreateLanguageInput) { return unwrapApiData((await api.post<ApiEnvelope<Language>>('/admin/languages', input)).data) }
export async function updateLanguage(id: string, input: UpdateLanguageInput) { return unwrapApiData((await api.patch<ApiEnvelope<Language>>(`/admin/languages/${id}`, input)).data) }
export async function setLanguageActive(id: string, active: boolean) { return unwrapApiData((await api.patch<ApiEnvelope<Language>>(`/admin/languages/${id}/${active ? 'activate' : 'deactivate'}`)).data) }
