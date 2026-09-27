import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react'
import { hasPermission, PERMISSIONS } from '@/lib/permissions'
import { normalizeApiError } from '@/lib/apiError'
import { useAuthStore } from '@/store/authStore'
import { listAllActiveWorkspaces } from './workspaceApi'
import { persistWorkspaceId, readPersistedWorkspaceId } from './workspacePersistence'
import { initialWorkspaceState, workspaceReducer } from './workspaceState'
import type { Workspace } from './workspaceTypes'

interface WorkspaceContextValue {
  workspaces: Workspace[]
  activeWorkspaceId: string | null
  activeWorkspace: Workspace | null
  isLoading: boolean
  error: string | null
  setActiveWorkspace: (workspaceId: string) => void
  refreshWorkspaces: () => Promise<Workspace[]>
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null)

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const tenantId = useAuthStore((state) => state.user?.organizationId ?? null)
  const permissions = useAuthStore((state) => state.user?.permissions ?? [])
  const canView = hasPermission(permissions, PERMISSIONS.WORKSPACE_VIEW)
  const [state, dispatch] = useReducer(workspaceReducer, tenantId, initialWorkspaceState)

  const refreshWorkspaces = useCallback(async () => {
    if (!tenantId || !canView) {
      dispatch({ type: 'loaded', workspaces: [], persistedId: null })
      return []
    }
    dispatch({ type: 'loading' })
    try {
      const workspaces = await listAllActiveWorkspaces()
      const persistedId = readPersistedWorkspaceId(tenantId)
      dispatch({ type: 'loaded', workspaces, persistedId })
      const validId = persistedId && workspaces.some((workspace) => workspace.id === persistedId)
        ? persistedId
        : workspaces[0]?.id ?? null
      persistWorkspaceId(tenantId, validId)
      return workspaces
    } catch (reason) {
      const error = normalizeApiError(reason)
      dispatch({ type: 'failed', message: error.message })
      throw reason
    }
  }, [canView, tenantId])

  useEffect(() => {
    dispatch({ type: 'tenant-changed', tenantId })
    void refreshWorkspaces().catch(() => undefined)
  }, [refreshWorkspaces, tenantId])

  const setActiveWorkspace = useCallback((workspaceId: string) => {
    if (!tenantId) return
    const valid = state.workspaces.some(
      (workspace) => workspace.id === workspaceId && workspace.status === 'ACTIVE',
    )
    if (!valid) return
    dispatch({ type: 'selected', workspaceId })
    persistWorkspaceId(tenantId, workspaceId)
  }, [state.workspaces, tenantId])

  const activeWorkspace = useMemo(
    () => state.workspaces.find((workspace) => workspace.id === state.activeWorkspaceId) ?? null,
    [state.activeWorkspaceId, state.workspaces],
  )

  const value = useMemo<WorkspaceContextValue>(() => ({
    workspaces: state.workspaces,
    activeWorkspaceId: state.activeWorkspaceId,
    activeWorkspace,
    isLoading: state.phase === 'loading',
    error: state.error,
    setActiveWorkspace,
    refreshWorkspaces,
  }), [activeWorkspace, refreshWorkspaces, setActiveWorkspace, state])

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext)
  if (!context) throw new Error('useWorkspace must be used inside WorkspaceProvider')
  return context
}
