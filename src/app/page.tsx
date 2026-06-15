import { HeroSection } from '@/components/HeroSection'
import { ScrollRevealText } from '@/components/ScrollRevealText'
import { ContentOverlay } from '@/components/ContentOverlay'
import { StickerCanvasSection } from '@/components/StickerCanvasSection'
import { TeamSection } from '@/components/TeamSection'
import { HowWeWorkSection } from '@/components/HowWeWorkSection'
import { WhatWeDoShowcase } from '@/components/WhatWeDoShowcase'
import { team } from '@/data/content'

const TEAM_FUNCTION =
  'We partner across product, engineering, and brand partners to create experiences that are intuitive, consistent, accessible, and distinctly Tapestry.'

export default function Home() {
  return (
    <div
      className="font-sans antialiased"
      style={{ background: 'var(--page-ground)', color: 'var(--page-ink)' }}
    >
      <HeroSection
        teamFunction={
          <ScrollRevealText
            className="w-full font-medium leading-[1.1] tracking-[0.2px]"
            style={{ fontSize: '8rem' }}
            grey="#8a8a8a"
            black="#ffffff"
            startRatio={0.65}
            completeVisibleRatio={0.5}
          >
            {TEAM_FUNCTION}
          </ScrollRevealText>
        }
      />

      <ContentOverlay>
        <div className="flex flex-col gap-[150px]">
          <WhatWeDoShowcase />

          <TeamSection members={team} />

          <HowWeWorkSection />

          <StickerCanvasSection />
        </div>
      </ContentOverlay>
    </div>
  )
}
