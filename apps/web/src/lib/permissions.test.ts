import { beforeEach, describe, expect, it } from 'vitest'
import { getPermissionDecision, hasAllPermissions, hasAnyPermission, hasPermission, PERMISSIONS, satisfiesPermissionRequirement } from './permissions'
import { useAuthStore, type AuthSession } from '@/store/authStore'

describe('permission helpers', () => {
  it('checks exact permissions including empty and missing sets', () => {
    expect(hasPermission([PERMISSIONS.USER_VIEW], PERMISSIONS.USER_VIEW)).toBe(true)
    expect(hasPermission([PERMISSIONS.USER_VIEW], PERMISSIONS.USER_MANAGE)).toBe(false)
    expect(hasPermission([], PERMISSIONS.USER_VIEW)).toBe(false)
  })
  it('supports explicit ANY semantics', () => {
    expect(hasAnyPermission([PERMISSIONS.USER_VIEW], [PERMISSIONS.USER_MANAGE, PERMISSIONS.USER_VIEW])).toBe(true)
    expect(hasAnyPermission([PERMISSIONS.USER_VIEW], [PERMISSIONS.USER_MANAGE, PERMISSIONS.ROLE_VIEW])).toBe(false)
  })
  it('supports explicit ALL semantics', () => {
    expect(hasAllPermissions([PERMISSIONS.USER_VIEW, PERMISSIONS.USER_MANAGE], [PERMISSIONS.USER_VIEW, PERMISSIONS.USER_MANAGE])).toBe(true)
    expect(hasAllPermissions([PERMISSIONS.USER_VIEW], [PERMISSIONS.USER_VIEW, PERMISSIONS.USER_MANAGE])).toBe(false)
  })
  it('combines ALL and ANY requirements without wildcard matching', () => {
    expect(satisfiesPermissionRequirement([PERMISSIONS.USER_VIEW, PERMISSIONS.ROLE_VIEW], { allOf: [PERMISSIONS.USER_VIEW], anyOf: [PERMISSIONS.ROLE_VIEW, PERMISSIONS.ROLE_MANAGE] })).toBe(true)
    expect(hasPermission(['user:*'], PERMISSIONS.USER_VIEW)).toBe(false)
  })
})

describe('permission route decisions', () => {
  it('distinguishes initialization, login, allowed, and forbidden', () => {
    const requirement = { allOf: [PERMISSIONS.ORGANIZATION_VIEW] } as const
    expect(getPermissionDecision('initializing', [], requirement)).toBe('loading')
    expect(getPermissionDecision('anonymous', [], requirement)).toBe('login')
    expect(getPermissionDecision('authenticated', [PERMISSIONS.ORGANIZATION_VIEW], requirement)).toBe('allowed')
    expect(getPermissionDecision('authenticated', [], requirement)).toBe('forbidden')
  })
})

describe('permission freshness', () => {
  const session = (permissions: string[]): AuthSession => ({ accessToken: 'token', accessTokenExpiresIn: '15m', user: { id: 'user', fullName: 'User', email: 'user@example.invalid', role: 'CUSTOM', organizationId: 'org', permissions, roleId: 'role', roleCode: 'CUSTOM', roleName: 'Custom', avatarObjectKey: null, platformAdmin: false } })
  beforeEach(() => useAuthStore.getState().clear())
  it('replaces permissions when a new tenant session is installed', () => {
    useAuthStore.getState().setSession(session([PERMISSIONS.USER_VIEW]))
    useAuthStore.getState().setSession(session([PERMISSIONS.ROLE_VIEW]))
    expect(useAuthStore.getState().user?.permissions).toEqual([PERMISSIONS.ROLE_VIEW])
    expect(useAuthStore.getState().user?.permissions).not.toContain(PERMISSIONS.USER_VIEW)
  })
})
