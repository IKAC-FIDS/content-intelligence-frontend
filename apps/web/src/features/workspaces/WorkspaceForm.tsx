import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Button, Input, Label } from '@/components/ui'
import { LanguageMultiSelect } from '@/features/languages/LanguageMultiSelect'
import { listAllSelectableLanguages } from '@/features/languages/languageApi'
import type { Language } from '@/features/languages/languageTypes'
import { IntelligenceDomainMultiSelect } from '@/features/intelligence-domains/IntelligenceDomainMultiSelect'
import { listAllSelectableIntelligenceDomains } from '@/features/intelligence-domains/intelligenceDomainApi'
import type { IntelligenceDomain } from '@/features/intelligence-domains/intelligenceDomainTypes'
import { normalizeApiError } from '@/lib/apiError'
import type { CreateWorkspaceInput, UpdateWorkspaceInput, Workspace } from './workspaceTypes'

const supportedTimezones = (() => {
  const supportedValuesOf = (Intl as unknown as { supportedValuesOf?: (key: string) => string[] }).supportedValuesOf
  return supportedValuesOf?.('timeZone') ?? ['Asia/Tehran', 'UTC']
})()

export function mergeLanguageOptions(active: Language[], existing: Language[]) { return [...new Map([...active, ...existing].map((language) => [language.id, language])).values()] }
export function mergeDomainOptions(active: IntelligenceDomain[], existing: IntelligenceDomain[]) { return [...new Map([...active, ...existing].map((domain) => [domain.id, domain])).values()] }

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
  const [languages, setLanguages] = useState<Language[]>([])
  const [languageError, setLanguageError] = useState<string | null>(null)
  const [domains, setDomains] = useState<IntelligenceDomain[]>([])
  const [domainError, setDomainError] = useState<string | null>(null)
  const [inputLanguageIds, setInputLanguageIds] = useState(workspace?.inputLanguages.map((language) => language.id) ?? [])
  const [outputLanguageIds, setOutputLanguageIds] = useState(workspace?.outputLanguages.map((language) => language.id) ?? [])
  const [defaultLanguageId, setDefaultLanguageId] = useState(workspace?.defaultLanguageId ?? '')
  const [domainIds, setDomainIds] = useState(workspace?.domains.map((domain) => domain.id) ?? [])
  const timezoneOptions = useMemo(() => supportedTimezones, [])
  useEffect(() => { void listAllSelectableLanguages().then((active) => setLanguages(mergeLanguageOptions(active, [...(workspace?.inputLanguages ?? []), ...(workspace?.outputLanguages ?? [])]))).catch((reason) => setLanguageError(normalizeApiError(reason).message)) }, [workspace])
  useEffect(() => { void listAllSelectableIntelligenceDomains().then((active) => setDomains(mergeDomainOptions(active, workspace?.domains ?? []))).catch((reason) => setDomainError(normalizeApiError(reason).message)) }, [workspace])

  async function submit(event: FormEvent) {
    event.preventDefault()
    const common = {
      name: name.trim(),
      timezone,
      inputLanguageIds,
      outputLanguageIds,
      defaultLanguageId: defaultLanguageId || (workspace ? null : undefined),
      domainIds,
    }
    await onSubmit(workspace ? common : { ...common, code: code.trim() })
  }

  return <form className="workspace-form" onSubmit={(event) => void submit(event)}>
    <Label>نام فضای کاری<Input autoFocus value={name} maxLength={160} required onChange={(event) => setName(event.target.value)} /></Label>
    <Label>کد فضای کاری<Input dir="ltr" value={code} maxLength={80} required readOnly={Boolean(workspace)} aria-describedby="workspace-code-help" onChange={(event) => setCode(event.target.value)} /></Label>
    <small id="workspace-code-help">کد پس از ایجاد قابل تغییر نیست.</small>
    <Label>منطقه زمانی<Input dir="ltr" list="workspace-timezones" value={timezone} required onChange={(event) => setTimezone(event.target.value)} /></Label>
    <datalist id="workspace-timezones">{timezoneOptions.map((value) => <option key={value} value={value} />)}</datalist>
    {languageError ? <div className="form-error" role="alert">{languageError}</div> : <><LanguageMultiSelect label="زبان‌های ورودی" languages={languages} value={inputLanguageIds} onChange={setInputLanguageIds} /><LanguageMultiSelect label="زبان‌های خروجی" languages={languages} value={outputLanguageIds} onChange={(ids) => { setOutputLanguageIds(ids); if (defaultLanguageId && !ids.includes(defaultLanguageId)) setDefaultLanguageId('') }} /><Label>زبان خروجی پیش‌فرض<select className="ui-input" value={defaultLanguageId} onChange={(event) => setDefaultLanguageId(event.target.value)}><option value="">بدون زبان پیش‌فرض</option>{languages.filter((language) => outputLanguageIds.includes(language.id)).map((language) => <option key={language.id} value={language.id}>{language.nativeName} — {language.name} ({language.code})</option>)}</select></Label></>}
    {domainError ? <div className="form-error" role="alert">{domainError}</div> : <IntelligenceDomainMultiSelect domains={domains} value={domainIds} onChange={setDomainIds} />}
    {error && <div className="form-error" role="alert">{error}</div>}
    <footer><Button type="button" variant="secondary" disabled={busy} onClick={onCancel}>انصراف</Button><Button type="submit" disabled={busy}>{busy ? 'در حال ذخیره…' : workspace ? 'ذخیره تغییرات' : 'ایجاد فضای کاری'}</Button></footer>
  </form>
}
