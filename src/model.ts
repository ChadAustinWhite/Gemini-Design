export type Theme = 'light' | 'dark'
export type Mode = 'chat' | 'spark'
export type Route =
  | 'home'
  | 'search'
  | 'brief'
  | 'images'
  | 'videos'
  | 'library'
  | 'notebooks'
  | 'results'
export type Shape = 'circle' | 'square' | 'hexagon' | 'shield' | 'diamond' | 'arch' | 'oval'
export type Style = 'minimal' | 'bold' | 'outlined' | 'filled' | 'stacked' | 'badge' | 'monogram'
export type Kind = 'wordmark' | 'symbol' | 'monogram' | 'badge'
export type Voice = 'bass' | 'rand' | 'geismar' | 'vignelli'
export type Tool =
  | 'select'
  | 'initials'
  | 'square'
  | 'pen'
  | 'text'
  | 'circle'
  | 'grid'
  | 'crop'
  | 'diamond'
  | 'code'
export type ModelId = 'flash-lite' | 'flash' | 'pro'
export type Phase = 'idle' | 'loading' | 'ready' | 'error'
export type MotionId = 'draw' | 'settle' | 'breathe' | 'turn' | 'rise' | 'reveal'
export type MotionStrength = 'soft' | 'natural' | 'present'
export type EasingId = 'linear' | 'ease-out' | 'ease' | 'smooth'

export interface MotionSnap {
  motion: MotionId
  strength: MotionStrength
  duration: number
  easing: EasingId
  movement: number
}

export interface Concept {
  id: string
  name: string
  kind: Kind
  letters: string
  word: string
  shape: Shape
  style: Style
  fontId: string
  size: number
  fg: string
  bg: string
  tracking: number
  showInitials: boolean
  voice: Voice
}

export interface Project {
  id: string
  title: string
  prompt: string
  concepts: Concept[]
}

export interface SavedMark {
  id: string
  title: string
  concept: Concept
  savedAt: number
}

export interface Notebook {
  id: string
  title: string
  body: string
}

export interface FontFace {
  id: string
  name: string
  tag: string
  stack: string
  note: string
  ai?: boolean
  more?: boolean
}

export interface HintOption {
  label: string
  patch: Partial<Concept>
  summary: string
}

export interface Hint {
  message: string
  options: HintOption[]
}

export const FONTS: FontFace[] = [
  {
    id: 'helvetica',
    name: 'Helvetica Neue',
    tag: 'Best match',
    stack: '"Helvetica Neue", Helvetica, Arial, sans-serif',
    note: 'Geometric neutrality mirrors the mark’s clean silhouette.',
    ai: true,
  },
  {
    id: 'avenir',
    name: 'Avenir',
    tag: 'Softness',
    stack: '"Avenir Next", Avenir, "Nunito Sans", sans-serif',
    note: 'Softer curves feel welcoming on a cup.',
  },
  {
    id: 'futura',
    name: 'Futura',
    tag: 'Best match',
    stack: 'Futura, "Century Gothic", "Avenir Next", sans-serif',
    note: 'Even strokes keep the badge geometric.',
    ai: true,
  },
  {
    id: 'bodoni',
    name: 'Bodoni',
    tag: 'High contrast',
    stack: '"Bodoni 72", Didot, "Times New Roman", serif',
    note: 'High contrast adds a little ceremony.',
  },
  {
    id: 'gill',
    name: 'Gill Sans',
    tag: 'Humanist',
    stack: '"Gill Sans", "Gill Sans MT", Calibri, sans-serif',
    note: 'Humanist forms feel slightly handmade.',
  },
  {
    id: 'optima',
    name: 'Optima',
    tag: 'Transitional',
    stack: 'Optima, Candara, "Avenir Next", sans-serif',
    note: 'Flared terminals sit between sans and serif.',
  },
  {
    id: 'rockwell',
    name: 'Rockwell',
    tag: 'Slab weight',
    stack: 'Rockwell, "Rockwell Nova", "American Typewriter", serif',
    note: 'Slab serifs hold up on a storefront.',
  },
  {
    id: 'garamond',
    name: 'Garamond',
    tag: 'Editorial',
    stack: 'Garamond, "Palatino Linotype", Palatino, serif',
    note: 'Old-style serifs feel quiet and literary.',
    more: true,
  },
  {
    id: 'didot',
    name: 'Didot',
    tag: 'Display',
    stack: 'Didot, "Bodoni 72", "Times New Roman", serif',
    note: 'A display serif for a more formal mark.',
    more: true,
  },
  {
    id: 'inter',
    name: 'Inter',
    tag: 'Neutral',
    stack: 'Inter, "Helvetica Neue", sans-serif',
    note: 'A neutral grotesque for interface-scale use.',
    more: true,
  },
]

export const SHAPES: { id: Shape; label: string }[] = [
  { id: 'circle', label: 'Circle' },
  { id: 'square', label: 'Square' },
  { id: 'hexagon', label: 'Hexagon' },
  { id: 'shield', label: 'Shield' },
  { id: 'diamond', label: 'Diamond' },
  { id: 'arch', label: 'Arch' },
  { id: 'oval', label: 'Oval' },
]

export const STYLES: { id: Style; label: string }[] = [
  { id: 'minimal', label: 'Minimal' },
  { id: 'bold', label: 'Bold' },
  { id: 'outlined', label: 'Outlined' },
  { id: 'filled', label: 'Filled' },
  { id: 'stacked', label: 'Stacked' },
  { id: 'badge', label: 'Badge' },
  { id: 'monogram', label: 'Monogram' },
]

export const MODELS: { id: ModelId; label: string; note: string }[] = [
  { id: 'flash-lite', label: 'Flash-Lite', note: 'Quick drafts' },
  { id: 'flash', label: 'Flash', note: 'Balanced' },
  { id: 'pro', label: 'Pro', note: 'Finer detail' },
]

export const INK = [
  { hex: '#1c1b19', name: 'Ink' },
  { hex: '#4a2e24', name: 'Coffee' },
  { hex: '#1e3a34', name: 'Deep green' },
  { hex: '#1a365d', name: 'Navy' },
  { hex: '#6b3a2a', name: 'Clay' },
  { hex: '#3d3428', name: 'Roast' },
]

export const GROUNDS = [
  { hex: '#f4f1ea', name: 'Ivory' },
  { hex: '#ffffff', name: 'White' },
  { hex: '#1c1b19', name: 'Ink' },
  { hex: '#efe2d2', name: 'Cream' },
  { hex: '#e4ebe6', name: 'Mist' },
  { hex: '#e7e1d6', name: 'Stone' },
]

export const PLACEMENTS = ['Cup sleeve', 'Sign', 'Favicon'] as const
export type Placement = (typeof PLACEMENTS)[number]

export function fontById(id: string) {
  return FONTS.find((f) => f.id === id) ?? FONTS[0]
}

export function shapeLabel(id: Shape) {
  return SHAPES.find((s) => s.id === id)?.label ?? id
}

export function styleLabel(id: Style) {
  return STYLES.find((s) => s.id === id)?.label ?? id
}

export function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`
}

export function clone<T>(value: T): T {
  return structuredClone(value)
}

export function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}

function channel(hex: string, i: number) {
  const h = hex.replace('#', '').padEnd(6, '0')
  const v = parseInt(h.slice(i, i + 2), 16) / 255
  return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
}

export function luminance(hex: string) {
  const r = channel(hex, 0)
  const g = channel(hex, 2)
  const b = channel(hex, 4)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export function isLight(hex: string) {
  return luminance(hex) > 0.45
}

export function contrastRatio(a: string, b: string) {
  const l1 = luminance(a)
  const l2 = luminance(b)
  const hi = Math.max(l1, l2)
  const lo = Math.min(l1, l2)
  return (hi + 0.05) / (lo + 0.05)
}

function concept(partial: Omit<Concept, 'tracking' | 'showInitials' | 'fg' | 'bg' | 'size' | 'voice'> & Partial<Concept>): Concept {
  return {
    tracking: 0,
    showInitials: partial.kind !== 'symbol',
    fg: '#1c1b19',
    bg: '#f4f1ea',
    size: 80,
    voice: 'bass',
    ...partial,
  }
}

export function voiceLabel(voice: Voice) {
  if (voice === 'bass') return 'Saul Bass'
  if (voice === 'rand') return 'Paul Rand'
  if (voice === 'geismar') return 'Chermayeff & Geismar'
  return 'Massimo Vignelli'
}

export function buildConcepts(prompt: string): Concept[] {
  const coffee = /coffee|arlo|cafe|roaster|franky/.test(prompt.toLowerCase())
  const words = prompt
    .replace(/[^a-zA-Z\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !/^(the|and|for|with|from|your|logo|mask|brand|design)$/i.test(w))
  const a = (words[0]?.[0] ?? 'A').toUpperCase()
  const b = (words[1]?.[0] ?? (coffee ? 'K' : 'M')).toUpperCase()
  const letter = coffee ? 'A' : a
  const mono = coffee ? 'AK' : `${a}${b}`
  const word = coffee ? 'ARLO' : (words[0] ?? 'MARK').toUpperCase().slice(0, 10)
  const stamp = uid('c')
  return [
    concept({
      id: `${stamp}-bass`,
      name: 'Bass cut',
      kind: 'symbol',
      letters: letter,
      word,
      shape: 'circle',
      style: 'bold',
      fontId: 'helvetica',
      voice: 'bass',
      showInitials: true,
    }),
    concept({
      id: `${stamp}-rand`,
      name: 'Rand picture',
      kind: 'wordmark',
      letters: letter,
      word,
      shape: 'circle',
      style: 'bold',
      fontId: 'futura',
      voice: 'rand',
    }),
    concept({
      id: `${stamp}-geismar`,
      name: 'Geismar lock',
      kind: 'monogram',
      letters: mono,
      word,
      shape: 'square',
      style: 'filled',
      fontId: 'futura',
      voice: 'geismar',
    }),
    concept({
      id: `${stamp}-vignelli`,
      name: 'Vignelli grid',
      kind: 'badge',
      letters: letter,
      word,
      shape: 'square',
      style: 'minimal',
      fontId: 'helvetica',
      voice: 'vignelli',
      tracking: 1,
    }),
  ]
}

export function titleFromPrompt(prompt: string) {
  if (/coffee/i.test(prompt)) return 'Coffee Shop Logo Design'
  const clean = prompt.replace(/\s+/g, ' ').trim()
  const short = clean.split(' ').slice(0, 6).join(' ')
  return short.charAt(0).toUpperCase() + short.slice(1)
}

export function makeHint(c: Concept): Hint {
  if (c.voice === 'bass') {
    return {
      message: 'This cut-paper silhouette is the idea. Keep it, or tilt the cut?',
      options: [
        { label: 'Keep the cut', patch: {}, summary: '' },
        { label: 'Tilt the cut', patch: { shape: 'diamond' }, summary: 'Tilted the cut-paper mark.' },
      ],
    }
  }
  if (c.voice === 'rand') {
    return {
      message: 'The letter is also the picture. Keep it, or set the picture in a square?',
      options: [
        { label: 'Keep the picture', patch: {}, summary: '' },
        { label: 'Use a square', patch: { shape: 'square' }, summary: 'Set the picture letter in a square.' },
      ],
    }
  }
  if (c.voice === 'geismar') {
    return {
      message: 'Two shapes lock into one mark. Keep the lock, or round it?',
      options: [
        { label: 'Keep the lock', patch: {}, summary: '' },
        { label: 'Round the lock', patch: { shape: 'circle' }, summary: 'Rounded the interlocking mark.' },
      ],
    }
  }
  if (c.voice === 'vignelli') {
    return {
      message: 'The grid is holding the word. Keep it, or loosen it into a circle?',
      options: [
        { label: 'Keep the grid', patch: {}, summary: '' },
        { label: 'Use a circle', patch: { shape: 'circle' }, summary: 'Set the grid mark in a circle.' },
      ],
    }
  }
  if (c.shape === 'circle') {
    return {
      message: 'This circle mask fits a cup sleeve. Keep it, or try a square tile?',
      options: [
        { label: 'Keep circle', patch: {}, summary: '' },
        { label: 'Try a square', patch: { shape: 'square' }, summary: 'Changed the mask to a square.' },
      ],
    }
  }
  if (c.shape === 'diamond') {
    return {
      message: 'The diamond stays legible when small. Try it inside a circle?',
      options: [
        { label: 'Keep diamond', patch: {}, summary: '' },
        { label: 'Try a circle', patch: { shape: 'circle' }, summary: 'Changed the mask to a circle.' },
      ],
    }
  }
  return {
    message: 'Leave this as a general mark, or soften it into a circle?',
    options: [
      { label: 'Keep as is', patch: {}, summary: '' },
      {
        label: 'Use a circle',
        patch: { shape: 'circle', style: 'minimal' },
        summary: 'Softened the mark into a circle.',
      },
    ],
  }
}

export function recommendFont(c: Concept) {
  const pick = c.fontId !== 'helvetica' ? 'helvetica' : 'futura'
  const font = fontById(pick)
  return { type: 'font' as const, fontId: pick, title: font.name, body: font.note, tag: font.tag }
}

export interface MotionTreatment {
  id: MotionId
  label: string
  note: string
}

export const MOTIONS: MotionTreatment[] = [
  { id: 'draw', label: 'Draw on', note: 'The outline traces itself, then the letters arrive.' },
  { id: 'settle', label: 'Settle', note: 'The mark eases into place, quiet enough for a homepage.' },
  { id: 'breathe', label: 'Breathe', note: 'A slow pulse for when the mark is sitting idle.' },
  { id: 'turn', label: 'Turn', note: 'A short turn that lands on the silhouette.' },
  { id: 'rise', label: 'Rise', note: 'The mark lifts into place, as if set down on a cup.' },
  { id: 'reveal', label: 'Reveal', note: 'A soft wipe uncovers the mark from the left.' },
]

export const MOTION_MS: Record<MotionId, number> = {
  draw: 1300,
  settle: 860,
  breathe: 2200,
  turn: 1000,
  rise: 900,
  reveal: 1000,
}

export const STRENGTHS: { id: MotionStrength; label: string }[] = [
  { id: 'soft', label: 'Softer' },
  { id: 'natural', label: 'As is' },
  { id: 'present', label: 'More present' },
]

const STRENGTH_SCALE: Record<MotionStrength, number> = { soft: 1.35, natural: 1, present: 0.78 }

export function motionMs(id: MotionId, strength: MotionStrength) {
  return Math.round(MOTION_MS[id] * STRENGTH_SCALE[strength])
}

export const EASINGS: { id: EasingId; label: string; css: string }[] = [
  { id: 'linear', label: 'Linear', css: 'linear' },
  { id: 'ease-out', label: 'Ease out', css: 'cubic-bezier(0.2, 0.7, 0.2, 1)' },
  { id: 'ease', label: 'Ease', css: 'ease' },
  { id: 'smooth', label: 'Smooth', css: 'cubic-bezier(0.45, 0.05, 0.55, 0.95)' },
]

export function easingById(id: EasingId) {
  return EASINGS.find((item) => item.id === id) ?? EASINGS[1]
}

export function defaultSnap(motion: MotionId): MotionSnap {
  return { motion, strength: 'natural', duration: MOTION_MS[motion], easing: 'ease-out', movement: 50 }
}

export function clampTune(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}

export function motionStyle(snap: Pick<MotionSnap, 'duration' | 'easing' | 'movement'>) {
  const t = clampTune(snap.movement, 0, 100) / 100
  const reveal = Math.round(24 + t * 76)
  return {
    '--motion-ms': `${snap.duration}ms`,
    '--motion-ease': easingById(snap.easing).css,
    '--settle-from': (0.985 - t * 0.17).toFixed(3),
    '--rise-from': `${(2 + t * 22).toFixed(1)}px`,
    '--turn-from': `${-(4 + t * 26).toFixed(1)}deg`,
    '--breathe-scale': (1.012 + t * 0.09).toFixed(3),
    '--reveal-inset': `${reveal}%`,
  } as Record<string, string>
}

export function motionChanges(before: MotionSnap, after: MotionSnap) {
  const parts: string[] = []
  if (before.motion !== after.motion) parts.push(`${motionById(before.motion).label} → ${motionById(after.motion).label}`)
  if (before.duration !== after.duration) {
    parts.push(`Duration ${(before.duration / 1000).toFixed(1)}s → ${(after.duration / 1000).toFixed(1)}s`)
  }
  if (before.easing !== after.easing) parts.push(`Easing ${easingById(before.easing).label} → ${easingById(after.easing).label}`)
  if (before.movement !== after.movement) parts.push(`Movement ${before.movement} → ${after.movement}`)
  return parts.join(' · ')
}

export function motionAlternatives(current: MotionId) {
  const index = MOTIONS.findIndex((item) => item.id === current)
  const rest = [...MOTIONS.slice(index + 1), ...MOTIONS.slice(0, index)].filter((item) => item.id !== current)
  return rest.slice(0, 3)
}

export function tuneIntent(raw: string): { durationScale?: number; easing?: EasingId; movementDelta?: number } | null {
  const t = raw.toLowerCase()
  const intent: { durationScale?: number; easing?: EasingId; movementDelta?: number } = {}
  if (/\bshorter\b|\bquicker\b|\bfaster\b/.test(t)) intent.durationScale = 0.75
  if (/\blonger\b|\bslower\b/.test(t)) intent.durationScale = 1.35
  if (/\bsmooth/.test(t) || /ease in out/.test(t)) intent.easing = 'smooth'
  else if (/ease out/.test(t) || /\bsnappier\b/.test(t)) intent.easing = 'ease-out'
  else if (/\blinear\b/.test(t)) intent.easing = 'linear'
  else if (/\bease\b/.test(t)) intent.easing = 'ease'
  if (/\bmore movement\b|\bfarther\b|\bbigger movement\b/.test(t)) intent.movementDelta = 24
  if (/\bless movement\b|\bsmaller movement\b/.test(t)) intent.movementDelta = -24
  if (intent.durationScale == null && !intent.easing && intent.movementDelta == null) return null
  return intent
}

export function briefLabel(prompt: string) {
  const clean = prompt.replace(/\s+/g, ' ').trim()
  if (clean.length <= 52) return clean
  return `${clean.slice(0, 49).trim()}…`
}

export function startingMotion(c: Concept) {
  return suggestMotion(c).id
}

export function motionStartNote(name: string, brief: string, motion: MotionId) {
  return `From “${brief}”. ${name} starts with ${motionById(motion).label}.`
}

export function motionChangeNote(args: {
  name: string
  brief: string
  motion: MotionId
  strength: MotionStrength
  previous?: MotionId
}) {
  const label = motionById(args.motion).label
  if (args.previous && args.previous !== args.motion) {
    const feel = args.strength === 'soft' ? ', a little softer' : args.strength === 'present' ? ', more present' : ''
    return `Still ${args.name}. The brief stays “${args.brief}”. Motion is now ${label}${feel}, after ${motionById(args.previous).label}.`
  }
  if (args.strength === 'soft') return `Still ${args.name}. The brief stays “${args.brief}”. ${label} is softer.`
  if (args.strength === 'present') return `Still ${args.name}. The brief stays “${args.brief}”. ${label} is more present.`
  return `Still ${args.name}. The brief stays “${args.brief}”. Motion is ${label}.`
}

export function motionFollowUp(current: MotionId, concept: Concept) {
  const label = motionById(current).label
  const suggested = suggestMotion(concept)
  const index = MOTIONS.findIndex((item) => item.id === current)
  const alt = suggested.id === current ? MOTIONS[(index + 1) % MOTIONS.length] : suggested
  return {
    message: `${concept.name} already uses ${label}. Adjust that motion, or try ${alt.label} on the same mark.`,
    options: [`Keep ${label}`, 'Make it softer', 'Make it more present', `Try ${alt.label}`],
  }
}

export function motionById(id: MotionId) {
  return MOTIONS.find((m) => m.id === id) ?? MOTIONS[0]
}

export function suggestMotion(c: Concept): MotionTreatment {
  if (c.kind === 'symbol') return motionById('draw')
  if (c.kind === 'monogram' || c.style === 'monogram') return motionById('turn')
  if (c.kind === 'badge' || c.style === 'badge') return motionById('reveal')
  return motionById('settle')
}

export function motionAdvice(c: Concept, current: MotionId) {
  const pick = suggestMotion(c)
  if (pick.id === current) return null
  const text =
    pick.id === 'draw'
      ? 'Drawing the symbol on makes the silhouette easier to follow.'
      : pick.id === 'turn'
        ? 'A short turn gives the letters a moment to land.'
        : pick.id === 'reveal'
          ? 'A wipe reveal suits a badge that should feel printed.'
          : 'Settle keeps a wordmark calm on a homepage or a cup.'
  return { id: pick.id, label: pick.label, text: `${text} ${c.name} stays as it is.` }
}

export function motionFromText(raw: string): MotionId | 'choose' | 'keep' | 'softer' | 'present' | null {
  const t = raw.toLowerCase().trim()
  if (/^keep\b/.test(t)) return 'keep'
  if (/\bsofter\b|\bgentler\b/.test(t)) return 'softer'
  if (/\bmore present\b/.test(t)) return 'present'
  const exact = MOTIONS.find((m) => m.label.toLowerCase() === t || t === `try ${m.label.toLowerCase()}`)
  if (exact) return exact.id
  if (/\bdraw[\s-]?on\b|\bsketch on\b/.test(t)) return 'draw'
  if (/\bbreathe\b|\bpulse\b/.test(t)) return 'breathe'
  if (/\bturn\b|\brotate\b|\bspin\b/.test(t)) return 'turn'
  if (/\brise\b|\blift\b/.test(t)) return 'rise'
  if (/\breveal\b|\bwipe\b/.test(t)) return 'reveal'
  if (/\bsettle\b|\bfade in\b/.test(t)) return 'settle'
  if (/\banimate this\b|\bopen motion\b|\bplayback\b/.test(t) || t === 'animate') return 'choose'
  return null
}

export function recommendColor(c: Concept) {
  if (c.fg.toLowerCase() !== '#1c1b19') return null
  return {
    type: 'color' as const,
    fg: '#4a2e24',
    title: 'Warm brown ink',
    body: 'Coffee brown stays readable on ivory and feels closer to the brand.',
    tag: 'Suggestion',
  }
}

export type Accelerator = ReturnType<typeof recommendFont> | NonNullable<ReturnType<typeof recommendColor>>

export function placementPatch(choice: string): Partial<Concept> | null {
  if (choice === 'Cup sleeve') return { size: 80 }
  if (choice === 'Sign') return { size: 120 }
  if (choice === 'Favicon') return { size: 36 }
  return null
}

function contextualAsk(c: Concept) {
  const alt = c.shape === 'circle' ? 'Use a diamond' : 'Use a circle'
  if (c.style === 'bold' || c.style === 'filled') {
    return {
      clarify: true as const,
      message: `${c.name} is ${c.style}. Quiet the weight, or change the ${c.shape} mask?`,
      options: ['Make it quieter', alt, 'Keep it'],
    }
  }
  return {
    clarify: true as const,
    message: `Keep the ${c.shape} mask, or make ${c.name} bolder?`,
    options: ['Keep it', 'Make it bolder', alt],
  }
}

function isOnlyVague(raw: string) {
  const t = raw.toLowerCase().replace(/[?.!]/g, '').replace(/\s+/g, ' ').trim()
  return /^(please )?(make|change|adjust|tweak|improve|refine)( (it|this|the mark|the logo))?( (better|nicer|different|a bit))?$/.test(t)
    || /^(better|nicer|different|tweak it|improve it|something else|try something)$/.test(t)
}

export function interpret(
  conceptValue: Concept,
  raw: string,
):
  | { patch: Partial<Concept>; summary: string }
  | { clarify: true; message: string; options: string[] }
  | { unclear: true; message: string } {
  const t = raw.toLowerCase()
  const patch: Partial<Concept> = {}
  const bits: string[] = []
  const shapes = [
    ['hexagon', /\bhex/],
    ['shield', /\bshield/],
    ['diamond', /\bdiamond/],
    ['arch', /\barch/],
    ['oval', /\boval/],
    ['circle', /\bcircle|\bround/],
    ['square', /\bsquare|\btile/],
  ] as const
  const shapeHits = shapes.filter(([, pattern]) => pattern.test(t)).map(([name]) => name)
  if (shapeHits.length > 1) {
    return {
      clarify: true,
      message: `Use a ${shapeHits[0]} or a ${shapeHits[1]}?`,
      options: shapeHits.slice(0, 2).map((name) => `Use a ${name}`),
    }
  }
  const inks = [
    ['Warm brown ink', /brown|coffee|warm ink/],
    ['Deep green', /\bgreen/],
    ['Navy ink', /navy|blue ink/],
    ['Black ink', /black ink|dark ink/],
  ] as const
  const inkHits = inks.filter(([, pattern]) => pattern.test(t)).map(([name]) => name)
  if (inkHits.length > 1) {
    return {
      clarify: true,
      message: `Use ${inkHits[0].toLowerCase()} or ${inkHits[1].toLowerCase()}?`,
      options: inkHits.slice(0, 2),
    }
  }

  if (/outline|stroke|line drawing/.test(t)) {
    patch.style = 'outlined'
    bits.push('an outline treatment')
  } else if (/fill/.test(t)) {
    patch.style = 'filled'
    bits.push('a filled mask')
  } else if (/stack/.test(t)) {
    patch.style = 'stacked'
    bits.push('stacked type')
  } else if (/monogram/.test(t)) {
    patch.style = 'monogram'
    patch.showInitials = true
    bits.push('a monogram')
  } else if (/badge/.test(t)) {
    patch.style = 'badge'
    bits.push('a badge')
  } else if (/bold|heavier|thicker/.test(t)) {
    patch.style = 'bold'
    bits.push('a bolder weight')
  } else if (/minimal|quieter|simpler/.test(t)) {
    patch.style = 'minimal'
    bits.push('a minimal treatment')
  }

  if (/hex/.test(t)) {
    patch.shape = 'hexagon'
    bits.push('a hexagon mask')
  } else if (/shield/.test(t)) {
    patch.shape = 'shield'
    bits.push('a shield mask')
  } else if (/diamond/.test(t)) {
    patch.shape = 'diamond'
    bits.push('a diamond mask')
  } else if (/arch/.test(t)) {
    patch.shape = 'arch'
    bits.push('an arch mask')
  } else if (/oval/.test(t)) {
    patch.shape = 'oval'
    bits.push('an oval mask')
  } else if (/circle|round/.test(t)) {
    patch.shape = 'circle'
    bits.push('a circle mask')
  } else if (/square|tile/.test(t)) {
    patch.shape = 'square'
    bits.push('a square mask')
  }

  if (/larger|bigger|increase/.test(t)) {
    patch.size = clamp(conceptValue.size + 24, 16, 160)
    bits.push('a larger size')
  } else if (/smaller|decrease/.test(t)) {
    patch.size = clamp(conceptValue.size - 20, 16, 160)
    bits.push('a smaller size')
  }

  if (/brown|coffee|warm ink/.test(t)) {
    patch.fg = '#4a2e24'
    bits.push('warm brown ink')
  } else if (/green/.test(t)) {
    patch.fg = '#1e3a34'
    bits.push('deep green ink')
  } else if (/navy|blue ink/.test(t)) {
    patch.fg = '#1a365d'
    bits.push('navy ink')
  } else if (/black ink|dark ink/.test(t)) {
    patch.fg = '#1c1b19'
    bits.push('black ink')
  }

  if (/ivory|cream ground|warm ground/.test(t)) {
    patch.bg = '#f4f1ea'
    bits.push('an ivory ground')
  } else if (/white ground|white background/.test(t)) {
    patch.bg = '#ffffff'
    bits.push('a white ground')
  } else if (/dark ground|dark background|black background/.test(t)) {
    patch.bg = '#1c1b19'
    bits.push('a dark ground')
  }

  for (const font of FONTS) {
    if (t.includes(font.name.toLowerCase())) {
      patch.fontId = font.id
      bits.push(font.name)
    }
  }

  if (/\b(shape|mask)\b/.test(t) && !patch.shape) {
    return {
      clarify: true,
      message: 'Which mask should this use?',
      options: ['Use a circle', 'Use a square', 'Use a diamond'],
    }
  }
  if (/\b(color|colour|ink)\b/.test(t) && !patch.fg) {
    return {
      clarify: true,
      message: 'Which ink should this use?',
      options: ['Warm brown ink', 'Deep green', 'Navy ink'],
    }
  }
  if (/\b(font|typeface)\b/.test(t) && !patch.fontId) {
    return {
      clarify: true,
      message: 'Which typeface should this use?',
      options: ['Helvetica Neue', 'Futura', 'Bodoni'],
    }
  }

  if (!bits.length) {
    if (/\b(animation|motion)\b/.test(t)) {
      return {
        clarify: true,
        message: 'Shorten it, smooth the easing, or move it farther?',
        options: ['Shorter', 'Smoother easing', 'More movement'],
      }
    }
    if (isOnlyVague(raw)) return contextualAsk(conceptValue)
    return { unclear: true, message: 'Name the mask, type, ink, or motion to change.' }
  }

  const summary =
    bits.length === 1 ? `Applied ${bits[0]}.` : `Applied ${bits.slice(0, -1).join(', ')} and ${bits[bits.length - 1]}.`
  return { patch, summary }
}

function coffeeProject(id: string, title: string, prompt: string, tweak?: Partial<Concept>): Project {
  const concepts = buildConcepts(prompt).map((c, i) => ({ ...c, id: `${id}-c${i}`, ...tweak }))
  return { id, title, prompt, concepts }
}

export const SEED: Project[] = [
  coffeeProject('p-studio', 'Gemini Logo Studio User Flow', 'Logo mask for a coffee brand'),
  coffeeProject('p-coffee', 'Coffee Shop Logo Design', 'Logo mask for a coffee brand', { fg: '#4a2e24' }),
  {
    id: 'p-hose',
    title: 'Vintage Rubber Hose Cybertruck',
    prompt: 'Vintage rubber hose logo for a night drive',
    concepts: buildConcepts('Vintage rubber hose').map((c, i) => ({ ...c, id: `p-hose-c${i}` })),
  },
  {
    id: 'p-term',
    title: 'Cybertruck vs. Terminators',
    prompt: 'A sharp monogram for a comparison title',
    concepts: buildConcepts('Cybertruck terminators').map((c, i) => ({ ...c, id: `p-term-c${i}` })),
  },
  {
    id: 'p-night',
    title: 'Cyber Truck Driving At Night',
    prompt: 'A geometric badge for a night drive',
    concepts: buildConcepts('Night drive').map((c, i) => ({
      ...c,
      id: `p-night-c${i}`,
      fg: '#e8eaed',
      bg: '#1c1b19',
    })),
  },
  coffeeProject('p-franky', "Franky's Coffee Shop Logo Design", "Franky's coffee shop logo"),
  {
    id: 'p-palette',
    title: 'Refined Client Color Palette',
    prompt: 'Refine a client color palette into a quiet badge',
    concepts: buildConcepts('Client palette').map((c, i) => ({
      ...c,
      id: `p-palette-c${i}`,
      fg: '#1e3a34',
      bg: '#e4ebe6',
    })),
  },
]

export const SUGGESTIONS: { label: string; icon?: 'image' | 'music' }[] = [
  { label: 'Create image', icon: 'image' },
  { label: 'Create music', icon: 'music' },
  { label: 'Help me learn' },
  { label: 'Boost my day' },
  { label: 'Write anything' },
]

export const BRIEFS = [
  { label: 'Coffee brand brief', text: 'Design a logo mask for a coffee brand' },
  { label: 'Monogram brief', text: 'Sketch a monogram for a small roaster' },
  { label: 'Badge brief', text: 'Try a geometric badge with quiet geometry' },
]

export const REFINE_CHIPS = ['Make it bolder', 'Use a circle', 'Warm brown ink', 'Animate this mark']
