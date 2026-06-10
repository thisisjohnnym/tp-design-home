'use client'

import { cn } from '@/lib/utils'
import type { HeroShaderTheme } from './heroShaderThemes'

interface HeroThemeSwitcherProps {
  theme: HeroShaderTheme
  onChange: (theme: HeroShaderTheme) => void
}

const THEME_OPTIONS = [
  { value: 'light' as const, label: 'Light mode', Icon: SunIcon },
  { value: 'dark' as const, label: 'Dark mode', Icon: MoonIcon },
]

function SunIcon() {
  return (
    <svg
      width={14}
      height={14}
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden
      className="block"
    >
      <circle cx={7} cy={7} r={2.75} stroke="currentColor" strokeWidth={1.1} />
      <path
        d="M7 1.25v1.75M7 11v1.75M12.75 7h-1.75M2.75 7H1M11.1 2.9l-1.24 1.24M4.14 9.86 2.9 11.1M11.1 11.1l-1.24-1.24M4.14 4.14 2.9 2.9"
        stroke="currentColor"
        strokeWidth={1.1}
        strokeLinecap="round"
      />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg
      width={14}
      height={14}
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden
      className="block"
    >
      <path
        d="M9.75 2.1a5.25 5.25 0 1 0 1.65 9.65A4.25 4.25 0 1 1 9.75 2.1Z"
        stroke="currentColor"
        strokeWidth={1.1}
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function HeroThemeSwitcher({ theme, onChange }: HeroThemeSwitcherProps) {
  return (
    <div
      className="absolute top-[20px] right-[20px] z-20 flex items-center gap-[2px] rounded-[6px] border border-solid p-[2px]"
      style={{
        borderColor: 'rgba(255, 255, 255, 0.28)',
        background: 'rgba(0, 0, 0, 0.18)',
      }}
      role="group"
      aria-label="Hero lighting"
    >
      {THEME_OPTIONS.map(({ value, label, Icon }) => (
        <button
          key={value}
          type="button"
          onClick={() => onChange(value)}
          className={cn(
            'rounded-[4px] p-[6px] transition-colors',
            theme === value
              ? 'text-white'
              : 'text-white/55 hover:text-white/80'
          )}
          style={
            theme === value
              ? { background: 'rgba(255, 255, 255, 0.16)' }
              : undefined
          }
          aria-label={label}
          aria-pressed={theme === value}
        >
          <Icon />
        </button>
      ))}
    </div>
  )
}
