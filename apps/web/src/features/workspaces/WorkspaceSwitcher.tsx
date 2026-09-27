import { BriefcaseBusiness } from 'lucide-react'
import { useWorkspace } from './WorkspaceProvider'

export function WorkspaceSwitcher() {
  const { workspaces, activeWorkspaceId, isLoading, error, setActiveWorkspace } = useWorkspace()
  return <label className="workspace-switcher">
    <BriefcaseBusiness size={18} aria-hidden="true" />
    <span className="sr-only">فضای کاری فعال</span>
    <select
      aria-label="فضای کاری فعال"
      value={activeWorkspaceId ?? ''}
      disabled={isLoading || workspaces.length === 0}
      title={error ?? undefined}
      onChange={(event) => setActiveWorkspace(event.target.value)}
    >
      {isLoading && <option value="">در حال بارگذاری…</option>}
      {!isLoading && workspaces.length === 0 && <option value="">فضای کاری موجود نیست</option>}
      {workspaces.map((workspace) => <option key={workspace.id} value={workspace.id}>{workspace.name}</option>)}
    </select>
  </label>
}
