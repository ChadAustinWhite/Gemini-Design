import { useEffect, useRef, type ReactNode } from 'react'
import { useApp } from './store'

export function Tip({
  label,
  placement = 'top',
  children,
}: {
  label: string
  placement?: 'top' | 'bottom' | 'right'
  children: ReactNode
}) {
  return (
    <span className={`tip tip-${placement}`}>
      {children}
      <span className="tip-bubble" role="tooltip">
        {label}
      </span>
    </span>
  )
}

export function useDismiss(open: boolean, onClose: () => void) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    function onPointer(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) onClose()
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault()
        e.stopPropagation()
        onClose()
      }
    }
    document.addEventListener('mousedown', onPointer)
    document.addEventListener('keydown', onKey, true)
    return () => {
      document.removeEventListener('mousedown', onPointer)
      document.removeEventListener('keydown', onKey, true)
    }
  }, [open, onClose])
  return ref
}

export function Toasts() {
  const { toasts, dismissToast } = useApp()
  return (
    <div className="toast-wrap" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`toast tone-${t.tone}`} role={t.tone === 'error' ? 'alert' : 'status'}>
          <span>{t.message}</span>
          <button type="button" className="toast-x" aria-label="Dismiss notification" onClick={() => dismissToast(t.id)}>
            ×
          </button>
        </div>
      ))}
    </div>
  )
}
