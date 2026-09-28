import type { PaginationMeta } from '@/features/workspaces/workspaceTypes'

export interface IntelligenceDomain { id: string; code: string; name: string; description: string | null; isActive: boolean; createdAt: string; updatedAt: string }
export interface IntelligenceDomainPage { data: IntelligenceDomain[]; meta: PaginationMeta }
export interface IntelligenceDomainListParams { page?: number; limit?: number; search?: string; isActive?: boolean }
export interface CreateIntelligenceDomainInput { code: string; name: string; description?: string }
export interface UpdateIntelligenceDomainInput { name?: string; description?: string | null }
