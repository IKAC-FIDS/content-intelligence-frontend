import axios from 'axios'
import { describe, expect, it, vi } from 'vitest'
import { normalizeApiError } from './apiError'

describe('normalizeApiError', () => {
  it('preserves the backend error code, message, and status', () => {
    vi.spyOn(axios, 'isAxiosError').mockReturnValueOnce(true)
    expect(normalizeApiError({ response: { status: 409, data: { error: { code: 'WORKSPACE_CODE_EXISTS', message: 'کد تکراری است' } } } })).toEqual({
      code: 'WORKSPACE_CODE_EXISTS', message: 'کد تکراری است', status: 409,
    })
  })

  it('distinguishes network failures from unknown failures', () => {
    vi.spyOn(axios, 'isAxiosError').mockReturnValueOnce(true)
    expect(normalizeApiError({ request: {} })).toMatchObject({ code: 'NETWORK_ERROR', status: null })
    expect(normalizeApiError(new Error('unexpected'))).toMatchObject({ code: 'UNKNOWN', status: null })
  })
})
