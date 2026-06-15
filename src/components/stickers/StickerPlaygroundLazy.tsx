'use client'

import dynamic from 'next/dynamic'

export const StickerPlaygroundLazy = dynamic(
  () =>
    import('@/components/stickers/StickerPlayground').then((m) => ({
      default: m.StickerPlayground,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="sticker-playground flex min-h-0 flex-1 flex-col" aria-hidden>
        <div className="sticker-playground__toolbar flex shrink-0 items-center justify-center gap-6 px-4 py-3" />
        <div className="sticker-playground__canvas relative min-h-[240px] flex-1" />
      </div>
    ),
  }
)
