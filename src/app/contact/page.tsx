import { PageShell } from "@/components/layout/PageShell";
import { ContactForm } from "@/components/contact/ContactForm";
import { site } from "@/content/site";

export const metadata = {
  title: "Contact — Tapestry Design",
  description: "How to collaborate with the Tapestry design team.",
};

export default function ContactPage() {
  const { figma, slack, intakeForm } = site.links;

  return (
    <PageShell eyebrow="Contact" title="Collaborate with us" description={site.contact.intro}>
      <div className="grid gap-10 lg:grid-cols-2">
        {site.contact.sections.map((section) => (
          <article key={section.title} className="rule border-t pt-6">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="font-coach text-headline font-bold">{section.title}</h2>
              {section.status === "placeholder" ? (
                <span className="font-coachtopia text-caption text-ink-500">TBD</span>
              ) : null}
            </div>
            <p className="mt-3 font-coachtopia text-body text-ink-700 dark:text-ink-200">
              {section.body}
            </p>
          </article>
        ))}
      </div>

      {(figma || slack || intakeForm) && (
        <div className="mt-12 flex flex-wrap gap-3">
          {figma ? (
            <a
              href={figma}
              target="_blank"
              rel="noopener noreferrer"
              className="rule inline-flex rounded-full border px-5 py-2.5 font-coachtopia text-body-sm font-bold transition hover:bg-ink-100/40 dark:hover:bg-ink-800/40"
            >
              Figma library
            </a>
          ) : null}
          {slack ? (
            <a
              href={slack}
              target="_blank"
              rel="noopener noreferrer"
              className="rule inline-flex rounded-full border px-5 py-2.5 font-coachtopia text-body-sm font-bold transition hover:bg-ink-100/40 dark:hover:bg-ink-800/40"
            >
              Slack channel
            </a>
          ) : null}
          {intakeForm ? (
            <a
              href={intakeForm}
              target="_blank"
              rel="noopener noreferrer"
              className="rule inline-flex rounded-full border px-5 py-2.5 font-coachtopia text-body-sm font-bold transition hover:bg-ink-100/40 dark:hover:bg-ink-800/40"
            >
              Request form
            </a>
          ) : null}
        </div>
      )}

      <section aria-labelledby="form-heading">
        <h2 id="form-heading" className="font-coach text-headline font-bold">
          Send a message
        </h2>
        <p className="mt-3 max-w-prose font-coachtopia text-body-sm text-ink-500">
          {site.contact.formNote}
        </p>
        <div className="mt-8">
          <ContactForm />
        </div>
      </section>
    </PageShell>
  );
}
