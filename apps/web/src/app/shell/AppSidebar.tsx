import { BrainCircuit, PanelRightClose, PanelRightOpen, X } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { filterNavigationGroups, navigationGroups } from './navigation'
import { useAuthStore } from '@/store/authStore'

interface AppSidebarProps {
  collapsed: boolean
  isMobile: boolean
  mobileOpen: boolean
  onCollapse: () => void
  onMobileClose: () => void
}

export function AppSidebar({ collapsed, isMobile, mobileOpen, onCollapse, onMobileClose }: AppSidebarProps) {
  const permissions = useAuthStore((state) => state.user?.permissions ?? [])
  const visibleGroups = filterNavigationGroups(navigationGroups, permissions)
  return <>
    <button className={`shell-backdrop ${mobileOpen ? 'is-visible' : ''}`} type="button" aria-label="بستن منوی اصلی" onClick={onMobileClose} />
    <aside id="app-sidebar" className={`app-sidebar ${collapsed ? 'is-collapsed' : ''} ${mobileOpen ? 'is-mobile-open' : ''}`} aria-label="منوی اصلی" aria-hidden={isMobile && !mobileOpen ? true : undefined} aria-modal={isMobile && mobileOpen ? true : undefined} role={isMobile && mobileOpen ? 'dialog' : undefined} inert={isMobile && !mobileOpen ? true : undefined}>
      <div className="sidebar-brand"><span className="app-logo"><BrainCircuit size={22} /></span><span className="sidebar-brand-copy"><strong>Content Intelligence</strong><small>سکوی هوشمندی محتوا</small></span><button className="icon-button sidebar-mobile-close" type="button" aria-label="بستن منوی اصلی" onClick={onMobileClose} autoFocus={isMobile && mobileOpen}><X size={20} /></button></div>
      <nav className="sidebar-nav" aria-label="ناوبری برنامه">
        {visibleGroups.map((group) => <div className="sidebar-group" key={group.id}>{group.label && <span className="sidebar-group-label">{group.label}</span>}{group.items.map(({ id, label, href, icon: Icon }) => <NavLink key={id} to={href} end={href === '/'} onClick={onMobileClose} className={({ isActive }) => `sidebar-link ${isActive ? 'is-active' : ''}`} title={collapsed ? label : undefined}><Icon size={19} /><span>{label}</span></NavLink>)}</div>)}
      </nav>
      <button className="sidebar-collapse" type="button" onClick={onCollapse} aria-label={collapsed ? 'بازکردن نوار کناری' : 'جمع‌کردن نوار کناری'} aria-expanded={!collapsed}>{collapsed ? <PanelRightOpen size={19} /> : <PanelRightClose size={19} />}<span>جمع‌کردن منو</span></button>
    </aside>
  </>
}
