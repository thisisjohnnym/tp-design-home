import { Container } from '@/components/Container'
import { Grid, Col } from '@/components/Grid'
import type { TeamMember } from '@/data/content'
import { StarBurst } from './QuirkyDoodles'
import { QuirkyTeamCard } from './QuirkyTeamCard'

const ROTATIONS = [-3, 2, -1.5, 3, -2, 1, -2.5, 2]

type QuirkyTeamSectionProps = {
  members: TeamMember[]
}

export function QuirkyTeamSection({ members }: QuirkyTeamSectionProps) {
  return (
    <section className="relative py-[clamp(80px,12vh,160px)]">
      <StarBurst className="quirky-float absolute left-[6%] top-[8%] h-8 w-8 text-[#FFD93D] md:h-10 md:w-10" />

      <Container>
        <Grid className="mb-[clamp(48px,8vh,80px)]">
          <Col span={{ base: 24, lg: 14 }}>
            <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.2em] text-[#1A1A1A]/50">
              The humans
            </p>
            <h2 className="text-[clamp(2.5rem,6vw,5rem)] font-medium leading-[0.92] tracking-[-0.02em] text-[#1A1A1A]">
              Meet the team
              <span className="quirky-serif ml-2 inline-block italic text-[#FF5722]">*</span>
            </h2>
          </Col>
          <Col span={{ base: 24, lg: 10 }} className="flex items-end">
            <p className="max-w-[400px] text-[clamp(1rem,1.6vw,1.125rem)] leading-[1.45] text-[#1A1A1A]/60">
              Hover for the real talk. We&apos;re serious about craft and slightly unhinged about Figma layer names.
            </p>
          </Col>
        </Grid>

        <div className="grid grid-cols-2 gap-x-[8px] gap-y-12 md:grid-cols-4 lg:grid-cols-4">
          {members.map((member, index) => (
            <div
              key={member.name}
              className={
                index % 4 === 1 ? 'md:mt-8' : index % 4 === 3 ? 'md:-mt-4' : ''
              }
            >
              <QuirkyTeamCard
                member={member}
                rotation={ROTATIONS[index % ROTATIONS.length]}
                index={index}
              />
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
