import { EssenceSection } from "@/components/essence/EssenceSection";
import { HowWeDoItSection } from "@/components/how-we-do-it/HowWeDoItSection";
import { HeroSectionV3 } from "@/components/hero-v3/HeroSection";
import { StatementRevealSection } from "@/components/statement/StatementRevealSection";
import { InteractiveDots } from "@/components/interactive-dots/InteractiveDots";
import { ResourcesSection } from "@/components/resources/ResourcesSection";
import { StatsBar } from "@/components/stats/StatsBar";
import { TeamSection } from "@/components/team/TeamSection";

export default function HeroV3Page() {
  return (
    <>
      <HeroSectionV3 />
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
