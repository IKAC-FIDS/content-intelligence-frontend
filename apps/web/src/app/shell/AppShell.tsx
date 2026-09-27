import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { ForbiddenPage } from '@/app/ForbiddenPage'
import { useAuthStore } from '@/store/authStore'
import { AppHeader } from './AppHeader'
import { AppSidebar } from './AppSidebar'

const sidebarStorageKey = 'content-intelligence-sidebar-collapsed'

export function AppShell() {
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem(sidebarStorageKey) === 'true')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(() => matchMedia('(max-width: 900px)').matches)
  const forbidden = useAuthStore((state) => state.forbidden)

  useEffect(() => {
    const media = matchMedia('(max-width: 900px)')
    const update = () => setIsMobile(media.matches)
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (!mobileOpen) return
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') setMobileOpen(false) }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [mobileOpen])

  function toggleCollapsed() {
    setCollapsed((current) => {
      localStorage.setItem(sidebarStorageKey, String(!current))
      return !current
    })
  }

  return <div className={`authenticated-shell ${collapsed ? 'has-collapsed-sidebar' : ''}`}><AppSidebar collapsed={collapsed} isMobile={isMobile} mobileOpen={mobileOpen} onCollapse={toggleCollapsed} onMobileClose={() => setMobileOpen(false)} /><div className="shell-workspace"><AppHeader onMenuOpen={() => setMobileOpen(true)} /><main className="shell-content">{forbidden ? <ForbiddenPage /> : <Outlet />}</main></div></div>
}
