import { useId, type SVGProps } from 'react'

type P = { size?: number }

function Svg({ size = 20, children, ...rest }: P & SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  )
}

export function Sparkle({ size = 20 }: P) {
  const id = useId().replace(/:/g, '')
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="3" y1="21" x2="21" y2="3" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4C8DF6" />
          <stop offset="42%" stopColor="#A277E4" />
          <stop offset="70%" stopColor="#E0717A" />
          <stop offset="100%" stopColor="#F2B84B" />
        </linearGradient>
      </defs>
      <path
        fill={`url(#${id})`}
        d="M12 1.2c.35 3.7 1.35 6.55 3.85 8.55C18.15 11.7 21 12.15 22.8 12c-3.7.35-6.55 1.35-8.55 3.85C12.3 18.15 11.85 21 12 22.8c-.35-3.7-1.35-6.55-3.85-8.55C5.85 12.3 3 11.85 1.2 12c3.7-.35 6.55-1.35 8.55-3.85C11.7 5.85 12.15 3 12 1.2z"
      />
    </svg>
  )
}

export const IcoPencil = (p: P) => (
  <Svg {...p}>
    <path d="M13.2 5.2 18.8 10.8" />
    <path d="M4.5 19.5 5.2 15.2 15.6 4.8a1.6 1.6 0 0 1 2.3 0l1.3 1.3a1.6 1.6 0 0 1 0 2.3L8.8 18.8z" />
  </Svg>
)
export const IcoSearch = (p: P) => (
  <Svg {...p}>
    <circle cx="11" cy="11" r="6.25" />
    <path d="m16 16 4 4" />
  </Svg>
)
export const IcoSun = (p: P) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="3.2" />
    <path d="M12 3.5v1.8M12 18.7v1.8M3.5 12h1.8M18.7 12h1.8M6 6l1.3 1.3M16.7 16.7 18 18M18 6l-1.3 1.3M7.3 16.7 6 18" />
  </Svg>
)
export const IcoImage = (p: P) => (
  <Svg {...p}>
    <rect x="4" y="5" width="16" height="14" rx="2.5" />
    <circle cx="9" cy="10" r="1.3" />
    <path d="m7 16 3.2-3.2a1 1 0 0 1 1.4 0L16 17" />
  </Svg>
)
export const IcoVideo = (p: P) => (
  <Svg {...p}>
    <rect x="3.5" y="6" width="12" height="12" rx="2.2" />
    <path d="m15.5 10 5-2.5v9L15.5 14" />
  </Svg>
)
export const IcoLibrary = (p: P) => (
  <Svg {...p}>
    <rect x="4" y="4" width="6.5" height="6.5" rx="1.4" />
    <rect x="13.5" y="4" width="6.5" height="6.5" rx="1.4" />
    <rect x="4" y="13.5" width="6.5" height="6.5" rx="1.4" />
    <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.4" />
  </Svg>
)
export const IcoPlus = (p: P) => (
  <Svg {...p}>
    <path d="M12 5.5v13M5.5 12h13" />
  </Svg>
)
export const IcoMic = (p: P) => (
  <Svg {...p}>
    <rect x="9" y="3.5" width="6" height="10" rx="3" />
    <path d="M7 11a5 5 0 0 0 10 0M12 16.5V20" />
  </Svg>
)
export const IcoChevron = (p: P) => (
  <Svg {...p}>
    <path d="m9 6-5 6 5 6" />
  </Svg>
)
export const IcoChevronDown = (p: P) => (
  <Svg {...p}>
    <path d="m7 10 5 5 5-5" />
  </Svg>
)
export const IcoArrowUp = (p: P) => (
  <Svg {...p}>
    <path d="M12 18.5V6M6.5 11.5 12 6l5.5 5.5" />
  </Svg>
)
export const IcoSettings = (p: P) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="2.4" />
    <path d="M12 4.2v1.6M12 18.2v1.6M4.2 12h1.6M18.2 12h1.6M6.4 6.4l1.1 1.1M16.5 16.5l1.1 1.1M17.6 6.4l-1.1 1.1M7.5 16.5l-1.1 1.1" />
  </Svg>
)
export const IcoUndo = (p: P) => (
  <Svg {...p}>
    <path d="M8 8H4.5V4.5" />
    <path d="M5 9.2A7 7 0 1 1 6.2 16" />
  </Svg>
)
export const IcoRedo = (p: P) => (
  <Svg {...p}>
    <path d="M16 8h3.5V4.5" />
    <path d="M19 9.2A7 7 0 1 0 17.8 16" />
  </Svg>
)
export const IcoMoon = (p: P) => (
  <Svg {...p}>
    <path d="M15.5 14.2A6.2 6.2 0 0 1 9.8 5.2 6.4 6.4 0 1 0 15.5 14.2z" />
  </Svg>
)
export const IcoGrid = (p: P) => (
  <Svg {...p}>
    <path d="M5 5h5.5v5.5H5zM13.5 5H19v5.5h-5.5zM5 13.5h5.5V19H5zM13.5 13.5H19V19h-5.5z" />
  </Svg>
)
export const IcoCrop = (p: P) => (
  <Svg {...p}>
    <path d="M7 3.5v12.2A1.3 1.3 0 0 0 8.3 17H20.5M3.5 7h12.2A1.3 1.3 0 0 1 17 8.3V20.5" />
  </Svg>
)
export const IcoDownload = (p: P) => (
  <Svg {...p}>
    <path d="M12 4.5v10M7.5 10.5 12 15l4.5-4.5" />
    <path d="M5 18.5h14" />
  </Svg>
)
export const IcoSidebar = (p: P) => (
  <Svg {...p}>
    <rect x="4" y="4.5" width="16" height="15" rx="2.2" />
    <path d="M9 4.5v15" />
  </Svg>
)
export const IcoCheck = (p: P) => (
  <Svg {...p}>
    <path d="m5.5 12.5 4 4 9-9" />
  </Svg>
)
export const IcoClose = (p: P) => (
  <Svg {...p}>
    <path d="m7 7 10 10M17 7 7 17" />
  </Svg>
)
export const IcoPlay = (p: P) => (
  <Svg {...p}>
    <path d="M8.5 6.8v10.4L17.5 12z" />
  </Svg>
)
export const IcoCursor = (p: P) => (
  <Svg {...p}>
    <path d="m6 4.5 4.8 14 2-5.2 5.2-2z" />
  </Svg>
)
export const IcoHash = (p: P) => (
  <Svg {...p}>
    <path d="M9 4.5 7.5 19.5M16.5 4.5 15 19.5M5 9.2h14M4.5 14.8h14" />
  </Svg>
)
export const IcoSquare = (p: P) => (
  <Svg {...p}>
    <rect x="5" y="5" width="14" height="14" rx="2" />
  </Svg>
)
export const IcoPen = (p: P) => (
  <Svg {...p}>
    <path d="M5 19c2.2-4.8 4.2-9.2 8.6-12.2 1.6-1.1 3.6.9 2.5 2.5C13.2 13.8 8.8 15.8 4 18.2L5 19z" />
    <path d="m13.2 6.6 3.2 3.2" />
  </Svg>
)
export const IcoType = (p: P) => (
  <Svg {...p}>
    <path d="M6 7.5h12M12 7.5V18" />
  </Svg>
)
export const IcoCircle = (p: P) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="7" />
  </Svg>
)
export const IcoDiamond = (p: P) => (
  <Svg {...p}>
    <path d="M12 3.8 20 12l-8 8.2L4 12z" />
  </Svg>
)
export const IcoCode = (p: P) => (
  <Svg {...p}>
    <path d="m9 8-4 4 4 4M15 8l4 4-4 4" />
  </Svg>
)
export const IcoHex = (p: P) => (
  <Svg {...p}>
    <path d="m12 3.8 7 4v8.4l-7 4-7-4V7.8z" />
  </Svg>
)
export const IcoShield = (p: P) => (
  <Svg {...p}>
    <path d="M12 3.8 19 6.6v6.2c0 3.6-2.8 6.2-7 7.6-4.2-1.4-7-4-7-7.6V6.6z" />
  </Svg>
)
export const IcoArch = (p: P) => (
  <Svg {...p}>
    <path d="M6 19V11a6 6 0 0 1 12 0v8" />
  </Svg>
)
export const IcoOval = (p: P) => (
  <Svg {...p}>
    <ellipse cx="12" cy="12" rx="8" ry="5.5" />
  </Svg>
)
export const IcoSend = (p: P) => (
  <Svg {...p}>
    <path d="M5 12h14M13 6.5 18.5 12 13 17.5" />
  </Svg>
)
