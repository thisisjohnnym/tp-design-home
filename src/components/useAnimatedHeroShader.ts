'use client'

import { useEffect, useRef, useState } from 'react'
import {
  HERO_SHADER_THEMES,
  HERO_SHADER_TRANSITION_MS,
  lerpHeroShaderConfig,
  smoothstep,
  type HeroShaderConfig,
  type HeroShaderTheme,
} from './heroShaderThemes'

export function useAnimatedHeroShader(target: HeroShaderTheme) {
  const configRef = useRef<HeroShaderConfig>(HERO_SHADER_THEMES[target])
  const [config, setConfig] = useState<HeroShaderConfig>(HERO_SHADER_THEMES[target])

  useEffect(() => {
    const from = configRef.current
    const to = HERO_SHADER_THEMES[target]
    const reducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reducedMotion) {
      configRef.current = to
      setConfig(to)
      return
    }

    const start = performance.now()
    let frame = 0

    const tick = (now: number) => {
      const raw = Math.min(1, (now - start) / HERO_SHADER_TRANSITION_MS)
      const eased = smoothstep(raw)
      const next = lerpHeroShaderConfig(from, to, eased)
      configRef.current = next
      setConfig(next)

      if (raw < 1) {
        frame = requestAnimationFrame(tick)
      } else {
        configRef.current = to
        setConfig(to)
      }
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [target])

  return config
}
