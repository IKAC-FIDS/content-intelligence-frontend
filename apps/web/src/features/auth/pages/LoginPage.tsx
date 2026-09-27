import { type FormEvent, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { BrainCircuit, LockKeyhole, Mail, ShieldCheck, Sparkles } from 'lucide-react'
import { Button, Card, Input, Label } from '@/components/ui'
import { ThemeSelector } from '@/components/ThemeSelector'
import { login } from '@/lib/auth'
import { normalizeAuthError } from '@/lib/authError'
import { getSafeReturnPath } from '@/lib/navigation'
import { useAuthStore } from '@/store/authStore'

export function LoginPage() {
  const status = useAuthStore((state) => state.status)
  const location = useLocation()
  const returnPath = getSafeReturnPath(location.state)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  if (status === 'initializing') return <div className="loading" role="status"><span className="spinner" />در حال بررسی نشست…</div>
  if (status === 'authenticated') return <Navigate to={returnPath} replace />

  async function submit(event: FormEvent) {
    event.preventDefault()
    if (busy) return
    setBusy(true)
    setError('')
    try {
      await login({ email, password })
    } catch (reason: unknown) {
      setError(normalizeAuthError(reason).message)
    } finally {
      setBusy(false)
    }
  }

  return <main className="login-page">
    <section className="login-brand" aria-label="معرفی محصول"><div className="brand-content"><div className="brand-mark"><BrainCircuit size={38} /></div><span className="eyebrow"><Sparkles size={15} /> سکوی هوشمندی محتوا</span><h1>Content<br />Intelligence</h1><p>گردآوری، تحلیل و پردازش محتوا در یک فضای امن و یکپارچه.</p><div className="trust-note"><ShieldCheck size={20} /><span><strong>دسترسی سازمانی امن</strong><small>کنترل دسترسی مبتنی بر نقش و سازمان</small></span></div></div><div className="brand-orb brand-orb--one" /><div className="brand-orb brand-orb--two" /></section>
    <section className="login-form-side"><div className="login-toolbar"><ThemeSelector /></div><Card className="login-card"><header><div className="mobile-brand"><BrainCircuit size={24} /> Content Intelligence</div><span className="eyebrow">حساب کاربری</span><h2>ورود به سامانه</h2><p>برای ادامه اطلاعات حساب سازمانی خود را وارد کنید.</p></header><form onSubmit={submit}><Label>ایمیل سازمانی<div className="field"><Mail size={18} /><Input dir="ltr" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" placeholder="name@example.com" required autoFocus /></div></Label><Label>رمز عبور<div className="field"><LockKeyhole size={18} /><Input dir="ltr" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" minLength={6} required /></div></Label>{error && <div className="form-error" role="alert">{error}</div>}<Button type="submit" disabled={busy}>{busy ? <><span className="spinner" />در حال ورود…</> : 'ورود به سامانه'}</Button></form></Card><p className="login-footer">سامانه مدیریت هوشمند محتوای سازمانی</p></section>
  </main>
}
