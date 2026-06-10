'use client'

import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { cn } from '@/lib/utils'

interface ScrollRevealTextProps {
  children: string
  className?: string
  style?: CSSProperties
  grey?: string
  black?: string
  /** Viewport ratio where the first line triggers the animation (0–1). */
  startRatio?: number
  /** Fraction of paragraph height still visible when all characters are black (0–1). */
  completeVisibleRatio?: number
}

function mixColor(grey: string, black: string, t: number) {
  const parse = (hex: string) => {
    const value = hex.replace('#', '')
    const normalized =
      value.length === 3
        ? value.split('').map((c) => c + c).join('')
        : value
    return [
      parseInt(normalized.slice(0, 2), 16),
      parseInt(normalized.slice(2, 4), 16),
      parseInt(normalized.slice(4, 6), 16),
    ]
  }

  const [gr, gg, gb] = parse(grey)
  const [br, bg, bb] = parse(black)
  const r = Math.round(gr + (br - gr) * t)
  const g = Math.round(gg + (bg - gg) * t)
  const b = Math.round(gb + (bb - gb) * t)
  return `rgb(${r} ${g} ${b})`
}

export function ScrollRevealText({
  children,
  className,
  style,
  grey = '#b2b2b2',
  black = '#000000',
  startRatio = 0.3,
  completeVisibleRatio = 0.5,
}: ScrollRevealTextProps) {
  const ref = useRef<HTMLParagraphElement>(null)
  const activeIndexRef = useRef(0)
  const [activeIndex, setActiveIndex] = useState(0)

  const chars = useMemo(
    () => Array.from(children),
    [children]
  )

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let raf = 0

    const commitIndex = (next: number) => {
      if (next === activeIndexRef.current) return
      activeIndexRef.current = next
      setActiveIndex(next)
    }

    const update = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const hero = el.closest('.hero-section') as HTMLElement | null

        if (hero) {
          if (hero.dataset.heroExpanded !== 'true') {
            commitIndex(0)
            return
          }

          const revealStartTop = parseFloat(hero.dataset.revealLockedTop ?? '')
          if (!Number.isFinite(revealStartTop)) {
            commitIndex(0)
            return
          }

          const container = (el.closest('[data-team-function]') ??
            el.parentElement) as HTMLElement | null
          if (!container) {
            commitIndex(0)
            return
          }

          const containerRect = container.getBoundingClientRect()
          const textRect = el.getBoundingClientRect()
          const viewport = window.innerHeight

          if (containerRect.bottom <= 0 || containerRect.top >= viewport) {
            commitIndex(0)
            return
          }

          // Progress 0 at post-expansion position; advances only as user scrolls up
          if (containerRect.top >= revealStartTop) {
            commitIndex(0)
            return
          }

          const end = -textRect.height * completeVisibleRatio
          const scrollRange = revealStartTop - end

          if (scrollRange <= 0) {
            commitIndex(0)
            return
          }

          const progress = Math.min(
            1,
            Math.max(0, (revealStartTop - containerRect.top) / scrollRange)
          )
          commitIndex(progress * chars.length)
          return
        }

        const rect = el.getBoundingClientRect()
        const viewport = window.innerHeight
        const start = viewport * startRatio
        const end = -rect.height * completeVisibleRatio
        const scrollRange = start - end

        if (rect.top > start || scrollRange <= 0) {
          commitIndex(0)
          return
        }

        const progress = Math.min(1, Math.max(0, (start - rect.top) / scrollRange))
        commitIndex(progress * chars.length)
      })
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [chars.length, startRatio, completeVisibleRatio])

  return (
    <p
      ref={ref}
      className={cn('whitespace-normal break-words', className)}
      style={style}
      aria-label={children}
    >
      {chars.map((char, index) => {
        const t = Math.min(1, Math.max(0, activeIndex - index))
        return (
          <span
            key={`${index}-${char}`}
            aria-hidden="true"
            style={{ color: mixColor(grey, black, t) }}
          >
            {char}
          </span>
        )
      })}
    </p>
  )
}
