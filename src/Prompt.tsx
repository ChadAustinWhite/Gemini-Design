import { useEffect, useRef, useState } from 'react'
import { BRIEFS, MODELS, type ModelId } from './model'
import { IcoArrowUp, IcoChevronDown, IcoMic, IcoPlus } from './icons'
import { useApp } from './store'
import { useDismiss } from './ui'

export function PromptComposer({
  value,
  onChange,
  onSubmit,
  placeholder,
  busy,
  error,
  variant,
  inputId,
}: {
  value: string
  onChange: (v: string) => void
  onSubmit: () => void
  placeholder: string
  busy?: boolean
  error?: string
  variant: 'home' | 'dock'
  inputId: string
}) {
  const app = useApp()
  const [plus, setPlus] = useState(false)
  const [models, setModels] = useState(false)
  const plusRef = useDismiss(plus, () => setPlus(false))
  const modelRef = useDismiss(models, () => setModels(false))
  const area = useRef<HTMLTextAreaElement>(null)
  const modelLabel = MODELS.find((m) => m.id === app.model)?.label ?? 'Flash-Lite'
  const canSend = value.trim().length > 0 && !busy
  const showMic = variant === 'home' && !canSend

  useEffect(() => {
    const el = area.current
    if (!el) return
    el.style.height = '0px'
    el.style.height = `${Math.min(el.scrollHeight, 112)}px`
  }, [value])

  return (
    <form
      className={`prompt variant-${variant} ${busy ? 'is-busy' : ''}`}
      aria-busy={busy || undefined}
      onSubmit={(e) => {
        e.preventDefault()
        if (!busy) onSubmit()
      }}
    >
      <div className="prompt-row">
        <div className="pop-anchor" ref={plusRef}>
          <button
            type="button"
            className="prompt-icon"
            aria-label="Add a brief"
            aria-expanded={plus}
            onClick={() => {
              setPlus((v) => !v)
              setModels(false)
            }}
          >
            <IcoPlus size={18} />
          </button>
          {plus && (
            <div className="menu" role="menu" data-overlay>
              {BRIEFS.map((b) => (
                <button
                  type="button"
                  role="menuitem"
                  key={b.label}
                  onClick={() => {
                    onChange(b.text)
                    setPlus(false)
                    area.current?.focus()
                  }}
                >
                  {b.label}
                </button>
              ))}
            </div>
          )}
        </div>
        <textarea
          id={inputId}
          ref={area}
          rows={1}
          value={value}
          maxLength={400}
          placeholder={placeholder}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${inputId}-error` : undefined}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              if (!busy) onSubmit()
            }
          }}
        />
        <div className="prompt-end">
          <div className="pop-anchor" ref={modelRef}>
            <button
              type="button"
              className="model-btn"
              aria-expanded={models}
              aria-haspopup="menu"
              onClick={() => {
                setModels((v) => !v)
                setPlus(false)
              }}
            >
              <span className="ready-dot" aria-hidden="true" />
              {modelLabel}
              <IcoChevronDown size={16} />
            </button>
            {models && (
              <div className="menu menu-models" role="menu">
                {MODELS.map((m) => (
                  <button
                    type="button"
                    role="menuitemradio"
                    aria-checked={app.model === m.id}
                    key={m.id}
                    onClick={() => {
                      app.setModel(m.id as ModelId)
                      setModels(false)
                    }}
                  >
                    <span>{m.label}</span>
                    <small>{m.note}</small>
                  </button>
                ))}
              </div>
            )}
          </div>
          {showMic ? (
            <button
              type="button"
              className="prompt-icon"
              aria-label="Voice input"
              onClick={() => app.notify('Voice input isn’t available in this preview.')}
            >
              <IcoMic size={18} />
            </button>
          ) : (
            <button type="submit" className="send-btn" disabled={!canSend} aria-label="Send">
              <IcoArrowUp size={18} />
            </button>
          )}
        </div>
      </div>
      {error && (
        <p id={`${inputId}-error`} className="prompt-error" role="alert">
          {error}
        </p>
      )}
    </form>
  )
}
