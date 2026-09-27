import type { ReactNode } from 'react'
import { usePermissions } from '@/hooks/usePermissions'
import type { PermissionRequirement } from '@/lib/permissions'

export function PermissionGate({ requirement, children, fallback = null }: { requirement: PermissionRequirement; children: ReactNode; fallback?: ReactNode }) {
  const { satisfies } = usePermissions()
  return satisfies(requirement) ? children : fallback
}
