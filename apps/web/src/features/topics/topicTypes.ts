import type { IntelligenceDomain } from '@/features/intelligence-domains/intelligenceDomainTypes'
import type { Language } from '@/features/languages/languageTypes'
import type { PaginationMeta } from '@/features/workspaces/workspaceTypes'
export interface TopicAlias { id: string; value: string; normalizedValue: string; languageId: string | null; language: Language | null; createdAt: string; updatedAt: string }
export interface Topic { id: string; code: string; name: string; description: string | null; isActive: boolean; domains: IntelligenceDomain[]; aliases: TopicAlias[]; createdAt: string; updatedAt: string }
export interface TopicPage { data: Topic[]; meta: PaginationMeta }
export interface TopicListParams { page?: number; limit?: number; search?: string; isActive?: boolean; domainId?: string }
export interface TopicAliasInput { value: string; languageId?: string | null }
export interface CreateTopicInput { code: string; name: string; description?: string; domainIds: string[]; aliases?: TopicAliasInput[] }
export interface UpdateTopicInput { name?: string; description?: string | null; domainIds?: string[]; aliases?: TopicAliasInput[] }
