'use client'

import { useEffect, type RefObject } from 'react'

export const HERO_EXPAND_DURATION = 600
const HERO_PAD = 20

function viewportInnerPx() {
  return Math.max(0, window.innerHeight - 2 * HERO_PAD)
}

function readPx(el: HTMLElement, name: string, fallback: number) {
  const raw = getComputedStyle(el).getPropertyValue(name).trim()
  const value = parseFloat(raw)
  return Number.isFinite(value) && value > 0 ? value : fallback
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3)
}

function readProgress(el: HTMLElement) {
  const stored = parseFloat(el.dataset.heroProgress ?? '')
  return Number.isFinite(stored) ? stored : 0
}

function applyExpansion(el: HTMLElement, progress: number) {
  const viewportInner = readPx(
    el,
    '--hero-viewport-inner',
    viewportInnerPx()
  )
  const heroNatural = readPx(el, '--hero-hero-natural', viewportInner)
  const expandedInner = readPx(el, '--hero-expanded-inner', viewportInner)

  const pad = HERO_PAD * (1 - progress)
  const radius = HERO_PAD * (1 - progress)
  const innerHeight =
    viewportInner + (expandedInner - viewportInner) * progress
  const headlineMin =
    viewportInner + (heroNatural - viewportInner) * progress
  const shellHeight =
    progress <= 0
      ? viewportInner + 2 * HERO_PAD
      : progress >= 1
        ? innerHeight
        : innerHeight + 2 * pad

  el.style.setProperty('--hero-expand', String(progress))
  el.style.setProperty('--hero-pad', `${pad}px`)
  el.style.setProperty('--hero-radius', `${radius}px`)
  el.style.setProperty('--hero-inner-height', `${innerHeight}px`)
  el.style.setProperty('--hero-headline-min', `${headlineMin}px`)
  el.style.setProperty('--hero-shell-height', `${shellHeight}px`)
  el.dataset.heroProgress = String(progress)
  el.dataset.heroExpanded = progress >= 0.999 ? 'true' : 'false'

  if (progress <= 0) {
    delete el.dataset.revealLockedTop
  }
}

function setRevealAnchor(el: HTMLElement) {
  const team = el.querySelector('[data-team-function]')
  if (!team) return
  el.dataset.revealLockedTop = String(team.getBoundingClientRect().top)
}

/** Re-apply layout using the current stored expansion progress. */
export function syncHeroExpansion(el: HTMLElement) {
  applyExpansion(el, readProgress(el))
}

/** Drives hero expansion — smooth animation on first scroll, not scroll-linked. */
export function useHeroScrollExpansion(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current
    if (!el) return

    const reducedMotion =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let animFrame = 0
    let animStart = 0
    let animFrom = 0
    let targetProgress = 0

    const animate = (now: number) => {
      const t = Math.min(1, (now - animStart) / HERO_EXPAND_DURATION)
      const progress = animFrom + (targetProgress - animFrom) * easeOutCubic(t)
      applyExpansion(el, progress)

      if (t < 1) {
        animFrame = requestAnimationFrame(animate)
      } else {
        animStart = 0
        applyExpansion(el, targetProgress)
        if (targetProgress >= 0.999) setRevealAnchor(el)
      }
    }

    const startAnimation = (to: number) => {
      const current = readProgress(el)
      if (Math.abs(current - to) < 0.001) return
      if (animStart !== 0 && targetProgress === to) return

      if (reducedMotion) {
        cancelAnimationFrame(animFrame)
        animStart = 0
        targetProgress = to
        applyExpansion(el, to)
        if (to >= 0.999) setRevealAnchor(el)
        return
      }

      animFrom = animStart !== 0 ? readProgress(el) : current
      targetProgress = to
      animStart = performance.now()
      cancelAnimationFrame(animFrame)
      animFrame = requestAnimationFrame(animate)
    }

    const expand = () => startAnimation(1)
    const collapse = () => startAnimation(0)

    const onScroll = () => {
      if (window.scrollY > 0) expand()
      else collapse()
    }

    const onWheel = (e: WheelEvent) => {
      if (e.deltaY > 0 && readProgress(el) < 1) expand()
      else if (e.deltaY < 0 && window.scrollY === 0) collapse()
    }

    const onResize = () => syncHeroExpansion(el)

    applyExpansion(el, 0)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('wheel', onWheel, { passive: true })
    window.addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(animFrame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('resize', onResize)
    }
  }, [ref])
}
