import { describe, expect, it } from 'vitest'
import { initialWorkspaceState, resolveActiveWorkspaceId, workspaceReducer } from './workspaceState'
import type { Workspace } from './workspaceTypes'

const workspace = (id: string, status: Workspace['status'] = 'ACTIVE'): Workspace => ({
  id, organizationId: 'tenant-a', name: `Workspace ${id}`, code: id, status,
  settings: {}, defaultLanguageId: null, defaultLanguage: null, inputLanguages: [], outputLanguages: [], timezone: 'Asia/Tehran', archivedAt: status === 'ARCHIVED' ? '2026-01-01T00:00:00.000Z' : null,
  createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z',
})

describe('workspace state', () => {
  it('starts loading for a tenant and ready without one', () => {
    expect(initialWorkspaceState('tenant-a').phase).toBe('loading')
    expect(initialWorkspaceState(null).phase).toBe('ready')
  })

  it('restores a valid persisted workspace and falls back to the first active workspace', () => {
    const workspaces = [workspace('one'), workspace('two'), workspace('old', 'ARCHIVED')]
    expect(resolveActiveWorkspaceId(workspaces, 'two')).toBe('two')
    expect(resolveActiveWorkspaceId(workspaces, 'missing')).toBe('one')
    expect(resolveActiveWorkspaceId([workspace('old', 'ARCHIVED')], 'old')).toBeNull()
  })

  it('rejects selection of missing and archived workspaces', () => {
    const loaded = workspaceReducer(initialWorkspaceState('tenant-a'), { type: 'loaded', workspaces: [workspace('one'), workspace('old', 'ARCHIVED')], persistedId: null })
    expect(workspaceReducer(loaded, { type: 'selected', workspaceId: 'old' })).toEqual(loaded)
    expect(workspaceReducer(loaded, { type: 'selected', workspaceId: 'missing' })).toEqual(loaded)
    expect(workspaceReducer(loaded, { type: 'selected', workspaceId: 'one' }).activeWorkspaceId).toBe('one')
  })

  it('invalidates an archived active workspace on refresh and resets on tenant change', () => {
    const loaded = workspaceReducer(initialWorkspaceState('tenant-a'), { type: 'loaded', workspaces: [workspace('one'), workspace('two')], persistedId: 'two' })
    const refreshed = workspaceReducer(loaded, { type: 'loaded', workspaces: [workspace('one'), workspace('two', 'ARCHIVED')], persistedId: 'two' })
    expect(refreshed.activeWorkspaceId).toBe('one')
    expect(workspaceReducer(refreshed, { type: 'tenant-changed', tenantId: 'tenant-b' })).toEqual(initialWorkspaceState('tenant-b'))
  })

  it('never carries Tenant A workspace state into Tenant B', () => {
    const tenantA = workspaceReducer(initialWorkspaceState('tenant-a'), { type: 'loaded', workspaces: [workspace('workspace-a')], persistedId: 'workspace-a' })
    const switching = workspaceReducer(tenantA, { type: 'tenant-changed', tenantId: 'tenant-b' })
    expect(switching).toMatchObject({ tenantId: 'tenant-b', activeWorkspaceId: null, workspaces: [], phase: 'loading' })
    const workspaceB = { ...workspace('workspace-b'), organizationId: 'tenant-b' }
    const tenantB = workspaceReducer(switching, { type: 'loaded', workspaces: [workspaceB], persistedId: 'workspace-b' })
    expect(tenantB.activeWorkspaceId).toBe('workspace-b')
    expect(tenantB.workspaces).toEqual([workspaceB])
  })

  it('clears stale data when loading fails', () => {
    const failed = workspaceReducer(initialWorkspaceState('tenant-a'), { type: 'failed', message: 'network error' })
    expect(failed).toMatchObject({ phase: 'error', error: 'network error', workspaces: [], activeWorkspaceId: null })
  })
})
