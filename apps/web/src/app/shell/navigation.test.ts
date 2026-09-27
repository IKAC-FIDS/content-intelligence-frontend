import { describe, expect, it } from 'vitest'
import { getBreadcrumbs, isNavigationItemActive, navigationItems } from './navigation'

describe('application shell navigation', () => {
  it('contains only the currently valid home route', () => {
    expect(navigationItems.map(({ href }) => href)).toEqual(['/'])
  })

  it('matches the home route exactly', () => {
    expect(isNavigationItemActive('/', '/')).toBe(true)
    expect(isNavigationItemActive('/legacy', '/')).toBe(false)
  })

  it('uses route metadata for breadcrumbs and a safe unknown fallback', () => {
    expect(getBreadcrumbs('/')).toEqual([{ label: 'خانه', href: '/' }])
    expect(getBreadcrumbs('/legacy')).toEqual([{ label: 'صفحه نامعتبر' }])
  })
})
