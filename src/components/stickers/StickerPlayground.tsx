'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { StickerComposer } from './StickerComposer'
import { STICKERS, type StickerDef } from './stickerCatalog'

type PlacedSticker = {
  uid: string
  stickerId: string
  src: string
  x: number
  y: number
  rotation: number
  scale: number
  z: number
}

let uidCounter = 0
function nextUid() {
  return `sticker-${++uidCounter}`
}

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min)
}

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)]
}

function seedStickers(pool: StickerDef[], count: number): PlacedSticker[] {
  const shuffled = [...pool].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count).map((sticker, i) => ({
    uid: nextUid(),
    stickerId: sticker.id,
    src: sticker.src,
    x: randomBetween(12, 72),
    y: randomBetween(14, 68),
    rotation: randomBetween(-28, 28),
    scale: randomBetween(0.85, 1.1),
    z: i + 1,
  }))
}

function pointerToPercent(
  clientX: number,
  clientY: number,
  rect: DOMRect
): { x: number; y: number } {
  if (rect.width <= 0 || rect.height <= 0) {
    return { x: 50, y: 50 }
  }
  const x = ((clientX - rect.left) / rect.width) * 100
  const y = ((clientY - rect.top) / rect.height) * 100
  return {
    x: Math.min(92, Math.max(8, x)),
    y: Math.min(88, Math.max(8, y)),
  }
}

function OrganizeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
      <rect x="1" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.2" />
      <rect x="9" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.2" />
      <rect x="1" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.2" />
      <rect x="9" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  )
}

function ShuffleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M2 5h8M10 5l2-2M10 5l2 2M14 11H6M4 11l-2-2M4 11l-2 2"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function RemoveAllIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M3 5h10M6 5V3.5h4V5M5.5 5l.5 8h4l.5-8"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7 7.5v4M9 7.5v4"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  )
}

function StampSticker({ src }: { src: string }) {
  return (
    <div className="sticker-stamp relative select-none">
      <div className="sticker-stamp__inner">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt=""
          className="pointer-events-none block h-auto w-full"
          draggable={false}
        />
      </div>
    </div>
  )
}

function StickerSkeleton() {
  return (
    <div className="sticker-skeleton" aria-hidden>
      <div className="sticker-skeleton__spin">
        <img
          src="/stickers/flower-loader.svg"
          alt=""
          className="sticker-skeleton__flower"
        />
        <div className="sticker-skeleton__flower-pulse" />
      </div>
    </div>
  )
}

type PendingSticker = {
  uid: string
  x: number
  y: number
  rotation: number
  scale: number
  z: number
}

const DRAG_THRESHOLD_PX = 6

export function StickerPlayground() {
  const canvasRef = useRef<HTMLDivElement>(null)
  const zCounter = useRef(10)
  const addStickerRef = useRef<(sticker: StickerDef, at?: { x: number; y: number }) => void>(
    () => {}
  )
  const dragRef = useRef<{
    uid: string
    offsetX: number
    offsetY: number
    pointerId: number
    startX: number
    startY: number
    moved: boolean
  } | null>(null)

  const [placed, setPlaced] = useState<PlacedSticker[]>([])
  const placedRef = useRef(placed)
  placedRef.current = placed
  const [selected, setSelected] = useState<string | null>(null)
  const [prompt, setPrompt] = useState('')
  const [generating, setGenerating] = useState(false)
  const [pendingSticker, setPendingSticker] = useState<PendingSticker | null>(null)
  const [genError, setGenError] = useState<string | null>(null)

  useEffect(() => {
    setPlaced(seedStickers(STICKERS, 3))
  }, [])

  const bringToFront = useCallback((uid: string) => {
    zCounter.current += 1
    setPlaced((prev) =>
      prev.map((s) => (s.uid === uid ? { ...s, z: zCounter.current } : s))
    )
  }, [])

  const addSticker = useCallback(
    (sticker: StickerDef, at?: { x: number; y: number }, pending?: PendingSticker) => {
      zCounter.current += 1
      const item: PlacedSticker = {
        uid: nextUid(),
        stickerId: sticker.id,
        src: sticker.src,
        x: at?.x ?? pending?.x ?? randomBetween(18, 62),
        y: at?.y ?? pending?.y ?? randomBetween(20, 58),
        rotation: pending?.rotation ?? randomBetween(-24, 24),
        scale: pending?.scale ?? randomBetween(0.9, 1.05),
        z: zCounter.current,
      }
      setPlaced((prev) => [...prev, item])
      setSelected(item.uid)
    },
    []
  )

  addStickerRef.current = addSticker

  const placeStickerAt = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const at = pointerToPercent(clientX, clientY, canvas.getBoundingClientRect())
    addStickerRef.current(pickRandom(STICKERS), at)
  }, [])

  const removeSticker = useCallback((uid: string) => {
    setPlaced((prev) => prev.filter((s) => s.uid !== uid))
    setSelected((cur) => (cur === uid ? null : cur))
  }, [])

  const handleShuffle = useCallback(() => {
    setPlaced((prev) =>
      prev.map((s) => ({
        ...s,
        x: randomBetween(8, 78),
        y: randomBetween(10, 72),
        rotation: randomBetween(-35, 35),
        scale: randomBetween(0.8, 1.15),
      }))
    )
  }, [])

  const handleRemoveAll = useCallback(() => {
    setPlaced([])
    setSelected(null)
  }, [])

  const handleGenerateSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      const text = prompt.trim()
      if (!text || generating) return

      setGenerating(true)
      setGenError(null)

      zCounter.current += 1
      const pending: PendingSticker = {
        uid: nextUid(),
        x: randomBetween(35, 65),
        y: randomBetween(32, 58),
        rotation: randomBetween(-16, 16),
        scale: randomBetween(0.95, 1.05),
        z: zCounter.current,
      }
      setPendingSticker(pending)

      try {
        const res = await fetch('/api/stickers/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: text }),
        })

        let data: { error?: string; id?: string; src?: string; label?: string }
        try {
          data = (await res.json()) as typeof data
        } catch {
          throw new Error('Server error. Is the dev server running?')
        }

        if (!res.ok || !data.src || !data.id) {
          throw new Error(data.error ?? 'Sticker generation failed.')
        }

        addSticker(
          { id: data.id, src: data.src, label: data.label ?? text },
          { x: pending.x, y: pending.y },
          pending
        )
        setPrompt('')
      } catch (err) {
        setGenError(err instanceof Error ? err.message : 'Sticker generation failed.')
      } finally {
        setPendingSticker(null)
        setGenerating(false)
      }
    },
    [addSticker, generating, prompt]
  )

  const handleOrganize = useCallback(() => {
    setPlaced((prev) => {
      const cols = Math.ceil(Math.sqrt(prev.length))
      const cellW = 72 / cols
      const cellH = 58 / cols
      return prev.map((s, i) => {
        const col = i % cols
        const row = Math.floor(i / cols)
        return {
          ...s,
          x: 14 + col * cellW + cellW * 0.15,
          y: 18 + row * cellH + cellH * 0.1,
          rotation: (col % 2 === 0 ? -1 : 1) * (4 + (i % 3) * 2),
          scale: 0.95,
        }
      })
    })
  }, [])

  const onCanvasPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.button !== 0) return
      if ((e.target as HTMLElement).closest('[data-sticker]')) return
      if ((e.target as HTMLElement).closest('[data-sticker-composer]')) return
      placeStickerAt(e.clientX, e.clientY)
    },
    [placeStickerAt]
  )

  const onStickerPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>, uid: string) => {
      e.stopPropagation()
      const canvas = canvasRef.current
      if (!canvas) return
      const rect = canvas.getBoundingClientRect()
      const sticker = placedRef.current.find((s) => s.uid === uid)
      if (!sticker) return

      const px = (sticker.x / 100) * rect.width
      const py = (sticker.y / 100) * rect.height

      setSelected(uid)
      bringToFront(uid)
      dragRef.current = {
        uid,
        offsetX: e.clientX - rect.left - px,
        offsetY: e.clientY - rect.top - py,
        pointerId: e.pointerId,
        startX: e.clientX,
        startY: e.clientY,
        moved: false,
      }
      canvas.setPointerCapture(e.pointerId)
    },
    [bringToFront]
  )

  useEffect(() => {
    const onPointerMove = (e: PointerEvent) => {
      const drag = dragRef.current
      if (!drag || drag.pointerId !== e.pointerId) return

      const dx = e.clientX - drag.startX
      const dy = e.clientY - drag.startY
      if (!drag.moved && Math.hypot(dx, dy) > DRAG_THRESHOLD_PX) {
        drag.moved = true
      }
      if (!drag.moved) return

      const canvas = canvasRef.current
      if (!canvas) return
      const rect = canvas.getBoundingClientRect()
      const x = ((e.clientX - rect.left - drag.offsetX) / rect.width) * 100
      const y = ((e.clientY - rect.top - drag.offsetY) / rect.height) * 100

      setPlaced((prev) =>
        prev.map((s) =>
          s.uid === drag.uid
            ? {
                ...s,
                x: Math.min(92, Math.max(4, x)),
                y: Math.min(88, Math.max(6, y)),
              }
            : s
        )
      )
    }

    const onPointerEnd = (e: PointerEvent) => {
      const drag = dragRef.current
      if (!drag || drag.pointerId !== e.pointerId) return

      dragRef.current = null
      canvasRef.current?.releasePointerCapture(e.pointerId)
    }

    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerEnd)
    window.addEventListener('pointercancel', onPointerEnd)
    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerEnd)
      window.removeEventListener('pointercancel', onPointerEnd)
    }
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && selected) {
        removeSticker(selected)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [removeSticker, selected])

  return (
    <div className="sticker-playground flex min-h-0 flex-1 flex-col">
      <div className="sticker-playground__toolbar flex shrink-0 items-center justify-center gap-6 px-4 py-3">
        <button
          type="button"
          onClick={handleOrganize}
          className="sticker-playground__tool flex items-center gap-1.5"
        >
          <OrganizeIcon />
          <span>organize</span>
        </button>
        <button
          type="button"
          onClick={handleShuffle}
          className="sticker-playground__tool flex items-center gap-1.5"
        >
          <ShuffleIcon />
          <span>shuffle</span>
        </button>
        <button
          type="button"
          onClick={handleRemoveAll}
          disabled={placed.length === 0}
          className="sticker-playground__tool flex items-center gap-1.5 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <RemoveAllIcon />
          <span>remove all</span>
        </button>
      </div>

      <div
        ref={canvasRef}
        className="sticker-playground__canvas relative min-h-[240px] flex-1 cursor-crosshair touch-none"
        role="presentation"
        onPointerDown={onCanvasPointerDown}
      >
        <StickerComposer
          anchorRef={canvasRef}
          prompt={prompt}
          generating={generating}
          error={genError}
          onPromptChange={(value) => {
            setPrompt(value)
            if (genError) setGenError(null)
          }}
          onSubmit={handleGenerateSubmit}
        />

        <div className="sticker-playground__holes pointer-events-none absolute top-0 bottom-0 left-3 z-[1] flex w-5 flex-col justify-evenly py-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className="sticker-playground__hole" />
          ))}
        </div>

        {pendingSticker ? (
          <div
            className="sticker-playground__pending pointer-events-none absolute"
            style={{
              left: `${pendingSticker.x}%`,
              top: `${pendingSticker.y}%`,
              transform: `translate(-50%, -50%) rotate(${pendingSticker.rotation}deg) scale(${pendingSticker.scale})`,
              zIndex: pendingSticker.z,
              width: 'clamp(80px, 16vw, 128px)',
            }}
            aria-busy="true"
            aria-label="Generating sticker"
          >
            <StickerSkeleton />
          </div>
        ) : null}

        {placed.map((item) => (
          <div
            key={item.uid}
            data-sticker
            className={cn(
              'absolute cursor-grab touch-none active:cursor-grabbing',
              selected === item.uid && 'sticker-playground__placed--selected'
            )}
            style={{
              left: `${item.x}%`,
              top: `${item.y}%`,
              transform: `translate(-50%, -50%) rotate(${item.rotation}deg) scale(${item.scale})`,
              zIndex: item.z,
              width: 'clamp(80px, 16vw, 128px)',
            }}
            onPointerDown={(e) => onStickerPointerDown(e, item.uid)}
            onDoubleClick={() => removeSticker(item.uid)}
          >
            <StampSticker src={item.src} />
          </div>
        ))}
      </div>
    </div>
  )
}
