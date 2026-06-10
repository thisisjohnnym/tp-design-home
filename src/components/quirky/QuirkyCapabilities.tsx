'use client'

import { Container } from '@/components/Container'
import { Grid, Col } from '@/components/Grid'
import { quirkyCapabilities } from '@/data/content'
import { cn } from '@/lib/utils'

const SIZE_CLASSES = {
  xl: 'text-[clamp(2.5rem,6vw,5.5rem)]',
  lg: 'text-[clamp(2rem,4.5vw,4rem)]',
  md: 'text-[clamp(1.5rem,3.5vw,3rem)]',
  sm: 'text-[clamp(1.25rem,2.5vw,2.25rem)] text-[#1A1A1A]/40',
} as const

export function QuirkyCapabilities() {
  return (
    <section className="border-t border-[#1A1A1A]/10 py-[clamp(80px,12vh,160px)]">
      <Container>
        <Grid className="mb-12">
          <Col span={{ base: 24, lg: 8 }}>
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#1A1A1A]/50">
              What we do
            </p>
          </Col>
          <Col span={{ base: 24, lg: 16 }}>
            <p className="text-[clamp(1rem,1.8vw,1.25rem)] leading-[1.4] text-[#1A1A1A]/60">
              Not a services menu — just the stuff we actually obsess over every day.
            </p>
          </Col>
        </Grid>

        <ul className="flex flex-col">
          {quirkyCapabilities.map((cap, i) => (
            <li key={cap.label}>
              <button
                type="button"
                className={cn(
                  'quirky-cap-item group w-full border-t border-[#1A1A1A]/10 py-4 text-left',
                  'transition-colors duration-200 hover:bg-[#FFD93D]/30 focus-visible:bg-[#FFD93D]/30 focus-visible:outline-none'
                )}
              >
                <span
                  className={cn(
                    'inline-flex items-baseline gap-4 font-medium leading-none tracking-[-0.02em] text-[#1A1A1A]',
                    'transition-transform duration-300 ease-out group-hover:translate-x-3',
                    SIZE_CLASSES[cap.size]
                  )}
                >
                  <span className="text-[11px] font-medium tabular-nums tracking-[0.15em] text-[#1A1A1A]/30">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {cap.label}
                  <span className="opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
                    →
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
