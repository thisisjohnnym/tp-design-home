import { Reveal } from "@/components/Reveal";
import { site } from "@/content/site";
import { TeamGallery } from "./TeamGallery";

export function TeamSection() {
  return (
    <section
      id="team"
      className="scroll-mt-[var(--site-header-height)] px-[var(--grid-margin)] pt-[80px] pb-[clamp(2rem,5vw,4rem)]"
      aria-labelledby="the-team"
    >
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-16">
        <Reveal>
          <h2 id="the-team" className="section-title">
            The
            <br />
            Team
          </h2>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="max-w-[45rem] flex-1 font-sans text-[clamp(1.125rem,2vw,1.5rem)] leading-[1.4] tracking-[0.01em] text-foreground">
            {site.teamIntro}
          </p>
        </Reveal>
      </div>

      <TeamGallery className="mt-[clamp(3rem,6vw,5rem)]" />
    </section>
  );
}
