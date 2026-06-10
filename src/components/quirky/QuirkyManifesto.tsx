import { Container } from '@/components/Container'
import { Grid, Col } from '@/components/Grid'
import { ScribbleCircle } from './QuirkyDoodles'

export function QuirkyManifesto() {
  return (
    <section className="relative overflow-hidden bg-[#6C63FF] py-[clamp(60px,10vh,100px)] text-[#FAF3E8]">
      <ScribbleCircle className="absolute -right-8 -top-8 h-32 w-32 text-[#FAF3E8]/10" />

      <Container>
        <Grid>
          <Col span={{ base: 24, lg: 6 }}>
            <p className="text-[clamp(3rem,8vw,6rem)] font-medium leading-none tracking-[-0.03em]">
              Bref.
            </p>
          </Col>
          <Col span={{ base: 24, lg: 18 }}>
            <p className="max-w-[720px] text-[clamp(1.25rem,2.5vw,2rem)] font-medium leading-[1.25] tracking-[-0.01em]">
              We partner across product, engineering, and brand to build experiences that are
              intuitive, consistent, accessible, and unmistakably Tapestry.
            </p>
            <p className="mt-6 text-[14px] uppercase tracking-[0.15em] text-[#FAF3E8]/50">
              [ we also really like good coffee ]
            </p>
          </Col>
        </Grid>
      </Container>
    </section>
  )
}
