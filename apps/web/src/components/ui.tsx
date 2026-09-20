import type { ButtonHTMLAttributes, HTMLAttributes, InputHTMLAttributes, LabelHTMLAttributes, ReactNode } from 'react'
export function Button({variant='primary',className='',...props}:ButtonHTMLAttributes<HTMLButtonElement>&{variant?:'primary'|'secondary'|'ghost'|'danger'}){return <button className={`ui-button ui-button--${variant} ${className}`} {...props}/>}
export function Card({className='',...props}:HTMLAttributes<HTMLElement>){return <section className={`ui-card ${className}`} {...props}/>}
export function Input({className='',...props}:InputHTMLAttributes<HTMLInputElement>){return <input className={`ui-input ${className}`} {...props}/>}
export function Label({children,...props}:LabelHTMLAttributes<HTMLLabelElement>&{children:ReactNode}){return <label className="ui-label" {...props}>{children}</label>}
export function Badge({children,tone='neutral'}:{children:ReactNode;tone?:'neutral'|'primary'|'success'|'warning'}){return <span className={`ui-badge ui-badge--${tone}`}>{children}</span>}
export function SurfaceCard({children,className=''}:{children:ReactNode;className?:string}){return <div className={`surface-card ${className}`}>{children}</div>}
