import type { Workspace } from './workspaceTypes'

export type WorkspacePhase = 'idle' | 'loading' | 'ready' | 'error'

export interface WorkspaceState {
  tenantId: string | null
  workspaces: Workspace[]
  activeWorkspaceId: string | null
  phase: WorkspacePhase
  error: string | null
}

export type WorkspaceAction =
  | { type: 'tenant-changed'; tenantId: string | null }
  | { type: 'loading' }
  | { type: 'loaded'; workspaces: Workspace[]; persistedId: string | null }
  | { type: 'failed'; message: string }
  | { type: 'selected'; workspaceId: string | null }

export function initialWorkspaceState(tenantId: string | null): WorkspaceState {
  return { tenantId, workspaces: [], activeWorkspaceId: null, phase: tenantId ? 'loading' : 'ready', error: null }
}

export function resolveActiveWorkspaceId(workspaces: readonly Workspace[], preferredId: string | null) {
  const active = workspaces.filter((workspace) => workspace.status === 'ACTIVE')
  return (preferredId && active.some((workspace) => workspace.id === preferredId) ? preferredId : active[0]?.id) ?? null
}

export function workspaceReducer(state: WorkspaceState, action: WorkspaceAction): WorkspaceState {
  if (action.type === 'tenant-changed') return initialWorkspaceState(action.tenantId)
  if (action.type === 'loading') return { ...state, phase: 'loading', error: null }
  if (action.type === 'failed') return { ...state, workspaces: [], activeWorkspaceId: null, phase: 'error', error: action.message }
  if (action.type === 'loaded') {
    return {
      ...state,
      workspaces: action.workspaces,
      activeWorkspaceId: resolveActiveWorkspaceId(action.workspaces, action.persistedId),
      phase: 'ready',
      error: null,
    }
  }
  if (action.workspaceId === null) return { ...state, activeWorkspaceId: null }
  return state.workspaces.some((workspace) => workspace.status === 'ACTIVE' && workspace.id === action.workspaceId)
    ? { ...state, activeWorkspaceId: action.workspaceId }
    : state
}
