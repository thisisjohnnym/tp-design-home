'use client'

import { createPortal } from 'react-dom'
import { useEffect, useState, type RefObject } from 'react'
import { cn } from '@/lib/utils'
import { useComposerAnchor } from './useComposerAnchor'

type StickerComposerProps = {
  anchorRef: RefObject<HTMLElement | null>
  prompt: string
  generating: boolean
  error: string | null
  onPromptChange: (value: string) => void
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
}

function PlusIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 6v12M6 12h12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function StickerComposer({
  anchorRef,
  prompt,
  generating,
  error,
  onPromptChange,
  onSubmit,
}: StickerComposerProps) {
  const anchor = useComposerAnchor(anchorRef)
  const [mounted, setMounted] = useState(false)
  const hasText = prompt.trim().length > 0

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !anchor?.visible) return null

  const composer = (
    <div
      className="sticker-composer-wrap pointer-events-none flex flex-col items-center gap-2"
      style={{
        position: 'fixed',
        left: anchor.left,
        top: anchor.top,
        width: anchor.width,
        zIndex: 100,
      }}
      data-sticker-composer
    >
      <form
        className={cn('sticker-composer pointer-events-auto', hasText && 'sticker-composer--active')}
        onSubmit={onSubmit}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <div className="sticker-composer__field">
          {!prompt && !generating ? (
            <span className="sticker-composer__placeholder" aria-hidden>
              Make your own sticker. Try&nbsp;&apos;a sleepy cat&apos;.
            </span>
          ) : null}
          {generating ? (
            <span className="sticker-composer__placeholder sticker-composer__status" aria-hidden>
              Making your sticker…
            </span>
          ) : null}
          <input
            type="text"
            value={prompt}
            onChange={(e) => onPromptChange(e.target.value)}
            disabled={generating}
            maxLength={280}
            className={cn(
              'sticker-composer__input',
              generating && 'sticker-composer__input--hidden'
            )}
            aria-label="Describe a sticker to generate"
          />
        </div>

        {hasText || generating ? (
          <button
            type="submit"
            disabled={generating || !hasText}
            className="sticker-composer__make"
            aria-label="Make sticker"
          >
            <span>Make</span>
            <PlusIcon />
          </button>
        ) : null}
      </form>

      {error ? (
        <p className="sticker-composer__error pointer-events-auto">{error}</p>
      ) : null}
    </div>
  )

  return createPortal(composer, document.body)
}
