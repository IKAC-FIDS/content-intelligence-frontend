import type { ReactNode } from 'react'
import { ForbiddenPage } from './ForbiddenPage'
import { useAuthStore } from '@/store/authStore'

export function PlatformBoundary({ children }: { children: ReactNode }) {
  return useAuthStore((state) => state.user?.platformAdmin) ? children : <ForbiddenPage />
}
