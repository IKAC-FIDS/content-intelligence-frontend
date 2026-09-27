import type { AuthStatus } from '@/store/authStore'

export const PERMISSIONS = {
  USER_VIEW: 'user:view',
  USER_CREATE: 'user:create',
  USER_MANAGE: 'user:manage',
  USER_ACTIVATE: 'user:activate',
  USER_DEACTIVATE: 'user:deactivate',
  USER_CHANGE_ROLE: 'user:change-role',
  USER_PASSKEY_VIEW: 'user:passkey:view',
  USER_PASSKEY_MANAGE: 'user:passkey:manage',
  PERMISSION_VIEW: 'permission:view',
  PERMISSION_MANAGE: 'permission:manage',
  ROLE_VIEW: 'role:view',
  ROLE_MANAGE: 'role:manage',
  AUDIT_LOG_VIEW: 'audit-log:view',
  ORGANIZATION_VIEW: 'organization:view',
  ORGANIZATION_MANAGE: 'organization:manage',
  TEAM_VIEW: 'team:view',
  TEAM_MANAGE: 'team:manage',
  SSO_PROVIDER_VIEW: 'sso-provider:view',
  SSO_PROVIDER_MANAGE: 'sso-provider:manage',
} as const

export type PermissionCode = typeof PERMISSIONS[keyof typeof PERMISSIONS]
export interface PermissionRequirement { allOf?: readonly PermissionCode[]; anyOf?: readonly PermissionCode[] }
export type PermissionDecision = 'loading' | 'login' | 'allowed' | 'forbidden'

export function hasPermission(permissions: readonly string[], permission: PermissionCode): boolean { return permissions.includes(permission) }
export function hasAnyPermission(permissions: readonly string[], required: readonly PermissionCode[]): boolean { return required.some((permission) => hasPermission(permissions, permission)) }
export function hasAllPermissions(permissions: readonly string[], required: readonly PermissionCode[]): boolean { return required.every((permission) => hasPermission(permissions, permission)) }
export function satisfiesPermissionRequirement(permissions: readonly string[], requirement?: PermissionRequirement): boolean {
  if (!requirement) return true
  return hasAllPermissions(permissions, requirement.allOf ?? []) && ((requirement.anyOf?.length ?? 0) === 0 || hasAnyPermission(permissions, requirement.anyOf ?? []))
}
export function getPermissionDecision(status: AuthStatus, permissions: readonly string[], requirement?: PermissionRequirement): PermissionDecision {
  if (status === 'initializing') return 'loading'
  if (status === 'anonymous') return 'login'
  return satisfiesPermissionRequirement(permissions, requirement) ? 'allowed' : 'forbidden'
}
