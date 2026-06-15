export type HeroShaderPreset = {
  solidColor: string
  worleyColorA: string
  worleyColorB: string
  worleyContrast: number
  worleyPersistence: number
  worleyScale: number
  worleySeed: number
  worleySpeed: number
  worleyLacunarity: number
  worleyBalance: number
  blobCenter: { x: number; y: number }
  blobSize: number
  blobSoftness: number
  blobSpeed: number
  blobDeform: number
  blurIntensity: number
  blurAngle: number
  chromaticAberration: number
  /** Bias Worley output toward colorB inside the blob mask. */
  highlightBias: number
  /** Final composite color grade (rgb multiplier). */
  grade: [number, number, number]
  /** Scales config chromaticAberration in composite pass. */
  caGain: number
  caMaskMin: number
  caMaskMax: number
}

/** Shaders.com "Afternoon Sunlight 2" — warm gray + cream blob. */
export const HERO_SHADER_PRESET_LIGHT: HeroShaderPreset = {
  solidColor: '#9d9d9d',
  worleyColorA: '#a69f9f',
  worleyColorB: '#fcf8f0',
  worleyContrast: 0.55,
  worleyPersistence: 1.0,
  worleyScale: 4.0,
  worleySeed: 33.0,
  worleySpeed: 3.3,
  worleyLacunarity: 2.3,
  worleyBalance: 0,
  blobCenter: { x: 0.85, y: 0.16 },
  blobSize: 0.85,
  blobSoftness: 1.5,
  blobSpeed: 0.8,
  blobDeform: 0.5,
  blurIntensity: 275,
  blurAngle: -135,
  chromaticAberration: 0.15,
  highlightBias: 0.1,
  grade: [1.02, 1.0, 0.975],
  caGain: 0.38,
  caMaskMin: 0.7,
  caMaskMax: 0.9,
}

/** Dark counterpart — navy ground, cool slate highlight in top-right blob. */
export const HERO_SHADER_PRESET_DARK: HeroShaderPreset = {
  solidColor: '#0e0e17',
  worleyColorA: '#101521',
  worleyColorB: '#2a303d',
  worleyContrast: 0.55,
  worleyPersistence: 1.0,
  worleyScale: 4.0,
  worleySeed: 33.0,
  worleySpeed: 3.3,
  worleyLacunarity: 2.3,
  worleyBalance: 0,
  blobCenter: { x: 0.85, y: 0.16 },
  blobSize: 0.85,
  blobSoftness: 1.5,
  blobSpeed: 0.8,
  blobDeform: 0.5,
  blurIntensity: 275,
  blurAngle: -135,
  chromaticAberration: 0.15,
  highlightBias: 0.14,
  grade: [0.98, 0.99, 1.02],
  caGain: 0.28,
  caMaskMin: 0.55,
  caMaskMax: 0.82,
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

function parseHex(hex: string): [number, number, number] {
  const value = hex.replace('#', '')
  const normalized =
    value.length === 3 ? value.split('').map((c) => c + c).join('') : value
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

export function lerpHeroShaderPreset(
  from: HeroShaderPreset,
  to: HeroShaderPreset,
  t: number
): HeroShaderPreset {
  return {
    solidColor: lerpHex(from.solidColor, to.solidColor, t),
    worleyColorA: lerpHex(from.worleyColorA, to.worleyColorA, t),
    worleyColorB: lerpHex(from.worleyColorB, to.worleyColorB, t),
    worleyContrast: lerp(from.worleyContrast, to.worleyContrast, t),
    worleyPersistence: lerp(from.worleyPersistence, to.worleyPersistence, t),
    worleyScale: lerp(from.worleyScale, to.worleyScale, t),
    worleySeed: lerp(from.worleySeed, to.worleySeed, t),
    worleySpeed: lerp(from.worleySpeed, to.worleySpeed, t),
    worleyLacunarity: lerp(from.worleyLacunarity, to.worleyLacunarity, t),
    worleyBalance: lerp(from.worleyBalance, to.worleyBalance, t),
    blobCenter: {
      x: lerp(from.blobCenter.x, to.blobCenter.x, t),
      y: lerp(from.blobCenter.y, to.blobCenter.y, t),
    },
    blobSize: lerp(from.blobSize, to.blobSize, t),
    blobSoftness: lerp(from.blobSoftness, to.blobSoftness, t),
    blobSpeed: lerp(from.blobSpeed, to.blobSpeed, t),
    blobDeform: lerp(from.blobDeform, to.blobDeform, t),
    blurIntensity: lerp(from.blurIntensity, to.blurIntensity, t),
    blurAngle: lerp(from.blurAngle, to.blurAngle, t),
    chromaticAberration: lerp(from.chromaticAberration, to.chromaticAberration, t),
    highlightBias: lerp(from.highlightBias, to.highlightBias, t),
    grade: [
      lerp(from.grade[0], to.grade[0], t),
      lerp(from.grade[1], to.grade[1], t),
      lerp(from.grade[2], to.grade[2], t),
    ],
    caGain: lerp(from.caGain, to.caGain, t),
    caMaskMin: lerp(from.caMaskMin, to.caMaskMin, t),
    caMaskMax: lerp(from.caMaskMax, to.caMaskMax, t),
  }
}
