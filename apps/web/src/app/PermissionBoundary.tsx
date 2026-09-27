import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { ForbiddenPage } from './ForbiddenPage'
import { PageLoading } from '@/components/PageStates'
import { getPermissionDecision, type PermissionRequirement } from '@/lib/permissions'
import { useAuthStore } from '@/store/authStore'

export function PermissionBoundary({ requirement, children }: { requirement: PermissionRequirement; children: ReactNode }) {
  const status = useAuthStore((state) => state.status)
  const permissions = useAuthStore((state) => state.user?.permissions ?? [])
  const location = useLocation()
  const decision = getPermissionDecision(status, permissions, requirement)
  if (decision === 'loading') return <PageLoading label="در حال بررسی دسترسی…" />
  if (decision === 'login') return <Navigate to="/login" replace state={{ from: `${location.pathname}${location.search}${location.hash}` }} />
  if (decision === 'forbidden') return <ForbiddenPage />
  return children
}
