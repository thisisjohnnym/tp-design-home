'use client'

import { useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import dynamic from 'next/dynamic'
import { HeroThemeSwitcher } from './HeroThemeSwitcher'
import type { HeroShaderTheme } from './heroShaderThemes'
import { useAnimatedHeroShader } from './useAnimatedHeroShader'
import { syncHeroExpansion, useHeroScrollExpansion } from './useHeroScrollProgress'

const LandingPageHeroShaderClient = dynamic(
  () => import('./LandingPageHeroShaderClient'),
  { ssr: false }
)

const HERO_PAD = 20
/** Extra shader scroll room below the paragraph before cream content floats over. */
const HERO_SCROLL_TAIL_VH = 0.22

interface HeroSectionProps {
  teamFunction: ReactNode
}

export function HeroSection({ teamFunction }: HeroSectionProps) {
  const [theme, setTheme] = useState<HeroShaderTheme>('light')
  const shellRef = useRef<HTMLElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const teamRef = useRef<HTMLDivElement>(null)
  const { config: shaderConfig, preset: shaderPreset } = useAnimatedHeroShader(theme)

  useHeroScrollExpansion(shellRef)

  useLayoutEffect(() => {
    const shell = shellRef.current
    if (!shell) return

    const updateViewport = () => {
      const viewportInner = Math.max(0, window.innerHeight - 2 * HERO_PAD)
      shell.style.setProperty('--hero-viewport-inner', `${viewportInner}px`)
      shell.style.setProperty(
        '--hero-scroll-tail',
        `${Math.round(window.innerHeight * HERO_SCROLL_TAIL_VH)}px`
      )
      syncHeroExpansion(shell)
    }

    updateViewport()
    window.addEventListener('resize', updateViewport)
    return () => window.removeEventListener('resize', updateViewport)
  }, [])

  useLayoutEffect(() => {
    const shell = shellRef.current
    const heroEl = heroRef.current
    const teamEl = teamRef.current
    if (!shell || !heroEl || !teamEl) return

    const measure = () => {
      const heroNatural = heroEl.offsetHeight
      const teamHeight = teamEl.offsetHeight
      const scrollTail = Math.round(window.innerHeight * HERO_SCROLL_TAIL_VH)
      shell.style.setProperty('--hero-hero-natural', `${heroNatural}px`)
      shell.style.setProperty('--hero-scroll-tail', `${scrollTail}px`)
      shell.style.setProperty(
        '--hero-expanded-inner',
        `${heroNatural + teamHeight + scrollTail}px`
      )
      syncHeroExpansion(shell)
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(heroEl)
    observer.observe(teamEl)
    return () => observer.disconnect()
  }, [teamFunction])

  return (
    <section ref={shellRef} data-hero-section className="hero-section relative">
      <div className="hero-section__inner">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <LandingPageHeroShaderClient preset={shaderPreset} />
          <div
            className="absolute inset-0"
            style={{ background: shaderConfig.overlay }}
          />
        </div>

        <HeroThemeSwitcher theme={theme} onChange={setTheme} />

        <div className="relative z-10">
          <div
            className="hero-headline-shell flex flex-col justify-end"
            style={{ minHeight: 'var(--hero-headline-min)' }}
          >
            <div ref={heroRef} className="hero-headline-grid pt-[120px] pb-[clamp(160px,14dvh,360px)]">
              <div className="hero-headline-content">
                <h1
                  className="font-medium leading-none tracking-[0.2px] text-white"
                  style={{ fontSize: '72px' }}
                >
                  Crafting with intention.
                </h1>

                <div
                  className="my-6 h-px w-full"
                  style={{ background: 'rgba(255, 255, 255, 0.55)' }}
                />

                <p
                  className="ml-auto max-w-[485px] text-right font-normal leading-[1.3] tracking-[0.2px] text-white"
                  style={{ fontSize: '24px' }}
                >
                  Creative agency building experiences for Tapestry brands.
                </p>
              </div>
            </div>
          </div>

          <div
            ref={teamRef}
            data-team-function
            className="hero-headline-grid pb-[150px] pt-[200px]"
          >
            <div className="hero-grid-span-1-24">{teamFunction}</div>
          </div>

          <div
            className="hero-scroll-tail shrink-0"
            style={{ height: 'var(--hero-scroll-tail, 0px)' }}
            aria-hidden
          />
        </div>
      </div>
    </section>
  )
}
