import { EssenceSection } from "@/components/essence/EssenceSection";
import { HowWeDoItSection } from "@/components/how-we-do-it/HowWeDoItSection";
import { InteractiveDots } from "@/components/interactive-dots/InteractiveDots";
import { ResourcesSection } from "@/components/resources/ResourcesSection";
import { StatementRevealSection } from "@/components/statement/StatementRevealSection";
import { StatsBar } from "@/components/stats/StatsBar";
import { TeamSection } from "@/components/team/TeamSection";

export function HomeSections() {
  return (
    <>
      <StatementRevealSection />
      <TeamSection />
      <EssenceSection />
      <HowWeDoItSection />
      <StatsBar />
      <ResourcesSection />
      <InteractiveDots />
    </>
  );
}
