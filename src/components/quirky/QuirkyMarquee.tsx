import { teamMarquee } from '@/data/content'

export function QuirkyMarquee() {
  const items = [...teamMarquee, ...teamMarquee]

  return (
    <div
      className="quirky-marquee overflow-hidden border-y border-[#1A1A1A]/15 bg-[#FFD93D] py-3"
      aria-hidden
    >
      <div className="quirky-marquee__track flex w-max gap-8">
        {items.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="flex shrink-0 items-center gap-8 text-[14px] font-medium uppercase tracking-[0.12em] text-[#1A1A1A]"
          >
            {item}
            <span className="text-[#FF5722]">✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}
