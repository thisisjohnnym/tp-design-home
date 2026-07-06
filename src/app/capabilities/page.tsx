import { DesignCapabilitiesShowcase } from "@/components/capabilities/DesignCapabilitiesShowcase";
import { CapabilitiesList } from "@/components/capabilities/CapabilitiesList";
import { PageShell } from "@/components/layout/PageShell";
import { site } from "@/content/site";

export const metadata = {
  title: "Capabilities — Tapestry Design",
  description: "Design capabilities across product, systems, craft, strategy, and operations.",
};

export default function CapabilitiesPage() {
  return (
    <PageShell eyebrow="What we do" title="Capabilities" description={site.capabilitiesIntro}>
      <DesignCapabilitiesShowcase />
      <CapabilitiesList />
    </PageShell>
  );
}
