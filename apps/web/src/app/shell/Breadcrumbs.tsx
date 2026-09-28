import { ChevronLeft } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { getBreadcrumbs } from './navigation'
import { useAuthStore } from '@/store/authStore'

export function Breadcrumbs() {
  const { pathname } = useLocation()
  const permissions = useAuthStore((state) => state.user?.permissions ?? [])
  const platformAdmin = useAuthStore((state) => state.user?.platformAdmin ?? false)
  const breadcrumbs = getBreadcrumbs(pathname, permissions, platformAdmin)
  return <nav className="breadcrumbs" aria-label="مسیر صفحه"><ol>{breadcrumbs.map((item, index) => <li key={`${item.label}-${index}`}>{index > 0 && <ChevronLeft size={14} aria-hidden="true" />}{item.href && index < breadcrumbs.length - 1 ? <Link to={item.href}>{item.label}</Link> : <span aria-current="page">{item.label}</span>}</li>)}</ol></nav>
}
