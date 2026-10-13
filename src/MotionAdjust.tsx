import { LogoMark } from './LogoMark'
import { EASINGS, briefLabel, motionAlternatives, motionById, type Concept, type EasingId, type MotionId } from './model'
import { useApp } from './store'

export function MotionAdjust({ concept, prompt }: { concept: Concept; prompt: string }) {
  const app = useApp()
  const tune = app.tuneOf(concept)
  const diff = app.motionDiffOf(concept)
  return (
    <div className="motion-adjust">
      <p className="motion-brief">Brief · {briefLabel(prompt)}</p>
      <p className="motion-story" aria-live="polite">
        {diff || app.motionStory(concept, prompt)}
      </p>
      {diff && (
        <div className="motion-verify">
          <button type="button" className="btn-quiet" onClick={() => app.playBefore(concept.id)}>
            Play before
          </button>
          <button type="button" className="btn-quiet" onClick={() => app.playAfter(concept.id)}>
            Play after
          </button>
          {app.canUndoMotion(concept.id) && (
            <button type="button" className="btn-quiet" onClick={() => app.undoMotion(concept.id)}>
              Undo motion
            </button>
          )}
        </div>
      )}
      <div className="tune-grid">
        <label className="tune-row">
          <span>Duration</span>
          <input
            type="range"
            min={400}
            max={2400}
            step={50}
            value={tune.duration}
            aria-label="Duration"
            onChange={(e) => app.setDuration(Number(e.target.value), concept.id, true)}
            onPointerUp={() => app.endMotionLive(concept.id)}
            onKeyUp={() => app.endMotionLive(concept.id)}
            onBlur={() => app.endMotionLive(concept.id)}
          />
          <output>{(tune.duration / 1000).toFixed(1)}s</output>
        </label>
        <label className="tune-row">
          <span>Movement</span>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={tune.movement}
            aria-label="Movement"
            onChange={(e) => app.setMovement(Number(e.target.value), concept.id, true)}
            onPointerUp={() => app.endMotionLive(concept.id)}
            onKeyUp={() => app.endMotionLive(concept.id)}
            onBlur={() => app.endMotionLive(concept.id)}
          />
          <output>{tune.movement}</output>
        </label>
      </div>
      <div className="seg seg-4" role="radiogroup" aria-label="Easing">
        {EASINGS.map((item) => (
          <button
            key={item.id}
            type="button"
            role="radio"
            aria-checked={tune.easing === item.id}
            aria-pressed={tune.easing === item.id}
            onClick={() => app.setEasing(item.id as EasingId, concept.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export function MotionCompare({ concept }: { concept: Concept }) {
  const app = useApp()
  const selected = app.tuneOf(concept)
  const playing = app.playingId === concept.id ? app.playSnap : null
  const previewing = playing != null && playing.motion !== selected.motion
  const alts = motionAlternatives(selected.motion)
  return (
    <div className="motion-compare">
      {previewing && (
        <p className="motion-note">
          Playing {motionById(playing.motion).label}. {motionById(selected.motion).label} stays selected.
        </p>
      )}
      <div className="motion-row" role="list" aria-label="Selected motion and three alternatives">
        <div className="motion-card is-on" role="listitem">
          <button type="button" className="motion-play" onClick={() => app.play(concept.id)} aria-pressed={playing?.motion === selected.motion}>
            <MarkPreview concept={concept} motion={selected.motion} />
            <span className="motion-label">{motionById(selected.motion).label}</span>
          </button>
          <span className="motion-tag">Selected</span>
        </div>
        {alts.map((item) => (
          <div key={item.id} className={`motion-card ${playing?.motion === item.id ? 'is-playing' : ''}`} role="listitem">
            <button
              type="button"
              className="motion-play"
              aria-pressed={playing?.motion === item.id}
              onClick={() => app.previewMotion(item.id, concept.id)}
            >
              <MarkPreview concept={concept} motion={item.id} />
              <span className="motion-label">{item.label}</span>
            </button>
            <button type="button" className="motion-use" onClick={() => app.chooseMotion(item.id, concept.id)}>
              Use
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

function MarkPreview({ concept, motion }: { concept: Concept; motion: MotionId }) {
  const tune = useApp().tuneOf(concept)
  return (
    <span className="motion-preview" style={{ background: concept.bg }}>
      <LogoMark concept={concept} pixelSize={44} motion={motion} duration={tune.duration} easing={tune.easing} movement={tune.movement} preview />
    </span>
  )
}
