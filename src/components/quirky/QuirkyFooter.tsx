import { Container } from '@/components/Container'
import { Grid, Col } from '@/components/Grid'
import { StarBurst } from './QuirkyDoodles'

export function QuirkyFooter() {
  return (
    <footer className="border-t border-[#1A1A1A] bg-[#1A1A1A] py-[clamp(60px,10vh,100px)] text-[#FAF3E8]">
      <Container>
        <Grid className="items-end">
          <Col span={{ base: 24, lg: 16 }}>
            <StarBurst className="mb-6 h-8 w-8 text-[#FFD93D]" />
            <p className="text-[clamp(2rem,5vw,3.5rem)] font-medium leading-[0.95] tracking-[-0.02em]">
              Got a project?
              <br />
              <span className="quirky-serif italic text-[#FF5722]">Let&apos;s talk.</span>
            </p>
          </Col>
          <Col span={{ base: 24, lg: 8 }}>
            <div className="flex flex-col gap-2 text-[12px] uppercase tracking-[0.12em] text-[#FAF3E8]/45 lg:items-end lg:text-right">
              <p>Tapestry Product Design</p>
              <p>Coach · Kate Spade · Stuart Weitzman</p>
              <p className="mt-4 normal-case tracking-normal text-[#FAF3E8]/30">
                tapestry.design/quirky
              </p>
            </div>
          </Col>
        </Grid>
      </Container>
    </footer>
  )
}
