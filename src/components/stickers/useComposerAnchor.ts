'use client'

import { useEffect, useState, type RefObject } from 'react'

const COMPOSER_HEIGHT = 58
const COMPOSER_BOTTOM_GAP = 24
const COMPOSER_MAX_WIDTH = 520
const COMPOSER_HORIZONTAL_INSET = 20

export type ComposerAnchor = {
  left: number
  top: number
  width: number
  visible: boolean
}

export function useComposerAnchor(
  anchorRef: RefObject<HTMLElement | null>
): ComposerAnchor | null {
  const [anchor, setAnchor] = useState<ComposerAnchor | null>(null)

  useEffect(() => {
    const el = anchorRef.current
    if (!el) return

    const update = () => {
      const rect = el.getBoundingClientRect()
      const width = Math.min(
        COMPOSER_MAX_WIDTH,
        Math.max(0, rect.width - COMPOSER_HORIZONTAL_INSET * 2)
      )
      const left = rect.left + (rect.width - width) / 2
      const top = rect.bottom - COMPOSER_BOTTOM_GAP - COMPOSER_HEIGHT
      const visible =
        width > 0 && rect.bottom > 0 && rect.top < window.innerHeight

      setAnchor({ left, top, width, visible })
    }

    update()

    const observer = new ResizeObserver(update)
    observer.observe(el)
    window.addEventListener('resize', update, { passive: true })
    window.addEventListener('scroll', update, { passive: true })

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', update)
      window.removeEventListener('scroll', update)
    }
  }, [anchorRef])

  return anchor
}
