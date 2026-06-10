import { Grid, Col } from '@/components/Grid'
import { TeamMemberCard } from '@/components/TeamMemberCard'
import type { TeamMember } from '@/data/content'
import { cn } from '@/lib/utils'

type TeamSectionProps = {
  members: TeamMember[]
}

export function TeamSection({ members }: TeamSectionProps) {
  return (
    <section>
      <Grid>
        <Col span={{ base: 24, lg: 22 }} className="lg:col-start-2">
          <div className="grid grid-cols-2 gap-x-2 gap-y-12 md:grid-cols-4 lg:grid-cols-5">
            <div className="col-span-2 flex flex-col gap-[10px] md:col-span-4 lg:col-span-3 lg:col-start-1">
              <h2 className="text-[clamp(2.5rem,5vw,4.5rem)] font-medium leading-none text-black">
                Our team
              </h2>
              <p className="max-w-[640px] text-[clamp(1.125rem,2vw,1.5rem)] leading-[1.3] tracking-[0.2px] text-[#989898]">
                Creative agency building experiences for Tapestry brands.
              </p>
            </div>

            {members.map((member, index) => (
              <div
                key={member.name}
                className={cn(
                  (index === 0 || index === 4) && 'lg:col-start-2'
                )}
              >
                <TeamMemberCard member={member} />
              </div>
            ))}
          </div>
        </Col>
      </Grid>
    </section>
  )
}
