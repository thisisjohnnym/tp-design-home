'use client'

import { useEffect, useState } from 'react'

const STORAGE_KEY = 'tapestry-grid-overlay'

export function GridOverlay() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const fromUrl = params.get('grid')
    const stored = localStorage.getItem(STORAGE_KEY)

    if (fromUrl === '1' || fromUrl === 'true') {
      setVisible(true)
    } else if (fromUrl === '0' || fromUrl === 'false') {
      setVisible(false)
    } else if (stored !== null) {
      setVisible(stored === 'true')
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'g' || event.metaKey || event.ctrlKey || event.altKey) return

      const target = event.target
      if (
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT')
      ) {
        return
      }

      setVisible((current) => {
        const next = !current
        localStorage.setItem(STORAGE_KEY, String(next))
        return next
      })
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  if (!visible) return null

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[9999] px-[20px]"
      aria-hidden
    >
      <div className="grid h-full w-full grid-cols-24 gap-[8px]">
        {Array.from({ length: 24 }, (_, index) => (
          <div
            key={index}
            className="relative h-full bg-[rgba(255,59,48,0.05)] outline outline-1 outline-[rgba(255,59,48,0.18)]"
          >
            <span className="absolute top-2 left-1/2 -translate-x-1/2 font-mono text-[9px] leading-none text-[rgba(255,59,48,0.55)]">
              {index + 1}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
