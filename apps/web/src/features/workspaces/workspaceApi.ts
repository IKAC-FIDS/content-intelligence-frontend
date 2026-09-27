import { api, unwrapApiData, type ApiEnvelope } from '@/lib/api'
import type {
  CreateWorkspaceInput,
  PaginationMeta,
  UpdateWorkspaceInput,
  Workspace,
  WorkspaceListParams,
  WorkspacePage,
} from './workspaceTypes'

interface PaginatedWorkspaceEnvelope extends ApiEnvelope<Workspace[]> {
  meta: PaginationMeta
}

export async function listWorkspaces(params: WorkspaceListParams = {}): Promise<WorkspacePage> {
  const response = await api.get<PaginatedWorkspaceEnvelope>('/workspaces', { params })
  return { data: response.data.data, meta: response.data.meta }
}

export async function listAllActiveWorkspaces(): Promise<Workspace[]> {
  const first = await listWorkspaces({ page: 1, limit: 100, status: 'ACTIVE' })
  const all = [...first.data]
  for (let page = 2; page <= first.meta.totalPages; page += 1) {
    const next = await listWorkspaces({ page, limit: 100, status: 'ACTIVE' })
    all.push(...next.data)
  }
  return all
}

export async function getWorkspace(id: string): Promise<Workspace> {
  const response = await api.get<ApiEnvelope<Workspace>>(`/workspaces/${id}`)
  return unwrapApiData(response.data)
}

export async function createWorkspace(input: CreateWorkspaceInput): Promise<Workspace> {
  const response = await api.post<ApiEnvelope<Workspace>>('/workspaces', input)
  return unwrapApiData(response.data)
}

export async function updateWorkspace(id: string, input: UpdateWorkspaceInput): Promise<Workspace> {
  const response = await api.patch<ApiEnvelope<Workspace>>(`/workspaces/${id}`, input)
  return unwrapApiData(response.data)
}

export async function archiveWorkspace(id: string): Promise<Workspace> {
  const response = await api.patch<ApiEnvelope<Workspace>>(`/workspaces/${id}/archive`)
  return unwrapApiData(response.data)
}
