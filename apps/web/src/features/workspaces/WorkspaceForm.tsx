import { useMemo, useState, type FormEvent } from 'react'
import { Button, Input, Label } from '@/components/ui'
import type { CreateWorkspaceInput, UpdateWorkspaceInput, Workspace } from './workspaceTypes'

const supportedTimezones = (() => {
  const supportedValuesOf = (Intl as unknown as { supportedValuesOf?: (key: string) => string[] }).supportedValuesOf
  return supportedValuesOf?.('timeZone') ?? ['Asia/Tehran', 'UTC']
})()

export function WorkspaceForm({ workspace, busy, error, onCancel, onSubmit }: {
  workspace?: Workspace
  busy: boolean
  error: string | null
  onCancel: () => void
  onSubmit: (input: CreateWorkspaceInput | UpdateWorkspaceInput) => Promise<void>
}) {
  const [name, setName] = useState(workspace?.name ?? '')
  const [code, setCode] = useState(workspace?.code ?? '')
  const [timezone, setTimezone] = useState(workspace?.timezone ?? 'Asia/Tehran')
  const [defaultLanguageCode, setDefaultLanguageCode] = useState(workspace?.defaultLanguageCode ?? '')
  const timezoneOptions = useMemo(() => supportedTimezones, [])

  async function submit(event: FormEvent) {
    event.preventDefault()
    const common = {
      name: name.trim(),
      timezone,
      defaultLanguageCode: defaultLanguageCode.trim() || (workspace ? null : undefined),
    }
    await onSubmit(workspace ? common : { ...common, code: code.trim() })
  }

  return <form className="workspace-form" onSubmit={(event) => void submit(event)}>
    <Label>نام فضای کاری<Input autoFocus value={name} maxLength={160} required onChange={(event) => setName(event.target.value)} /></Label>
    <Label>کد فضای کاری<Input dir="ltr" value={code} maxLength={80} required readOnly={Boolean(workspace)} aria-describedby="workspace-code-help" onChange={(event) => setCode(event.target.value)} /></Label>
    <small id="workspace-code-help">کد پس از ایجاد قابل تغییر نیست.</small>
    <Label>منطقه زمانی<Input dir="ltr" list="workspace-timezones" value={timezone} required onChange={(event) => setTimezone(event.target.value)} /></Label>
    <datalist id="workspace-timezones">{timezoneOptions.map((value) => <option key={value} value={value} />)}</datalist>
    <Label>کد زبان پیش‌فرض<Input dir="ltr" value={defaultLanguageCode} maxLength={35} pattern="[A-Za-z]{2,3}(-[A-Za-z0-9]{2,8})*" placeholder="fa-IR" onChange={(event) => setDefaultLanguageCode(event.target.value)} /></Label>
    <small>این مقدار موقت و اختیاری است؛ مدیریت زبان‌ها در مرحله بعد اضافه می‌شود.</small>
    {error && <div className="form-error" role="alert">{error}</div>}
    <footer><Button type="button" variant="secondary" disabled={busy} onClick={onCancel}>انصراف</Button><Button type="submit" disabled={busy}>{busy ? 'در حال ذخیره…' : workspace ? 'ذخیره تغییرات' : 'ایجاد فضای کاری'}</Button></footer>
  </form>
}
