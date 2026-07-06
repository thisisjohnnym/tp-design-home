import { PageShell } from "@/components/layout/PageShell";
import { ProcessStep } from "@/components/ui/ProcessStep";
import { site } from "@/content/site";

export const metadata = {
  title: "How we work — Tapestry Design",
  description: "Design process, collaboration principles, and ways of working.",
};

export default function HowWeWorkPage() {
  return (
    <PageShell
      eyebrow="How we work"
      title="Process & principles"
      description="Our operating model from framing problems through evolving what we ship."
    >
      <section aria-labelledby="process-heading">
        <h2 id="process-heading" className="font-coach text-headline font-bold">
          Six-step process
        </h2>
        <ol className="mt-8 space-y-2">
          {site.process.map((step) => (
            <ProcessStep
              key={step.step}
              step={step.step}
              title={step.title}
              description={step.description}
            />
          ))}
        </ol>
      </section>
      <section aria-labelledby="principles-heading">
        <h2 id="principles-heading" className="font-coach text-headline font-bold">
          Collaboration & quality
        </h2>
        <div className="mt-8 grid gap-10 lg:grid-cols-3">
          {site.principles.map((principle) => (
            <article key={principle.title} className="rule border-t pt-8">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-coach text-headline font-bold">{principle.title}</h3>
                {principle.status === "placeholder" ? (
                  <span className="font-coachtopia text-caption text-ink-500">
                    Details coming soon
                  </span>
                ) : null}
              </div>
              <p className="mt-4 font-coachtopia text-body text-ink-700 dark:text-ink-200">
                {principle.description}
              </p>
            </article>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
