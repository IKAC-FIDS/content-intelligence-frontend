import { Monitor, Moon, Sun } from 'lucide-react'
import { useTheme, type Theme } from './theme-provider'
const options:{value:Theme;label:string;icon:typeof Sun}[]=[{value:'light',label:'روشن',icon:Sun},{value:'dark',label:'تیره',icon:Moon},{value:'system',label:'سیستم',icon:Monitor}]
export function ThemeSelector(){const {theme,setTheme}=useTheme();return <div className="theme-selector" role="group" aria-label="انتخاب پوسته">{options.map(({value,label,icon:Icon})=><button key={value} type="button" className={theme===value?'active':''} aria-pressed={theme===value} title={`پوسته ${label}`} onClick={()=>setTheme(value)}><Icon size={16}/><span>{label}</span></button>)}</div>}
