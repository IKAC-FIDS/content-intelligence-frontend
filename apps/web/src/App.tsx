import { Navigate, Route, Routes } from 'react-router-dom'
import { useEffect } from 'react'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { Dashboard } from '@/app/Dashboard'
import { api, unwrapApiData } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
function Protected({children}:{children:React.ReactNode}){const status=useAuthStore(s=>s.status);if(status==='loading')return <div className="loading" role="status"><span className="spinner"/>در حال بررسی نشست…</div>;if(status!=='authenticated')return <Navigate to="/login" replace/>;return children}
export default function App(){const {status,setSession,setStatus}=useAuthStore();useEffect(()=>{if(status!=='loading')return;api.post('/auth/refresh').then(r=>{const data=unwrapApiData<{user:any;accessToken:string}>(r.data);setSession(data.user,data.accessToken)}).catch(()=>setStatus('anonymous'))},[status,setSession,setStatus]);return <Routes><Route path="/login" element={<LoginPage/>}/><Route path="/" element={<Protected><Dashboard/></Protected>}/><Route path="*" element={<Navigate to="/" replace/>}/></Routes>}
