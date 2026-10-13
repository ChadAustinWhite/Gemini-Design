import { LogoMark } from './LogoMark'
import { MotionAdjust, MotionCompare } from './MotionAdjust'
import { IcoGuitar, IcoImageSpark, IcoMoon, IcoPencil, IcoPlay, IcoSun, Sparkle } from './icons'
import { PLACEMENTS, SUGGESTIONS, motionById } from './model'
import { PromptComposer } from './Prompt'
import { useApp } from './store'

export function HomeView() {
  const app = useApp()
  return (
    <section className="home">
      <div className="home-actions">
        <button
          type="button"
          className="icon-btn"
          aria-label={app.theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          onClick={app.toggleTheme}
        >
          {app.theme === 'dark' ? <IcoSun size={18} /> : <IcoMoon size={18} />}
        </button>
        <button type="button" className="ghost-pill" onClick={() => app.notify('The Gemini app isn’t part of this preview.')}>
          Get app
        </button>
        <button type="button" className="icon-btn" aria-label="Focus the prompt" onClick={() => document.getElementById('ask')?.focus()}>
          <IcoPencil size={18} />
        </button>
      </div>
      <div className="home-stage">
        <h1>Where should we start?</h1>
        <PromptComposer
          inputId="ask"
          variant="home"
          value={app.composer}
          onChange={app.setComposer}
          onSubmit={() => app.submitPrompt()}
          placeholder="Ask ChadGPT"
          error={app.promptError}
        />
        <div className="suggestions">
          {SUGGESTIONS.map((s) => (
            <button key={s.label} type="button" className="suggestion" onClick={() => app.submitPrompt(s.label)}>
              {s.icon === 'image' && <IcoImageSpark />}
              {s.icon === 'music' && <IcoGuitar />}
              <span>{s.label}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

export function SparkView() {
  const app = useApp()
  const starts = [
    {
      title: 'Coffee wordmark',
      note: 'A quiet letter in a circle mask.',
      prompt: 'Design a logo mask for a coffee brand',
    },
    {
      title: 'Night badge',
      note: 'A geometric badge for a dark ground.',
      prompt: 'A geometric badge for a night drive',
    },
    {
      title: 'Studio monogram',
      note: 'Two initials with humanist type.',
      prompt: 'Sketch a monogram for Lumen studio',
    },
  ]
  return (
    <section className="page">
      <header className="page-head">
        <p className="eyebrow">
          <Sparkle size={16} /> Spark
        </p>
        <h1>Start from a direction</h1>
        <p className="lede">Pick a starting point. You can still change the mask, type, and ink afterward.</p>
      </header>
      <div className="spark-grid">
        {starts.map((s) => (
          <button key={s.title} type="button" className="spark-card" onClick={() => app.submitPrompt(s.prompt)}>
            <span className="spark-title">{s.title}</span>
            <span className="spark-note">{s.note}</span>
          </button>
        ))}
      </div>
    </section>
  )
}

export function ResultsView() {
  const app = useApp()
  const project = app.activeProject
  const prompt = project?.prompt || app.composer
  const concepts = project?.concepts ?? []

  return (
    <section className="results">
      <div className="results-scroll">
        <div className="results-top">
          <div className="results-intro" aria-live="polite">
            {app.phase === 'loading' ? (
              <h1>
                <Sparkle size={18} /> Shaping four directions
              </h1>
            ) : app.phase === 'error' ? (
              <h1>Couldn’t finish these concepts</h1>
            ) : (
              <h1>
                <Sparkle size={18} /> Here are {concepts.length || 4} logo mask concepts based on your prompt. Select one to
                refine.
              </h1>
            )}
            {app.model === 'pro' && app.phase === 'ready' && <p className="model-note">Pro is favoring cleaner geometry.</p>}
          </div>
          {prompt && (
            <button type="button" className="prompt-chip" onClick={() => document.getElementById('refine-prompt')?.focus()}>
              {prompt}
            </button>
          )}
        </div>

        {app.phase === 'error' && (
          <div className="status-block" role="alert">
            <p>Gemini couldn’t complete that request. Your prompt is still here.</p>
            <div className="status-actions">
              <button type="button" className="btn-primary" onClick={app.retry}>
                Try again
              </button>
              <button type="button" className="btn-quiet" onClick={() => document.getElementById('refine-prompt')?.focus()}>
                Edit prompt
              </button>
            </div>
          </div>
        )}

        {app.phase === 'loading' && (
          <div className="concept-grid" aria-hidden="true">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton" />
            ))}
          </div>
        )}

        {app.phase === 'ready' && (
          <>
            <div className="helper-row">
              <p>Each direction keeps your brief. Open one to adjust it.</p>
              <button
                type="button"
                className={`chip ${app.compare ? 'is-on' : ''}`}
                aria-pressed={app.compare}
                onClick={() => app.setCompare(!app.compare)}
              >
                Compare
              </button>
              <button type="button" className="chip" onClick={() => app.newDirections()}>
                New directions
              </button>
              <button type="button" className="chip" onClick={() => app.setRoute('videos')}>
                Explore motion
              </button>
            </div>

            {app.compare && app.compareIds.length > 0 && (
              <div className="compare-band">
                {app.compareIds.map((id) => {
                  const concept = concepts.find((c) => c.id === id)
                  if (!concept) return null
                  const shown = app.shownTune(concept)
                  return (
                    <article key={id} className="compare-card">
                      <div className="concept-preview" style={{ background: concept.bg }}>
                        <LogoMark
                          concept={concept}
                          pixelSize={140}
                          motion={shown.motion}
                          strength={shown.strength}
                          duration={shown.duration}
                          easing={shown.easing}
                          movement={shown.movement}
                          animate={app.playingId === id}
                          key={`${id}-${app.playKey}`}
                        />
                      </div>
                      <div>
                        <h2>{concept.name}</h2>
                        <div className="status-actions">
                          <button type="button" className="btn-quiet" onClick={() => app.play(id)}>
                            <IcoPlay size={16} /> Play
                          </button>
                          <button type="button" className="btn-primary btn-sm" onClick={() => app.openConcept(id)}>
                            Refine
                          </button>
                        </div>
                      </div>
                    </article>
                  )
                })}
              </div>
            )}

            <div className="concept-grid" role="list">
              {concepts.map((concept) => {
                const selected = app.activeConceptId === concept.id || (app.compare && app.compareIds.includes(concept.id))
                const shown = app.shownTune(concept)
                return (
                  <div key={concept.id} className={`concept-card ${selected ? 'is-selected' : ''}`} role="listitem">
                    <button
                      type="button"
                      className="concept-open"
                      onClick={() => (app.compare ? app.toggleCompare(concept.id) : app.openConcept(concept.id))}
                      aria-pressed={app.compare ? app.compareIds.includes(concept.id) : undefined}
                    >
                      <span className="concept-preview" style={{ background: concept.bg }}>
                        <LogoMark
                          concept={concept}
                          pixelSize={112}
                          motion={shown.motion}
                          strength={shown.strength}
                          duration={shown.duration}
                          easing={shown.easing}
                          movement={shown.movement}
                          animate={app.playingId === concept.id}
                          key={`${concept.id}-${app.playingId === concept.id ? app.playKey : 'still'}`}
                        />
                      </span>
                      <span className="concept-name">{concept.name}</span>
                    </button>
                    <button
                      type="button"
                      className="play-btn"
                      aria-label={`Play ${concept.name}, ${motionById(app.motionOf(concept)).label}`}
                      onClick={() => app.play(concept.id)}
                    >
                      <IcoPlay size={14} />
                    </button>
                  </div>
                )
              })}
            </div>

            <div className="clarify-row">
              <p>Where should this mark live?</p>
              <div className="chips">
                {PLACEMENTS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    className={`chip ${app.placement === p ? 'is-on' : ''}`}
                    aria-pressed={app.placement === p}
                    onClick={() => app.setPlacement(p)}
                  >
                    {p}
                  </button>
                ))}
              </div>
              {app.placement && <p className="model-note">Tuned for a {app.placement.toLowerCase()}. Open a variant to see the size.</p>}
            </div>
          </>
        )}
      </div>
      {app.pendingBrief && (
        <div className="pending-brief">
          <p>Add “{app.pendingBrief}” to this brief and keep these marks, or start a new set of directions.</p>
          <div className="chips">
            <button type="button" className="btn-primary btn-sm" onClick={app.keepBrief}>
              Keep these marks
            </button>
            <button type="button" className="btn-quiet" onClick={app.newDirections}>
              New directions
            </button>
          </div>
        </div>
      )}
      <div className="composer-dock">
        <PromptComposer
          inputId="refine-prompt"
          variant="dock"
          value={app.composer}
          onChange={app.setComposer}
          onSubmit={() => app.submitPrompt()}
          placeholder="Add to this brief…"
          busy={app.phase === 'loading'}
          error={app.promptError}
        />
      </div>
    </section>
  )
}

export function SearchView() {
  const app = useApp()
  const q = app.search.trim().toLowerCase()
  const matches = app.projects.filter((p) => !q || p.title.toLowerCase().includes(q) || p.prompt.toLowerCase().includes(q))
  return (
    <section className="page">
      <header className="page-head">
        <h1>Search chats</h1>
        <label className="search-field">
          <span className="sr-only">Search chats</span>
          <input
            autoFocus
            value={app.search}
            placeholder="Search chats"
            onChange={(e) => app.setSearch(e.target.value)}
          />
        </label>
      </header>
      {matches.length === 0 ? (
        <div className="status-block">
          <h2>No chats found</h2>
          <p>Nothing matches “{app.search}”.</p>
        </div>
      ) : (
        <ul className="plain-list">
          {matches.map((p) => (
            <li key={p.id}>
              <button type="button" onClick={() => app.openProject(p.id)}>
                <strong>{p.title}</strong>
                <span>{p.prompt}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export function BriefView() {
  const app = useApp()
  return (
    <section className="page narrow">
      <header className="page-head">
        <p className="eyebrow">Monday, October 12</p>
        <h1>Daily brief</h1>
        <p className="lede">A short read on the logo work already in your recents.</p>
      </header>
      <ul className="brief-list">
        <li>
          <strong>Coffee shop logo</strong>
          <span>Four directions are ready, in the manner of Bass, Rand, Geismar, and Vignelli.</span>
        </li>
        <li>
          <strong>Ink</strong>
          <span>Warm brown holds contrast on ivory if black feels too stark.</span>
        </li>
        <li>
          <strong>Playback</strong>
          <span>Each mark can settle, draw on, or reveal. Compare the motion before you commit to one.</span>
        </li>
      </ul>
      <button type="button" className="btn-primary" onClick={() => app.openProject('p-studio')}>
        Continue the coffee logo
      </button>
    </section>
  )
}

export function ImagesView() {
  const app = useApp()
  return (
    <section className="page">
      <header className="page-head">
        <h1>Images</h1>
        <p className="lede">Marks you save or export gather here.</p>
      </header>
      {app.library.length === 0 ? (
        <div className="status-block">
          <h2>No saved marks yet</h2>
          <p>Save from the editor, or export a PNG, and it will show up here.</p>
          <button type="button" className="btn-primary" onClick={() => app.openProject('p-studio')}>
            Open a logo
          </button>
        </div>
      ) : (
        <div className="image-grid">
          {app.library.map((item) => (
            <figure key={item.id}>
              <div className="concept-preview" style={{ background: item.concept.bg }}>
                <LogoMark concept={item.concept} pixelSize={120} />
              </div>
              <figcaption>
                <strong>{item.title}</strong>
                <span>{ago(item.savedAt)}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      )}
    </section>
  )
}

export function VideosView() {
  const app = useApp()
  const project = app.activeProject ?? app.projects[0]
  const concept =
    project?.concepts.find((c) => c.id === app.activeConceptId) ?? project?.concepts[0] ?? null
  const tune = concept ? app.tuneOf(concept) : null
  const shown = concept ? app.shownTune(concept) : null
  const treatment = tune ? motionById(tune.motion) : null
  return (
    <section className="page">
      <header className="page-head">
        <h1>Motion</h1>
        <p className="lede">Adjust how this mark moves. The brief and the design stay with you.</p>
      </header>
      {!concept || !project || !shown || !treatment ? (
        <div className="status-block">
          <h2>No studies yet</h2>
          <p>Generate a logo to preview motion.</p>
        </div>
      ) : (
        <>
          <div className="motion-stage" style={{ background: concept.bg }}>
            <LogoMark
              concept={concept}
              pixelSize={200}
              motion={shown.motion}
              strength={shown.strength}
              duration={shown.duration}
              easing={shown.easing}
              movement={shown.movement}
              animate={app.playingId === concept.id}
              key={`${concept.id}-${app.playingId === concept.id ? `${app.playKey}-${shown.motion}` : 'still'}`}
            />
          </div>
          <div className="motion-caption">
            <h2>
              {concept.name} · {treatment.label}
            </h2>
            <p>{treatment.note}</p>
            {app.reduceMotion && <p>Playback stays still while reduced motion is on.</p>}
            <div className="status-actions">
              <button type="button" className="btn-quiet" onClick={() => app.play(concept.id)}>
                <IcoPlay size={16} /> Play again
              </button>
              <button type="button" className="btn-primary btn-sm" onClick={() => app.openConcept(concept.id)}>
                Open in the editor
              </button>
            </div>
          </div>
          <div className="motion-page-adjust">
            <MotionAdjust concept={concept} prompt={project.prompt} />
          </div>
          {project.concepts.length > 1 && (
            <div className="chips motion-marks">
              {project.concepts.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`chip ${item.id === concept.id ? 'is-on' : ''}`}
                  aria-pressed={item.id === concept.id}
                  onClick={() => app.focusMark(item.id)}
                >
                  {item.name}
                </button>
              ))}
            </div>
          )}
          <p className="motion-note">Play an alternative without replacing the selected version.</p>
          <MotionCompare concept={concept} />
        </>
      )}
    </section>
  )
}

export function LibraryView() {
  const app = useApp()
  return (
    <section className="page">
      <header className="page-head">
        <h1>Library</h1>
        <p className="lede">Projects you can reopen and refine.</p>
      </header>
      <ul className="library-list">
        {app.projects.map((p) => (
          <li key={p.id}>
            <button type="button" onClick={() => app.openProject(p.id)}>
              <span className="mini-row">
                {p.concepts.slice(0, 4).map((c) => (
                  <span key={c.id} className="mini-plate" style={{ background: c.bg }}>
                    <LogoMark concept={c} pixelSize={36} />
                  </span>
                ))}
              </span>
              <span>
                <strong>{p.title}</strong>
                <span className="muted">{p.prompt}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}

export function NotebooksView() {
  const app = useApp()
  const current = app.notebooks.find((n) => n.id === app.activeNotebook) ?? null
  if (!current) {
    return (
      <section className="page narrow">
        <header className="page-head">
          <h1>Notebooks</h1>
          <p className="lede">Keep references and decisions beside the work.</p>
        </header>
        <div className="status-block">
          <h2>No notebooks yet</h2>
          <p>A notebook is a quiet place for notes. It won’t change the logo until you do.</p>
          <button type="button" className="btn-primary" onClick={app.addNotebook}>
            New notebook
          </button>
        </div>
      </section>
    )
  }
  return (
    <section className="page narrow">
      <header className="page-head">
        <h1>
          <label className="sr-only" htmlFor="nb-title">
            Notebook title
          </label>
          <input
            id="nb-title"
            className="title-input"
            value={current.title}
            onChange={(e) => app.updateNotebook(current.id, { title: e.target.value })}
          />
        </h1>
      </header>
      <textarea
        className="notebook-body"
        placeholder="Write a note…"
        value={current.body}
        onChange={(e) => app.updateNotebook(current.id, { body: e.target.value })}
      />
      {app.notebooks.length > 1 && (
        <ul className="plain-list compact">
          {app.notebooks.map((n) => (
            <li key={n.id}>
              <button type="button" onClick={() => app.setActiveNotebook(n.id)} aria-current={n.id === current.id}>
                {n.title || 'Untitled notebook'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

function ago(ts: number) {
  const s = Math.round((Date.now() - ts) / 1000)
  if (s < 60) return 'Just now'
  const m = Math.round(s / 60)
  if (m < 60) return `${m} min ago`
  return `${Math.round(m / 60)} hr ago`
}
