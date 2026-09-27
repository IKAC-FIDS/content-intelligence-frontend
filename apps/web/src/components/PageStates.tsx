import type { ReactNode } from 'react'
import { AlertCircle, Inbox } from 'lucide-react'
import { Button, SurfaceCard } from './ui'

export function PageContainer({ children, className = '' }: { children: ReactNode; className?: string }) { return <div className={`page-container ${className}`}>{children}</div> }
export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) { return <header className="page-header"><div><h1>{title}</h1>{description && <p>{description}</p>}</div>{actions && <div className="page-header-actions">{actions}</div>}</header> }
export function PageLoading({ label = 'در حال بارگذاری…' }: { label?: string }) { return <div className="page-state" role="status"><span className="spinner" />{label}</div> }
export function PageError({ title = 'خطایی رخ داد', description = 'امکان نمایش این بخش وجود ندارد.', onRetry }: { title?: string; description?: string; onRetry?: () => void }) { return <SurfaceCard className="page-state-card"><AlertCircle size={28} /><h2>{title}</h2><p>{description}</p>{onRetry && <Button onClick={onRetry}>تلاش دوباره</Button>}</SurfaceCard> }
export function EmptyState({ title, description, icon, action }: { title: string; description?: string; icon?: ReactNode; action?: ReactNode }) { return <SurfaceCard className="page-state-card">{icon ?? <Inbox size={28} />}<h2>{title}</h2>{description && <p>{description}</p>}{action}</SurfaceCard> }
