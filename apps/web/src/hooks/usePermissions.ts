import { useAuthStore } from '@/store/authStore'
import { hasAllPermissions, hasAnyPermission, hasPermission, satisfiesPermissionRequirement, type PermissionCode, type PermissionRequirement } from '@/lib/permissions'

export function usePermissions() {
  const permissions = useAuthStore((state) => state.user?.permissions ?? [])
  return {
    permissions,
    hasPermission: (permission: PermissionCode) => hasPermission(permissions, permission),
    hasAnyPermission: (required: readonly PermissionCode[]) => hasAnyPermission(permissions, required),
    hasAllPermissions: (required: readonly PermissionCode[]) => hasAllPermissions(permissions, required),
    satisfies: (requirement?: PermissionRequirement) => satisfiesPermissionRequirement(permissions, requirement),
  }
}
