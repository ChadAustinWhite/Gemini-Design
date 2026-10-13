import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import {
  SEED,
  type Accelerator,
  type Concept,
  type Hint,
  type Mode,
  type ModelId,
  type Notebook,
  type Phase,
  type MotionId,
  type MotionStrength,
  type Placement,
  type Project,
  type Route,
  type SavedMark,
  type Theme,
  type Tool,
  briefLabel,
  buildConcepts,
  clone,
  interpret,
  makeHint,
  motionChangeNote,
  motionFollowUp,
  motionFromText,
  motionMs,
  motionStartNote,
  startingMotion,
  placementPatch,
  recommendColor,
  recommendFont,
  titleFromPrompt,
  uid,
} from './model'

export interface Toast {
  id: string
  message: string
  tone: 'info' | 'success' | 'error'
}

export interface EditorState {
  projectId: string
  past: Concept[]
  present: Concept
  future: Concept[]
  dirty: boolean
}

export interface Verifier {
  summary: string
  before: Concept
  after: Concept
}

interface Store {
  theme: Theme
  setTheme: (t: Theme) => void
  toggleTheme: () => void
  reduceMotion: boolean
  setReduceMotion: (v: boolean) => void
  mode: Mode
  setMode: (m: Mode) => void
  route: Route
  setRoute: (r: Route) => void
  collapsed: boolean
  setCollapsed: (v: boolean) => void
  model: ModelId
  setModel: (m: ModelId) => void
  projects: Project[]
  activeId: string | null
  activeProject: Project | null
  phase: Phase
  promptError: string
  composer: string
  setComposer: (s: string) => void
  submitPrompt: (text?: string) => void
  retry: () => void
  openProject: (id: string) => void
  newChat: () => void
  search: string
  setSearch: (s: string) => void
  editor: EditorState | null
  openConcept: (id: string) => void
  closeEditor: () => void
  updateConcept: (patch: Partial<Concept>, mode?: 'commit' | 'live') => void
  endLive: () => void
  undo: () => void
  redo: () => void
  canUndo: boolean
  canRedo: boolean
  save: () => void
  savedPulse: boolean
  tool: Tool
  setTool: (t: Tool) => void
  selected: boolean
  setSelected: (v: boolean) => void
  showGrid: boolean
  setShowGrid: (v: boolean) => void
  showCrop: boolean
  setShowCrop: (v: boolean) => void
  showCode: boolean
  setShowCode: (v: boolean) => void
  promptOpen: boolean
  setPromptOpen: (v: boolean) => void
  hint: Hint | null
  acceptHint: (index: number) => void
  dismissHint: () => void
  accelerator: Accelerator | null
  dismissAccelerator: () => void
  applyAccelerator: () => void
  verifier: Verifier | null
  keepVerifier: () => void
  undoVerifier: () => void
  refineText: string
  setRefineText: (s: string) => void
  refine: (text?: string) => void
  refining: boolean
  refineError: string
  clarify: { message: string; options: string[] } | null
  toasts: Toast[]
  notify: (message: string, tone?: Toast['tone']) => void
  dismissToast: (id: string) => void
  library: SavedMark[]
  addToLibrary: (concept: Concept, title: string) => void
  notebooks: Notebook[]
  activeNotebook: string | null
  setActiveNotebook: (id: string | null) => void
  addNotebook: () => void
  updateNotebook: (id: string, patch: Partial<Notebook>) => void
  compare: boolean
  setCompare: (v: boolean) => void
  compareIds: string[]
  toggleCompare: (id: string) => void
  playingId: string | null
  playKey: number
  play: (id: string) => void
  motionOf: (concept: Concept) => MotionId
  strengthOf: (concept: Concept) => MotionStrength
  motionStory: (concept: Concept, prompt: string) => string
  canUndoMotion: (conceptId: string) => boolean
  motionOpen: boolean
  setMotionOpen: (v: boolean) => void
  toggleMotion: () => void
  chooseMotion: (id: MotionId, conceptId?: string) => void
  setMotionStrength: (strength: MotionStrength, conceptId?: string) => void
  undoMotion: (conceptId?: string) => void
  focusMark: (conceptId: string) => void
  motionHintOn: boolean
  dismissMotionHint: () => void
  pendingBrief: string | null
  keepBrief: () => void
  newDirections: () => void
  placement: Placement | null
  setPlacement: (p: Placement) => void
  activeConceptId: string | null
  settingsOpen: boolean
  setSettingsOpen: (v: boolean) => void
}

const Ctx = createContext<Store | null>(null)

export function useApp() {
  const value = useContext(Ctx)
  if (!value) throw new Error('useApp outside provider')
  return value
}

function initialTheme(): Theme {
  const stored = localStorage.getItem('gemini-theme')
  if (stored === 'light' || stored === 'dark') return stored
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function Provider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(initialTheme)
  const [reduceMotion, setReduceState] = useState(() => localStorage.getItem('gemini-reduce') === '1')
  const [mode, setMode] = useState<Mode>('chat')
  const [route, setRoute] = useState<Route>('home')
  const [collapsed, setCollapsed] = useState(false)
  const [model, setModelState] = useState<ModelId>('flash-lite')
  const [projects, setProjects] = useState<Project[]>(() => clone(SEED))
  const [activeId, setActiveId] = useState<string | null>(null)
  const [phase, setPhase] = useState<Phase>('idle')
  const [promptError, setPromptError] = useState('')
  const [composer, setComposer] = useState('')
  const [search, setSearch] = useState('')
  const [editor, setEditor] = useState<EditorState | null>(null)
  const [tool, setTool] = useState<Tool>('select')
  const [selected, setSelected] = useState(true)
  const [showGrid, setShowGrid] = useState(false)
  const [showCrop, setShowCrop] = useState(true)
  const [showCode, setShowCode] = useState(false)
  const [promptOpen, setPromptOpen] = useState(false)
  const [hint, setHint] = useState<Hint | null>(null)
  const [accelerator, setAccelerator] = useState<Accelerator | null>(null)
  const [verifier, setVerifier] = useState<Verifier | null>(null)
  const [refineText, setRefineText] = useState('')
  const [refining, setRefining] = useState(false)
  const [refineError, setRefineError] = useState('')
  const [clarify, setClarify] = useState<{ message: string; options: string[] } | null>(null)
  const [toasts, setToasts] = useState<Toast[]>([])
  const [library, setLibrary] = useState<SavedMark[]>([])
  const [notebooks, setNotebooks] = useState<Notebook[]>([])
  const [activeNotebook, setActiveNotebook] = useState<string | null>(null)
  const [compare, setCompare] = useState(false)
  const [compareIds, setCompareIds] = useState<string[]>([])
  const [playingId, setPlayingId] = useState<string | null>(null)
  const [playKey, setPlayKey] = useState(0)
  const [playSpec, setPlaySpec] = useState<{ motion: MotionId; strength: MotionStrength }>({
    motion: 'draw',
    strength: 'natural',
  })
  const [memory, setMemory] = useState<
    Record<string, { motion: MotionId; strength: MotionStrength; past: { motion: MotionId; strength: MotionStrength }[] }>
  >({})
  const [motionOpen, setMotionOpen] = useState(false)
  const [motionHintOn, setMotionHintOn] = useState(true)
  const [pendingBrief, setPendingBrief] = useState<string | null>(null)
  const [placement, setPlacementState] = useState<Placement | null>(null)
  const [activeConceptId, setActiveConceptId] = useState<string | null>(null)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [savedPulse, setSavedPulse] = useState(false)
  const live = useRef(false)
  const gen = useRef(0)
  const refineGen = useRef(0)
  const editorRef = useRef(editor)
  const routeRef = useRef(route)
  const activeRef = useRef(activeId)
  const reduceRef = useRef(reduceMotion)
  const selectedRef = useRef(selected)
  editorRef.current = editor
  routeRef.current = route
  activeRef.current = activeId
  reduceRef.current = reduceMotion
  selectedRef.current = selected

  const activeProject = projects.find((p) => p.id === activeId) ?? null

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('gemini-theme', theme)
  }, [theme])

  useEffect(() => {
    document.documentElement.toggleAttribute('data-reduce', reduceMotion)
    localStorage.setItem('gemini-reduce', reduceMotion ? '1' : '0')
  }, [reduceMotion])

  useEffect(() => {
    const titles: Record<Route, string> = {
      home: 'Gemini',
      search: 'Search chats',
      brief: 'Daily brief',
      images: 'Images',
      videos: 'Motion',
      library: 'Library',
      notebooks: 'Notebooks',
      results: activeProject?.title ?? 'Logo concepts',
    }
    document.title = editor ? `${editor.present.name} · Gemini` : titles[route]
  }, [route, editor, activeProject])

  const presentKey = editor ? JSON.stringify(editor.present) : ''
  useEffect(() => {
    const current = editorRef.current
    if (!current) return
    setProjects((ps) =>
      ps.map((p) =>
        p.id === current.projectId
          ? {
              ...p,
              concepts: p.concepts.map((c) => (c.id === current.present.id ? current.present : c)),
            }
          : p,
      ),
    )
  }, [presentKey])

  useEffect(() => {
    if (!playingId) return
    const t = window.setTimeout(
      () => setPlayingId(null),
      reduceMotion ? 180 : motionMs(playSpec.motion, playSpec.strength),
    )
    return () => window.clearTimeout(t)
  }, [playingId, playKey, reduceMotion, playSpec])

  function notify(message: string, tone: Toast['tone'] = 'info') {
    const id = uid('toast')
    setToasts((list) => [...list, { id, message, tone }])
    window.setTimeout(() => setToasts((list) => list.filter((t) => t.id !== id)), 3400)
  }

  function setTheme(t: Theme) {
    setThemeState(t)
  }

  function setModel(m: ModelId) {
    setModelState(m)
    const label = m === 'flash-lite' ? 'Flash-Lite' : m === 'flash' ? 'Flash' : 'Pro'
    notify(`Model set to ${label}`)
  }

  function findConcept(id: string) {
    if (editorRef.current?.present.id === id) return editorRef.current.present
    for (const project of projects) {
      const concept = project.concepts.find((item) => item.id === id)
      if (concept) return concept
    }
    return null
  }

  function remembered(concept: Concept) {
    return (
      memory[concept.id] ?? {
        motion: startingMotion(concept),
        strength: 'natural' as const,
        past: [],
      }
    )
  }

  function motionOf(concept: Concept) {
    return remembered(concept).motion
  }

  function strengthOf(concept: Concept) {
    return remembered(concept).strength
  }

  function motionStory(concept: Concept, prompt: string) {
    const brief = briefLabel(prompt)
    const saved = memory[concept.id]
    const untouched =
      !saved ||
      (saved.past.length === 0 && saved.strength === 'natural' && saved.motion === startingMotion(concept))
    if (untouched) return motionStartNote(concept.name, brief, startingMotion(concept))
    return motionChangeNote({
      name: concept.name,
      brief,
      motion: saved.motion,
      strength: saved.strength,
      previous: saved.past[saved.past.length - 1]?.motion,
    })
  }

  function remember(
    conceptId: string,
    next: { motion: MotionId; strength: MotionStrength; past: { motion: MotionId; strength: MotionStrength }[] },
  ) {
    setMemory((current) => ({ ...current, [conceptId]: next }))
    setActiveConceptId(conceptId)
    setMotionOpen(true)
    setShowCode(false)
    setPlaySpec({ motion: next.motion, strength: next.strength })
    setPlayingId(conceptId)
    setPlayKey((key) => key + 1)
  }

  function finishGeneration(prompt: string, updateId: string | null) {
    if (!navigator.onLine || /\berror\b/i.test(prompt)) {
      setPhase('error')
      return
    }
    const concepts = buildConcepts(prompt)
    if (updateId) {
      setProjects((ps) =>
        ps.map((p) =>
          p.id === updateId ? { ...p, prompt, title: titleFromPrompt(prompt), concepts } : p,
        ),
      )
      setActiveId(updateId)
    } else {
      const project: Project = {
        id: uid('p'),
        title: titleFromPrompt(prompt),
        prompt,
        concepts,
      }
      setProjects((ps) => [project, ...ps])
      setActiveId(project.id)
    }
    setPlacementState(null)
    setCompare(false)
    setCompareIds([])
    setActiveConceptId(null)
    setPendingBrief(null)
    setPhase('ready')
  }

  function beginGeneration(prompt: string, updateId: string | null) {
    setPromptError('')
    setPendingBrief(null)
    setComposer(prompt)
    setMode('chat')
    setEditor(null)
    setRoute('results')
    setPhase('loading')
    const id = ++gen.current
    window.setTimeout(
      () => {
        if (gen.current !== id) return
        finishGeneration(prompt, updateId)
      },
      reduceRef.current ? 160 : 1250,
    )
  }

  function submitPrompt(text?: string) {
    const prompt = (text ?? composer).trim()
    if (!prompt) {
      setPromptError('Add a short description to begin.')
      return
    }
    if (prompt.length < 3) {
      setPromptError('Add a little more detail.')
      return
    }
    const projectId = routeRef.current === 'results' ? activeRef.current : null
    const project = projectId ? projects.find((item) => item.id === projectId) : null
    if (project && prompt === project.prompt.trim()) {
      setPendingBrief(null)
      setPromptError('This brief is already in place. Open a mark to keep refining, or choose New directions.')
      return
    }
    if (project) {
      setComposer(prompt)
      setPromptError('')
      setPendingBrief(prompt)
      return
    }
    beginGeneration(prompt, null)
  }

  function keepBrief() {
    const next = pendingBrief
    const projectId = activeRef.current
    if (!next || !projectId) return
    setProjects((list) =>
      list.map((item) => (item.id === projectId ? { ...item, prompt: next, title: titleFromPrompt(next) } : item)),
    )
    setComposer(next)
    setPendingBrief(null)
    notify('Brief updated. Your marks stay as they are.')
  }

  function newDirections() {
    const prompt = (pendingBrief ?? composer).trim()
    if (!prompt) return
    beginGeneration(prompt, routeRef.current === 'results' ? activeRef.current : null)
  }

  function retry() {
    beginGeneration(composer, routeRef.current === 'results' ? activeRef.current : null)
  }

  function openProject(id: string) {
    const project = projects.find((p) => p.id === id)
    if (!project) return
    setActiveId(id)
    setComposer(project.prompt)
    setMode('chat')
    setRoute('results')
    setPhase('ready')
    setEditor(null)
    setPlacementState(null)
    setCompare(false)
    setCompareIds([])
    setPromptError('')
    setPendingBrief(null)
    setActiveConceptId(null)
  }

  function newChat() {
    gen.current += 1
    setMode('chat')
    setRoute('home')
    setPhase('idle')
    setComposer('')
    setPromptError('')
    setEditor(null)
    setActiveId(null)
    setActiveConceptId(null)
    setPendingBrief(null)
    setSettingsOpen(false)
  }

  function openConcept(id: string) {
    const owned = projects.find((p) => p.id === activeId && p.concepts.some((c) => c.id === id))
    const project = owned ?? projects.find((p) => p.concepts.some((c) => c.id === id))
    const concept = project?.concepts.find((c) => c.id === id)
    if (!project || !concept) return
    if (project.id !== activeId) {
      setActiveId(project.id)
      setComposer(project.prompt)
    }
    setRoute('results')
    const present = clone(concept)
    setEditor({ projectId: project.id, past: [], present, future: [], dirty: false })
    setTool('select')
    setSelected(true)
    setShowGrid(false)
    setShowCrop(true)
    setShowCode(false)
    setPromptOpen(false)
    setRefineText('')
    setRefineError('')
    setClarify(null)
    setVerifier(null)
    setHint(makeHint(present))
    setAccelerator(recommendFont(present))
    setActiveConceptId(id)
    setMotionOpen(false)
    setMotionHintOn(true)
    live.current = false
  }

  function closeEditor() {
    setEditor(null)
    setVerifier(null)
    setShowCode(false)
    setRoute('results')
    setPhase('ready')
  }

  function updateConcept(patch: Partial<Concept>, mode: 'commit' | 'live' = 'commit') {
    setVerifier(null)
    setHint(null)
    if (patch.fg || patch.fontId) {
      setAccelerator((current) => {
        if (!current) return current
        if (patch.fg && current.type === 'color') return null
        if (patch.fontId && current.type === 'font') return null
        return current
      })
    }
    setEditor((e) => {
      if (!e) return e
      const changed = (Object.keys(patch) as (keyof Concept)[]).some((k) => patch[k] !== e.present[k])
      if (!changed) return e
      const next = { ...e.present, ...patch }
      if (mode === 'live') {
        if (!live.current) {
          live.current = true
          return { ...e, past: [...e.past, e.present], present: next, future: [], dirty: true }
        }
        return { ...e, present: next, dirty: true }
      }
      live.current = false
      return { ...e, past: [...e.past, e.present], present: next, future: [], dirty: true }
    })
  }

  function applyAi(patch: Partial<Concept>, summary: string) {
    const before = editorRef.current?.present
    if (!before) return
    const next = { ...before, ...patch }
    setVerifier({ summary, before: clone(before), after: clone(next) })
    setEditor((e) =>
      e ? { ...e, past: [...e.past, e.present], present: next, future: [], dirty: true } : e,
    )
    live.current = false
  }

  function endLive() {
    live.current = false
  }

  function undo() {
    setVerifier(null)
    setEditor((e) => {
      if (!e || e.past.length === 0) return e
      const past = [...e.past]
      const prev = past.pop()!
      return { ...e, past, present: prev, future: [e.present, ...e.future], dirty: true }
    })
  }

  function redo() {
    setVerifier(null)
    setEditor((e) => {
      if (!e || e.future.length === 0) return e
      const [next, ...future] = e.future
      return { ...e, past: [...e.past, e.present], present: next, future, dirty: true }
    })
  }

  function save() {
    const current = editorRef.current
    if (!current) return
    const project = projects.find((p) => p.id === current.projectId)
    addToLibrary(current.present, `${project?.title ?? 'Logo'} — ${current.present.name}`)
    setEditor((e) => (e ? { ...e, dirty: false } : e))
    setSavedPulse(true)
    window.setTimeout(() => setSavedPulse(false), 1600)
    notify('Saved to library', 'success')
  }

  function acceptHint(index: number) {
    const option = hint?.options[index]
    setHint(null)
    if (!option || Object.keys(option.patch).length === 0) return
    applyAi(option.patch, option.summary)
  }

  function dismissAccelerator() {
    if (!accelerator || !editor) {
      setAccelerator(null)
      return
    }
    if (accelerator.type === 'font') {
      const color = recommendColor(editor.present)
      setAccelerator(color)
      return
    }
    setAccelerator(null)
  }

  function applyAccelerator() {
    if (!accelerator || !editor) return
    if (accelerator.type === 'font') {
      applyAi(
        { fontId: accelerator.fontId },
        `Updated the typeface to ${accelerator.title}. ${accelerator.body}`,
      )
      const color = recommendColor({ ...editor.present, fontId: accelerator.fontId })
      setAccelerator(color)
      return
    }
    applyAi({ fg: accelerator.fg }, 'Updated the ink to warm brown. It stays readable on ivory.')
    setAccelerator(null)
  }

  function keepVerifier() {
    setVerifier(null)
  }

  function undoVerifier() {
    undo()
  }

  function refine(text?: string) {
    const value = (text ?? refineText).trim()
    if (!value) {
      setRefineError('Describe the change you want.')
      return
    }
    if (/\berror\b/i.test(value)) {
      setRefineError('That change didn’t apply. Try again.')
      setClarify(null)
      return
    }
    const id = ++refineGen.current
    setRefining(true)
    setRefineError('')
    setClarify(null)
    window.setTimeout(
      () => {
        if (refineGen.current !== id) return
        const present = editorRef.current?.present
        setRefining(false)
        if (!present) return
        const asked = motionFromText(value)
        if (asked === 'choose') {
          const current = remembered(present)
          setMotionOpen(true)
          setShowCode(false)
          setClarify(motionFollowUp(current.motion, present))
          return
        }
        if (asked === 'keep') {
          setMotionOpen(true)
          setShowCode(false)
          play(present.id)
          setRefineText('')
          setClarify(null)
          return
        }
        if (asked === 'softer' || asked === 'present') {
          setMotionStrength(asked === 'softer' ? 'soft' : 'present', present.id)
          setRefineText('')
          setClarify(null)
          return
        }
        if (asked) {
          const result = interpret(present, value)
          if (!('clarify' in result) && Object.keys(result.patch).length > 0) {
            applyAi(result.patch, result.summary)
          }
          chooseMotion(asked, present.id)
          setRefineText('')
          setClarify(null)
          return
        }
        const result = interpret(present, value)
        if ('clarify' in result) {
          setClarify(result)
          return
        }
        applyAi(result.patch, result.summary)
        setRefineText('')
      },
      reduceRef.current ? 80 : 780,
    )
  }

  function addToLibrary(concept: Concept, title: string) {
    setLibrary((list) => [{ id: uid('save'), title, concept: clone(concept), savedAt: Date.now() }, ...list])
  }

  function addNotebook() {
    const nb: Notebook = { id: uid('nb'), title: 'Untitled notebook', body: '' }
    setNotebooks((list) => [nb, ...list])
    setActiveNotebook(nb.id)
    setRoute('notebooks')
    setMode('chat')
    notify('Notebook created', 'success')
  }

  function updateNotebook(id: string, patch: Partial<Notebook>) {
    setNotebooks((list) => list.map((n) => (n.id === id ? { ...n, ...patch } : n)))
  }

  function toggleCompare(id: string) {
    setCompareIds((ids) => {
      if (ids.includes(id)) return ids.filter((x) => x !== id)
      if (ids.length >= 2) return [ids[1], id]
      return [...ids, id]
    })
  }

  function play(id: string, spec?: { motion: MotionId; strength: MotionStrength }) {
    const concept = findConcept(id)
    const next = spec ?? (concept ? { motion: motionOf(concept), strength: strengthOf(concept) } : playSpec)
    setPlaySpec(next)
    setPlayingId(id)
    setPlayKey((k) => k + 1)
  }

  function toggleMotion() {
    setShowCode(false)
    const next = !motionOpen
    setMotionOpen(next)
    const id = editorRef.current?.present.id
    if (!id) return
    if (next) play(id)
    else setPlayingId(null)
  }

  function chooseMotion(id: MotionId, conceptId?: string) {
    const target = conceptId ?? editorRef.current?.present.id
    if (!target) return
    const concept = findConcept(target)
    if (!concept) return
    const current = remembered(concept)
    if (current.motion === id) {
      setMotionOpen(true)
      setShowCode(false)
      setActiveConceptId(target)
      play(target, { motion: current.motion, strength: current.strength })
      return
    }
    remember(target, {
      motion: id,
      strength: 'natural',
      past: [...current.past, { motion: current.motion, strength: current.strength }],
    })
  }

  function setMotionStrength(strength: MotionStrength, conceptId?: string) {
    const target = conceptId ?? editorRef.current?.present.id
    if (!target) return
    const concept = findConcept(target)
    if (!concept) return
    const current = remembered(concept)
    if (current.strength === strength) {
      setMotionOpen(true)
      play(target, { motion: current.motion, strength })
      return
    }
    remember(target, {
      motion: current.motion,
      strength,
      past: [...current.past, { motion: current.motion, strength: current.strength }],
    })
  }

  function undoMotion(conceptId?: string) {
    const target = conceptId ?? editorRef.current?.present.id
    if (!target) return
    const concept = findConcept(target)
    if (!concept) return
    const current = remembered(concept)
    if (current.past.length === 0) return
    const past = [...current.past]
    const prev = past.pop()!
    remember(target, { motion: prev.motion, strength: prev.strength, past })
  }

  function focusMark(conceptId: string) {
    setActiveConceptId(conceptId)
    play(conceptId)
  }

  function setPlacement(p: Placement) {
    setPlacementState(p)
    const patch = placementPatch(p)
    if (!patch || !activeId) return
    setProjects((ps) =>
      ps.map((project) =>
        project.id === activeId
          ? { ...project, concepts: project.concepts.map((c) => ({ ...c, ...patch })) }
          : project,
      ),
    )
    notify(`Tuned for a ${p.toLowerCase()}`)
  }

  const actions = useRef({ undo, redo, save, updateConcept, play })
  actions.current = { undo, redo, save, updateConcept, play }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement
      const typing = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable
      const api = actions.current
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z' && editorRef.current) {
        e.preventDefault()
        if (e.shiftKey) api.redo()
        else api.undo()
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's' && editorRef.current) {
        e.preventDefault()
        api.save()
      }
      const interactive = target.tagName === 'BUTTON' || target.tagName === 'A' || target.tagName === 'SUMMARY'
      if (!typing && !interactive && e.key === ' ' && editorRef.current) {
        e.preventDefault()
        setShowCode(false)
        setMotionOpen(true)
        api.play(editorRef.current.present.id)
      }
      if (!typing && selectedRef.current && editorRef.current && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
        const current = editorRef.current
        if (!current) return
        e.preventDefault()
        const size = current.present.size + (e.key === 'ArrowUp' ? 2 : -2)
        api.updateConcept({ size: Math.min(160, Math.max(16, size)) })
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const value: Store = {
    theme,
    setTheme,
    toggleTheme: () => setThemeState((t) => (t === 'dark' ? 'light' : 'dark')),
    reduceMotion,
    setReduceMotion: setReduceState,
    mode,
    setMode,
    route,
    setRoute,
    collapsed,
    setCollapsed,
    model,
    setModel,
    projects,
    activeId,
    activeProject,
    phase,
    promptError,
    composer,
    setComposer: (s: string) => {
      setComposer(s)
      setPromptError('')
      setPendingBrief(null)
    },
    submitPrompt,
    retry,
    openProject,
    newChat,
    search,
    setSearch,
    editor,
    openConcept,
    closeEditor,
    updateConcept,
    endLive,
    undo,
    redo,
    canUndo: !!editor && editor.past.length > 0,
    canRedo: !!editor && editor.future.length > 0,
    save,
    savedPulse,
    tool,
    setTool,
    selected,
    setSelected,
    showGrid,
    setShowGrid,
    showCrop,
    setShowCrop,
    showCode,
    setShowCode,
    promptOpen,
    setPromptOpen,
    hint,
    acceptHint,
    dismissHint: () => setHint(null),
    accelerator,
    dismissAccelerator,
    applyAccelerator,
    verifier,
    keepVerifier,
    undoVerifier,
    refineText,
    setRefineText,
    refine,
    refining,
    refineError,
    clarify,
    toasts,
    notify,
    dismissToast: (id) => setToasts((list) => list.filter((t) => t.id !== id)),
    library,
    addToLibrary,
    notebooks,
    activeNotebook,
    setActiveNotebook,
    addNotebook,
    updateNotebook,
    compare,
    setCompare: (v) => {
      setCompare(v)
      if (!v) setCompareIds([])
    },
    compareIds,
    toggleCompare,
    playingId,
    playKey,
    play,
    motionOf,
    strengthOf,
    motionStory,
    canUndoMotion: (conceptId: string) => (memory[conceptId]?.past.length ?? 0) > 0,
    motionOpen,
    setMotionOpen,
    toggleMotion,
    chooseMotion,
    setMotionStrength,
    undoMotion,
    focusMark,
    motionHintOn,
    dismissMotionHint: () => setMotionHintOn(false),
    pendingBrief,
    keepBrief,
    newDirections,
    placement,
    setPlacement,
    activeConceptId,
    settingsOpen,
    setSettingsOpen,
  }

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
