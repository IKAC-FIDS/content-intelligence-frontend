import { ArrowRight, FileQuestion } from 'lucide-react'
import { Link } from 'react-router-dom'
import { SurfaceCard } from '@/components/ui'

export function NotFoundPage(){return <div className="route-state-page"><SurfaceCard className="not-found-card"><span className="not-found-icon"><FileQuestion size={30}/></span><p className="eyebrow">خطای ۴۰۴</p><h1>صفحه پیدا نشد</h1><p>نشانی واردشده وجود ندارد یا دیگر در دسترس نیست.</p><Link className="ui-button ui-button--primary" to="/"><ArrowRight size={17}/> بازگشت به صفحه اصلی</Link></SurfaceCard></div>}
