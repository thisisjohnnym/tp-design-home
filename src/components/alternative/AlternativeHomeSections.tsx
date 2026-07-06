import type { ReactNode } from "react";
import {
  alternativeCapabilities,
  alternativeEssence,
  alternativeIntro,
  alternativeProcess,
  alternativeStats,
} from "@/content/alternative";
import { site } from "@/content/site";
import { AlternativeTeamCard } from "./AlternativeTeamCard";
import { EssenceIcon } from "./EssenceIcons";

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="font-sans text-[clamp(3rem,5.7vw,5rem)] font-bold leading-none tracking-[-0.0125em] text-[var(--foreground)]">
      {children}
    </h2>
  );
}

export function AlternativeHomeSections() {
  return (
    <div className="bg-[var(--background)] text-[var(--foreground)] transition-colors">
      <section aria-labelledby="alt-intro" className="px-[var(--grid-margin)] py-[clamp(3rem,6vw,5rem)]">
        <p
          id="alt-intro"
          className="mx-auto max-w-[85rem] whitespace-pre-line text-center font-sans text-[clamp(1.5rem,2.85vw,2.5rem)] leading-[1.2] tracking-[0.01em] text-[var(--foreground)]"
        >
          {alternativeIntro}
        </p>
      </section>

      <section
        aria-labelledby="alt-essence"
        className="px-[var(--grid-margin)] pb-[clamp(5rem,12vw,10rem)] pt-[clamp(4rem,8vw,6rem)]"
      >
        <SectionTitle>
          <span id="alt-essence">
            Our
            <br />
            Essence
          </span>
        </SectionTitle>

        <div className="mt-[clamp(3.5rem,7vw,6rem)] grid grid-cols-1 items-start gap-16 lg:grid-cols-3 lg:gap-x-[clamp(2.5rem,6vw,5.5rem)] lg:gap-y-0">
          {alternativeEssence.map((item) => (
            <div key={item.key} className="flex flex-col gap-6 lg:max-w-none lg:gap-8">
              {item.iconFirst ? (
                <div className="size-[200px] shrink-0">
                  <EssenceIcon icon={item.key} />
                </div>
              ) : null}
              <h3 className="font-sans text-2xl font-bold leading-[1.3] text-[var(--foreground)]">
                {item.title}
              </h3>
              <p className="font-sans text-2xl leading-[1.4] tracking-[0.01em] text-[var(--foreground)]">
                {item.description}
              </p>
              {!item.iconFirst ? (
                <div className="mt-2 size-[200px] shrink-0">
                  <EssenceIcon icon={item.key} />
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="alt-team" className="px-[var(--grid-margin)] pb-[clamp(4rem,10vw,8rem)]">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-16">
          <SectionTitle>
            <span id="alt-team">
              The
              <br />
              Team
            </span>
          </SectionTitle>
          <p className="max-w-[45rem] flex-1 font-sans text-2xl leading-[1.4] tracking-[0.01em] text-[var(--foreground)]">
            {site.teamIntro}
          </p>
        </div>

        <ul
          className="mt-[clamp(3rem,6vw,5rem)] grid list-none grid-cols-1 gap-x-12 gap-y-16 sm:grid-cols-2 lg:grid-cols-4"
          aria-label="Team gallery"
        >
          {site.team.map((member) => (
            <li key={member.name}>
              <AlternativeTeamCard member={member} />
            </li>
          ))}
        </ul>
      </section>

      <section
        id="resources"
        aria-labelledby="alt-capabilities"
        className="px-[var(--grid-margin)] pb-[clamp(4rem,10vw,8rem)] scroll-mt-28"
      >
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start lg:gap-20">
          <div className="max-w-[60rem]">
            <SectionTitle>
              <span id="alt-capabilities">What We Do</span>
            </SectionTitle>
            <p className="mt-4 max-w-[60rem] font-sans text-2xl leading-[1.4] tracking-[0.01em] text-[var(--foreground)]">
              {site.capabilitiesIntro}
            </p>
          </div>

          <ul className="list-none text-right font-sans text-[clamp(2.5rem,5.7vw,5rem)] font-medium leading-[1.4] text-[var(--foreground-muted)] lg:min-w-[22rem]">
            {alternativeCapabilities.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-label="Team statistics" className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-3">
          {alternativeStats.map((stat) => (
            <div
              key={stat.value}
              className="flex min-h-[12.5rem] flex-col justify-center gap-4 px-6 py-8"
              style={{ backgroundColor: stat.bg, color: stat.text }}
            >
              <p className="font-sans text-[clamp(3rem,5.7vw,5rem)] font-bold leading-none tracking-[-0.0125em]">
                {stat.value}
              </p>
              <p className="max-w-[24rem] font-sans text-2xl leading-[1.4] tracking-[0.01em]">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section
        aria-labelledby="alt-process"
        className="px-[var(--grid-margin)] py-[clamp(4rem,10vw,8rem)]"
      >
        <SectionTitle>
          <span id="alt-process">Our Process</span>
        </SectionTitle>
        <p className="mt-4 max-w-[60rem] font-sans text-2xl leading-[1.4] tracking-[0.01em] text-[var(--foreground)]">
          {site.capabilitiesIntro}
        </p>

        <ol className="relative mt-[clamp(3rem,8vw,6rem)] list-none space-y-12 md:space-y-16">
          {alternativeProcess.map((step) => (
            <li
              key={step.title}
              className={`max-w-[20.5rem] ${
                step.offset === 1
                  ? "md:ml-[25%]"
                  : step.offset === 2
                    ? "md:ml-[50%] lg:ml-[58%]"
                    : ""
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="font-sans text-[clamp(2rem,3vw,3rem)] font-medium leading-none text-[var(--foreground)]">
                  {step.title}
                </span>
                <span className="font-sans text-[clamp(1.5rem,2.5vw,2rem)] font-medium leading-none text-[var(--foreground-muted)]">
                  {step.step}
                </span>
              </div>
              <p className="mt-3 font-sans text-2xl leading-[1.4] tracking-[0.01em] text-[var(--foreground)]">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
