import { describe, expect, it } from 'vitest'
import { persistWorkspaceId, readPersistedWorkspaceId, workspaceStorageKey } from './workspacePersistence'

function memoryStorage(): Storage {
  const values = new Map<string, string>()
  return {
    get length() { return values.size },
    clear: () => values.clear(),
    getItem: (key) => values.get(key) ?? null,
    key: (index) => [...values.keys()][index] ?? null,
    removeItem: (key) => { values.delete(key) },
    setItem: (key, value) => { values.set(key, value) },
  }
}

describe('workspace persistence', () => {
  it('uses a tenant-scoped key and restores each tenant independently', () => {
    const storage = memoryStorage()
    persistWorkspaceId('tenant-a', 'workspace-a', storage)
    persistWorkspaceId('tenant-b', 'workspace-b', storage)
    expect(workspaceStorageKey('tenant-a')).not.toBe(workspaceStorageKey('tenant-b'))
    expect(readPersistedWorkspaceId('tenant-a', storage)).toBe('workspace-a')
    expect(readPersistedWorkspaceId('tenant-b', storage)).toBe('workspace-b')
  })

  it('removes the tenant selection when no active workspace remains', () => {
    const storage = memoryStorage()
    persistWorkspaceId('tenant-a', 'workspace-a', storage)
    persistWorkspaceId('tenant-a', null, storage)
    expect(readPersistedWorkspaceId('tenant-a', storage)).toBeNull()
  })
})
