'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { Container } from '@/components/Container'
import { cn } from '@/lib/utils'

/** Matches boring.industries `.vid-start-wrap` overlap (margin-top: -60vh). */
const OVERLAP_RATIO = 0.6

interface ContentOverlayProps {
  children: ReactNode
  className?: string
}

/**
 * Float-over sheet (boring.industries `vid-start-wrap` / `section-up`).
 * The hero above is not pinned — overlap ramps in on scroll so nothing peeks on land.
 */
export function ContentOverlay({ children, className }: ContentOverlayProps) {
  const ref = useRef<HTMLDivElement>(null)
  // Scroll position where the float-over unlocks — anchors the ramp to 0 so it
  // grows continuously from there (no jump when the gate opens).
  const anchorRef = useRef<number | null>(null)

  useEffect(() => {
    const overlay = ref.current
    if (!overlay) return

    const update = () => {
      const hero = document.querySelector<HTMLElement>('[data-hero-section]')
      const vh = window.innerHeight
      if (!hero || vh <= 0) {
        overlay.style.marginTop = '0px'
        return
      }

      const teamFunction = hero.querySelector<HTMLElement>('[data-team-function]')
      if (teamFunction && teamFunction.dataset.revealComplete !== 'true') {
        overlay.style.marginTop = '0px'
        anchorRef.current = null
        return
      }

      // First frame after the gate opens: anchor here so overlap starts at 0.
      if (anchorRef.current === null) {
        anchorRef.current = window.scrollY
      }

      const maxOverlap = OVERLAP_RATIO * vh
      const delta = window.scrollY - anchorRef.current
      const overlap = Math.max(0, Math.min(maxOverlap, delta))
      overlay.style.marginTop = `${-overlap}px`
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  return (
    <div ref={ref} className="content-overlay">
      {/* Bottom breathing room below the sticker canvas. */}
      <Container className={cn('pt-[160px] pb-[100px]', className)}>
        {children}
      </Container>
    </div>
  )
}
