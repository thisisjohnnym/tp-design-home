/**
 * Generates hero-v2-generated.jpg from scratch — Peter de Jong attractor plotter.
 * Run: node scripts/generate-hero-attractor.mjs
 */

import sharp from 'sharp'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = join(__dirname, '../public/hero-v2-generated.jpg')

const W = 1920
const H = 1688

const BG = [255, 254, 224]
const CYAN = [108, 210, 224]
const TEAL = [46, 148, 184]
const NAVY = [13, 41, 87]

const PRESETS = [
  { a: 1.56, b: -1.56, c: 1.78, d: -0.78, ox: -0.1, oy: 0.04, scale: 1 },
  { a: 1.4, b: 2.3, c: 1.7, d: 2.1, ox: -0.06, oy: 0.08, scale: 1 },
  { a: -1.52, b: 1.68, c: -1.42, d: 1.92, ox: -0.12, oy: 0.02, scale: 1 },
  { a: 1.62, b: 1.82, c: -1.72, d: -1.34, ox: -0.08, oy: -0.02, scale: 1 },
  { a: 1.32, b: 2.18, c: 1.62, d: 2.04, ox: -0.04, oy: 0.1, scale: 1.22 },
  { a: 1.28, b: 1.92, c: 1.48, d: 1.86, ox: -0.02, oy: 0.14, scale: 1.35 },
  { a: 1.48, b: -1.44, c: 1.86, d: -1.62, ox: -0.14, oy: 0.06, scale: 1 },
  { a: -1.38, b: -1.94, c: 1.56, d: -1.88, ox: -0.11, oy: -0.04, scale: 1 },
  { a: 1.44, b: 1.96, c: -1.48, d: 2.04, ox: -0.05, oy: 0.12, scale: 1.08 },
]

const TRAPS = [
  { x: -0.22, y: -0.12, boost: 1.8, falloff: 18 },
  { x: -0.06, y: 0.04, boost: 1.6, falloff: 20 },
  { x: -0.14, y: 0.14, boost: 1.5, falloff: 16 },
  { x: 0.04, y: -0.04, boost: 1.3, falloff: 15 },
  { x: -0.18, y: 0.22, boost: 1.4, falloff: 14 },
]

const KERNEL = [
  [0.04, 0.08, 0.04],
  [0.08, 0.36, 0.08],
  [0.04, 0.08, 0.04],
]

const PATHS_PER_PRESET = 8500
const STEPS_PER_PATH = 2200
const BURN_IN = 60
const DEPOSIT = 0.022
const ASPECT = W / H
const MAP_SCALE = 0.62
const CENTER_X = 0.41
const CENTER_Y = 0.53
const TONE_K = 0.0011

function deJong(x, y, a, b, c, d) {
  return [Math.sin(a * y) - Math.cos(b * x), Math.sin(c * x) - Math.cos(d * y)]
}

function trapBoost(wx, wy) {
  let boost = 1
  for (const trap of TRAPS) {
    const dx = wx - trap.x
    const dy = wy - trap.y
    boost += trap.boost * Math.exp(-(dx * dx + dy * dy) * trap.falloff)
  }
  return Math.min(boost, 2.8)
}

function envelope(wx, wy) {
  const qx = (wx + 0.04) * 0.9
  const qy = (wy - 0.02) * 0.95
  const r = Math.hypot(qx, qy)
  const core = Math.exp(-r * r * 1.45)
  const wing = 1 - smoothstep(0.55, 1.05, Math.abs(qx + qy * 0.35))
  return core * (0.45 + 0.55 * wing)
}

function worldToPixel(wx, wy) {
  const px = (wx * MAP_SCALE) / ASPECT + CENTER_X
  const py = -wy * MAP_SCALE + CENTER_Y
  return [px * W, py * H]
}

function deposit(density, px, py, amount) {
  const ix = Math.round(px)
  const iy = Math.round(py)
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      const x = ix + dx
      const y = iy + dy
      if (x >= 0 && x < W && y >= 0 && y < H) {
        density[y * W + x] += amount * KERNEL[dy + 1][dx + 1]
      }
    }
  }
}

function smoothstep(edge0, edge1, x) {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)))
  return t * t * (3 - 2 * t)
}

function mix(a, b, t) {
  return a + (b - a) * t
}

function depositSegment(density, x0, y0, x1, y1, amount) {
  const steps = Math.min(4, Math.max(1, Math.ceil(Math.hypot(x1 - x0, y1 - y0) * 0.25)))
  const stepAmount = amount / steps
  for (let s = 0; s <= steps; s++) {
    const t = s / steps
    deposit(density, x0 + (x1 - x0) * t, y0 + (y1 - y0) * t, stepAmount)
  }
}

function run() {
  console.log(`Plotting ${PRESETS.length * PATHS_PER_PRESET} attractor paths…`)
  const density = new Float32Array(W * H)

  for (const preset of PRESETS) {
    for (let p = 0; p < PATHS_PER_PRESET; p++) {
      let x = (Math.random() - 0.5) * 0.5
      let y = (Math.random() - 0.5) * 0.5
      let prevPx = 0
      let prevPy = 0

      for (let b = 0; b < BURN_IN; b++) {
        ;[x, y] = deJong(x, y, preset.a, preset.b, preset.c, preset.d)
      }

      for (let i = 0; i < STEPS_PER_PATH; i++) {
        const wx = x * 0.4 * preset.scale + preset.ox
        const wy = y * 0.42 * preset.scale + preset.oy
        const [px, py] = worldToPixel(wx, wy)
        const amount = DEPOSIT * trapBoost(wx, wy)

        if (i > 0) {
          depositSegment(density, prevPx, prevPy, px, py, amount)
        } else {
          deposit(density, px, py, amount)
        }

        prevPx = px
        prevPy = py
        ;[x, y] = deJong(x, y, preset.a, preset.b, preset.c, preset.d)
      }
    }
  }

  let maxD = 0
  for (let i = 0; i < density.length; i++) {
    maxD = Math.max(maxD, density[i])
  }
  console.log(`Peak density: ${maxD.toFixed(2)}`)

  console.log('Colorizing…')
  const rgba = Buffer.alloc(W * H * 4)

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = y * W + x
      const wx = (x / W - CENTER_X) * ASPECT / MAP_SCALE
      const wy = -(y / H - CENTER_Y) / MAP_SCALE
      const env = envelope(wx, wy)
      const raw = 1 - Math.exp(-density[i] * TONE_K)
      const d = Math.pow(raw, 0.55) * Math.max(env, 0.35)

      let r = BG[0]
      let g = BG[1]
      let b = BG[2]

      if (d > 0.002) {
        const fringe = smoothstep(0, 0.14, d)
        const body = smoothstep(0.05, 0.32, d)
        const core = smoothstep(0.18, 0.82, d)

        r = mix(BG[0], CYAN[0], fringe * 0.82)
        g = mix(g, CYAN[1], fringe * 0.82)
        b = mix(b, CYAN[2], fringe * 0.82)

        r = mix(r, TEAL[0], body * 0.76)
        g = mix(g, TEAL[1], body * 0.76)
        b = mix(b, TEAL[2], body * 0.76)

        r = mix(r, NAVY[0], core)
        g = mix(g, NAVY[1], core)
        b = mix(b, NAVY[2], core)
      }

      const o = i * 4
      rgba[o] = Math.round(r)
      rgba[o + 1] = Math.round(g)
      rgba[o + 2] = Math.round(b)
      rgba[o + 3] = 255
    }
  }

  return rgba
}

const rgba = run()

await sharp(rgba, { raw: { width: W, height: H, channels: 4 } })
  .jpeg({ quality: 93, mozjpeg: true })
  .toFile(OUT)

console.log(`Wrote ${OUT}`)
