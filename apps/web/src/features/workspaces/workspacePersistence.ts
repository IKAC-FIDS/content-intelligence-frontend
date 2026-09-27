const storagePrefix = 'content-intelligence-active-workspace'

export function workspaceStorageKey(tenantId: string): string {
  return `${storagePrefix}:${tenantId}`
}

export function readPersistedWorkspaceId(tenantId: string, storage: Pick<Storage, 'getItem'> = localStorage) {
  return storage.getItem(workspaceStorageKey(tenantId))
}

export function persistWorkspaceId(
  tenantId: string,
  workspaceId: string | null,
  storage: Pick<Storage, 'setItem' | 'removeItem'> = localStorage,
) {
  const key = workspaceStorageKey(tenantId)
  if (workspaceId) storage.setItem(key, workspaceId)
  else storage.removeItem(key)
}
