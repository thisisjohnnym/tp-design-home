'use client'

import { StickerPlaygroundLazy } from '@/components/stickers/StickerPlaygroundLazy'

export function HeroVisualPanel() {
  return (
    <div className="hero-v2__panel hero-v2__panel--visual flex min-h-0 flex-col">
      <StickerPlaygroundLazy />
    </div>
  )
}
