import { type FormEvent, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { BrainCircuit, LockKeyhole, Mail, ShieldCheck, Sparkles } from 'lucide-react'
import { api, unwrapApiData } from '@/lib/api'
import { useAuthStore, type AuthUser } from '@/store/authStore'
import { Button, Card, Input, Label } from '@/components/ui'
import { ThemeSelector } from '@/components/ThemeSelector'
import axios from 'axios'

type LoginResult={accessToken:string;user:AuthUser}
export function LoginPage(){
 const {status,setSession}=useAuthStore();const[email,setEmail]=useState('');const[password,setPassword]=useState('');const[busy,setBusy]=useState(false);const[error,setError]=useState('')
 if(status==='authenticated')return <Navigate to="/" replace/>
 async function submit(event:FormEvent){event.preventDefault();setBusy(true);setError('');try{const response=await api.post('/auth/login',{email,password});const data=unwrapApiData<LoginResult>(response.data);setSession(data.user,data.accessToken)}catch(reason:unknown){const payload=axios.isAxiosError(reason)?reason.response?.data:undefined;setError(payload?.error?.message||payload?.message||'ورود ناموفق بود. اطلاعات حساب را بررسی کنید.')}finally{setBusy(false)}}
 return <main className="login-page">
  <section className="login-brand" aria-label="معرفی محصول"><div className="brand-content"><div className="brand-mark"><BrainCircuit size={38}/></div><span className="eyebrow"><Sparkles size={15}/> سکوی هوشمندی محتوا</span><h1>Content<br/>Intelligence</h1><p>گردآوری، تحلیل و پردازش محتوا در یک فضای امن و یکپارچه.</p><div className="trust-note"><ShieldCheck size={20}/><span><strong>دسترسی سازمانی امن</strong><small>کنترل دسترسی مبتنی بر نقش و سازمان</small></span></div></div><div className="brand-orb brand-orb--one"/><div className="brand-orb brand-orb--two"/></section>
  <section className="login-form-side"><div className="login-toolbar"><ThemeSelector/></div><Card className="login-card"><header><div className="mobile-brand"><BrainCircuit size={24}/> Content Intelligence</div><span className="eyebrow">حساب کاربری</span><h2>ورود به سامانه</h2><p>برای ادامه اطلاعات حساب سازمانی خود را وارد کنید.</p></header><form onSubmit={submit}><Label>ایمیل سازمانی<div className="field"><Mail size={18}/><Input dir="ltr" type="email" value={email} onChange={e=>setEmail(e.target.value)} autoComplete="email" placeholder="name@example.com" required autoFocus/></div></Label><Label>رمز عبور<div className="field"><LockKeyhole size={18}/><Input dir="ltr" type="password" value={password} onChange={e=>setPassword(e.target.value)} autoComplete="current-password" required/></div></Label>{error&&<div className="form-error" role="alert">{error}</div>}<Button type="submit" disabled={busy}>{busy?<><span className="spinner"/>در حال ورود…</>:'ورود به سامانه'}</Button></form></Card><p className="login-footer">سامانه مدیریت هوشمند محتوای سازمانی</p></section>
 </main>
}
