import { useCallback, useEffect, useState } from 'react'
import { Archive, BriefcaseBusiness, Pencil, Plus, Search } from 'lucide-react'
import { EmptyState, PageContainer, PageError, PageHeader, PageLoading } from '@/components/PageStates'
import { Modal } from '@/components/Modal'
import { Badge, Button, Input, SurfaceCard } from '@/components/ui'
import { PermissionGate } from '@/components/PermissionGate'
import { normalizeApiError } from '@/lib/apiError'
import { PERMISSIONS } from '@/lib/permissions'
import { archiveWorkspace, createWorkspace, listWorkspaces, updateWorkspace } from './workspaceApi'
import { useWorkspace } from './WorkspaceProvider'
import { WorkspaceForm } from './WorkspaceForm'
import type { CreateWorkspaceInput, UpdateWorkspaceInput, Workspace, WorkspacePage, WorkspaceStatus } from './workspaceTypes'

const emptyPage: WorkspacePage = { data: [], meta: { total: 0, page: 1, limit: 20, totalPages: 0, hasNext: false, hasPrevious: false } }

export function WorkspaceManagementPage() {
  const [result, setResult] = useState<WorkspacePage>(emptyPage)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<WorkspaceStatus>('ACTIVE')
  const [page, setPage] = useState(1)
  const [editing, setEditing] = useState<Workspace | 'create' | null>(null)
  const [archiving, setArchiving] = useState<Workspace | null>(null)
  const [busy, setBusy] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const { activeWorkspaceId, refreshWorkspaces } = useWorkspace()

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setResult(await listWorkspaces({ page, limit: 20, search: search || undefined, status }))
    } catch (reason) {
      setError(normalizeApiError(reason).message)
    } finally {
      setLoading(false)
    }
  }, [page, search, status])

  useEffect(() => { void load() }, [load])

  async function save(input: CreateWorkspaceInput | UpdateWorkspaceInput) {
    setBusy(true)
    setFormError(null)
    try {
      if (editing === 'create') {
        await createWorkspace(input as CreateWorkspaceInput)
        setFeedback('فضای کاری با موفقیت ایجاد شد.')
      } else if (editing) {
        await updateWorkspace(editing.id, input as UpdateWorkspaceInput)
        setFeedback('تغییرات فضای کاری ذخیره شد.')
      }
      setEditing(null)
      await Promise.all([load(), refreshWorkspaces()])
    } catch (reason) {
      setFormError(normalizeApiError(reason).message)
    } finally {
      setBusy(false)
    }
  }

  async function confirmArchive() {
    if (!archiving) return
    setBusy(true)
    setFormError(null)
    try {
      const wasActive = archiving.id === activeWorkspaceId
      await archiveWorkspace(archiving.id)
      setFeedback(wasActive ? 'فضای کاری بایگانی شد و انتخاب فعال به‌روزرسانی شد.' : 'فضای کاری بایگانی شد.')
      setArchiving(null)
      await Promise.all([load(), refreshWorkspaces()])
    } catch (reason) {
      setFormError(normalizeApiError(reason).message)
    } finally {
      setBusy(false)
    }
  }

  return <PageContainer className="workspace-page">
    <PageHeader title="فضاهای کاری" description="پروژه‌های پایش و هوشمندی سازمان فعال را مدیریت کنید." actions={<PermissionGate requirement={{ allOf: [PERMISSIONS.WORKSPACE_CREATE] }}><Button onClick={() => { setFormError(null); setEditing('create') }}><Plus size={18} /> فضای کاری جدید</Button></PermissionGate>} />
    <form className="workspace-toolbar" onSubmit={(event) => { event.preventDefault(); setPage(1); setSearch(searchInput.trim()) }}>
      <div className="workspace-search"><Search size={18} /><Input aria-label="جست‌وجوی فضای کاری" placeholder="جست‌وجو در نام یا کد" value={searchInput} onChange={(event) => setSearchInput(event.target.value)} /></div>
      <select aria-label="وضعیت فضای کاری" value={status} onChange={(event) => { setPage(1); setStatus(event.target.value as WorkspaceStatus) }}><option value="ACTIVE">فعال</option><option value="ARCHIVED">بایگانی‌شده</option></select>
      <Button type="submit" variant="secondary">جست‌وجو</Button>
    </form>
    {feedback && <div className="workspace-feedback" role="status" aria-live="polite">{feedback}</div>}
    {loading ? <PageLoading label="در حال دریافت فضاهای کاری…" /> : error ? <PageError description={error} onRetry={() => void load()} /> : result.data.length === 0 ? <PermissionGate requirement={{ allOf: [PERMISSIONS.WORKSPACE_CREATE] }} fallback={<EmptyState title="فضای کاری یافت نشد" description="در این وضعیت فضای کاری قابل نمایش وجود ندارد." icon={<BriefcaseBusiness size={30} />} />}><EmptyState title="فضای کاری یافت نشد" description={status === 'ACTIVE' ? 'اولین فضای کاری سازمان را ایجاد کنید.' : 'فضای کاری بایگانی‌شده‌ای وجود ندارد.'} icon={<BriefcaseBusiness size={30} />} action={status === 'ACTIVE' ? <Button onClick={() => setEditing('create')}><Plus size={18} /> ایجاد فضای کاری</Button> : undefined} /></PermissionGate> : <>
      <div className="workspace-grid">{result.data.map((workspace) => <SurfaceCard className="workspace-card" key={workspace.id}><header><span className="workspace-icon"><BriefcaseBusiness size={21} /></span><Badge tone={workspace.status === 'ACTIVE' ? 'success' : 'warning'}>{workspace.status === 'ACTIVE' ? 'فعال' : 'بایگانی‌شده'}</Badge></header><div><h2>{workspace.name}</h2><code dir="ltr">{workspace.code}</code></div><dl><div><dt>منطقه زمانی</dt><dd dir="ltr">{workspace.timezone}</dd></div><div><dt>زبان خروجی پیش‌فرض</dt><dd dir="ltr">{workspace.defaultLanguage?.code ?? '—'}</dd></div><div><dt>آخرین تغییر</dt><dd>{new Intl.DateTimeFormat('fa-IR', { dateStyle: 'medium' }).format(new Date(workspace.updatedAt))}</dd></div></dl>{workspace.status === 'ACTIVE' && <footer><PermissionGate requirement={{ allOf: [PERMISSIONS.WORKSPACE_UPDATE] }}><Button variant="ghost" aria-label={`ویرایش ${workspace.name}`} onClick={() => { setFormError(null); setEditing(workspace) }}><Pencil size={17} /> ویرایش</Button></PermissionGate><PermissionGate requirement={{ allOf: [PERMISSIONS.WORKSPACE_ARCHIVE] }}><Button variant="ghost" className="danger-action" aria-label={`بایگانی ${workspace.name}`} onClick={() => { setFormError(null); setArchiving(workspace) }}><Archive size={17} /> بایگانی</Button></PermissionGate></footer>}</SurfaceCard>)}</div>
      <nav className="workspace-pagination" aria-label="صفحه‌بندی فضاهای کاری"><Button variant="secondary" disabled={!result.meta.hasPrevious} onClick={() => setPage((current) => current - 1)}>صفحه قبل</Button><span>صفحه {result.meta.page} از {Math.max(result.meta.totalPages, 1)}</span><Button variant="secondary" disabled={!result.meta.hasNext} onClick={() => setPage((current) => current + 1)}>صفحه بعد</Button></nav>
    </>}
    {editing && <Modal title={editing === 'create' ? 'ایجاد فضای کاری' : 'ویرایش فضای کاری'} description="اطلاعات مطابق قرارداد Workspace ذخیره می‌شود." onClose={() => !busy && setEditing(null)}><WorkspaceForm workspace={editing === 'create' ? undefined : editing} busy={busy} error={formError} onCancel={() => setEditing(null)} onSubmit={save} /></Modal>}
    {archiving && <Modal title="بایگانی فضای کاری" description={`با بایگانی «${archiving.name}»، این فضای کاری دیگر قابل انتخاب نخواهد بود.`} onClose={() => !busy && setArchiving(null)}><div className="archive-confirmation">{formError && <div className="form-error" role="alert">{formError}</div>}<p>اطلاعات حذف نمی‌شود، اما امکان بازگردانی در API فعلی وجود ندارد.</p><footer><Button variant="secondary" disabled={busy} onClick={() => setArchiving(null)}>انصراف</Button><Button variant="danger" disabled={busy} onClick={() => void confirmArchive()}>{busy ? 'در حال بایگانی…' : 'تأیید بایگانی'}</Button></footer></div></Modal>}
  </PageContainer>
}
