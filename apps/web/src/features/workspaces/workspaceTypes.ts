export type WorkspaceStatus = 'ACTIVE' | 'ARCHIVED'

export interface Workspace {
  id: string
  organizationId: string
  name: string
  code: string
  status: WorkspaceStatus
  settings: Record<string, unknown>
  defaultLanguageCode: string | null
  timezone: string
  archivedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface WorkspaceListParams {
  page?: number
  limit?: number
  search?: string
  status?: WorkspaceStatus
}

export interface PaginationMeta {
  total: number
  page: number
  limit: number
  totalPages: number
  hasNext: boolean
  hasPrevious: boolean
}

export interface WorkspacePage {
  data: Workspace[]
  meta: PaginationMeta
}

export interface CreateWorkspaceInput {
  name: string
  code: string
  defaultLanguageCode?: string
  timezone?: string
}

export interface UpdateWorkspaceInput {
  name?: string
  defaultLanguageCode?: string | null
  timezone?: string
}
