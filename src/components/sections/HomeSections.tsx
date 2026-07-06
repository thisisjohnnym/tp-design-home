import Link from "next/link";
import { site } from "@/content/site";
import { SectionLink } from "@/components/ui/SectionLink";
import { ValueCard } from "@/components/ui/ValueCard";
import { TeamGallery } from "@/components/team/TeamGallery";
import { DesignCapabilitiesShowcase } from "@/components/capabilities/DesignCapabilitiesShowcase";
import { OwnershipItem } from "@/components/ui/OwnershipItem";
import { ProcessStep } from "@/components/ui/ProcessStep";
import { teamLayout } from "@/content/grid";
import { GridCell, PageGrid } from "@/components/layout/PageGrid";

function SectionHeader({
  id,
  eyebrow,
  title,
  href,
  linkLabel,
}: {
  id: string;
  eyebrow: string;
  title: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p id={`${id}-label`} className="eyebrow text-ink-500">
          {eyebrow}
        </p>
        <h2 className="display-tight mt-3 font-sans text-display-md font-bold">{title}</h2>
      </div>
      {href && linkLabel ? <SectionLink href={href}>{linkLabel}</SectionLink> : null}
    </div>
  );
}

export function HomeSections() {
  return (
    <PageGrid className="mt-section pb-20 md:pb-28">
      <GridCell className="section-stack">
      <section aria-labelledby="team-heading" id="team" className="scroll-mt-24">
        <PageGrid>
          <GridCell span={teamLayout.titleSpan} spanMobile={12}>
            <h2
              id="team-heading"
              className="max-w-[50.5rem] font-sans text-[clamp(2.5rem,5.56vw,5rem)] font-bold uppercase leading-[0.95] tracking-[-0.02em] text-[var(--foreground)]"
            >
              Who we are
            </h2>
          </GridCell>
        </PageGrid>

        <div className="mt-[clamp(2rem,8vw,5rem)] flex flex-col gap-[clamp(4rem,12vw,8rem)]">
          {site.values.map((value, index) => (
            <ValueCard
              key={value.title}
              index={index + 1}
              title={value.title}
              description={value.description}
            />
          ))}
        </div>

        <TeamGallery variant="home" className="mt-[clamp(4rem,12vw,8rem)]" />
      </section>

      <section aria-labelledby="capabilities-label" id="what-we-do" className="scroll-mt-24">
        <SectionHeader
          id="capabilities"
          eyebrow="What we do"
          title="Capabilities"
          href="/capabilities"
          linkLabel="All capabilities"
        />
        <p className="mt-6 max-w-prose font-sans text-body-lg text-ink-700 dark:text-ink-200">
          {site.capabilitiesIntro}
        </p>
        <DesignCapabilitiesShowcase compact showDescription={false} />
      </section>

      <section aria-labelledby="manage-label" id="what-we-manage" className="scroll-mt-24 pt-[100px]">
        <SectionHeader
          id="manage"
          eyebrow="What we manage"
          title={site.ownershipMapTitle}
          href="/what-we-manage"
          linkLabel="Ownership map"
        />
        <p className="mt-6 max-w-prose font-sans text-body-lg text-ink-700 dark:text-ink-200">
          {site.manageIntro}
        </p>
        <div className="mt-10 grid gap-2 md:grid-cols-2">
          {site.ownership.map((item) => (
            <OwnershipItem
              key={item.category}
              category={item.category}
              label={item.label}
              status={item.status}
            />
          ))}
        </div>
      </section>

      <section aria-labelledby="process-label" id="how-we-work" className="scroll-mt-24">
        <SectionHeader
          id="process"
          eyebrow="How we work"
          title="Our process"
          href="/how-we-work"
          linkLabel="Full process & principles"
        />
        <ol className="mt-10 space-y-2">
          {site.process.slice(0, 3).map((step) => (
            <ProcessStep
              key={step.step}
              step={step.step}
              title={step.title}
              description={step.description}
            />
          ))}
        </ol>
      </section>

      <section
        aria-labelledby="contact-label"
        id="contact"
        className="rule scroll-mt-24 rounded border p-8 md:p-10"
      >
        <p id="contact-label" className="eyebrow text-ink-500">
          Contact
        </p>
        <h2 className="display-tight mt-3 font-sans text-display-md font-bold">
          {site.contact.intro}
        </h2>
        <p className="mt-4 max-w-prose font-sans text-body text-ink-700 dark:text-ink-200">
          Partners can find intake details, office hours, and how to reach us on the contact page.
        </p>
        <Link
          href="/contact"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink-900 px-6 py-3 font-sans text-body-sm font-bold text-ink-50 transition hover:opacity-90 dark:bg-ink-50 dark:text-ink-900"
        >
          Get in touch
          <span aria-hidden>→</span>
        </Link>
      </section>
      </GridCell>
    </PageGrid>
  );
}
