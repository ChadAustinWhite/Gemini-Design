import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactElement } from 'react'
import { downloadBlob, downloadText, fileSlug, rasterize, serializeMark } from './exportMark'
import {
  IcoArch,
  IcoCheck,
  IcoChevron,
  IcoCircle,
  IcoClose,
  IcoCode,
  IcoCrop,
  IcoCursor,
  IcoDiamond,
  IcoGrid,
  IcoHash,
  IcoHex,
  IcoMoon,
  IcoOval,
  IcoPen,
  IcoPlay,
  IcoRedo,
  IcoShield,
  IcoSquare,
  IcoSun,
  IcoType,
  IcoUndo,
  Sparkle,
} from './icons'
import { LogoMark } from './LogoMark'
import { MotionAdjust } from './MotionAdjust'
import {
  FONTS,
  GROUNDS,
  INK,
  MOTIONS,
  REFINE_CHIPS,
  SHAPES,
  STYLES,
  motionAdvice,
  motionById,
  briefLabel,
  clamp,
  contrastRatio,
  fontById,
  isLight,
  shapeLabel,
  styleLabel,
  type Shape,
  type Tool,
} from './model'
import { PromptComposer } from './Prompt'
import { useApp } from './store'
import { Tip } from './ui'

const SHAPE_ICON: Record<Shape, (p: { size?: number }) => ReactElement> = {
  circle: IcoCircle,
  square: IcoSquare,
  hexagon: IcoHex,
  shield: IcoShield,
  diamond: IcoDiamond,
  arch: IcoArch,
  oval: IcoOval,
}

const TOOLS: { id: Tool; label: string; icon: (p: { size?: number }) => ReactElement; soft?: boolean }[] = [
  { id: 'select', label: 'Select', icon: IcoCursor },
  { id: 'initials', label: 'Toggle initials', icon: IcoHash },
  { id: 'square', label: 'Square mask', icon: IcoSquare },
  { id: 'pen', label: 'Outline', icon: IcoPen },
  { id: 'text', label: 'Edit letters', icon: IcoType },
  { id: 'circle', label: 'Circle mask', icon: IcoCircle },
  { id: 'grid', label: 'Guides', icon: IcoGrid, soft: true },
  { id: 'crop', label: 'Crop marks', icon: IcoCrop, soft: true },
  { id: 'diamond', label: 'Diamond mask', icon: IcoDiamond },
  { id: 'code', label: 'SVG code', icon: IcoCode },
]

export function Editor() {
  const app = useApp()
  const editor = app.editor
  const svgRef = useRef<SVGSVGElement>(null)
  const letterRef = useRef<HTMLInputElement>(null)
  const [svgText, setSvgText] = useState('')
  const [moreFonts, setMoreFonts] = useState(false)
  const concept = editor?.present

  useEffect(() => {
    if (!svgRef.current || !concept) return
    setSvgText(serializeMark(svgRef.current, concept.bg))
  }, [concept])

  useEffect(() => {
    if (app.tool === 'text') letterRef.current?.focus()
  }, [app.tool])

  if (!editor || !concept) return null
  const current = concept
  const px = Math.round(current.size * 2.15)
  const font = fontById(concept.fontId)
  const prompt = app.activeProject?.prompt ?? ''
  const motion = motionById(app.motionOf(concept))
  const spec = `${font.name} · ${shapeLabel(concept.shape)} · ${styleLabel(concept.style)} · ${concept.size}px · ${motion.label}`
  const advice = motionAdvice(concept, app.motionOf(concept))
  const ratio = contrastRatio(concept.fg, concept.bg)
  const lowContrast = ratio < 3

  function onTool(id: Tool) {
    if (id === 'grid') {
      app.setShowGrid(!app.showGrid)
      return
    }
    if (id === 'crop') {
      app.setShowCrop(!app.showCrop)
      return
    }
    if (id === 'code') {
      const next = !app.showCode
      app.setShowCode(next)
      if (next) app.setMotionOpen(false)
      app.setTool(next ? 'code' : 'select')
      return
    }
    app.setTool(id)
    if (id === 'select' || id === 'text') app.setSelected(true)
    if (id === 'square') app.updateConcept({ shape: 'square' })
    if (id === 'circle') app.updateConcept({ shape: 'circle' })
    if (id === 'diamond') app.updateConcept({ shape: 'diamond' })
    if (id === 'pen') app.updateConcept({ style: 'outlined' })
    if (id === 'initials') {
      app.updateConcept({ showInitials: !current.showInitials, letters: current.letters || 'A' })
    }
  }

  function startResize(e: ReactPointerEvent) {
    e.preventDefault()
    e.stopPropagation()
    const origin = current.size
    const start = e.clientY
    const el = e.currentTarget as HTMLElement
    el.setPointerCapture(e.pointerId)
    const move = (ev: PointerEvent) => {
      app.updateConcept({ size: clamp(Math.round(origin + (ev.clientY - start) * 0.45), 16, 160) }, 'live')
    }
    const up = () => {
      app.endLive()
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerup', up)
    }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerup', up)
  }

  function exportSvg() {
    if (!svgText || !app.activeProject) return
    downloadText(`${fileSlug(app.activeProject.title, current.name)}.svg`, svgText, 'image/svg+xml')
    app.addToLibrary(current, `${app.activeProject.title} — ${current.name}`)
    app.notify('SVG downloaded', 'success')
  }

  async function exportPng() {
    if (!svgRef.current || !app.activeProject) return
    try {
      const source = serializeMark(svgRef.current, current.bg)
      const blob = await rasterize(source, current.bg)
      downloadBlob(`${fileSlug(app.activeProject.title, current.name)}.png`, blob)
      app.addToLibrary(current, `${app.activeProject.title} — ${current.name}`)
      app.notify('PNG downloaded', 'success')
    } catch {
      app.notify('PNG couldn’t be created. Try SVG instead.', 'error')
    }
  }

  const previewFor = app.accelerator
    ? app.accelerator.type === 'font'
      ? { ...concept, fontId: app.accelerator.fontId }
      : { ...concept, fg: app.accelerator.fg }
    : concept

  return (
    <div className="editor" id="main">
      <a className="skip" href="#stage">
        Skip to canvas
      </a>
      <header className="editor-header">
        <button type="button" className="back-btn" onClick={app.closeEditor}>
          <IcoChevron size={18} /> Back
        </button>
        <div className="header-cluster">
          <Tip label="Undo" placement="bottom">
            <button type="button" className="icon-btn" aria-label="Undo" disabled={!app.canUndo} onClick={app.undo}>
              <IcoUndo size={18} />
            </button>
          </Tip>
          <Tip label="Redo" placement="bottom">
            <button type="button" className="icon-btn" aria-label="Redo" disabled={!app.canRedo} onClick={app.redo}>
              <IcoRedo size={18} />
            </button>
          </Tip>
          <span className="vdiv" />
          <div className="theme-switch" role="group" aria-label="Theme">
            <button type="button" aria-pressed={app.theme === 'light'} aria-label="Light theme" onClick={() => app.setTheme('light')}>
              <IcoSun size={15} />
            </button>
            <button type="button" aria-pressed={app.theme === 'dark'} aria-label="Dark theme" onClick={() => app.setTheme('dark')}>
              <IcoMoon size={15} />
            </button>
          </div>
          <Tip label="Guides" placement="bottom">
            <button
              type="button"
              className="icon-btn"
              aria-label="Guides"
              aria-pressed={app.showGrid}
              onClick={() => app.setShowGrid(!app.showGrid)}
            >
              <IcoGrid size={18} />
            </button>
          </Tip>
          <Tip label="Crop marks" placement="bottom">
            <button
              type="button"
              className="icon-btn"
              aria-label="Crop marks"
              aria-pressed={app.showCrop}
              onClick={() => app.setShowCrop(!app.showCrop)}
            >
              <IcoCrop size={18} />
            </button>
          </Tip>
          <span className="vdiv" />
          <button type="button" className="btn-primary" onClick={app.save}>
            {app.savedPulse ? 'Saved' : 'Save'}
          </button>
        </div>
      </header>

      <div className="editor-body">
        <div className="stage-wrap" id="stage">
          <div className="stage">
            {app.hint && !app.verifier && (
              <div className="hint-bar">
                <Sparkle size={16} />
                <p>{app.hint.message}</p>
                <div className="chips">
                  {app.hint.options.map((o, i) => (
                    <button key={o.label} type="button" className="chip" onClick={() => app.acceptHint(i)}>
                      {o.label}
                    </button>
                  ))}
                </div>
                <button type="button" className="icon-btn" aria-label="Dismiss suggestion" onClick={app.dismissHint}>
                  <IcoClose size={16} />
                </button>
              </div>
            )}

            {app.verifier && (
              <div className="verifier" role="status">
                <span className="ba-plate" style={{ background: app.verifier.before.bg }}>
                  <LogoMark concept={app.verifier.before} pixelSize={36} />
                </span>
                <span className="ba-plate" style={{ background: app.verifier.after.bg }}>
                  <LogoMark concept={app.verifier.after} pixelSize={36} />
                </span>
                <p>{app.verifier.summary}</p>
                <button type="button" className="btn-quiet" onClick={app.undoVerifier}>
                  Undo
                </button>
                <button type="button" className="btn-primary btn-sm" onClick={app.keepVerifier}>
                  Keep
                </button>
              </div>
            )}

            {app.motionOpen && (
              <div className="motion-banner">
                <MotionAdjust concept={concept} prompt={prompt} />
                {advice && app.motionHintOn && (
                  <div className="motion-suggest">
                    <Sparkle size={14} />
                    <p>{advice.text}</p>
                    <button type="button" className="btn-primary btn-sm" onClick={() => app.chooseMotion(advice.id, concept.id)}>
                      Try {advice.label}
                    </button>
                    <button type="button" className="btn-quiet" onClick={app.dismissMotionHint}>
                      Dismiss
                    </button>
                  </div>
                )}
              </div>
            )}

            <div
              className={`artboard ${isLight(concept.bg) ? 'on-light' : 'on-dark'} ${app.refining ? 'is-refining' : ''} ${app.motionOpen ? 'has-motion' : ''}`}
              style={{ background: concept.bg }}
              onClick={() => app.setSelected(false)}
            >
              {app.showCrop && (
                <div className="crop" aria-hidden="true">
                  <span className="tl" />
                  <span className="tr" />
                  <span className="bl" />
                  <span className="br" />
                </div>
              )}
              {app.showGrid && <div className="guides" aria-hidden="true" />}
              <div className="mark-block" onClick={(e) => e.stopPropagation()}>
                <div className="mark-wrap" style={{ width: px, height: px }}>
                  <button
                    type="button"
                    className="mark-hit"
                    aria-pressed={app.selected}
                    aria-label={`${concept.name}. ${spec}`}
                    onClick={() => app.setSelected(true)}
                  >
                    <LogoMark
                      ref={svgRef}
                      concept={concept}
                      pixelSize={px}
                      motion={app.motionOf(concept)}
                      strength={app.strengthOf(concept)}
                      animate={app.playingId === concept.id}
                      key={app.playingId === concept.id ? app.playKey : 'still'}
                    />
                  </button>
                  {app.selected && app.tool === 'select' && (
                    <>
                      <span className="selection" />
                      <span className="handle nw" onPointerDown={startResize} />
                      <span className="handle ne" onPointerDown={startResize} />
                      <span className="handle sw" onPointerDown={startResize} />
                      <span className="handle se" onPointerDown={startResize} />
                    </>
                  )}
                </div>
                <p className="mark-name">{concept.name}</p>
                <p className="mark-spec">{spec}</p>
                {app.tool === 'text' && (
                  <label className="letter-edit">
                    Letters
                    <input
                      ref={letterRef}
                      value={concept.letters}
                      maxLength={4}
                      aria-label="Letters"
                      onChange={(e) =>
                        app.updateConcept({ letters: e.target.value.toUpperCase(), showInitials: true }, 'live')
                      }
                      onBlur={app.endLive}
                    />
                  </label>
                )}
              </div>

              <div className="float-toolbar" role="toolbar" aria-label="Canvas tools" onClick={(e) => e.stopPropagation()}>
                {TOOLS.map((t) => {
                  const Icon = t.icon
                  const pressed = t.id === 'grid' ? app.showGrid : t.id === 'crop' ? app.showCrop : app.tool === t.id
                  return (
                    <Tip key={t.id} label={t.label}>
                      <button
                        type="button"
                        className={`tool-btn ${t.soft ? 'is-soft' : ''}`}
                        aria-label={t.label}
                        aria-pressed={pressed}
                        onClick={() => onTool(t.id)}
                      >
                        <Icon size={18} />
                      </button>
                    </Tip>
                  )
                })}
                <Tip label="Motion">
                  <button
                    type="button"
                    className="tool-btn is-soft"
                    aria-label="Motion"
                    aria-expanded={app.motionOpen}
                    aria-pressed={app.motionOpen}
                    onClick={app.toggleMotion}
                  >
                    <IcoPlay size={16} />
                  </button>
                </Tip>
              </div>

              {app.motionOpen && (
                <div className="motion-tray" onClick={(e) => e.stopPropagation()}>
                  <div className="motion-tray-head">
                    <span>Motion</span>
                    {app.reduceMotion && <span className="motion-note">Playback stays still while reduced motion is on</span>}
                    <button type="button" className="btn-quiet" onClick={() => app.play(concept.id)}>
                      <IcoPlay size={14} /> Play again
                    </button>
                    <button type="button" className="icon-btn" aria-label="Close motion" onClick={app.toggleMotion}>
                      <IcoClose size={16} />
                    </button>
                  </div>
                  <p className="motion-note">Same mark, different motion</p>
                  <div className="motion-row" role="listbox" aria-label="Ways to animate this mark">
                    {MOTIONS.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        role="option"
                        aria-selected={app.motionOf(concept) === item.id}
                        className={`motion-card ${app.motionOf(concept) === item.id ? 'is-on' : ''}`}
                        onClick={() => app.chooseMotion(item.id, concept.id)}
                      >
                        <span className="motion-preview" style={{ background: concept.bg }}>
                          <LogoMark
                            concept={concept}
                            pixelSize={44}
                            motion={item.id}
                            strength={item.id === app.motionOf(concept) ? app.strengthOf(concept) : 'natural'}
                            preview
                          />
                        </span>
                        <span className="motion-label">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {app.showCode && (
                <div className="code-drawer" onClick={(e) => e.stopPropagation()}>
                  <div className="code-head">
                    <span>SVG</span>
                    <button
                      type="button"
                      className="btn-quiet"
                      onClick={async () => {
                        await navigator.clipboard.writeText(svgText)
                        app.notify('SVG copied', 'success')
                      }}
                    >
                      Copy
                    </button>
                    <button type="button" className="icon-btn" aria-label="Close SVG" onClick={() => onTool('code')}>
                      <IcoClose size={16} />
                    </button>
                  </div>
                  <pre>{svgText}</pre>
                </div>
              )}
            </div>

            <div className="refine-dock">
              {app.promptOpen ? (
                <div className={`refine-panel ${app.refining ? 'is-busy' : ''}`}>
                  <div className="refine-head">
                    <Sparkle size={16} />
                    <span>Refine this mark</span>
                    {prompt && <span className="motion-note">Building on “{briefLabel(prompt)}”</span>}
                    <button type="button" className="icon-btn" aria-label="Collapse prompt" onClick={() => app.setPromptOpen(false)}>
                      <IcoClose size={16} />
                    </button>
                  </div>
                  <PromptComposer
                    inputId="editor-prompt"
                    variant="dock"
                    value={app.refineText}
                    onChange={app.setRefineText}
                    onSubmit={() => app.refine()}
                    placeholder={`Adjust ${concept.name.toLowerCase()}…`}
                    busy={app.refining}
                    error={app.refineError}
                  />
                  {app.clarify && (
                    <div className="clarify-row flat">
                      <p>{app.clarify.message}</p>
                      <div className="chips">
                        {app.clarify.options.map((o) => (
                          <button key={o} type="button" className="chip" onClick={() => app.refine(o)}>
                            {o}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="chips">
                    {REFINE_CHIPS.map((c) => (
                      <button key={c} type="button" className="chip" onClick={() => app.refine(c)}>
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <button type="button" className="refine-collapsed" onClick={() => app.setPromptOpen(true)}>
                  <Sparkle size={16} /> Refine · {motion.label}
                </button>
              )}
            </div>
          </div>
        </div>

        <aside className="panel" aria-label="Logo tools">
          <div className="panel-head">
            <h1>Logo tools</h1>
            <p>{concept.name}</p>
          </div>
          <div className="panel-scroll">
            {app.accelerator && (
              <section className="ai-card">
                <div className="ai-kicker">
                  <Sparkle size={14} />
                  <span>{app.accelerator.tag}</span>
                </div>
                <h2>{app.accelerator.title}</h2>
                <p>{app.accelerator.body}</p>
                <div className="ba" aria-label="Before and after">
                  <span className="ba-plate" style={{ background: concept.bg }}>
                    <LogoMark concept={concept} pixelSize={42} />
                  </span>
                  <span className="ba-arrow" aria-hidden="true">
                    →
                  </span>
                  <span className="ba-plate" style={{ background: previewFor.bg }}>
                    <LogoMark concept={previewFor} pixelSize={42} />
                  </span>
                </div>
                <div className="ai-actions">
                  <button type="button" className="btn-primary btn-sm" onClick={app.applyAccelerator}>
                    Apply
                  </button>
                  <button type="button" className="btn-quiet" onClick={app.dismissAccelerator}>
                    Dismiss
                  </button>
                </div>
              </section>
            )}

            <section>
              <h2>Type</h2>
              <ul className="font-list">
                {FONTS.filter((f) => (moreFonts ? true : !f.more)).map((f) => (
                  <li key={f.id}>
                    <button
                      type="button"
                      className={`font-row ${concept.fontId === f.id ? 'is-on' : ''}`}
                      aria-pressed={concept.fontId === f.id}
                      onClick={() => app.updateConcept({ fontId: f.id })}
                    >
                      <span className="font-name" style={{ fontFamily: f.stack }}>
                        {f.name}
                      </span>
                      <span className={`tag ${f.ai ? 'is-ai' : ''}`}>{f.tag}</span>
                      {concept.fontId === f.id && <IcoCheck size={16} />}
                    </button>
                  </li>
                ))}
              </ul>
              <button type="button" className="disclosure" aria-expanded={moreFonts} onClick={() => setMoreFonts((v) => !v)}>
                {moreFonts ? 'Fewer fonts' : 'More fonts'}
              </button>
            </section>

            <section>
              <h2>Shape</h2>
              <div className="shape-grid" role="group" aria-label="Shape">
                {SHAPES.map((s) => {
                  const Icon = SHAPE_ICON[s.id]
                  return (
                    <button
                      key={s.id}
                      type="button"
                      aria-pressed={concept.shape === s.id}
                      onClick={() => app.updateConcept({ shape: s.id })}
                    >
                      <Icon size={16} />
                      {s.label}
                    </button>
                  )
                })}
              </div>
            </section>

            <section>
              <h2>Style</h2>
              <div className="style-list" role="radiogroup" aria-label="Style">
                {STYLES.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    role="radio"
                    aria-checked={concept.style === s.id}
                    className={concept.style === s.id ? 'is-on' : ''}
                    onClick={() => app.updateConcept({ style: s.id, showInitials: s.id === 'monogram' ? true : concept.showInitials })}
                  >
                    {concept.style === s.id && <IcoCheck size={15} />}
                    {s.label}
                  </button>
                ))}
              </div>
            </section>

            <section>
              <div className="section-row">
                <h2>Size</h2>
                <input
                  className="size-num"
                  type="number"
                  min={16}
                  max={160}
                  aria-label="Size in pixels"
                  value={concept.size}
                  onChange={(e) => app.updateConcept({ size: clamp(Number(e.target.value) || 16, 16, 160) }, 'live')}
                  onBlur={app.endLive}
                />
              </div>
              <input
                className="slider"
                type="range"
                min={16}
                max={160}
                value={concept.size}
                aria-label="Size"
                aria-valuetext={`${concept.size} pixels`}
                onChange={(e) => app.updateConcept({ size: Number(e.target.value) }, 'live')}
                onPointerUp={app.endLive}
                onKeyUp={app.endLive}
              />
              <div className="slider-scale">
                <span>16</span>
                <span>160</span>
              </div>
            </section>

            <section>
              <h2>Color</h2>
              <p className="field-label">Foreground</p>
              <div className="swatches">
                {INK.map((c) => (
                  <button
                    key={c.hex}
                    type="button"
                    className="swatch"
                    style={{ background: c.hex }}
                    aria-label={`${c.name} foreground ${c.hex}`}
                    aria-pressed={concept.fg.toLowerCase() === c.hex}
                    onClick={() => app.updateConcept({ fg: c.hex })}
                  />
                ))}
              </div>
              <p className="field-label">Background</p>
              <div className="swatches">
                {GROUNDS.map((c) => (
                  <button
                    key={c.hex}
                    type="button"
                    className="swatch"
                    style={{ background: c.hex }}
                    aria-label={`${c.name} background ${c.hex}`}
                    aria-pressed={concept.bg.toLowerCase() === c.hex}
                    onClick={() => app.updateConcept({ bg: c.hex })}
                  />
                ))}
              </div>
              {lowContrast && (
                <p className="contrast-note" role="status">
                  Contrast is {ratio.toFixed(1)}:1. Large marks should stay at or above 3:1.
                </p>
              )}
            </section>

            <details className="fine">
              <summary>Fine tune</summary>
              <label className="fine-row">
                <span>Tracking</span>
                <input
                  type="range"
                  min={-4}
                  max={16}
                  value={concept.tracking}
                  aria-label="Tracking"
                  onChange={(e) => app.updateConcept({ tracking: Number(e.target.value) }, 'live')}
                  onPointerUp={app.endLive}
                  onKeyUp={app.endLive}
                />
              </label>
              <label className="fine-row">
                <span>Custom ink</span>
                <input type="color" aria-label="Custom foreground" value={toHex(concept.fg)} onChange={(e) => app.updateConcept({ fg: e.target.value })} />
              </label>
              <label className="fine-row">
                <span>Custom ground</span>
                <input
                  type="color"
                  aria-label="Custom background"
                  value={toHex(concept.bg)}
                  onChange={(e) => app.updateConcept({ bg: e.target.value })}
                />
              </label>
            </details>

            <section>
              <h2>Export</h2>
              <div className="export-row">
                <button type="button" onClick={exportPng}>
                  PNG
                </button>
                <button type="button" onClick={exportSvg}>
                  SVG
                </button>
              </div>
            </section>
          </div>
        </aside>
      </div>
    </div>
  )
}

function toHex(value: string) {
  return /^#[0-9a-fA-F]{6}$/.test(value) ? value : '#1c1b19'
}
