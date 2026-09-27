import { create } from 'zustand'

export interface AuthUser {
  id: string
  fullName: string
  email: string
  role: string
  organizationId: string | null
  permissions: string[]
  roleId: string | null
  roleCode: string
  roleName: string
  avatarObjectKey: string | null
}

export interface AuthSession {
  accessToken: string
  accessTokenExpiresIn: string
  user: AuthUser
}

export type AuthStatus = 'initializing' | 'authenticated' | 'anonymous'

interface AuthState {
  user: AuthUser | null
  accessToken: string | null
  accessTokenExpiresIn: string | null
  status: AuthStatus
  forbidden: boolean
  setSession: (session: AuthSession) => void
  clear: () => void
  setAnonymous: () => void
  setForbidden: () => void
  clearForbidden: () => void
}

const initialSession = { user: null, accessToken: null, accessTokenExpiresIn: null } as const

export const useAuthStore = create<AuthState>((set) => ({
  ...initialSession,
  status: 'initializing',
  forbidden: false,
  setSession: ({ user, accessToken, accessTokenExpiresIn }) => set({ user, accessToken, accessTokenExpiresIn, status: 'authenticated', forbidden: false }),
  clear: () => set({ ...initialSession, status: 'anonymous', forbidden: false }),
  setAnonymous: () => set({ ...initialSession, status: 'anonymous', forbidden: false }),
  setForbidden: () => set({ forbidden: true }),
  clearForbidden: () => set({ forbidden: false }),
}))
