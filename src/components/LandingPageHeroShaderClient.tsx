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

interface LandingPageHeroShaderClientProps {
  config: HeroShaderConfig
}

export default function LandingPageHeroShaderClient({
  config,
}: LandingPageHeroShaderClientProps) {
  return (
    <Shader style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
      <Blob
        id="idmozyext3ts4o5d9ra"
        center={config.blob.center}
        colorA="#000000"
        colorB="#000000"
        size={config.blob.size}
        softness={config.blob.softness}
        speed={config.blob.speed}
        visible
      />
      <SolidColor color={config.solidColor} />
      <WorleyNoise
        balance={config.worley.balance}
        colorA={config.worley.colorA}
        colorB={config.worley.colorB}
        {...(config.worley.colorSpace ? { colorSpace: config.worley.colorSpace } : {})}
        contrast={config.worley.contrast}
        lacunarity={2.3}
        maskSource="idmozyext3ts4o5d9ra"
        mode="f2MinusF1"
        octaves={2}
        persistence={config.worley.persistence}
        scale={config.worley.scale}
        seed={33}
        speed={config.worley.speed}
      />
      <LinearBlur angle={135} intensity={config.linearBlurIntensity} visible />
      <ChromaticAberration strength={config.chromaticAberration} visible />
    </Shader>
  )
}
