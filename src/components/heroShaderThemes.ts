export type HeroShaderTheme = 'light' | 'dark'

export type HeroShaderConfig = {
  overlay: string
  blob: {
    center: { x: number; y: number }
    size: number
    softness: number
    speed: number
  }
  solidColor: string
  worley: {
    balance: number
    colorA: string
    colorB: string
    colorSpace?: 'oklch' | 'hsl' | 'oklab'
    contrast: number
    persistence: number
    scale: number
    speed: number
  }
  linearBlurIntensity: number
  chromaticAberration: number
}

export const HERO_SHADER_THEMES: Record<HeroShaderTheme, HeroShaderConfig> = {
  light: {
    overlay: 'rgba(143, 143, 143, 0.15)',
    blob: {
      center: { x: 0.85, y: 0.16 },
      size: 0.85,
      softness: 1.5,
      speed: 0.8,
    },
    solidColor: '#999897',
    worley: {
      balance: -0.1,
      colorA: '#a69f9f',
      colorB: '#fffbf2',
      contrast: 0.85,
      persistence: 0.65,
      scale: 4,
      speed: 3.3,
    },
    linearBlurIntensity: 300,
    chromaticAberration: 0.15,
  },
  dark: {
    overlay: 'rgba(8, 10, 20, 0.18)',
    blob: {
      center: { x: 0.85, y: 0.16 },
      size: 0.85,
      softness: 1.5,
      speed: 0.8,
    },
    solidColor: '#0e0e17',
    worley: {
      balance: -0.1,
      colorA: '#101521',
      colorB: '#2a303d',
      contrast: 0.85,
      persistence: 0.65,
      scale: 4,
      speed: 3.3,
    },
    linearBlurIntensity: 300,
    chromaticAberration: 0.15,
  },
}

export const HERO_SHADER_TRANSITION_MS = 700

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

function parseHex(hex: string): [number, number, number] {
  const value = hex.replace('#', '')
  const normalized =
    value.length === 3
      ? value.split('').map((c) => c + c).join('')
      : value
  return [
    parseInt(normalized.slice(0, 2), 16),
    parseInt(normalized.slice(2, 4), 16),
    parseInt(normalized.slice(4, 6), 16),
  ]
}

function lerpHex(from: string, to: string, t: number) {
  const [fr, fg, fb] = parseHex(from)
  const [tr, tg, tb] = parseHex(to)
  const r = Math.round(lerp(fr, tr, t))
  const g = Math.round(lerp(fg, tg, t))
  const b = Math.round(lerp(fb, tb, t))
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

function parseRgba(rgba: string): [number, number, number, number] {
  const match = rgba.match(/rgba?\(([^)]+)\)/)
  if (!match) return [0, 0, 0, 1]
  const [r, g, b, a = '1'] = match[1].split(',').map((part) => part.trim())
  return [Number(r), Number(g), Number(b), Number(a)]
}

function lerpRgba(from: string, to: string, t: number) {
  const [fr, fg, fb, fa] = parseRgba(from)
  const [tr, tg, tb, ta] = parseRgba(to)
  const r = Math.round(lerp(fr, tr, t))
  const g = Math.round(lerp(fg, tg, t))
  const b = Math.round(lerp(fb, tb, t))
  const a = lerp(fa, ta, t)
  return `rgba(${r}, ${g}, ${b}, ${a})`
}

function compositeWithOverlay(baseHex: string, overlayRgba: string) {
  const [br, bg, bb] = parseHex(baseHex)
  const [or, og, ob, oa] = parseRgba(overlayRgba)
  const r = Math.round(br * (1 - oa) + or * oa)
  const g = Math.round(bg * (1 - oa) + og * oa)
  const b = Math.round(bb * (1 - oa) + ob * oa)
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

/** Bottom-edge fill derived from shader layer colors + overlay. */
export function deriveExtensionFill(config: HeroShaderConfig) {
  const base = lerpHex(config.solidColor, config.worley.colorA, 0.4)
  return compositeWithOverlay(base, config.overlay)
}

export function lerpHeroShaderConfig(
  from: HeroShaderConfig,
  to: HeroShaderConfig,
  t: number
): HeroShaderConfig {
  return {
    overlay: lerpRgba(from.overlay, to.overlay, t),
    blob: {
      center: {
        x: lerp(from.blob.center.x, to.blob.center.x, t),
        y: lerp(from.blob.center.y, to.blob.center.y, t),
      },
      size: lerp(from.blob.size, to.blob.size, t),
      softness: lerp(from.blob.softness, to.blob.softness, t),
      speed: lerp(from.blob.speed, to.blob.speed, t),
    },
    solidColor: lerpHex(from.solidColor, to.solidColor, t),
    worley: {
      balance: lerp(from.worley.balance, to.worley.balance, t),
      colorA: lerpHex(from.worley.colorA, to.worley.colorA, t),
      colorB: lerpHex(from.worley.colorB, to.worley.colorB, t),
      colorSpace: t < 0.5 ? from.worley.colorSpace : to.worley.colorSpace,
      contrast: lerp(from.worley.contrast, to.worley.contrast, t),
      persistence: lerp(from.worley.persistence, to.worley.persistence, t),
      scale: lerp(from.worley.scale, to.worley.scale, t),
      speed: lerp(from.worley.speed, to.worley.speed, t),
    },
    linearBlurIntensity: lerp(from.linearBlurIntensity, to.linearBlurIntensity, t),
    chromaticAberration: lerp(from.chromaticAberration, to.chromaticAberration, t),
  }
}

export function smoothstep(t: number) {
  return t * t * (3 - 2 * t)
}
