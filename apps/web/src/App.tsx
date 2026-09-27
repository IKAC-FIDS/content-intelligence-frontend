import { useEffect, type ReactNode } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { Dashboard } from '@/app/Dashboard'
import { ForbiddenPage } from '@/app/ForbiddenPage'
import { NotFoundPage } from '@/app/NotFoundPage'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { initializeSession } from '@/lib/auth'
import { getProtectedRouteDecision } from '@/lib/navigation'
import { useAuthStore } from '@/store/authStore'

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
  if (decision === 'forbidden') return <ForbiddenPage />
  return children
}

export default function App() {
  const status = useAuthStore((state) => state.status)
  useEffect(() => { if (status === 'initializing') void initializeSession() }, [status])

  return <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/" element={<Protected><Dashboard /></Protected>} />
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
}
