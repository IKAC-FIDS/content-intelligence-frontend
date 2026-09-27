import { Home } from 'lucide-react'

export interface NavigationItem {
  id: string
  label: string
  href: string
  icon: typeof Home
}

export const navigationItems: NavigationItem[] = [
  { id: 'home', label: 'خانه', href: '/', icon: Home },
]

export interface BreadcrumbItem { label: string; href?: string }

export function isNavigationItemActive(pathname: string, href: string): boolean {
  return href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`)
}

export function getBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const item = navigationItems.find((candidate) => isNavigationItemActive(pathname, candidate.href))
  return item ? [{ label: item.label, href: item.href }] : [{ label: 'صفحه نامعتبر' }]
}
