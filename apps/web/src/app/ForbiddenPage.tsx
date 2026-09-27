import { ShieldX } from 'lucide-react'
import { Button, SurfaceCard } from '@/components/ui'
import { useAuthStore } from '@/store/authStore'

export function ForbiddenPage(){const clearForbidden=useAuthStore((state)=>state.clearForbidden);return <div className="route-state-page"><SurfaceCard className="not-found-card"><span className="not-found-icon"><ShieldX size={30}/></span><p className="eyebrow">دسترسی محدود</p><h1>اجازه دسترسی ندارید</h1><p>نشست شما فعال است، اما مجوز لازم برای این عملیات را ندارید.</p><Button onClick={clearForbidden}>بازگشت به صفحه اصلی</Button></SurfaceCard></div>}
