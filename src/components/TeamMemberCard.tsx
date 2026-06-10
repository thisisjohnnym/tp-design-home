'use client'

import { useCallback, useEffect, useId, useRef } from 'react'
import { TEAM_CARD_MORPH_STEPS, TEAM_CARD_SHAPE_PATHS } from './teamCardMorphPaths'

import type { TeamMember } from '@/data/content'

type TeamMemberCardProps = {
  member: TeamMember
}

const HOVER_IN_MS = 280
const HOVER_OUT_MS = 200
const LERP = 0.14

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

export function TeamMemberCard({ member }: TeamMemberCardProps) {
  const clipId = `team-clip-${useId().replace(/:/g, '')}`
  const pathRef = useRef<SVGPathElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const progressRef = useRef(0)
  const targetRef = useRef(0)
  const rafRef = useRef<number | null>(null)
  const hoverStartRef = useRef<number | null>(null)
  const hoverFromRef = useRef(0)
  const canAnimateRef = useRef(false)
  const reducedMotionRef = useRef(false)

  const applyProgress = useCallback((progress: number) => {
    const path = pathRef.current
    const svg = svgRef.current
    if (!path || !svg) return

    const step = Math.round(progress * TEAM_CARD_MORPH_STEPS)
    path.setAttribute('d', TEAM_CARD_SHAPE_PATHS[step])

    svg.style.filter = progress >= 1 ? 'none' : `grayscale(${1 - progress})`
    progressRef.current = progress
  }, [])

  const tick = useCallback(
    (now: number) => {
      const target = targetRef.current
      let progress = progressRef.current

      if (hoverStartRef.current !== null) {
        const duration = target > hoverFromRef.current ? HOVER_IN_MS : HOVER_OUT_MS
        const elapsed = now - hoverStartRef.current
        const t = Math.min(elapsed / duration, 1)
        const eased = 1 - Math.pow(1 - t, 4)
        progress = lerp(hoverFromRef.current, target, eased)
        if (t >= 1) hoverStartRef.current = null
      } else {
        progress = lerp(progress, target, LERP)
        if (Math.abs(progress - target) < 0.002) progress = target
      }

      applyProgress(progress)

      if (progress !== target || hoverStartRef.current !== null) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        rafRef.current = null
      }
    },
    [applyProgress]
  )

  const startAnimation = useCallback(
    (target: number) => {
      if (reducedMotionRef.current) {
        applyProgress(target)
        targetRef.current = target
        return
      }

      targetRef.current = target
      hoverFromRef.current = progressRef.current
      hoverStartRef.current = performance.now()

      if (rafRef.current === null) {
        rafRef.current = requestAnimationFrame(tick)
      }
    },
    [applyProgress, tick]
  )

  useEffect(() => {
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)')
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

    const sync = () => {
      canAnimateRef.current = finePointer.matches
      reducedMotionRef.current = reducedMotion.matches
    }

    sync()
    finePointer.addEventListener('change', sync)
    reducedMotion.addEventListener('change', sync)
    applyProgress(0)

    return () => {
      finePointer.removeEventListener('change', sync)
      reducedMotion.removeEventListener('change', sync)
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [applyProgress])

  const handleEnter = useCallback(() => {
    if (!canAnimateRef.current) return
    startAnimation(1)
  }, [startAnimation])

  const handleLeave = useCallback(() => {
    if (!canAnimateRef.current) return
    startAnimation(0)
  }, [startAnimation])

  const handleFocus = useCallback(() => {
    startAnimation(1)
  }, [startAnimation])

  const handleBlur = useCallback(
    (event: React.FocusEvent<HTMLElement>) => {
      if (event.currentTarget.contains(event.relatedTarget as Node | null)) return
      startAnimation(0)
    },
    [startAnimation]
  )

  return (
    <article
      className="group flex flex-col items-center gap-[10px] rounded-[16px] outline-none focus-visible:ring-2 focus-visible:ring-black/20"
      onPointerEnter={handleEnter}
      onPointerLeave={handleLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      tabIndex={0}
      aria-label={member.name}
    >
      <div className="team-card-media relative aspect-square w-full">
        <svg
          ref={svgRef}
          viewBox="0 0 240 240"
          aria-hidden
          className="team-card-svg"
        >
          <defs>
            <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
              <path ref={pathRef} d={TEAM_CARD_SHAPE_PATHS[0]} />
            </clipPath>
          </defs>
          <image
            href={member.image}
            width={240}
            height={240}
            preserveAspectRatio="xMidYMid slice"
            clipPath={`url(#${clipId})`}
          />
        </svg>
      </div>
      <div className="flex w-full flex-col items-center gap-1 text-center">
        <p className="text-[20px] font-medium leading-normal text-black">{member.name}</p>
        <p className="text-[16px] font-medium leading-normal text-[#888888]">{member.role}</p>
      </div>
    </article>
  )
}
