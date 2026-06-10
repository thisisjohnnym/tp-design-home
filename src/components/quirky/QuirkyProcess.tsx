import { Container } from '@/components/Container'
import { Grid, Col } from '@/components/Grid'
import { process } from '@/data/content'
import { SquiggleArrow } from './QuirkyDoodles'

export function QuirkyProcess() {
  return (
    <section className="relative border-t border-[#1A1A1A]/10 py-[clamp(80px,12vh,160px)]">
      <SquiggleArrow className="quirky-wiggle absolute right-[10%] top-[15%] hidden h-10 w-20 text-[#FF5722]/50 lg:block" />

      <Container>
        <Grid className="mb-[clamp(48px,8vh,72px)]">
          <Col span={{ base: 24, lg: 12 }}>
            <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.2em] text-[#1A1A1A]/50">
              How we work
            </p>
            <h2 className="text-[clamp(2rem,5vw,4rem)] font-medium leading-[0.95] tracking-[-0.02em] text-[#1A1A1A]">
              Frame → Explore →{' '}
              <span className="quirky-serif italic text-[#6C63FF]">Align</span>
              <br />
              → Refine → Ship → Evolve
            </h2>
          </Col>
          <Col span={{ base: 24, lg: 12 }} className="flex items-end">
            <p className="max-w-[420px] text-[clamp(1rem,1.6vw,1.125rem)] leading-[1.45] text-[#1A1A1A]/60">
              Six steps. Zero mystery. We document everything in Figma so engineering never has to guess.
            </p>
          </Col>
        </Grid>

        <div className="grid gap-[8px] md:grid-cols-2 lg:grid-cols-3">
          {process.map((step, i) => (
            <article
              key={step.step}
              className="group border border-[#1A1A1A]/10 bg-[#FAF3E8] p-6 transition-colors duration-200 hover:border-[#1A1A1A]/30 hover:bg-[#FFF]"
              style={{
                transform: i % 2 === 1 ? 'rotate(0.5deg)' : 'rotate(-0.5deg)',
              }}
            >
              <p className="mb-4 text-[clamp(2.5rem,4vw,3.5rem)] font-medium leading-none tabular-nums text-[#FF5722]/25 transition-colors duration-200 group-hover:text-[#FF5722]/60">
                {step.step}
              </p>
              <h3 className="mb-2 text-[clamp(1.125rem,2vw,1.5rem)] font-medium leading-tight text-[#1A1A1A]">
                {step.name}
              </h3>
              <p className="text-[14px] leading-relaxed text-[#1A1A1A]/55">
                {step.description}
              </p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  )
}
