import { BriefcaseBusiness, Home } from 'lucide-react'
import { PERMISSIONS, satisfiesPermissionRequirement, type PermissionRequirement } from '@/lib/permissions'

export interface NavigationItem {
  id: string
  label: string
  href: string
  icon: typeof Home
  permission?: PermissionRequirement
}

export interface NavigationGroup { id: string; label?: string; items: NavigationItem[] }
export interface BreadcrumbItem { label: string; href?: string }

export const navigationGroups: NavigationGroup[] = [
  { id: 'main', items: [
    { id: 'home', label: 'خانه', href: '/', icon: Home },
    { id: 'workspaces', label: 'فضاهای کاری', href: '/workspaces', icon: BriefcaseBusiness, permission: { allOf: [PERMISSIONS.WORKSPACE_VIEW] } },
  ] },
]

export const navigationItems = navigationGroups.flatMap((group) => group.items)

export function filterNavigationGroups(groups: readonly NavigationGroup[], permissions: readonly string[]): NavigationGroup[] {
  return groups.map((group) => ({ ...group, items: group.items.filter((item) => satisfiesPermissionRequirement(permissions, item.permission)) })).filter((group) => group.items.length > 0)
}

export function isNavigationItemActive(pathname: string, href: string): boolean {
  return href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`)
}

export function getBreadcrumbs(pathname: string, permissions: readonly string[] = []): BreadcrumbItem[] {
  const item = navigationItems.find((candidate) => isNavigationItemActive(pathname, candidate.href))
  if (!item) return [{ label: 'صفحه نامعتبر' }]
  return satisfiesPermissionRequirement(permissions, item.permission) ? [{ label: item.label, href: item.href }] : [{ label: 'دسترسی محدود' }]
}
