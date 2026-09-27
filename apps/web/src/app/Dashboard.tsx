import { Activity, Building2, CheckCircle2, KeyRound, ShieldCheck } from 'lucide-react'
import { Badge, SurfaceCard } from '@/components/ui'
import { PageContainer, PageHeader } from '@/components/PageStates'
import { useAuthStore } from '@/store/authStore'

const metrics = [
  { key: 'tenant', label: 'سازمان فعال', icon: Building2 },
  { key: 'role', label: 'نقش دسترسی', icon: KeyRound },
  { key: 'permissions', label: 'مجوزهای فعال', icon: Activity },
]

export function Dashboard() {
  const user = useAuthStore((state) => state.user)
  const values = { tenant: user?.organizationId ? 'فعال' : 'سطح پلتفرم', role: user?.roleName || user?.role || '—', permissions: String(user?.permissions.length ?? 0) }

  return <PageContainer><PageHeader title={`سلام، ${user?.fullName ?? ''}`} description="هویت، سازمان و کنترل دسترسی شما برای استفاده از سامانه آماده است." /><SurfaceCard className="home-status"><Badge tone="primary"><ShieldCheck size={14} /> زیرساخت پلتفرم</Badge><div className="home-status-message"><CheckCircle2 /><span><strong>نشست فعال است</strong><small>دسترسی شما با اطلاعات فعلی سازمان تأیید شده است.</small></span></div></SurfaceCard><div className="metric-grid">{metrics.map(({ key, label, icon: Icon }) => <SurfaceCard className="metric-card" key={key}><div><span>{label}</span><strong>{values[key as keyof typeof values]}</strong></div><i><Icon size={21} /></i></SurfaceCard>)}</div><SurfaceCard className="access-panel"><header><div><span className="eyebrow">اطلاعات نشست</span><h2>وضعیت دسترسی</h2></div><Badge tone="success"><CheckCircle2 size={13} /> فعال</Badge></header><dl><div><dt>ایمیل</dt><dd dir="ltr">{user?.email}</dd></div><div><dt>کد نقش</dt><dd>{user?.roleCode || '—'}</dd></div><div><dt>شناسه سازمان</dt><dd dir="ltr">{user?.organizationId || '—'}</dd></div></dl></SurfaceCard></PageContainer>
}
