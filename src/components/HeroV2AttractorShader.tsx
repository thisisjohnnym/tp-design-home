'use client'

import { useEffect, useRef } from 'react'

const DPR_CAP = 1.5
const CORE_COUNT = 3800
const OUTER_COUNT = 1600
const PARTICLE_COUNT = CORE_COUNT + OUTER_COUNT

const VERTEX_SHADER = `
attribute vec2 a_position;
varying vec2 v_uv;
void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`

const POINT_VERTEX_SHADER = `
attribute vec2 a_point;
attribute float a_weight;
varying float v_weight;
void main() {
  gl_Position = vec4(a_point, 0.0, 1.0);
  gl_PointSize = 1.0;
  v_weight = a_weight;
}
`

const POINT_FRAGMENT_SHADER = `
precision mediump float;
varying float v_weight;
uniform float u_deposit;
void main() {
  gl_FragColor = vec4(0.06, 0.18, 0.28, u_deposit * v_weight);
}
`

const FADE_SHADER = `
precision mediump float;
varying vec2 v_uv;
uniform sampler2D u_tex;
uniform float u_decay;
void main() {
  gl_FragColor = texture2D(u_tex, v_uv) * u_decay;
}
`

const DISPLAY_SHADER = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

varying vec2 v_uv;
uniform sampler2D u_tex;
uniform vec2 u_res;
uniform float u_time;
uniform float u_motion;

void main() {
  vec3 acc = texture2D(u_tex, v_uv).rgb;
  float d = dot(acc, vec3(0.35, 0.9, 0.55));

  vec3 bg = vec3(1.0, 0.996, 0.878);
  vec3 cyan = vec3(0.42, 0.82, 0.88);
  vec3 teal = vec3(0.18, 0.58, 0.72);
  vec3 navy = vec3(0.05, 0.16, 0.34);

  float fringe = smoothstep(0.008, 0.12, d);
  float body = smoothstep(0.05, 0.28, d);
  float core = smoothstep(0.16, 0.75, d);

  vec3 col = mix(bg, cyan, fringe * 0.82);
  col = mix(col, teal, body * 0.78);
  col = mix(col, navy, core);

  float grain = fract(sin(dot(v_uv * u_res + u_time * 11.0, vec2(12.9898, 78.233))) * 43758.5453);
  col += (grain - 0.5) * 0.01 * fringe;

  gl_FragColor = vec4(col, 1.0);
}
`

type Pool = 'core' | 'outer'

type Particle = {
  x: number
  y: number
  pool: Pool
}

type AttractorCoeffs = {
  a: number
  b: number
  c: number
  d: number
}

const CORE_ATTRACTOR: AttractorCoeffs = { a: 1.56, b: -1.56, c: 1.78, d: -0.78 }
const OUTER_ATTRACTOR: AttractorCoeffs = { a: 1.32, b: 2.18, c: 1.62, d: 2.04 }

/** Orbit traps — vortex knots in panel space (clip coords). */
const ORBIT_TRAPS = [
  { x: -0.22, y: -0.14, boost: 2.8, falloff: 28 },
  { x: -0.06, y: 0.02, boost: 2.4, falloff: 32 },
  { x: -0.14, y: 0.12, boost: 2.2, falloff: 26 },
  { x: 0.04, y: -0.06, boost: 1.8, falloff: 24 },
  { x: -0.18, y: 0.2, boost: 2.0, falloff: 22 },
]

function compileProgram(
  gl: WebGLRenderingContext,
  vertex: string,
  fragment: string,
  label: string
): WebGLProgram | null {
  const vs = gl.createShader(gl.VERTEX_SHADER)!
  gl.shaderSource(vs, vertex)
  gl.compileShader(vs)
  if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
    console.error(`[hero-v2-shader] ${label} vertex:`, gl.getShaderInfoLog(vs))
    gl.deleteShader(vs)
    return null
  }

  const fs = gl.createShader(gl.FRAGMENT_SHADER)!
  gl.shaderSource(fs, fragment)
  gl.compileShader(fs)
  if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
    console.error(`[hero-v2-shader] ${label} fragment:`, gl.getShaderInfoLog(fs))
    gl.deleteShader(vs)
    gl.deleteShader(fs)
    return null
  }

  const program = gl.createProgram()!
  gl.attachShader(program, vs)
  gl.attachShader(program, fs)
  gl.linkProgram(program)
  gl.deleteShader(vs)
  gl.deleteShader(fs)

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(`[hero-v2-shader] ${label} link:`, gl.getProgramInfoLog(program))
    gl.deleteProgram(program)
    return null
  }

  return program
}

type Target = { fb: WebGLFramebuffer; tex: WebGLTexture }

function createTarget(gl: WebGLRenderingContext, w: number, h: number): Target {
  const tex = gl.createTexture()!
  gl.bindTexture(gl.TEXTURE_2D, tex)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

  const fb = gl.createFramebuffer()!
  gl.bindFramebuffer(gl.FRAMEBUFFER, fb)
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0)
  return { fb, tex }
}

function clearTarget(gl: WebGLRenderingContext, target: Target) {
  gl.bindFramebuffer(gl.FRAMEBUFFER, target.fb)
  gl.clearColor(0, 0, 0, 0)
  gl.clear(gl.COLOR_BUFFER_BIT)
}

function deJong(
  x: number,
  y: number,
  coeffs: AttractorCoeffs,
  t: number,
  drift: number
) {
  const a = coeffs.a + Math.sin(t * 0.14) * 0.04 * drift
  const b = coeffs.b + Math.cos(t * 0.11) * 0.04 * drift
  const c = coeffs.c + Math.sin(t * 0.09) * 0.03 * drift
  const d = coeffs.d + Math.cos(t * 0.13) * 0.03 * drift
  return {
    x: Math.sin(a * y) - Math.cos(b * x),
    y: Math.sin(c * x) - Math.cos(d * y),
  }
}

function randSeed() {
  return (Math.random() - 0.5) * 0.6
}

function initParticles(): Particle[] {
  const particles: Particle[] = []
  for (let i = 0; i < CORE_COUNT; i++) {
    particles.push({ x: randSeed(), y: randSeed(), pool: 'core' })
  }
  for (let i = 0; i < OUTER_COUNT; i++) {
    particles.push({ x: randSeed() * 1.4, y: randSeed() * 1.4, pool: 'outer' })
  }
  return particles
}

function trapWeight(cx: number, cy: number) {
  let w = 1
  for (const trap of ORBIT_TRAPS) {
    const dx = cx - trap.x
    const dy = cy - trap.y
    w += trap.boost * Math.exp(-(dx * dx + dy * dy) * trap.falloff)
  }
  return Math.min(w, 5)
}

function toPanel(
  x: number,
  y: number,
  pool: Pool,
  aspect: number,
  mouse: { x: number; y: number },
  hover: number
) {
  const isOuter = pool === 'outer'
  const scale = isOuter ? 0.46 : 0.34
  const sy = isOuter ? 0.5 : 0.36
  const mx = (mouse.x - 0.5) * 0.22 * hover
  const my = (mouse.y - 0.5) * 0.18 * hover
  const ox = -0.1 + mx
  const oy = -0.16 + my

  return {
    x: (x * scale) / aspect + ox,
    y: y * sy + oy,
  }
}

function needsReseed(x: number, y: number, cx: number, cy: number) {
  return Math.abs(x) > 5 || Math.abs(y) > 5 || Math.abs(cx) > 1.35 || Math.abs(cy) > 1.35
}

export default function HeroV2AttractorShader() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0.5, y: 0.5 })
  const motionRef = useRef(1)

  useEffect(() => {
    const reducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    motionRef.current = reducedMotion ? 0.2 : 1
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl =
      canvas.getContext('webgl', { alpha: false, antialias: false, powerPreference: 'default' }) ??
      canvas.getContext('experimental-webgl', { alpha: false, antialias: false })
    if (!gl || !(gl instanceof WebGLRenderingContext)) {
      console.error('[hero-v2-shader] WebGL unavailable')
      return
    }

    const fadeProgram = compileProgram(gl, VERTEX_SHADER, FADE_SHADER, 'fade')
    const pointProgram = compileProgram(gl, POINT_VERTEX_SHADER, POINT_FRAGMENT_SHADER, 'point')
    const displayProgram = compileProgram(gl, VERTEX_SHADER, DISPLAY_SHADER, 'display')
    if (!fadeProgram || !pointProgram || !displayProgram) return

    const quadBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)

    const pointPosBuffer = gl.createBuffer()
    const pointWeightBuffer = gl.createBuffer()

    const bindQuad = (program: WebGLProgram) => {
      const loc = gl.getAttribLocation(program, 'a_position')
      gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer)
      gl.enableVertexAttribArray(loc)
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)
    }

    const uFade = (name: string) => gl.getUniformLocation(fadeProgram, name)
    const uPoint = (name: string) => gl.getUniformLocation(pointProgram, name)
    const uDisplay = (name: string) => gl.getUniformLocation(displayProgram, name)

    const particles = initParticles()
    const positions = new Float32Array(PARTICLE_COUNT * 2)
    const weights = new Float32Array(PARTICLE_COUNT)

    let readTarget: Target | null = null
    let writeTarget: Target | null = null
    let w = 0
    let h = 0
    let raf = 0
    let frame = 0
    let hoverTarget = 0
    let hoverCurrent = 0

    const ensureTargets = (width: number, height: number) => {
      if (readTarget) {
        gl.deleteFramebuffer(readTarget.fb)
        gl.deleteTexture(readTarget.tex)
      }
      if (writeTarget) {
        gl.deleteFramebuffer(writeTarget.fb)
        gl.deleteTexture(writeTarget.tex)
      }
      readTarget = createTarget(gl, width, height)
      writeTarget = createTarget(gl, width, height)
      clearTarget(gl, readTarget)
      clearTarget(gl, writeTarget)
      frame = 0
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      if (rect.width < 1 || rect.height < 1) return
      const dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP)
      const nextW = Math.max(1, Math.floor(rect.width * dpr))
      const nextH = Math.max(1, Math.floor(rect.height * dpr))
      if (nextW !== w || nextH !== h) {
        w = nextW
        h = nextH
        canvas.width = w
        canvas.height = h
        ensureTargets(w, h)
      }
    }

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      if (rect.width < 1 || rect.height < 1) return
      mouseRef.current.x = (e.clientX - rect.left) / rect.width
      mouseRef.current.y = 1 - (e.clientY - rect.top) / rect.height
    }

    const onPointerEnter = () => {
      hoverTarget = 1
    }

    const onPointerLeave = () => {
      hoverTarget = 0
      mouseRef.current.x = 0.5
      mouseRef.current.y = 0.5
    }

    canvas.addEventListener('pointermove', onPointerMove)
    canvas.addEventListener('pointerenter', onPointerEnter)
    canvas.addEventListener('pointerleave', onPointerLeave)

    const stepParticles = (t: number, aspect: number, hover: number) => {
      const drift = motionRef.current * (1 + hover * 0.35)

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const p = particles[i]
        const coeffs = p.pool === 'core' ? CORE_ATTRACTOR : OUTER_ATTRACTOR
        const steps = p.pool === 'core' ? 2 : 1

        for (let s = 0; s < steps; s++) {
          const next = deJong(p.x, p.y, coeffs, t, drift)
          p.x = next.x
          p.y = next.y
        }

        const panel = toPanel(p.x, p.y, p.pool, aspect, mouseRef.current, hover)

        if (needsReseed(p.x, p.y, panel.x, panel.y)) {
          p.x = randSeed() * (p.pool === 'outer' ? 1.4 : 1)
          p.y = randSeed() * (p.pool === 'outer' ? 1.4 : 1)
          const reset = toPanel(p.x, p.y, p.pool, aspect, mouseRef.current, hover)
          positions[i * 2] = reset.x
          positions[i * 2 + 1] = reset.y
          weights[i] = 0.4
          continue
        }

        positions[i * 2] = panel.x
        positions[i * 2 + 1] = panel.y
        weights[i] = trapWeight(panel.x, panel.y)
      }
    }

    const drawPoints = (deposit: number) => {
      gl.useProgram(pointProgram)
      gl.uniform1f(uPoint('u_deposit'), deposit)

      const posLoc = gl.getAttribLocation(pointProgram, 'a_point')
      const weightLoc = gl.getAttribLocation(pointProgram, 'a_weight')

      gl.bindBuffer(gl.ARRAY_BUFFER, pointPosBuffer)
      gl.bufferData(gl.ARRAY_BUFFER, positions, gl.DYNAMIC_DRAW)
      gl.enableVertexAttribArray(posLoc)
      gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0)

      gl.bindBuffer(gl.ARRAY_BUFFER, pointWeightBuffer)
      gl.bufferData(gl.ARRAY_BUFFER, weights, gl.DYNAMIC_DRAW)
      gl.enableVertexAttribArray(weightLoc)
      gl.vertexAttribPointer(weightLoc, 1, gl.FLOAT, false, 0, 0)

      gl.drawArrays(gl.POINTS, 0, PARTICLE_COUNT)
    }

    const render = (time: number) => {
      resize()
      if (readTarget && writeTarget && w > 0 && h > 0) {
        frame += 1
        const t = time * 0.001
        hoverCurrent += (hoverTarget - hoverCurrent) * 0.08
        const aspect = w / h
        const warmup = frame < 150
        const decay = warmup ? 0.9994 : 0.9972 - hoverCurrent * 0.0008
        const deposit = warmup ? 0.022 : 0.014 + hoverCurrent * 0.008

        stepParticles(t, aspect, hoverCurrent)

        gl.bindFramebuffer(gl.FRAMEBUFFER, writeTarget.fb)
        gl.viewport(0, 0, w, h)

        gl.useProgram(fadeProgram)
        bindQuad(fadeProgram)
        gl.activeTexture(gl.TEXTURE0)
        gl.bindTexture(gl.TEXTURE_2D, readTarget.tex)
        gl.uniform1i(uFade('u_tex'), 0)
        gl.uniform1f(uFade('u_decay'), decay)
        gl.drawArrays(gl.TRIANGLES, 0, 3)

        gl.enable(gl.BLEND)
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE)
        drawPoints(deposit)
        gl.disable(gl.BLEND)

        gl.bindFramebuffer(gl.FRAMEBUFFER, null)
        gl.viewport(0, 0, w, h)
        gl.useProgram(displayProgram)
        bindQuad(displayProgram)
        gl.activeTexture(gl.TEXTURE0)
        gl.bindTexture(gl.TEXTURE_2D, writeTarget.tex)
        gl.uniform1i(uDisplay('u_tex'), 0)
        gl.uniform2f(uDisplay('u_res'), w, h)
        gl.uniform1f(uDisplay('u_time'), t)
        gl.uniform1f(uDisplay('u_motion'), motionRef.current)
        gl.drawArrays(gl.TRIANGLES, 0, 3)

        const swap = readTarget
        readTarget = writeTarget
        writeTarget = swap
      }

      raf = requestAnimationFrame(render)
    }

    resize()
    raf = requestAnimationFrame(render)
    window.addEventListener('resize', resize)

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    return () => {
      ro.disconnect()
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('pointermove', onPointerMove)
      canvas.removeEventListener('pointerenter', onPointerEnter)
      canvas.removeEventListener('pointerleave', onPointerLeave)
      cancelAnimationFrame(raf)
      if (readTarget) {
        gl.deleteFramebuffer(readTarget.fb)
        gl.deleteTexture(readTarget.tex)
      }
      if (writeTarget) {
        gl.deleteFramebuffer(writeTarget.fb)
        gl.deleteTexture(writeTarget.tex)
      }
      gl.deleteBuffer(quadBuffer)
      gl.deleteBuffer(pointPosBuffer)
      gl.deleteBuffer(pointWeightBuffer)
      gl.deleteProgram(fadeProgram)
      gl.deleteProgram(pointProgram)
      gl.deleteProgram(displayProgram)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="hero-v2__shader"
      aria-hidden
    />
  )
}
