import type { CSSProperties } from "react";
import { Reveal } from "@/components/Reveal";
import { ESSENCE_SECTION_BG, essenceItems } from "@/content/essence";

export function EssenceSection() {
  return (
    <section
      aria-labelledby="our-essence"
      className="essence-section"
      style={
        {
          backgroundColor: ESSENCE_SECTION_BG,
          "--essence-bg": ESSENCE_SECTION_BG,
        } as CSSProperties
      }
    >
      <div className="essence-section__content px-[var(--grid-margin)] py-[clamp(4rem,8vw,6rem)]">
        <Reveal>
          <h2 id="our-essence" className="section-title">
            Our
            <br />
            Essence
          </h2>
        </Reveal>

        <div className="mt-[clamp(3.5rem,7vw,5.5rem)] grid grid-cols-1 items-start gap-16 lg:grid-cols-3 lg:gap-x-[68px] lg:gap-y-0">
          {essenceItems.map((item, index) => (
            <Reveal key={item.key} delay={index * 0.1}>
              <article className="flex max-w-[24.2rem] flex-col gap-2">
                <p
                  aria-hidden
                  className="font-sans text-[clamp(4rem,9vw,8.75rem)] font-black leading-none tracking-[-0.007em]"
                  style={{
                    color: "transparent",
                    WebkitTextStroke: `1.5px ${item.color}`,
                  }}
                >
                  {item.number}
                </p>
                <h3
                  className="font-sans text-[clamp(1.75rem,3vw,2.5rem)] font-bold leading-none tracking-[-0.025em]"
                  style={{ color: item.color }}
                >
                  {item.title}
                </h3>
                <p className="font-sans text-2xl leading-[1.4] tracking-[0.01em] text-foreground">
                  {item.description}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
