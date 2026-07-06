import { PageShell } from "@/components/layout/PageShell";
import { TeamGallery } from "@/components/team/TeamGallery";
import { ValueCard } from "@/components/ui/ValueCard";
import { site } from "@/content/site";

export const metadata = {
  title: "Team — Tapestry Design",
  description:
    "Meet the Tapestry design team — each member paired with a design poster that represents how they think and work.",
};

export default function TeamPage() {
  return (
    <PageShell eyebrow="Who we are" title="Our team">
      <section aria-label="Our values">
        <div className="flex flex-col gap-[clamp(4rem,12vw,8rem)]">
          {site.values.map((value, index) => (
            <ValueCard
              key={value.title}
              index={index + 1}
              title={value.title}
              description={value.description}
            />
          ))}
        </div>
      </section>
      <section aria-label="The team">
        <TeamGallery variant="page" />
      </section>
    </PageShell>
  );
}
