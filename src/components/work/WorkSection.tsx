import { Reveal } from "@/components/Reveal";
import { workIntro } from "@/content/work";
import { WorkArcGallery } from "./WorkArcGallery";

export function WorkSection() {
  return (
    <section id="work" className="our-work scroll-mt-[var(--site-header-height)]" aria-label="Our work">
      <div className="our-work__intro px-[var(--grid-margin)]">
        <Reveal>
          <p className="our-work__intro-text">{workIntro}</p>
        </Reveal>
      </div>
      <WorkArcGallery />
    </section>
  );
}
