'use client'

import {
  Shader,
  Blob,
  ChromaticAberration,
  LinearBlur,
  SolidColor,
  WorleyNoise,
} from 'shaders/react'
import type { HeroShaderConfig } from './heroShaderThemes'

interface LandingPageHeroShaderOriginalProps {
  /** Unused — this component renders the fixed "Afternoon Sunlight 2" preset. */
  config?: HeroShaderConfig
  maskId?: string
}

/**
 * Shaders.com preset "Afternoon Sunlight 2" (collection: Afternoon Sunlight).
 * Used on the /v2 landing page for comparison against the custom WebGL shader.
 */
export default function LandingPageHeroShaderOriginal(
  _props: LandingPageHeroShaderOriginalProps = {}
) {
  return (
    <Shader style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
      <Blob
        id="idmozyext3ts4o5d9ra"
        center={{ x: 0.85, y: 0.16 }}
        colorA="#000000"
        colorB="#000000"
        size={0.85}
        softness={1.5}
        speed={0.8}
        visible={false}
      />
      <SolidColor color="#c4c4c4" />
      <WorleyNoise
        colorA="#a69f9f"
        colorB="#fcf8f0"
        contrast={0.55}
        lacunarity={2.3}
        maskSource="idmozyext3ts4o5d9ra"
        mode="f2MinusF1"
        octaves={2}
        persistence={1}
        scale={4}
        seed={33}
        speed={3.3}
      />
      <LinearBlur angle={135} intensity={300} visible />
      <ChromaticAberration strength={0.15} visible />
    </Shader>
  )
}
