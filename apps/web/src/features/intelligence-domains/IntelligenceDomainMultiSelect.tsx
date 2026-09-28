import { useMemo, useState } from 'react'
import { Input } from '@/components/ui'
import type { IntelligenceDomain } from './intelligenceDomainTypes'

export function IntelligenceDomainMultiSelect({ domains, value, onChange }: { domains: IntelligenceDomain[]; value: string[]; onChange: (value: string[]) => void }) {
  const [search, setSearch] = useState('')
  const options = useMemo(() => domains.filter((domain) => `${domain.code} ${domain.name} ${domain.description ?? ''}`.toLowerCase().includes(search.trim().toLowerCase())), [domains, search])
  return <fieldset className="language-multi"><legend>حوزه‌های پایش</legend><Input aria-label="جست‌وجوی حوزه" placeholder="جست‌وجوی حوزه…" value={search} onChange={(event) => setSearch(event.target.value)} /><div>{options.map((domain) => <label key={domain.id}><input type="checkbox" checked={value.includes(domain.id)} onChange={() => onChange(value.includes(domain.id) ? value.filter((id) => id !== domain.id) : [...value, domain.id])} /><span>{domain.name}</span><small>{domain.code}{!domain.isActive ? ' — غیرفعال' : ''}</small></label>)}</div></fieldset>
}
