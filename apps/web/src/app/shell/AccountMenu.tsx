import { LogOut, UserRound } from 'lucide-react'
import { useState } from 'react'
import { logout } from '@/lib/auth'
import { useAuthStore } from '@/store/authStore'

export function AccountMenu() {
  const user = useAuthStore((state) => state.user)
  const [busy, setBusy] = useState(false)
  const initials = user?.fullName.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join('') || 'U'

  async function handleLogout() {
    if (busy) return
    setBusy(true)
    try { await logout() } catch { /* Local auth state is cleared by the logout service. */ } finally { setBusy(false) }
  }

  return <details className="account-menu">
    <summary aria-label="بازکردن منوی حساب"><span className="account-avatar" aria-hidden="true">{initials}</span><span className="account-summary"><strong>{user?.fullName}</strong><small>{user?.roleName || user?.roleCode}</small></span></summary>
    <div className="account-popover">
      <div className="account-identity"><UserRound size={18} /><span><strong>{user?.fullName}</strong><small dir="ltr">{user?.email}</small></span></div>
      <button type="button" disabled={busy} onClick={() => void handleLogout()}><LogOut size={17} />{busy ? 'در حال خروج…' : 'خروج از حساب'}</button>
    </div>
  </details>
}
