import { Reveal } from "@/components/Reveal";
import { workIntro, workProjects } from "@/content/work";
import { WorkCard } from "./WorkCard";

export function WorkSection() {
  return (
    <section
      id="work"
      className="our-work scroll-mt-[var(--site-header-height)]"
      aria-labelledby="work-title"
    >
      <header className="our-work__header px-[var(--grid-margin)]">
        <Reveal>
          <p className="our-work__subheader">{workIntro.subheader}</p>
          <h2 id="work-title" className="section-title">
            {workIntro.title}
          </h2>
        </Reveal>
      </header>

      <div className="our-work__grid px-[var(--grid-margin)]">
        {workProjects.map((project, index) => (
          <Reveal key={project.id} delay={index * 0.08}>
            <WorkCard project={project} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
