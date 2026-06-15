import {
  lerpHeroShaderConfig,
  smoothstep,
  type HeroShaderConfig,
} from './heroShaderThemes'

/**
 * Warm, cinematic atmospheric fields — one per capability.
 * Same shader grammar as the hero (worley + blob + blur + aberration),
 * recoloured into matte warm-dark grounds so pale type/icons stay crisp.
 */
export const WHAT_WE_DO_FIELDS: HeroShaderConfig[] = [
  // 01 — Design Strategy · amber espresso
  {
    overlay: 'rgba(18, 12, 8, 0.28)',
    blob: { center: { x: 0.7, y: 0.28 }, size: 0.9, softness: 1.5, speed: 0.6 },
    solidColor: '#1b1611',
    worley: {
      balance: -0.1,
      colorA: '#241b12',
      colorB: '#c98a45',
      contrast: 0.85,
      persistence: 0.65,
      scale: 3.4,
      speed: 2.4,
    },
    linearBlurIntensity: 280,
    chromaticAberration: 0.16,
  },
  // 02 — Product Experience · deep olive
  {
    overlay: 'rgba(14, 16, 10, 0.28)',
    blob: { center: { x: 0.3, y: 0.34 }, size: 0.92, softness: 1.6, speed: 0.55 },
    solidColor: '#161811',
    worley: {
      balance: -0.1,
      colorA: '#1d2216',
      colorB: '#9fae63',
      contrast: 0.85,
      persistence: 0.65,
      scale: 3.6,
      speed: 2.2,
    },
    linearBlurIntensity: 300,
    chromaticAberration: 0.14,
  },
  // 03 — Interaction Design · terracotta clay
  {
    overlay: 'rgba(20, 11, 8, 0.28)',
    blob: { center: { x: 0.62, y: 0.2 }, size: 0.88, softness: 1.4, speed: 0.7 },
    solidColor: '#1d1410',
    worley: {
      balance: -0.1,
      colorA: '#291813',
      colorB: '#cd6f4c',
      contrast: 0.85,
      persistence: 0.65,
      scale: 3.2,
      speed: 2.8,
    },
    linearBlurIntensity: 260,
    chromaticAberration: 0.18,
  },
  // 04 — Research Collaboration · warm umber taupe
  {
    overlay: 'rgba(18, 14, 9, 0.28)',
    blob: { center: { x: 0.4, y: 0.24 }, size: 0.94, softness: 1.6, speed: 0.5 },
    solidColor: '#1a1610',
    worley: {
      balance: -0.1,
      colorA: '#241e16',
      colorB: '#bfa172',
      contrast: 0.82,
      persistence: 0.65,
      scale: 3.8,
      speed: 2.0,
    },
    linearBlurIntensity: 320,
    chromaticAberration: 0.13,
  },
  // 05 — Prototyping · rosewood mauve
  {
    overlay: 'rgba(18, 10, 12, 0.28)',
    blob: { center: { x: 0.68, y: 0.32 }, size: 0.9, softness: 1.5, speed: 0.65 },
    solidColor: '#1b1316',
    worley: {
      balance: -0.1,
      colorA: '#27181f',
      colorB: '#b86f7e',
      contrast: 0.85,
      persistence: 0.65,
      scale: 3.4,
      speed: 2.6,
    },
    linearBlurIntensity: 280,
    chromaticAberration: 0.17,
  },
]

/** Neutral, muted field shown while no capability is hovered. */
export const WWD_RESTING_FIELD: HeroShaderConfig = {
  overlay: 'rgba(16, 13, 9, 0.3)',
  blob: { center: { x: 0.5, y: 0.28 }, size: 0.95, softness: 1.7, speed: 0.4 },
  solidColor: '#17130e',
  worley: {
    balance: -0.1,
    colorA: '#1f1a14',
    colorB: '#6b6253',
    contrast: 0.8,
    persistence: 0.65,
    scale: 4,
    speed: 1.6,
  },
  linearBlurIntensity: 320,
  chromaticAberration: 0.1,
}

export { lerpHeroShaderConfig, smoothstep }
export type { HeroShaderConfig }
