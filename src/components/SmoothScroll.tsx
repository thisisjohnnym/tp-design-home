'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'

/**
 * Page-wide smooth scrolling (Lenis). Eases wheel/trackpad input so fast flicks
 * glide instead of jumping — gives scroll-linked animations (hero expansion,
 * paragraph reveal, float-over) room to keep up. Disabled for reduced motion.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const lenis = new Lenis({
      duration: 0.75,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
    })

    let raf = 0
    const loop = (time: number) => {
      lenis.raf(time)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
    }
  }, [])

  return null
}
