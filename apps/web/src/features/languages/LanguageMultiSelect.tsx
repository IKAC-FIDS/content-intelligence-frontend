import { useMemo, useState } from 'react'
import { Input } from '@/components/ui'
import type { Language } from './languageTypes'

export function LanguageMultiSelect({ label, languages, value, onChange }: { label: string; languages: Language[]; value: string[]; onChange: (value: string[]) => void }) {
  const [search, setSearch] = useState('')
  const options = useMemo(() => languages.filter((language) => `${language.code} ${language.name} ${language.nativeName}`.toLowerCase().includes(search.trim().toLowerCase())), [languages, search])
  return <fieldset className="language-multi"><legend>{label}</legend><Input aria-label={`جست‌وجو در ${label}`} placeholder="جست‌وجوی زبان…" value={search} onChange={(event) => setSearch(event.target.value)} /><div>{options.map((language) => <label key={language.id}><input type="checkbox" checked={value.includes(language.id)} onChange={() => onChange(value.includes(language.id) ? value.filter((id) => id !== language.id) : [...value, language.id])} /><span dir={language.direction === 'RTL' ? 'rtl' : 'ltr'}>{language.nativeName}</span><small>{language.name} ({language.code}){!language.isActive ? ' — غیرفعال' : ''}</small></label>)}</div></fieldset>
}
