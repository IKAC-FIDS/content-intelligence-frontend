import type { PaginationMeta } from '@/features/workspaces/workspaceTypes'

export type LanguageDirection = 'LTR' | 'RTL'
export interface Language { id: string; code: string; name: string; nativeName: string; direction: LanguageDirection; isActive: boolean; createdAt: string; updatedAt: string }
export interface LanguagePage { data: Language[]; meta: PaginationMeta }
export interface LanguageListParams { page?: number; limit?: number; search?: string; isActive?: boolean }
export interface CreateLanguageInput { code: string; name: string; nativeName: string; direction: LanguageDirection }
export type UpdateLanguageInput = Omit<CreateLanguageInput, 'code'>
