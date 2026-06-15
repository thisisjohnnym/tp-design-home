import { HeroSectionStatic } from '@/components/HeroSectionStatic'
import { ScrollRevealText } from '@/components/ScrollRevealText'
import { ContentOverlay } from '@/components/ContentOverlay'
import { TeamSection } from '@/components/TeamSection'
import { WhatWeDoShowcase } from '@/components/WhatWeDoShowcase'
import { HowWeWorkSection } from '@/components/HowWeWorkSection'
import { team } from '@/data/content'

const TEAM_FUNCTION =
  'We partner across product, engineering, and brand partners to create experiences that are intuitive, consistent, accessible, and distinctly Tapestry.'

export default function HomeV2() {
  return (
    <div
      className="font-sans antialiased"
      style={{ background: 'var(--page-ground)', color: 'var(--page-ink)' }}
    >
      <HeroSectionStatic />

      <ContentOverlay>
        <div className="flex flex-col gap-[150px]">
          {/* Team-function statement — now its own section, keeps the scroll reveal */}
          <section>
            <ScrollRevealText
              className="w-full font-medium leading-[1.1] tracking-[0.2px]"
              style={{ fontSize: '8rem' }}
              grey="#cfc9ba"
              black="#1f1b15"
              startRatio={0.85}
              completeVisibleRatio={0.4}
            >
              {TEAM_FUNCTION}
            </ScrollRevealText>
          </section>

          <WhatWeDoShowcase />

          <TeamSection members={team} />

          <HowWeWorkSection />
        </div>
      </ContentOverlay>
    </div>
  )
}
