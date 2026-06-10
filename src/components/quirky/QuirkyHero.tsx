import { Container } from '@/components/Container'
import { Grid, Col } from '@/components/Grid'
import { ScribbleCircle, SquiggleArrow, StarBurst, WavyUnderline } from './QuirkyDoodles'
import { QuirkyMarquee } from './QuirkyMarquee'

export function QuirkyHero() {
  return (
    <header className="relative overflow-hidden pt-[clamp(80px,12vh,140px)]">
      <StarBurst className="quirky-float absolute right-[8%] top-[12%] h-10 w-10 text-[#FF5722] md:h-14 md:w-14" />
      <ScribbleCircle className="quirky-float-slow absolute left-[4%] top-[28%] h-16 w-16 text-[#1A1A1A]/25 md:h-20 md:w-20" />
      <SquiggleArrow className="quirky-wiggle absolute bottom-[38%] right-[18%] hidden h-12 w-24 text-[#1A1A1A]/40 lg:block" />

      <Container>
        <Grid className="items-end">
          <Col span={{ base: 24, lg: 16 }}>
            <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.2em] text-[#1A1A1A]/50">
              Tapestry Product Design
            </p>
            <h1 className="font-medium leading-[0.88] tracking-[-0.03em] text-[#1A1A1A]">
              <span className="block text-[clamp(3.5rem,11vw,9rem)]">We design</span>
              <span className="relative inline-block text-[clamp(3.5rem,11vw,9rem)]">
                <span className="quirky-serif italic text-[#FF5722]">with soul</span>
                <WavyUnderline className="absolute -bottom-1 left-0 h-3 w-full text-[#FFD93D]" />
              </span>
              <span className="mt-1 block text-[clamp(2rem,5vw,4rem)] text-[#1A1A1A]/35">
                (and spreadsheets)
              </span>
            </h1>
          </Col>
          <Col span={{ base: 24, lg: 8 }} className="lg:pb-4">
            <p className="max-w-[320px] text-[clamp(1rem,1.8vw,1.25rem)] leading-[1.4] text-[#1A1A1A]/70 lg:ml-auto lg:text-right">
              Eight designers. Three brands. One Figma library to rule them all.
              We make Coach, Kate Spade &amp; Stuart Weitzman feel unmistakably themselves.
            </p>
            <p className="mt-6 text-[11px] font-medium uppercase tracking-[0.18em] text-[#1A1A1A]/40 lg:text-right">
              [ yes, we argue about 4px vs 8px ]
            </p>
          </Col>
        </Grid>
      </Container>

      <div className="mt-[clamp(60px,10vh,120px)]">
        <QuirkyMarquee />
      </div>
    </header>
  )
}
