import type { AuthStatus } from '@/store/authStore'

export type ProtectedRouteDecision = 'loading' | 'login' | 'forbidden' | 'content'

export function getProtectedRouteDecision(status: AuthStatus, forbidden: boolean): ProtectedRouteDecision {
  if (status === 'initializing') return 'loading'
  if (status === 'anonymous') return 'login'
  if (forbidden) return 'forbidden'
  return 'content'
}

export function getSafeReturnPath(state: unknown): string {
  if (typeof state !== 'object' || state === null || !('from' in state)) return '/'
  const from = (state as { from?: unknown }).from
  if (typeof from !== 'string' || !from.startsWith('/') || from.startsWith('//') || from === '/login') return '/'
  return from
}
