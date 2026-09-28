import type { Language } from '@/features/languages/languageTypes'

export type WorkspaceStatus = 'ACTIVE' | 'ARCHIVED'

export interface Workspace {
  id: string
  organizationId: string
  name: string
  code: string
  status: WorkspaceStatus
  settings: Record<string, unknown>
  defaultLanguageId: string | null
  defaultLanguage: Language | null
  inputLanguages: Language[]
  outputLanguages: Language[]
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
  inputLanguageIds?: string[]
  outputLanguageIds?: string[]
  defaultLanguageId?: string
  timezone?: string
}

export interface UpdateWorkspaceInput {
  name?: string
  inputLanguageIds?: string[]
  outputLanguageIds?: string[]
  defaultLanguageId?: string | null
  timezone?: string
}
