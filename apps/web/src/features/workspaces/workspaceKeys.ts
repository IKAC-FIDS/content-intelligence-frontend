import type { WorkspaceListParams } from './workspaceTypes'

export const workspaceKeys = {
  all: (tenantId: string) => ['workspaces', tenantId] as const,
  list: (tenantId: string, filters: WorkspaceListParams = {}) =>
    [...workspaceKeys.all(tenantId), 'list', filters] as const,
  detail: (tenantId: string, workspaceId: string) =>
    [...workspaceKeys.all(tenantId), 'detail', workspaceId] as const,
  scoped: (tenantId: string, workspaceId: string, resource: string) =>
    ['workspace-scoped', tenantId, workspaceId, resource] as const,
}
