import { PageShell } from "@/components/layout/PageShell";
import { OwnershipItem } from "@/components/ui/OwnershipItem";
import { site } from "@/content/site";

export const metadata = {
  title: "What we manage — Tapestry Design",
  description: "Patterns, files, rituals, and design references the team maintains.",
};

export default function WhatWeManagePage() {
  return (
    <PageShell
      eyebrow="What we manage"
      title={site.ownershipMapTitle}
      description={site.manageIntro}
    >
      <div className="grid gap-2 md:grid-cols-2">
        {site.ownership.map((item) => (
          <OwnershipItem
            key={item.category}
            category={item.category}
            label={item.label}
            status={item.status}
          />
        ))}
      </div>
      <p className="mt-12 max-w-prose font-coachtopia text-body-sm text-ink-500">
        Replace placeholder items in{" "}
        <code className="text-ink-700 dark:text-ink-200">src/content/site.ts</code> with your
        real ownership map — Figma libraries, product areas, rituals, and platforms.
      </p>
    </PageShell>
  );
}
