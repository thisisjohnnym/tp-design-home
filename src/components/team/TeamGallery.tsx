import { Reveal } from "@/components/Reveal";
import { site } from "@/content/site";
import { AlternativeTeamCard } from "./AlternativeTeamCard";
import { WarholFilters } from "./WarholPortrait";

type TeamGalleryProps = {
  className?: string;
};

export function TeamGallery({ className = "" }: TeamGalleryProps) {
  return (
    <div className={className}>
      <WarholFilters />
      <ul
        className="grid list-none grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-12 sm:gap-y-16 lg:grid-cols-4"
        aria-label="Team gallery"
      >
        {site.team.map((member, index) => (
          <li key={member.name}>
            <Reveal delay={index * 0.06}>
              <AlternativeTeamCard member={member} />
            </Reveal>
          </li>
        ))}
      </ul>
    </div>
  );
}
