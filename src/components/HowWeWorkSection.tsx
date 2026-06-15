'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { process } from '@/data/content'
import { Grid, Col } from './Grid'
import { cn } from '@/lib/utils'

const GAP_PX = 90
const SHAPE_SLOT = 'clamp(80px,12vw,160px)'
/** Viewport heights of scroll per step transition (after the initial pin). */
const SCROLL_VH_PER_STEP = 45

type ProcessStep = (typeof process)[number]

function findCenteredIndex(refs: (HTMLElement | null)[]): number {
  const centerX = window.innerWidth / 2
  let best = 0
  let bestDist = Infinity

  for (let i = 0; i < refs.length; i++) {
    const el = refs[i]
    if (!el) continue
    const rect = el.getBoundingClientRect()
    const elCenter = rect.left + rect.width / 2
    const dist = Math.abs(elCenter - centerX)
    if (dist < bestDist) {
      bestDist = dist
      best = i
    }
  }

  return best
}

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value))
}

export function HowWeWorkSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const titleRefs = useRef<(HTMLSpanElement | null)[]>([])
  const translateRangeRef = useRef({ start: 0, end: 0 })
  const centeredIndexRef = useRef(0)
  const rafRef = useRef(0)

  const [activeStep, setActiveStep] = useState(0)
  const [centeredIndex, setCenteredIndex] = useState(0)

  const items: ProcessStep[] = process
  const scrollHeightVh = 80 + (process.length - 1) * SCROLL_VH_PER_STEP

  const measureTranslateRange = () => {
    const first = titleRefs.current[0]
    const last = titleRefs.current[process.length - 1]
    const track = trackRef.current
    if (!first || !last || !track) return

    track.style.transform = 'translate3d(0, 0, 0)'
    const centerX = window.innerWidth / 2
    const trackRect = track.getBoundingClientRect()

    const firstCenter =
      first.getBoundingClientRect().left +
      first.getBoundingClientRect().width / 2 -
      trackRect.left
    const lastCenter =
      last.getBoundingClientRect().left +
      last.getBoundingClientRect().width / 2 -
      trackRect.left

    translateRangeRef.current = {
      start: centerX - firstCenter,
      end: centerX - lastCenter,
    }
  }

  const applyScroll = () => {
    const section = sectionRef.current
    const track = trackRef.current
    if (!section || !track) return

    const { start, end } = translateRangeRef.current
    const scrollable = section.offsetHeight - window.innerHeight
    const progress =
      scrollable <= 0 ? 0 : clamp01(-section.getBoundingClientRect().top / scrollable)
    const translate = start + (end - start) * progress

    track.style.transform = `translate3d(${translate}px, 0, 0)`

    const centered = findCenteredIndex(titleRefs.current)
    if (centered !== centeredIndexRef.current) {
      centeredIndexRef.current = centered
      setCenteredIndex(centered)
      setActiveStep(centered)
    }
  }

  useLayoutEffect(() => {
    measureTranslateRange()
    applyScroll()
  }, [])

  useEffect(() => {
    const onScroll = () => {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(applyScroll)
    }

    const onResize = () => {
      measureTranslateRange()
      applyScroll()
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  const activeDescription = process[activeStep]?.description ?? ''

  return (
    <section
      ref={sectionRef}
      className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2"
      style={{ height: `${scrollHeightVh}vh` }}
      aria-labelledby="how-we-work-heading"
    >
      <div
        className="sticky top-0 relative h-[100svh] w-full overflow-x-clip"
        style={{
          background: 'var(--page-ink)',
          color: 'var(--page-ground)',
        }}
      >
        <h2 id="how-we-work-heading" className="sr-only">
          How we work
        </h2>

        <div className="absolute inset-x-0 top-[clamp(32px,4vw,56px)] z-10 px-[20px]">
          <Grid className="items-start">
            <Col span={24}>
              <span
                className="font-mono text-[12px] tracking-[0.12em]"
                style={{ color: 'var(--page-ground)', opacity: 0.5 }}
              >
                (How we work)
              </span>
            </Col>
          </Grid>
        </div>

        <div
          className="pointer-events-none absolute top-1/2 left-1/2 w-screen max-w-none -translate-x-1/2 -translate-y-1/2 overflow-x-clip overflow-y-visible"
          style={{ height: 'clamp(360px, 44vw, 520px)' }}
          aria-hidden
        >
          <div
            ref={trackRef}
            className="absolute top-1/2 flex -translate-y-1/2 items-end will-change-transform"
            style={{ gap: `${GAP_PX}px` }}
          >
            {items.map((step, i) => {
              const isActive = i === centeredIndex
              return (
                <span
                  key={step.step}
                  className="inline-flex shrink-0 flex-col items-center"
                >
                  <span
                    className="mb-[clamp(12px,1.8vw,24px)] flex items-end justify-center"
                    style={{ width: SHAPE_SLOT, height: SHAPE_SLOT }}
                    aria-hidden={!isActive}
                  >
                    {isActive && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={step.shape}
                        alt=""
                        className="max-h-full max-w-full object-contain"
                        draggable={false}
                      />
                    )}
                  </span>
                  <span
                    ref={(node) => {
                      titleRefs.current[i] = node
                    }}
                    className={cn(
                      'block whitespace-nowrap font-medium leading-[1.1] tracking-[-0.0045em] transition-opacity duration-300 ease-out'
                    )}
                    style={{
                      color: 'var(--page-ground)',
                      opacity: isActive ? 1 : 0.35,
                      fontSize: 'clamp(3.5rem, 8vw, 8rem)',
                    }}
                  >
                    {step.name}
                  </span>
                </span>
              )
            })}
          </div>
        </div>

        <p
          className={cn(
            'absolute left-1/2 max-w-[511px] -translate-x-1/2 text-center font-medium leading-[1.35] transition-opacity duration-300 ease-out'
          )}
          style={{
            top: 'calc(50% + clamp(110px, 15vw, 200px))',
            color: 'var(--page-ground)',
            fontSize: 'clamp(1.125rem, 1.6vw, 1.5rem)',
            opacity: activeDescription ? 1 : 0,
          }}
          aria-live="polite"
        >
          {activeDescription}
        </p>
      </div>
    </section>
  )
}
