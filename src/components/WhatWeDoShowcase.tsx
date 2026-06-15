'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Grid, Col } from './Grid'
import { CAPABILITIES } from './WhatWeDo'

const MUTED = 'var(--page-label)'

export function WhatWeDoShowcase() {
  const [active, setActive] = useState<number | null>(null)

  return (
    <section className="relative">
      <Grid className="items-start">
        <Col span={{ base: 24, lg: 8 }}>
          <span
            className="font-mono text-[12px] tracking-[0.12em]"
            style={{ color: 'var(--page-label)' }}
          >
            (What we do)
          </span>
        </Col>

        <Col span={{ base: 24, lg: 16 }}>
          <ul className="flex flex-col" onPointerLeave={() => setActive(null)}>
            {CAPABILITIES.map((cap, i) => {
              const isActive = i === active
              return (
                <li
                  key={cap.name}
                  className={cn(
                    'border-t',
                    i === CAPABILITIES.length - 1 && 'border-b'
                  )}
                  style={{ borderColor: 'var(--page-rule)' }}
                >
                  <button
                    type="button"
                    onPointerEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    onBlur={() => setActive(null)}
                    aria-pressed={isActive}
                    className="wwd2-row group flex w-full py-[clamp(10px,1.2vw,18px)] text-left outline-none"
                  >
                    <div className="grid min-w-0 flex-1 grid-cols-[auto_1fr] items-start gap-x-5 gap-y-1">
                      <span
                        className="pt-[0.35em] font-mono text-[12px] tabular-nums transition-opacity duration-300"
                        style={{
                          color: 'var(--page-ink)',
                          opacity: isActive ? 1 : 0.6,
                        }}
                      >
                        {cap.index}
                      </span>

                      <span
                        className="relative inline-flex w-fit items-center transition-transform duration-300 ease-out"
                        style={{
                          transform: isActive ? 'translateX(12px)' : 'translateX(0)',
                        }}
                      >
                        <span
                          className="whitespace-nowrap font-medium leading-[0.95] tracking-[-0.01em]"
                          style={{
                            color: 'var(--page-ink)',
                            fontSize: 'clamp(1.9rem, 4.4vw, 3.6rem)',
                          }}
                        >
                          {cap.name}
                        </span>

                      </span>

                      {/* Reserved single-line slot — fades in, no height shift */}
                      <p
                        aria-hidden={!isActive}
                        className="col-start-2 h-[18px] truncate text-[13px] leading-[18px]"
                        style={{
                          color: MUTED,
                          opacity: isActive ? 1 : 0,
                          transform: isActive ? 'translateX(12px)' : 'translateX(0)',
                          transition: 'opacity 0.3s ease-out, transform 0.3s ease-out',
                        }}
                      >
                        {cap.note}
                      </p>
                    </div>
                  </button>
                </li>
              )
            })}
          </ul>
        </Col>
      </Grid>
    </section>
  )
}
