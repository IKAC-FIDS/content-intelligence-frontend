import { useEffect, type ReactNode } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { Dashboard } from '@/app/Dashboard'
import { NotFoundPage } from '@/app/NotFoundPage'
import { AppShell } from '@/app/shell/AppShell'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { WorkspaceManagementPage } from '@/features/workspaces/WorkspaceManagementPage'
import { PermissionBoundary } from '@/app/PermissionBoundary'
import { initializeSession } from '@/lib/auth'
import { getProtectedRouteDecision } from '@/lib/navigation'
import { PERMISSIONS } from '@/lib/permissions'
import { useAuthStore } from '@/store/authStore'
import { PlatformBoundary } from '@/app/PlatformBoundary'
import { LanguageAdminPage } from '@/features/languages/LanguageAdminPage'
import { IntelligenceDomainAdminPage } from '@/features/intelligence-domains/IntelligenceDomainAdminPage'

export function Protected({ children }: { children: ReactNode }) {
  const status = useAuthStore((state) => state.status)
  const forbidden = useAuthStore((state) => state.forbidden)
  const location = useLocation()
  const decision = getProtectedRouteDecision(status, forbidden)

  if (decision === 'loading') return <div className="loading" role="status"><span className="spinner" />در حال بررسی نشست…</div>
  if (decision === 'login') {
    const from = `${location.pathname}${location.search}${location.hash}`
    return <Navigate to="/login" replace state={{ from }} />
  }
  if (decision === 'forbidden') return children
  return children
}

export default function App() {
  const status = useAuthStore((state) => state.status)
  useEffect(() => { if (status === 'initializing') void initializeSession() }, [status])

  return <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route element={<Protected><AppShell /></Protected>}>
      <Route index element={<Dashboard />} />
      <Route path="workspaces" element={<PermissionBoundary requirement={{ allOf: [PERMISSIONS.WORKSPACE_VIEW] }}><WorkspaceManagementPage /></PermissionBoundary>} />
      <Route path="admin/languages" element={<PlatformBoundary><LanguageAdminPage /></PlatformBoundary>} />
      <Route path="admin/intelligence-domains" element={<PlatformBoundary><IntelligenceDomainAdminPage /></PlatformBoundary>} />
      <Route path="*" element={<NotFoundPage />} />
    </Route>
  </Routes>
}
