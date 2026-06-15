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
import {
  HERO_SHADER_PRESET_DARK,
  HERO_SHADER_PRESET_LIGHT,
  lerpHeroShaderPreset,
  type HeroShaderPreset,
} from './heroShaderPresets'

const PRESETS: Record<HeroShaderTheme, HeroShaderPreset> = {
  light: HERO_SHADER_PRESET_LIGHT,
  dark: HERO_SHADER_PRESET_DARK,
}

export function useAnimatedHeroShader(target: HeroShaderTheme) {
  const configRef = useRef<HeroShaderConfig>(HERO_SHADER_THEMES[target])
  const presetRef = useRef<HeroShaderPreset>(PRESETS[target])
  const [config, setConfig] = useState<HeroShaderConfig>(HERO_SHADER_THEMES[target])
  const [preset, setPreset] = useState<HeroShaderPreset>(PRESETS[target])

  useEffect(() => {
    const fromConfig = configRef.current
    const toConfig = HERO_SHADER_THEMES[target]
    const fromPreset = presetRef.current
    const toPreset = PRESETS[target]
    const reducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reducedMotion) {
      configRef.current = toConfig
      presetRef.current = toPreset
      setConfig(toConfig)
      setPreset(toPreset)
      return
    }

    const start = performance.now()
    let frame = 0

    const tick = (now: number) => {
      const raw = Math.min(1, (now - start) / HERO_SHADER_TRANSITION_MS)
      const eased = smoothstep(raw)
      const nextConfig = lerpHeroShaderConfig(fromConfig, toConfig, eased)
      const nextPreset = lerpHeroShaderPreset(fromPreset, toPreset, eased)
      configRef.current = nextConfig
      presetRef.current = nextPreset
      setConfig(nextConfig)
      setPreset(nextPreset)

      if (raw < 1) {
        frame = requestAnimationFrame(tick)
      } else {
        configRef.current = toConfig
        presetRef.current = toPreset
        setConfig(toConfig)
        setPreset(toPreset)
      }
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [target])

  return { config, preset }
}
