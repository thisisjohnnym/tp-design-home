import { EssenceSection } from "@/components/essence/EssenceSection";
import { HowWeDoItSection } from "@/components/how-we-do-it/HowWeDoItSection";
import { HeroSectionV5 } from "@/components/hero-v5/HeroSection";
import { StatementRevealSection } from "@/components/statement/StatementRevealSection";
import { InteractiveDots } from "@/components/interactive-dots/InteractiveDots";
import { ResourcesSection } from "@/components/resources/ResourcesSection";
import { StatsBar } from "@/components/stats/StatsBar";
import { TeamSection } from "@/components/team/TeamSection";
import { WorkSection } from "@/components/work/WorkSection";

export default function Home() {
  return (
    <>
      <HeroSectionV5 />
      <StatementRevealSection />
      <WorkSection />
      <TeamSection />
      <HowWeDoItSection />
      <EssenceSection />
      <StatsBar />
      <ResourcesSection />
      <InteractiveDots />
    </>
  );
}
