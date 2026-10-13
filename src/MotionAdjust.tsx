import { STRENGTHS, briefLabel, motionById, type Concept } from './model'
import { useApp } from './store'

export function MotionAdjust({ concept, prompt }: { concept: Concept; prompt: string }) {
  const app = useApp()
  const motion = motionById(app.motionOf(concept))
  const strength = app.strengthOf(concept)
  return (
    <div className="motion-adjust">
      <p className="motion-brief">Brief · {briefLabel(prompt)}</p>
      <p className="motion-story" aria-live="polite">
        {app.motionStory(concept, prompt)}
      </p>
      <div className="motion-tools">
        <div className="seg seg-3" role="radiogroup" aria-label={`Adjust ${motion.label}`}>
          {STRENGTHS.map((item) => (
            <button
              key={item.id}
              type="button"
              role="radio"
              aria-checked={strength === item.id}
              aria-pressed={strength === item.id}
              onClick={() => app.setMotionStrength(item.id, concept.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
        {app.canUndoMotion(concept.id) && (
          <button type="button" className="btn-quiet" onClick={() => app.undoMotion(concept.id)}>
            Undo motion
          </button>
        )}
      </div>
    </div>
  )
}
