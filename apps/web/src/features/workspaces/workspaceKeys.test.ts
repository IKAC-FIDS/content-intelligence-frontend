import { describe, expect, it } from 'vitest'
import { workspaceKeys } from './workspaceKeys'

describe('workspace query keys', () => {
  it('scopes list, detail, and resource keys by tenant and active workspace', () => {
    expect(workspaceKeys.list('tenant-a', { status: 'ACTIVE' })).not.toEqual(workspaceKeys.list('tenant-b', { status: 'ACTIVE' }))
    expect(workspaceKeys.detail('tenant-a', 'workspace-a')).not.toEqual(workspaceKeys.detail('tenant-a', 'workspace-b'))
    expect(workspaceKeys.scoped('tenant-a', 'workspace-a', 'documents')).toEqual(['workspace-scoped', 'tenant-a', 'workspace-a', 'documents'])
  })
})
