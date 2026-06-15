'use client'

import { StickerPlaygroundLazy } from '@/components/stickers/StickerPlaygroundLazy'

type StickerCanvasPanelProps = {
  className?: string
}

export function StickerCanvasPanel({ className }: StickerCanvasPanelProps) {
  return (
    <div className={className}>
      <StickerPlaygroundLazy />
    </div>
  )
}
