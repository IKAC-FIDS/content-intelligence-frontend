import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
export type Theme='light'|'dark'|'system'
type ThemeContextValue={theme:Theme;setTheme:(theme:Theme)=>void}
const ThemeContext=createContext<ThemeContextValue|undefined>(undefined)
const query='(prefers-color-scheme: dark)'
export function ThemeProvider({children,defaultTheme='system',storageKey='content-intelligence-theme'}:{children:ReactNode;defaultTheme?:Theme;storageKey?:string}){
 const [theme,setThemeState]=useState<Theme>(()=>{const value=localStorage.getItem(storageKey);return value==='light'||value==='dark'||value==='system'?value:defaultTheme})
 const apply=useCallback((value:Theme)=>{const resolved=value==='system'?(matchMedia(query).matches?'dark':'light'):value;document.documentElement.classList.remove('light','dark');document.documentElement.classList.add(resolved);document.documentElement.style.colorScheme=resolved},[])
 const setTheme=useCallback((value:Theme)=>{localStorage.setItem(storageKey,value);setThemeState(value)},[storageKey])
 useEffect(()=>{apply(theme);if(theme!=='system')return;const media=matchMedia(query);const update=()=>apply('system');media.addEventListener('change',update);return()=>media.removeEventListener('change',update)},[apply,theme])
 const value=useMemo(()=>({theme,setTheme}),[theme,setTheme]);return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
export function useTheme(){const value=useContext(ThemeContext);if(!value)throw new Error('useTheme must be used within ThemeProvider');return value}
