'use client'

import { useRef, useState, type CSSProperties } from 'react'
import { Grid, Col } from '@/components/Grid'
import type { TeamMember } from '@/data/content'
import { cn } from '@/lib/utils'

type TeamSectionProps = {
  members: TeamMember[]
}

// Resting scatter per card (xPercent, yPercent, rotation) — truus-style offsets.
const REST = [
  { x: 0, y: -5.4, rot: 4 },
  { x: -3.2, y: 8.6, rot: -5 },
  { x: -8.4, y: -8.5, rot: 6 },
  { x: -3.2, y: -3.7, rot: -6 },
  { x: 0, y: 7.1, rot: 8 },
  { x: 4, y: 6, rot: -5 },
  { x: -2, y: -6, rot: 5 },
  { x: 3, y: 5, rot: -7 },
]

// Springy easing approximating GSAP elastic.out(1, 0.75)
const SPRING = 'cubic-bezier(0.34, 1.4, 0.64, 1)'

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15.3375 15.3375H12.6675V11.16C12.6675 10.1625 12.6525 8.88 11.28 8.88C9.8925 8.88 9.675 9.9675 9.675 11.085V15.3375H7.005V6.75H9.57V7.92H9.6075C9.9675 7.245 10.8375 6.5325 12.135 6.5325C14.835 6.5325 15.3375 8.31 15.3375 10.6275V15.3375ZM4.005 5.5725C3.80112 5.5725 3.59924 5.53234 3.41088 5.45432C3.22253 5.3763 3.05138 5.26195 2.90722 5.11778C2.76305 4.97362 2.6487 4.80247 2.57068 4.61412C2.49266 4.42576 2.4525 4.22388 2.4525 4.02C2.4525 3.81612 2.49266 3.61424 2.57068 3.42588C2.6487 3.23753 2.76305 3.06638 2.90722 2.92222C3.05138 2.77805 3.22253 2.6637 3.41088 2.58568C3.59924 2.50766 3.80112 2.4675 4.005 2.4675C4.41675 2.4675 4.81163 2.63107 5.10278 2.92222C5.39393 3.21337 5.5575 3.60825 5.5575 4.02C5.5575 4.43175 5.39393 4.82663 5.10278 5.11778C4.81163 5.40893 4.41675 5.5725 4.005 5.5725ZM5.34 15.3375H2.67V6.75H5.34V15.3375ZM16.665 0H1.3275C0.5925 0 0 0.5775 0 1.2975V16.7025C0 17.415 0.5925 18 1.3275 18H16.665C17.4 18 18 17.415 18 16.7025V1.2975C18 0.5775 17.4 0 16.665 0Z"
        fill="currentColor"
      />
    </svg>
  )
}

export function TeamSection({ members }: TeamSectionProps) {
  const [active, setActive] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLElement | null)[]>([])

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) return
    const el = containerRef.current
    if (!el) return

    // The card actually under the cursor wins — keeps the active card (and its
    // LinkedIn link) stable/clickable instead of flipping to a nearby center.
    const overCard = (e.target as HTMLElement | null)?.closest<HTMLElement>(
      '[data-card-index]'
    )
    if (overCard) {
      setActive(Number(overCard.dataset.cardIndex))
      return
    }

    // Fallback for the gaps/padding between cards: nearest card center.
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left + el.scrollLeft
    let best = 0
    let bestDist = Infinity
    for (let i = 0; i < cardRefs.current.length; i++) {
      const card = cardRefs.current[i]
      if (!card) continue
      const center = card.offsetLeft + card.offsetWidth / 2
      const dist = Math.abs(center - x)
      if (dist < bestDist) {
        bestDist = dist
        best = i
      }
    }
    setActive(best)
  }

  return (
    <section>
      <Grid>
        <Col span={24}>
          <div className="mb-[clamp(32px,4vw,56px)] flex justify-center">
            <span
              className="font-mono text-[12px] tracking-[0.12em]"
              style={{ color: 'var(--page-label)' }}
            >
              (Our team)
            </span>
          </div>

          <div
            ref={containerRef}
            onMouseMove={handleMove}
            onMouseLeave={() => setActive(null)}
            className={cn(
              'team-cascade relative flex justify-start overflow-x-auto px-2 py-12',
              '[scrollbar-width:none] lg:justify-center lg:overflow-visible [&::-webkit-scrollbar]:hidden'
            )}
            style={{ ['--cascade-ov' as string]: 'clamp(28px, 3.6vw, 56px)' } as CSSProperties}
          >
            {members.map((member, i) => {
              const rest = REST[i % REST.length]
              const isActive = active === i

              const wrapTransform = isActive
                ? 'translate(0%, 0%) rotate(0deg) scale(1.1)'
                : `translate(${rest.x}%, ${rest.y}%) rotate(${rest.rot}deg)`

              const innerShift =
                active === null || isActive ? 0 : 70 / (i - active)

              return (
                <article
                  key={member.name}
                  data-card-index={i}
                  ref={(node) => {
                    cardRefs.current[i] = node
                  }}
                  onMouseEnter={() => setActive(i)}
                  className="team-cascade-card relative shrink-0 origin-center"
                  style={{
                    marginLeft: i === 0 ? 0 : 'calc(var(--cascade-ov) * -1)',
                    transform: wrapTransform,
                    transition: `transform 0.7s ${SPRING}`,
                    zIndex: i,
                    pointerEvents:
                      active !== null && i > active ? 'none' : 'auto',
                  }}
                >
                  <div
                    className="team-cascade-card__frame relative aspect-[222/281] w-[clamp(166px,17vw,222px)] overflow-hidden rounded-[8px]"
                    style={{
                      transform: `translateX(${innerShift}%)`,
                      transition: `transform 0.7s ${SPRING}`,
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={member.image}
                      alt=""
                      className="pointer-events-none absolute inset-0 h-full w-full object-cover"
                      draggable={false}
                    />

                    <div className="team-card-gradient" aria-hidden />

                    <div className="team-card-content">
                      <div className="min-w-0 flex flex-col gap-[1px] pr-2">
                        <p className="truncate text-[15px] font-medium leading-normal text-white">
                          {member.name}
                        </p>
                        <p className="truncate text-[12px] font-normal leading-normal text-[rgba(255,255,255,0.75)]">
                          {member.role}
                        </p>
                      </div>
                      <a
                        href="#"
                        aria-label={`${member.name} on LinkedIn`}
                        onMouseEnter={(e) => {
                          e.stopPropagation()
                          setActive(i)
                        }}
                        className="team-card-linkedin relative z-20 flex h-[18px] w-[18px] shrink-0 items-center justify-center text-white outline-none before:absolute before:-inset-2.5 before:content-[''] transition-opacity duration-200 hover:opacity-85 focus-visible:opacity-85"
                      >
                        <LinkedInIcon className="h-[18px] w-[18px]" />
                      </a>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </Col>
      </Grid>
    </section>
  )
}
