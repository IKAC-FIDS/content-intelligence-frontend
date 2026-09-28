import { describe, expect, it } from 'vitest'
import { Home } from 'lucide-react'
import { PERMISSIONS } from '@/lib/permissions'
import { filterNavigationGroups, getBreadcrumbs, isNavigationItemActive, navigationGroups, navigationItems, type NavigationGroup } from './navigation'

describe('application shell navigation', () => {
  it('contains the valid product and platform routes', () => {
    expect(navigationItems.map(({ href }) => href)).toEqual(['/', '/workspaces', '/admin/languages', '/admin/intelligence-domains'])
  })

  it('matches the home route exactly', () => {
    expect(isNavigationItemActive('/', '/')).toBe(true)
    expect(isNavigationItemActive('/legacy', '/')).toBe(false)
  })

  it('uses route metadata for breadcrumbs and a safe unknown fallback', () => {
    expect(getBreadcrumbs('/')).toEqual([{ label: 'خانه', href: '/' }])
    expect(getBreadcrumbs('/workspaces', [PERMISSIONS.WORKSPACE_VIEW])).toEqual([{ label: 'فضاهای کاری', href: '/workspaces' }])
    expect(getBreadcrumbs('/workspaces')).toEqual([{ label: 'دسترسی محدود' }])
    expect(getBreadcrumbs('/admin/languages', [], true)).toEqual([{ label: 'مدیریت زبان‌ها', href: '/admin/languages' }])
    expect(getBreadcrumbs('/admin/languages')).toEqual([{ label: 'دسترسی محدود' }])
    expect(getBreadcrumbs('/admin/intelligence-domains', [], true)).toEqual([{ label: 'مدیریت حوزه‌ها', href: '/admin/intelligence-domains' }])
    expect(getBreadcrumbs('/legacy')).toEqual([{ label: 'صفحه نامعتبر' }])
  })

  it('shows platform navigation only to explicit platform authority', () => {
    expect(filterNavigationGroups(navigationGroups, [PERMISSIONS.WORKSPACE_VIEW], false).flatMap(group => group.items).some(item => item.id === 'languages')).toBe(false)
    expect(filterNavigationGroups(navigationGroups, [], true).flatMap(group => group.items).some(item => item.id === 'languages')).toBe(true)
    expect(filterNavigationGroups(navigationGroups, [], true).flatMap(group => group.items).some(item => item.id === 'intelligence-domains')).toBe(true)
  })

  it('filters protected items and removes empty groups', () => {
    const groups: NavigationGroup[] = [
      { id: 'public', items: [{ id: 'home', label: 'Home', href: '/', icon: Home }] },
      { id: 'admin', items: [{ id: 'users', label: 'Users', href: '/users', icon: Home, permission: { allOf: [PERMISSIONS.USER_VIEW] } }] },
    ]
    expect(filterNavigationGroups(groups, []).map(({ id }) => id)).toEqual(['public'])
    expect(filterNavigationGroups(groups, [PERMISSIONS.USER_VIEW]).map(({ id }) => id)).toEqual(['public', 'admin'])
  })

  it('does not depend on role names for custom-role visibility', () => {
    const groups: NavigationGroup[] = [{ id: 'roles', items: [{ id: 'roles', label: 'Roles', href: '/roles', icon: Home, permission: { allOf: [PERMISSIONS.ROLE_VIEW] } }] }]
    const roleA = { name: 'Custom A', permissions: [PERMISSIONS.ROLE_VIEW] }
    const roleB = { name: 'Custom B', permissions: [PERMISSIONS.ROLE_VIEW] }
    expect(filterNavigationGroups(groups, roleA.permissions)).toEqual(filterNavigationGroups(groups, roleB.permissions))
  })
})
