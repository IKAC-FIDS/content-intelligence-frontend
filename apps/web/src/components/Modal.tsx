import { useEffect, useRef, type ReactNode } from 'react'
import { X } from 'lucide-react'

export function Modal({ title, description, children, onClose }: {
  title: string
  description?: string
  children: ReactNode
  onClose: () => void
}) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    dialog.showModal()
    return () => dialog.close()
  }, [])
  return <dialog ref={ref} className="app-dialog" aria-labelledby="dialog-title" aria-describedby={description ? 'dialog-description' : undefined} onCancel={(event) => { event.preventDefault(); onClose() }} onClick={(event) => { if (event.target === ref.current) onClose() }}>
    <div className="dialog-panel">
      <header><div><h2 id="dialog-title">{title}</h2>{description && <p id="dialog-description">{description}</p>}</div><button className="icon-button" type="button" aria-label="بستن پنجره" onClick={onClose}><X size={20} /></button></header>
      {children}
    </div>
  </dialog>
}
