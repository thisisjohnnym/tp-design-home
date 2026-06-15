'use client'

import { useEffect, useRef } from 'react'
import type { HeroShaderPreset } from './heroShaderPresets'

interface LandingPageHeroShaderClientProps {
  preset: HeroShaderPreset
}

const DOWNSCALE = 1
const DPR_CAP = 1.25

const BLUR_WEIGHTS = (() => {
  const raw = Array.from({ length: 32 }, (_, i) => {
    const t = (i / 31 - 0.5) * 2
    return Math.exp(-0.5 * (t * t) / 0.64)
  })
  const sum = raw.reduce((a, b) => a + b, 0)
  return raw.map((w) => w / sum)
})()

function blurWeightGlsl(i: number) {
  return BLUR_WEIGHTS[i].toFixed(8)
}

const BLUR_SAMPLE_LOOP = Array.from({ length: 32 }, (_, i) => {
  const t = (i / 31).toFixed(8)
  return `total += texture2D(u_tex, v_uv + blurVec * (${t} - 0.5)) * ${blurWeightGlsl(i)};`
}).join('\n    ')

const VERTEX_SHADER = `
attribute vec2 a_position;
varying vec2 v_uv;
void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`

const NOISE_SHADER = `
precision mediump float;
varying vec2 v_uv;

uniform vec2 u_res;
uniform float u_time;
uniform vec3 u_solid;
uniform vec3 u_colorA;
uniform vec3 u_colorB;
uniform float u_worleyContrast;
uniform float u_worleyPersistence;
uniform float u_worleyScale;
uniform float u_worleySpeed;
uniform float u_worleyLacunarity;
uniform float u_worleyBalance;
uniform float u_worleySeed;
uniform float u_highlightBias;
uniform vec2 u_blobCenter;
uniform float u_blobSize;
uniform float u_blobSoftness;
uniform float u_blobSpeed;
uniform float u_blobDeform;

float blobMask(vec2 p, vec2 center, float size, float softness, float deform, float t) {
  float edgeWidth = softness * 0.3;
  float edgeCurve = softness * 2.0 + 0.5;
  vec2 uv = p - center;
  float dist = length(uv);
  float ns = 4.0;
  float n1 = sin(uv.x * ns * 0.8 + t * 0.8) * sin(uv.y * ns * 0.7 + t * 0.6)
    + sin(uv.x * ns * 1.2 - uv.y * ns * 0.9 + t * 0.4);
  float n2 = sin(uv.x * ns * 1.4 - t * 0.5) * sin(uv.y * ns * 1.1 + t * 0.7);
  float n3 = sin(uv.x * ns * 1.8 + uv.y * ns * 1.6 + t * 0.3) + sin(uv.x * ns * 0.6 - t * 0.9);
  float n4 = sin(uv.x * ns * 2.2 + t * 0.2) * sin(uv.y * ns * 1.9 - t * 0.8);
  float noiseAmt = (n1 * 0.15 + n2 * 0.12 + n3 * 0.1 + n4 * 0.04) * deform;
  float radius = size + noiseAmt;
  float edge = 1.0 - smoothstep(radius - edgeWidth, radius + edgeWidth, dist);
  return pow(max(edge, 0.0), edgeCurve);
}

vec2 worleyHash(vec2 p) {
  return fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453);
}

float worleyOctave(vec2 oUV, float animT, float seedOff) {
  float animTSlow = animT * 0.7;
  vec2 cell = floor(oUV);
  vec2 localUV = fract(oUV);
  float d1 = 10.0;
  float d2 = 10.0;
  for (int ny = -1; ny <= 1; ny++) {
    for (int nx = -1; nx <= 1; nx++) {
      vec2 offset = vec2(float(nx), float(ny));
      vec2 h = vec2(worleyHash(cell + offset + seedOff));
      float px = h.x + sin(animT + h.x * 6.2831853) * 0.15;
      float py = h.y + cos(animTSlow + h.y * 6.2831853) * 0.15;
      float jx = mix(0.5, clamp(px, 0.05, 0.95), 1.0);
      float jy = mix(0.5, clamp(py, 0.05, 0.95), 1.0);
      vec2 point = offset + vec2(jx, jy);
      vec2 delta = localUV - point;
      float d = dot(delta, delta);
      if (d < d1) { d2 = d1; d1 = d; }
      else if (d < d2) { d2 = d; }
    }
  }
  return sqrt(d2) - sqrt(d1);
}

vec3 linearToSrgb(vec3 c) {
  return pow(max(c, vec3(0.0)), vec3(1.0 / 2.2));
}

vec3 srgbToLinear(vec3 c) {
  return pow(max(c, vec3(0.0)), vec3(2.2));
}

vec3 mixLinear(vec3 a, vec3 b, float t) {
  return linearToSrgb(mix(srgbToLinear(a), srgbToLinear(b), t));
}

void main() {
  float aspect = u_res.x / max(u_res.y, 1.0);
  vec2 p = vec2(v_uv.x * aspect, v_uv.y);

  float t = u_time * u_worleySpeed;
  float blobT = u_time * u_blobSpeed;
  vec2 center = vec2(u_blobCenter.x * aspect, 1.0 - u_blobCenter.y);
  float mask = blobMask(p, center, u_blobSize, u_blobSoftness, u_blobDeform, blobT);

  float acc = 0.0;
  float totalAmp = 0.0;
  float amp = 1.0;
  float freq = u_worleyScale;
  for (int o = 0; o < 2; o++) {
    float fi = float(o);
    float raw = worleyOctave(p * freq, t + fi * 17.0, u_worleySeed + fi * 31.0);
    acc += raw * amp;
    totalAmp += amp;
    amp *= u_worleyPersistence;
    freq *= u_worleyLacunarity;
  }
  float field = acc / max(totalAmp, 1e-4);
  field = clamp(field * 2.5 * 2.0 - 1.0, -1.0, 1.0);
  field = clamp(field * u_worleyContrast * 0.5 + u_worleyBalance * 0.5 + 0.5, 0.0, 1.0);

  vec3 worleyColor = mixLinear(u_colorA, u_colorB, field);
  worleyColor = mix(worleyColor, u_colorB, u_highlightBias * mask);
  vec3 color = mix(u_solid, worleyColor, mask);
  gl_FragColor = vec4(color, 1.0);
}
`

const BLUR_SHADER = `
precision mediump float;
varying vec2 v_uv;
uniform sampler2D u_tex;
uniform vec2 u_viewport;
uniform float u_intensity;
uniform float u_angle;

void main() {
  float aspect = u_viewport.x / max(u_viewport.y, 1.0);
  float angleRad = radians(u_angle);
  vec2 blurDir = vec2(cos(angleRad) / aspect, sin(angleRad));
  vec2 blurVec = blurDir * u_intensity / u_viewport * 2.0;

  vec4 total = vec4(0.0);
  ${BLUR_SAMPLE_LOOP}
  gl_FragColor = total;
}
`

const COMPOSITE_SHADER = `
precision mediump float;
varying vec2 v_uv;
uniform sampler2D u_tex;
uniform float u_ca;
uniform float u_caGain;
uniform float u_caMaskMin;
uniform float u_caMaskMax;
uniform vec3 u_grade;

void main() {
  vec3 base = texture2D(u_tex, v_uv).rgb;
  float lum = dot(base, vec3(0.2126, 0.7152, 0.0722));
  float caMask = smoothstep(u_caMaskMin, u_caMaskMax, lum);
  vec2 dir = v_uv - 0.5;
  vec2 off = dir * u_ca * u_caGain * caMask;
  float r = texture2D(u_tex, v_uv + off).r;
  float g = base.g;
  float b = texture2D(u_tex, v_uv - off).b;
  vec3 color = vec3(r, g, b) * u_grade;
  gl_FragColor = vec4(color, 1.0);
}
`

function parseHex(hex: string): [number, number, number] {
  const value = hex.replace('#', '')
  const normalized =
    value.length === 3 ? value.split('').map((c) => c + c).join('') : value
  return [
    parseInt(normalized.slice(0, 2), 16) / 255,
    parseInt(normalized.slice(2, 4), 16) / 255,
    parseInt(normalized.slice(4, 6), 16) / 255,
  ]
}

function compileProgram(
  gl: WebGLRenderingContext,
  fragment: string,
  label: string
): WebGLProgram | null {
  const vs = gl.createShader(gl.VERTEX_SHADER)!
  gl.shaderSource(vs, VERTEX_SHADER)
  gl.compileShader(vs)
  if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
    console.error(`[hero-shader] ${label} vertex:`, gl.getShaderInfoLog(vs))
    gl.deleteShader(vs)
    return null
  }

  const fs = gl.createShader(gl.FRAGMENT_SHADER)!
  gl.shaderSource(fs, fragment)
  gl.compileShader(fs)
  if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
    console.error(`[hero-shader] ${label} fragment:`, gl.getShaderInfoLog(fs))
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
    console.error(`[hero-shader] ${label} link:`, gl.getProgramInfoLog(program))
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

function applyPreset(
  gl: WebGLRenderingContext,
  noiseProgram: WebGLProgram,
  blurProgram: WebGLProgram,
  compositeProgram: WebGLProgram,
  u: (program: WebGLProgram, name: string) => WebGLUniformLocation | null,
  preset: HeroShaderPreset,
  canvas: HTMLCanvasElement
) {
  const solid = parseHex(preset.solidColor)
  const colorA = parseHex(preset.worleyColorA)
  const colorB = parseHex(preset.worleyColorB)

  gl.useProgram(noiseProgram)
  gl.uniform3f(u(noiseProgram, 'u_solid'), solid[0], solid[1], solid[2])
  gl.uniform3f(u(noiseProgram, 'u_colorA'), colorA[0], colorA[1], colorA[2])
  gl.uniform3f(u(noiseProgram, 'u_colorB'), colorB[0], colorB[1], colorB[2])
  gl.uniform1f(u(noiseProgram, 'u_worleyContrast'), preset.worleyContrast)
  gl.uniform1f(u(noiseProgram, 'u_worleyPersistence'), preset.worleyPersistence)
  gl.uniform1f(u(noiseProgram, 'u_worleyScale'), preset.worleyScale)
  gl.uniform1f(u(noiseProgram, 'u_worleySpeed'), preset.worleySpeed)
  gl.uniform1f(u(noiseProgram, 'u_worleyLacunarity'), preset.worleyLacunarity)
  gl.uniform1f(u(noiseProgram, 'u_worleyBalance'), preset.worleyBalance)
  gl.uniform1f(u(noiseProgram, 'u_worleySeed'), preset.worleySeed)
  gl.uniform1f(u(noiseProgram, 'u_highlightBias'), preset.highlightBias)
  gl.uniform2f(u(noiseProgram, 'u_blobCenter'), preset.blobCenter.x, preset.blobCenter.y)
  gl.uniform1f(u(noiseProgram, 'u_blobSize'), preset.blobSize)
  gl.uniform1f(u(noiseProgram, 'u_blobSoftness'), preset.blobSoftness)
  gl.uniform1f(u(noiseProgram, 'u_blobSpeed'), preset.blobSpeed)
  gl.uniform1f(u(noiseProgram, 'u_blobDeform'), preset.blobDeform)

  gl.useProgram(blurProgram)
  gl.uniform2f(u(blurProgram, 'u_viewport'), canvas.width, canvas.height)
  gl.uniform1f(u(blurProgram, 'u_intensity'), preset.blurIntensity)
  gl.uniform1f(u(blurProgram, 'u_angle'), preset.blurAngle)

  gl.useProgram(compositeProgram)
  gl.uniform1f(u(compositeProgram, 'u_ca'), preset.chromaticAberration)
  gl.uniform1f(u(compositeProgram, 'u_caGain'), preset.caGain)
  gl.uniform1f(u(compositeProgram, 'u_caMaskMin'), preset.caMaskMin)
  gl.uniform1f(u(compositeProgram, 'u_caMaskMax'), preset.caMaskMax)
  gl.uniform3f(
    u(compositeProgram, 'u_grade'),
    preset.grade[0],
    preset.grade[1],
    preset.grade[2]
  )
}

export default function LandingPageHeroShaderClient({
  preset,
}: LandingPageHeroShaderClientProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const presetRef = useRef(preset)

  useEffect(() => {
    presetRef.current = preset
  }, [preset])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext('webgl', {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: 'low-power',
    })
    if (!gl) return

    const noiseProgram = compileProgram(gl, NOISE_SHADER, 'noise')
    const blurProgram = compileProgram(gl, BLUR_SHADER, 'blur')
    const compositeProgram = compileProgram(gl, COMPOSITE_SHADER, 'composite')
    if (!noiseProgram || !blurProgram || !compositeProgram) return

    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)

    const bindPositions = (program: WebGLProgram) => {
      const loc = gl.getAttribLocation(program, 'a_position')
      gl.enableVertexAttribArray(loc)
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)
    }

    let ping: Target | null = null
    let pong: Target | null = null
    let lowW = 0
    let lowH = 0
    let visible = true
    let raf = 0

    const ensureTargets = (w: number, h: number) => {
      if (w === lowW && h === lowH && ping && pong) return
      if (ping) {
        gl.deleteFramebuffer(ping.fb)
        gl.deleteTexture(ping.tex)
      }
      if (pong) {
        gl.deleteFramebuffer(pong.fb)
        gl.deleteTexture(pong.tex)
      }
      lowW = w
      lowH = h
      ping = createTarget(gl, w, h)
      pong = createTarget(gl, w, h)
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP)
      const w = Math.max(1, Math.floor(rect.width * dpr))
      const h = Math.max(1, Math.floor(rect.height * dpr))
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
      }
      ensureTargets(
        Math.max(1, Math.floor(w / DOWNSCALE)),
        Math.max(1, Math.floor(h / DOWNSCALE))
      )
    }

    const u = (program: WebGLProgram, name: string) =>
      gl.getUniformLocation(program, name)

    const render = (time: number) => {
      if (ping && pong) {
        if (!visible) {
          raf = requestAnimationFrame(render)
          return
        }

        resize()
        const p = presetRef.current
        const t = time * 0.001

        applyPreset(gl, noiseProgram, blurProgram, compositeProgram, u, p, canvas)

        gl.bindFramebuffer(gl.FRAMEBUFFER, ping.fb)
        gl.viewport(0, 0, lowW, lowH)
        gl.useProgram(noiseProgram)
        bindPositions(noiseProgram)
        gl.uniform2f(u(noiseProgram, 'u_res'), lowW, lowH)
        gl.uniform1f(u(noiseProgram, 'u_time'), t)
        gl.drawArrays(gl.TRIANGLES, 0, 3)

        gl.bindFramebuffer(gl.FRAMEBUFFER, pong.fb)
        gl.viewport(0, 0, lowW, lowH)
        gl.useProgram(blurProgram)
        bindPositions(blurProgram)
        gl.activeTexture(gl.TEXTURE0)
        gl.bindTexture(gl.TEXTURE_2D, ping.tex)
        gl.uniform1i(u(blurProgram, 'u_tex'), 0)
        gl.drawArrays(gl.TRIANGLES, 0, 3)

        gl.bindFramebuffer(gl.FRAMEBUFFER, null)
        gl.viewport(0, 0, canvas.width, canvas.height)
        gl.useProgram(compositeProgram)
        bindPositions(compositeProgram)
        gl.activeTexture(gl.TEXTURE0)
        gl.bindTexture(gl.TEXTURE_2D, pong.tex)
        gl.uniform1i(u(compositeProgram, 'u_tex'), 0)
        gl.drawArrays(gl.TRIANGLES, 0, 3)
      }
      raf = requestAnimationFrame(render)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
      },
      { rootMargin: '200px 0px' }
    )
    observer.observe(canvas)

    resize()
    raf = requestAnimationFrame(render)
    window.addEventListener('resize', resize)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(raf)
      if (ping) {
        gl.deleteFramebuffer(ping.fb)
        gl.deleteTexture(ping.tex)
      }
      if (pong) {
        gl.deleteFramebuffer(pong.fb)
        gl.deleteTexture(pong.tex)
      }
      gl.deleteBuffer(buffer)
      gl.deleteProgram(noiseProgram)
      gl.deleteProgram(blurProgram)
      gl.deleteProgram(compositeProgram)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      aria-hidden
    />
  )
}
