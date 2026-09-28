import { api, unwrapApiData, type ApiEnvelope } from '@/lib/api'
import type { CreateTopicInput, Topic, TopicListParams, TopicPage, UpdateTopicInput } from './topicTypes'
interface PageEnvelope extends ApiEnvelope<Topic[]> { meta: TopicPage['meta'] }
export async function listTopics(params: TopicListParams = {}, admin = false): Promise<TopicPage> { const response = await api.get<PageEnvelope>(admin ? '/admin/topics' : '/topics', { params }); return { data: response.data.data, meta: response.data.meta } }
export async function listAllSelectableTopics() { const first = await listTopics({ page: 1, limit: 100 }); const data = [...first.data]; for (let page = 2; page <= first.meta.totalPages; page++) data.push(...(await listTopics({ page, limit: 100 })).data); return data }
export async function createTopic(input: CreateTopicInput) { return unwrapApiData((await api.post<ApiEnvelope<Topic>>('/admin/topics', input)).data) }
export async function updateTopic(id: string, input: UpdateTopicInput) { return unwrapApiData((await api.patch<ApiEnvelope<Topic>>(`/admin/topics/${id}`, input)).data) }
export async function setTopicActive(id: string, active: boolean) { return unwrapApiData((await api.patch<ApiEnvelope<Topic>>(`/admin/topics/${id}/${active ? 'activate' : 'deactivate'}`)).data) }
