import { useMemo, useState } from 'react'
import { Input } from '@/components/ui'
import type { Topic } from './topicTypes'
export function TopicMultiSelect({ topics, domainIds, value, onChange }: { topics: Topic[]; domainIds: string[]; value: string[]; onChange: (value: string[]) => void }) {
  const [search,setSearch]=useState(''); const options=useMemo(()=>topics.filter(topic=>(domainIds.length===0||topic.domains.some(domain=>domainIds.includes(domain.id))||value.includes(topic.id))&&`${topic.code} ${topic.name} ${topic.aliases.map(alias=>alias.value).join(' ')}`.toLowerCase().includes(search.trim().toLowerCase())),[topics,domainIds,value,search]);
  return <fieldset className="language-multi"><legend>موضوع‌ها</legend><Input aria-label="جست‌وجوی موضوع" placeholder="جست‌وجوی موضوع…" value={search} onChange={e=>setSearch(e.target.value)}/><div>{options.map(topic=><label key={topic.id}><input type="checkbox" checked={value.includes(topic.id)} onChange={()=>onChange(value.includes(topic.id)?value.filter(id=>id!==topic.id):[...value,topic.id])}/><span>{topic.name}</span><small>{topic.code}{!topic.isActive?' — غیرفعال':''}</small></label>)}</div></fieldset>
}
