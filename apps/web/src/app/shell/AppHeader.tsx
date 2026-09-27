import { Menu } from 'lucide-react'
import { ThemeSelector } from '@/components/ThemeSelector'
import { PermissionGate } from '@/components/PermissionGate'
import { WorkspaceSwitcher } from '@/features/workspaces/WorkspaceSwitcher'
import { PERMISSIONS } from '@/lib/permissions'
import { AccountMenu } from './AccountMenu'
import { Breadcrumbs } from './Breadcrumbs'

export function AppHeader({ onMenuOpen }: { onMenuOpen: () => void }) {
  return <header className="shell-header"><div className="shell-header-context"><button className="icon-button mobile-menu-trigger" type="button" aria-label="بازکردن منوی اصلی" aria-controls="app-sidebar" onClick={onMenuOpen}><Menu size={21} /></button><Breadcrumbs /><PermissionGate requirement={{ allOf: [PERMISSIONS.WORKSPACE_VIEW] }}><WorkspaceSwitcher /></PermissionGate></div><div className="shell-header-actions"><ThemeSelector /><AccountMenu /></div></header>
}
