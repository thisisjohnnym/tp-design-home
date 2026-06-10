type DoodleProps = {
  className?: string
}

export function StarBurst({ className }: DoodleProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M24 2L27.5 18.5L44 22L27.5 25.5L24 42L20.5 25.5L4 22L20.5 18.5L24 2Z"
        fill="currentColor"
      />
    </svg>
  )
}

export function SquiggleArrow({ className }: DoodleProps) {
  return (
    <svg
      viewBox="0 0 120 60"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M4 48C28 52 44 8 72 16C88 20 96 36 116 28"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M108 22L116 28L108 34"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function WavyUnderline({ className }: DoodleProps) {
  return (
    <svg
      viewBox="0 0 200 12"
      fill="none"
      aria-hidden
      className={className}
      preserveAspectRatio="none"
    >
      <path
        d="M0 8C20 2 40 12 60 6C80 0 100 10 120 4C140 -2 160 8 180 2L200 6"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function ScribbleCircle({ className }: DoodleProps) {
  return (
    <svg
      viewBox="0 0 80 80"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M40 6C58 4 72 18 74 36C76 54 62 72 44 74C26 76 8 62 6 44C4 26 18 8 40 6Z"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="3 5"
      />
    </svg>
  )
}
