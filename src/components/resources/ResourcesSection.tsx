import { Reveal } from "@/components/Reveal";
import { feedbackGuides, resourcesIntro } from "@/content/resources";
import { ResourceLinkCard } from "./ResourceLinkCard";

export function ResourcesSection() {
  return (
    <section
      id="resources"
      className="resources scroll-mt-[var(--site-header-height)]"
      aria-labelledby="resources-title"
    >
      <header className="resources__header px-[var(--grid-margin)]">
        <Reveal>
          <p className="resources__eyebrow">{resourcesIntro.eyebrow}</p>
          <h2 id="resources-title" className="section-title">
            {resourcesIntro.title}
          </h2>
          <p className="resources__description">{resourcesIntro.description}</p>
        </Reveal>
      </header>

      <div className="resources__content px-[var(--grid-margin)]">
        <Reveal delay={0.1}>
          <div className="resources__group">
            <div className="resources__grid resources__grid--links">
              {feedbackGuides.map((guide) => (
                <ResourceLinkCard key={guide.id} guide={guide} />
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
