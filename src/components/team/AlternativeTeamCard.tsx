import Image from "next/image";
import { memberDisplayName, type TeamMember } from "@/content/site";
import { posterAltText } from "@/components/team/TeamGalleryCard";
import { WarholPortrait } from "./WarholPortrait";

export type TeamView = "art" | "faces";

type AlternativeTeamCardProps = {
  member: TeamMember;
  view?: TeamView;
};

const IMAGE_SIZES = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw";
const LINEUP_CORNER_RADIUS = "120px";

function TeamCardArtMedia({ member }: { member: TeamMember }) {
  return (
    <div className="relative aspect-[304/406] w-full overflow-hidden bg-ink-100 dark:bg-ink-800">
      <Image
        src={member.poster}
        alt={posterAltText(member)}
        fill
        sizes={IMAGE_SIZES}
        className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transition-none"
      />
    </div>
  );
}

function TeamCardFacesMedia({ member }: { member: TeamMember }) {
  const photo = ("photo" in member ? member.photo : undefined) ?? member.poster;
  const hoverBio = "hoverBio" in member && member.hoverBio ? member.hoverBio : "";

  const cornerStyle = {
    borderTopRightRadius: LINEUP_CORNER_RADIUS,
    borderBottomLeftRadius: LINEUP_CORNER_RADIUS,
  };

  return (
    <div
      className="relative aspect-[304/406] w-full overflow-hidden [perspective:1000px]"
      style={cornerStyle}
      tabIndex={0}
      aria-label={`${member.name}. Hover or focus to reveal more.`}
    >
      <div className="absolute inset-0 transition-transform duration-700 ease-out [transform-style:preserve-3d] motion-safe:group-hover:[transform:rotateY(180deg)] motion-safe:group-focus-within:[transform:rotateY(180deg)]">
        <div
          className="absolute inset-0 overflow-hidden [backface-visibility:hidden]"
          style={cornerStyle}
        >
          <WarholPortrait
            src={photo}
            alt={`Portrait of ${member.name}`}
            name={member.name}
            sizes={IMAGE_SIZES}
            className="absolute inset-0"
          />
        </div>

        <div
          className="absolute inset-0 flex items-center bg-[#111] p-6 [backface-visibility:hidden] [transform:rotateY(180deg)]"
          style={cornerStyle}
        >
          <p className="font-sans text-[19px] leading-[1.4] text-white">{hoverBio}</p>
        </div>
      </div>
    </div>
  );
}

export function AlternativeTeamCard({ member, view = "art" }: AlternativeTeamCardProps) {
  return (
    <article className="group flex flex-col">
      {view === "faces" ? (
        <TeamCardFacesMedia member={member} />
      ) : (
        <TeamCardArtMedia member={member} />
      )}
      <div className="pt-8">
        <h3 className="font-sans text-2xl font-extrabold leading-none text-foreground">
          {memberDisplayName(member)}
        </h3>
        <p className="mt-2 font-sans text-lg leading-none text-foreground">{member.title}</p>
        <p className="mt-4 font-sans text-[15px] leading-none text-[var(--foreground-muted)]">
          {member.location}
        </p>
      </div>
    </article>
  );
}
