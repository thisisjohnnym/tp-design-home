import { cn } from '@/lib/utils'

export type Capability = {
  index: string
  name: string
  note: string
  graphic: 'strategy' | 'product' | 'interaction' | 'research' | 'prototyping'
}

const INK = 'var(--page-ink)'
const MUTED = 'var(--page-label)'
/** Warm greige tile on cream ground — matches WhatWeDoShowcase. */
const TILE_BG = '#e3ded7'
const INTRO =
  'Five disciplines. One team. Built for Tapestry product surfaces.'

export const CAPABILITIES: Capability[] = [
  {
    index: '01',
    name: 'Design Strategy',
    note: 'Scoping, prioritization, and alignment with product direction.',
    graphic: 'strategy',
  },
  {
    index: '02',
    name: 'Product Design',
    note: 'End-to-end UX across web and mobile product surfaces.',
    graphic: 'product',
  },
  {
    index: '03',
    name: 'Interaction Design',
    note: 'Flows, micro-interactions, and behavior that feels right.',
    graphic: 'interaction',
  },
  {
    index: '04',
    name: 'Research Collaboration',
    note: 'Synthesis and integration of user insight into decisions.',
    graphic: 'research',
  },
  {
    index: '05',
    name: 'High-fidelity Prototyping',
    note: 'High-fidelity exploration and stakeholder communication.',
    graphic: 'prototyping',
  },
]

const L = 1

export function Graphic({ kind, className }: { kind: Capability['graphic']; className?: string }) {
  const props = {
    viewBox: '0 0 100 100',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
    className: cn('wwd-icon h-[96px] w-[96px] shrink-0', className),
  }

  switch (kind) {
    case 'strategy':
      // Venn + hatch — "Listen" mark from the reference video.
      return (
        <svg {...props}>
          <defs>
            <clipPath id="wwd-venn-hatch">
              <circle cx="50" cy="50" r="9" />
            </clipPath>
          </defs>
          <circle cx="50" cy="38" r="22" pathLength={L} />
          <circle cx="36" cy="60" r="22" pathLength={L} />
          <circle cx="64" cy="60" r="22" pathLength={L} />
          <g clipPath="url(#wwd-venn-hatch)">
            {Array.from({ length: 9 }, (_, i) => (
              <line
                key={i}
                x1={41 + i * 2.2}
                y1={42}
                x2={41 + i * 2.2 - 14}
                y2={58}
                strokeWidth={0.6}
                pathLength={L}
              />
            ))}
          </g>
        </svg>
      )
    case 'product':
      // Layered surfaces — staggered frames reading as product screens.
      return (
        <svg {...props}>
          <rect x="14" y="20" width="46" height="34" rx="4" pathLength={L} />
          <rect x="26" y="33" width="46" height="34" rx="4" pathLength={L} />
          <rect x="38" y="46" width="46" height="34" rx="4" pathLength={L} />
        </svg>
      )
    case 'interaction':
      // Tap ripple — pointer node with concentric response rings.
      return (
        <svg {...props}>
          <circle cx="50" cy="50" r="5" pathLength={L} />
          <circle cx="50" cy="50" r="16" pathLength={L} />
          <circle cx="50" cy="50" r="27" pathLength={L} />
          <circle cx="50" cy="50" r="38" pathLength={L} />
        </svg>
      )
    case 'research':
      // Connected nodes — a small network reading as collaboration.
      return (
        <svg {...props}>
          <path d="M28 30 72 26 78 60 44 78 20 54Z" pathLength={L} />
          <path d="M28 30 78 60" pathLength={L} />
          <path d="M72 26 44 78" pathLength={L} />
          <path d="M20 54 72 26" pathLength={L} />
          <circle cx="28" cy="30" r="5" pathLength={L} />
          <circle cx="72" cy="26" r="5" pathLength={L} />
          <circle cx="78" cy="60" r="5" pathLength={L} />
          <circle cx="44" cy="78" r="5" pathLength={L} />
          <circle cx="20" cy="54" r="5" pathLength={L} />
        </svg>
      )
    case 'prototyping':
      // Paper plane — "Ship" mark from the reference video.
      return (
        <svg {...props}>
          <path d="M18 58 82 22 52 78 44 54Z" pathLength={L} />
          <path d="M82 22 44 54" pathLength={L} />
        </svg>
      )
  }
}

export function WhatWeDo() {
  return (
    <section className="flex flex-col gap-10">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:gap-8">
        <h2
          className="shrink-0 font-medium leading-none"
          style={{ color: INK, fontSize: 'clamp(3rem, 6vw, 5rem)' }}
        >
          What we do
        </h2>

        <div
          className="hidden h-20 w-px shrink-0 lg:block"
          style={{ background: 'var(--page-rule)' }}
          aria-hidden
        />

        <p
          className="max-w-[360px] text-[14px] leading-relaxed lg:pb-1"
          style={{ color: MUTED }}
        >
          {INTRO}
        </p>
      </div>

      <div
        className="-mx-[20px] flex snap-x snap-mandatory gap-3 overflow-x-auto px-[20px] lg:mx-0 lg:grid lg:grid-cols-5 lg:overflow-visible lg:px-0"
        style={{ color: INK }}
      >
        {CAPABILITIES.map((item) => (
          <article
            key={item.name}
            tabIndex={0}
            aria-label={`${item.name}. ${item.note}`}
            className={cn(
              'wwd-cell group relative flex min-h-[360px] w-[253px] shrink-0 snap-center flex-col justify-between',
              'rounded-2xl px-5 py-6 outline-none transition-[filter] duration-300',
              'lg:w-auto',
              'hover:brightness-[0.97] focus-visible:brightness-[0.97]',
              'focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-black/15'
            )}
            style={{ background: TILE_BG }}
          >
            {/* Figma: 72px top band — index left, 52px icon right */}
            <div className="flex h-[72px] items-start justify-between">
              <span
                className="text-[11px] font-medium tabular-nums leading-none tracking-[0.04em]"
                style={{ color: MUTED }}
              >
                {item.index}
              </span>
              <div className="transition-transform duration-500 ease-out group-hover:scale-[1.06] group-focus-within:scale-[1.06]">
                <Graphic kind={item.graphic} className="h-[52px] w-[52px]" />
              </div>
            </div>

            {/* Figma: title + note stacked directly below, 10px gap */}
            <div className="flex flex-col gap-2.5">
              <h3 className="text-[20px] font-medium leading-[22px]">{item.name}</h3>
              <p className="text-[12px] leading-4" style={{ color: MUTED }}>
                {item.note}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
