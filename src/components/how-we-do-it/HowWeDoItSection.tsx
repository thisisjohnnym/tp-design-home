import { Reveal } from "@/components/Reveal";
import {
  HOW_WE_DO_IT_CANVAS,
  howWeDoItArrows,
  howWeDoItIntro,
  howWeDoItSteps,
} from "@/content/howWeDoIt";
import { HowWeDoItArrow } from "./HowWeDoItArrow";
import { HowWeDoItStep } from "./HowWeDoItStep";

export function HowWeDoItSection() {
  return (
    <section
      id="how-we-do-it"
      className="how-we-do-it scroll-mt-[var(--site-header-height)]"
      aria-labelledby="how-we-do-it-title"
    >
      <header className="how-we-do-it__header px-[var(--grid-margin)]">
        <Reveal>
          <p className="how-we-do-it__eyebrow">{howWeDoItIntro.eyebrow}</p>
          <h2 id="how-we-do-it-title" className="how-we-do-it__intro">
            {howWeDoItIntro.title}
          </h2>
        </Reveal>
      </header>

      <div
        className="how-we-do-it__stage-wrap px-[var(--grid-margin)]"
        style={{
          aspectRatio: `${HOW_WE_DO_IT_CANVAS.width} / ${HOW_WE_DO_IT_CANVAS.height}`,
        }}
      >
        <div className="how-we-do-it__stage how-we-do-it__stage--desktop">
          {howWeDoItSteps.map((step) => (
            <HowWeDoItStep key={step.id} step={step} variant="stage" />
          ))}
          {howWeDoItArrows.map((arrow) => (
            <HowWeDoItArrow key={arrow.id} arrow={arrow} />
          ))}
        </div>
      </div>

      <div className="how-we-do-it__stack how-we-do-it__stack--mobile px-[var(--grid-margin)]">
        {howWeDoItSteps.map((step) => (
          <HowWeDoItStep key={step.id} step={step} variant="stack" />
        ))}
      </div>
    </section>
  );
}
