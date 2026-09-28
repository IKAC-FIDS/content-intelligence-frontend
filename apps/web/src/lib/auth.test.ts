import { AxiosError, AxiosHeaders, type InternalAxiosRequestConfig } from 'axios'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { initializeSession, login, logout, logoutAll } from './auth'
import { api, authTransport, refreshSession } from './api'
import { normalizeAuthError } from './authError'
import { useAuthStore, type AuthSession } from '@/store/authStore'

const session = (token = 'access-one'): AuthSession => ({
  accessToken: token,
  accessTokenExpiresIn: '15m',
  user: {
    id: 'user-1', fullName: 'Test User', email: 'test@example.invalid', role: 'ADMIN',
    organizationId: 'organization-1', permissions: ['organization:view'], roleId: 'role-1',
    roleCode: 'ADMIN', roleName: 'Administrator', avatarObjectKey: null, platformAdmin: false,
  },
})

const envelope = (value: AuthSession) => ({ data: { success: true, data: value } })
const originalAdapter = api.defaults.adapter

function unauthorized(config: InternalAxiosRequestConfig, status = 401) {
  return new AxiosError('Request rejected', 'ERR_BAD_REQUEST', config, undefined, {
    status, statusText: status === 401 ? 'Unauthorized' : 'Forbidden', headers: new AxiosHeaders(), config, data: {},
  })
}

describe('authentication services', () => {
  beforeEach(() => useAuthStore.getState().clear())
  afterEach(() => { vi.restoreAllMocks(); api.defaults.adapter = originalAdapter })

  it('hydrates the session after successful login', async () => {
    vi.spyOn(authTransport, 'post').mockResolvedValue(envelope(session()))
    await login({ email: 'test@example.invalid', password: 'secret1' })
    expect(useAuthStore.getState()).toMatchObject({ status: 'authenticated', accessToken: 'access-one', accessTokenExpiresIn: '15m' })
  })

  it('normalizes a failed login without authenticating', async () => {
    const error = new AxiosError('rejected', 'ERR_BAD_REQUEST', undefined, undefined, { status: 401, statusText: 'Unauthorized', headers: {}, config: {} as InternalAxiosRequestConfig, data: { error: { code: 'UNAUTHORIZED', message: 'Invalid credentials' } } })
    vi.spyOn(authTransport, 'post').mockRejectedValue(error)
    await expect(login({ email: 'test@example.invalid', password: 'wrong-pass' })).rejects.toBe(error)
    expect(normalizeAuthError(error)).toMatchObject({ code: 'UNAUTHORIZED', message: 'Invalid credentials', status: 401 })
    expect(useAuthStore.getState().status).toBe('anonymous')
  })

  it('initializes a session through refresh', async () => {
    useAuthStore.setState({ status: 'initializing' })
    vi.spyOn(authTransport, 'post').mockResolvedValue(envelope(session()))
    await expect(initializeSession()).resolves.toMatchObject({ accessToken: 'access-one' })
    expect(useAuthStore.getState().status).toBe('authenticated')
  })

  it('hydrates a successful explicit refresh', async () => {
    vi.spyOn(authTransport, 'post').mockResolvedValue(envelope(session('access-two')))
    await expect(refreshSession()).resolves.toMatchObject({ accessToken: 'access-two' })
    expect(useAuthStore.getState().accessToken).toBe('access-two')
  })

  it('clears state after failed refresh', async () => {
    useAuthStore.getState().setSession(session())
    vi.spyOn(authTransport, 'post').mockRejectedValue(new Error('expired'))
    await expect(refreshSession()).resolves.toBeNull()
    expect(useAuthStore.getState()).toMatchObject({ status: 'anonymous', accessToken: null, user: null })
  })

  it('refreshes once and retries a 401 request with the new token', async () => {
    useAuthStore.getState().setSession(session())
    vi.spyOn(authTransport, 'post').mockResolvedValue(envelope(session('access-two')))
    let attempts = 0
    api.defaults.adapter = async (config) => {
      attempts += 1
      if (attempts === 1) throw unauthorized(config)
      return { status: 200, statusText: 'OK', headers: {}, config, data: { ok: true } }
    }
    await expect(api.get('/protected')).resolves.toMatchObject({ data: { ok: true } })
    expect(attempts).toBe(2)
    expect(useAuthStore.getState().accessToken).toBe('access-two')
  })

  it('shares one refresh across concurrent 401 responses', async () => {
    useAuthStore.getState().setSession(session())
    const refresh = vi.spyOn(authTransport, 'post').mockResolvedValue(envelope(session('access-two')))
    api.defaults.adapter = async (config) => {
      if (config.headers.get('Authorization') === 'Bearer access-two') return { status: 200, statusText: 'OK', headers: {}, config, data: { ok: true } }
      throw unauthorized(config)
    }
    await expect(Promise.all([api.get('/first'), api.get('/second')])).resolves.toHaveLength(2)
    expect(refresh).toHaveBeenCalledTimes(1)
  })

  it('clears auth when a 401 refresh fails', async () => {
    useAuthStore.getState().setSession(session())
    vi.spyOn(authTransport, 'post').mockRejectedValue(new Error('expired'))
    api.defaults.adapter = async (config) => { throw unauthorized(config) }
    await expect(api.get('/protected')).rejects.toBeInstanceOf(AxiosError)
    expect(useAuthStore.getState().status).toBe('anonymous')
  })

  it('marks a 403 as forbidden without logging out', async () => {
    useAuthStore.getState().setSession(session())
    api.defaults.adapter = async (config) => { throw unauthorized(config, 403) }
    await expect(api.get('/restricted')).rejects.toBeInstanceOf(AxiosError)
    expect(useAuthStore.getState()).toMatchObject({ status: 'authenticated', accessToken: 'access-one', forbidden: true })
  })

  it('clears local state even when logout fails', async () => {
    useAuthStore.getState().setSession(session())
    vi.spyOn(authTransport, 'post').mockRejectedValue(new Error('network'))
    await expect(logout()).rejects.toThrow('network')
    expect(useAuthStore.getState().status).toBe('anonymous')
  })

  it('clears local state after logout-all', async () => {
    useAuthStore.getState().setSession(session())
    vi.spyOn(api, 'post').mockResolvedValue({ data: { success: true, revokedCount: 2 } })
    await expect(logoutAll()).resolves.toEqual({ success: true, revokedCount: 2 })
    expect(useAuthStore.getState().status).toBe('anonymous')
  })
})
