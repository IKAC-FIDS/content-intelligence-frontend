import { describe, expect, it } from 'vitest'
import { getProtectedRouteDecision, getSafeReturnPath } from './navigation'

describe('getSafeReturnPath', () => {
  it('keeps a safe internal route', () => expect(getSafeReturnPath({ from: '/reports?q=1#latest' })).toBe('/reports?q=1#latest'))
  it.each(['https://example.com', '//example.com', '/login'])('rejects unsafe return path %s', (from) => expect(getSafeReturnPath({ from })).toBe('/'))
})

describe('getProtectedRouteDecision', () => {
  it('waits while session initialization is running', () => expect(getProtectedRouteDecision('initializing', false)).toBe('loading'))
  it('distinguishes anonymous, forbidden, and authenticated states', () => {
    expect(getProtectedRouteDecision('anonymous', false)).toBe('login')
    expect(getProtectedRouteDecision('authenticated', true)).toBe('forbidden')
    expect(getProtectedRouteDecision('authenticated', false)).toBe('content')
  })
})
