'use client'

import Image from 'next/image'
import { useCallback, useState } from 'react'
import type { TeamMember } from '@/data/content'
import { cn } from '@/lib/utils'

type QuirkyTeamCardProps = {
  member: TeamMember
  rotation: number
  index: number
}

export function QuirkyTeamCard({ member, rotation, index }: QuirkyTeamCardProps) {
  const [hovered, setHovered] = useState(false)
  const accent = member.color ?? '#FF5722'

  const handleEnter = useCallback(() => setHovered(true), [])
  const handleLeave = useCallback(() => setHovered(false), [])

  return (
    <article
      className="quirky-team-card group relative outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A]/30"
      style={{
        transform: `rotate(${rotation}deg)`,
        transition: 'transform 400ms cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
      onPointerEnter={handleEnter}
      onPointerLeave={handleLeave}
      onFocus={handleEnter}
      onBlur={handleLeave}
      tabIndex={0}
      aria-label={`${member.name}, ${member.role}`}
    >
      <div
        className={cn(
          'relative aspect-[4/5] overflow-hidden border-2 border-[#1A1A1A]',
          'transition-transform duration-300 ease-out group-hover:scale-[1.03] group-focus-visible:scale-[1.03]'
        )}
        style={{ background: accent }}
      >
        <Image
          src={member.image}
          alt=""
          fill
          sizes="(max-width: 768px) 50vw, 20vw"
          className={cn(
            'object-cover transition-all duration-300',
            'max-md:scale-100 max-md:grayscale-0',
            hovered ? 'md:scale-105 md:grayscale-0' : 'md:scale-100 md:grayscale'
          )}
          priority={index < 2}
        />

        <div
          className={cn(
            'absolute inset-x-0 bottom-0 bg-[#1A1A1A] px-3 py-2 transition-transform duration-300 ease-out',
            'max-md:translate-y-0 md:translate-y-full',
            'md:group-hover:translate-y-0 md:group-focus-visible:translate-y-0'
          )}
        >
          <p className="text-[12px] leading-snug text-[#FAF3E8]">
            {member.emoji} {member.quirk}
          </p>
        </div>
      </div>

      <div className="mt-3 px-1">
        <p className="text-[clamp(0.875rem,1.5vw,1.125rem)] font-medium leading-tight text-[#1A1A1A]">
          {member.name}
        </p>
        <p className="mt-0.5 text-[12px] uppercase tracking-[0.08em] text-[#1A1A1A]/45">
          {member.role}
        </p>
      </div>
    </article>
  )
}
