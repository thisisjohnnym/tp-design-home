import { HeroSection } from '@/components/HeroSection'
import { ScrollRevealText } from '@/components/ScrollRevealText'
import { Container } from '@/components/Container'
import { Grid, Col } from '@/components/Grid'
import { TeamSection } from '@/components/TeamSection'
import { process, team } from '@/data/content'

const BG = '#ffffff'
const INK = '#000000'
const LABEL = '#424242'
const BODY = '#323232'

const WHAT_WE_DO = [
  'Design Strategy',
  'Product Experience Design',
  'Interaction Design',
  'Research Collaboration',
  'Production-ready Prototyping',
]

const TEAM_FUNCTION =
  'We partner across product, engineering, and brand partners to create experiences that are intuitive, consistent, accessible, and distinctly Tapestry.'

export default function Home() {
  return (
    <div className="font-sans antialiased" style={{ background: BG, color: INK }}>
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

      <Container className="pt-[200px] pb-[120px]">
        <div className="flex flex-col gap-[150px]">
          <TeamSection members={team} />

          <section>
            <Grid className="items-start">
              <Col span={{ base: 24, lg: 5 }}>
                <p
                  className="font-medium leading-none"
                  style={{ color: LABEL, fontSize: '1.5rem' }}
                >
                  What we do
                </p>
              </Col>
              <Col span={{ base: 24, lg: 19 }}>
                <ul className="flex flex-col gap-[23px]">
                  {WHAT_WE_DO.map((item) => (
                    <li
                      key={item}
                      className="font-medium leading-none"
                      style={{ color: BODY, fontSize: 'clamp(1.75rem, 3vw, 2.5rem)' }}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </Col>
            </Grid>
          </section>

          <section>
            <Grid className="items-start">
              <Col span={{ base: 24, lg: 5 }}>
                <p
                  className="font-medium leading-none"
                  style={{ color: LABEL, fontSize: '1.5rem' }}
                >
                  How We Work
                </p>
              </Col>
              <Col span={{ base: 24, lg: 19 }}>
                <div className="flex flex-col gap-8">
                  {process.map((step) => (
                    <div key={step.step} className="border-t pt-4" style={{ borderColor: '#e8e8e8' }}>
                      <p
                        className="mb-2 font-medium leading-none"
                        style={{ color: BODY, fontSize: 'clamp(1.25rem, 2.2vw, 2rem)' }}
                      >
                        {step.name}
                      </p>
                      <p className="max-w-[640px] text-[14px] leading-relaxed" style={{ color: LABEL }}>
                        {step.description}
                      </p>
                    </div>
                  ))}
                </div>
              </Col>
            </Grid>
          </section>
        </div>
      </Container>
    </div>
  )
}
