import Image from "next/image";
import { memberDisplayName, type TeamMember } from "@/content/site";
import { posterAltText } from "@/components/team/TeamGalleryCard";
import { WarholPortrait } from "./WarholPortrait";

type AlternativeTeamCardProps = {
  member: TeamMember;
};

const IMAGE_SIZES = "(max-width: 1024px) 50vw, 25vw";
const LINEUP_CORNER_RADIUS = "120px";

const cornerStyle = {
  borderTopRightRadius: LINEUP_CORNER_RADIUS,
  borderBottomLeftRadius: LINEUP_CORNER_RADIUS,
};

const linkClass =
  "font-sans text-[13px] leading-none text-[var(--foreground-muted)] underline underline-offset-2 sm:text-[15px]";

function TeamCardMedia({ member }: { member: TeamMember }) {
  const photo = ("photo" in member ? member.photo : undefined) ?? member.poster;

  return (
    <div
      className="relative aspect-[304/406] w-full overflow-hidden"
      style={cornerStyle}
      tabIndex={0}
      aria-label={`${member.name}. Hover or focus to reveal art poster.`}
    >
      <WarholPortrait
        src={photo}
        alt={`Portrait of ${member.name}`}
        name={member.name}
        sizes={IMAGE_SIZES}
        className="absolute inset-0"
      />
      <div
        className="absolute inset-0 opacity-0 transition-opacity duration-500 ease-out motion-safe:group-hover:opacity-100 motion-safe:group-focus-within:opacity-100 motion-reduce:transition-none"
        style={cornerStyle}
        aria-hidden
      >
        <Image
          src={member.poster}
          alt={posterAltText(member)}
          fill
          sizes={IMAGE_SIZES}
          className="object-cover"
        />
      </div>
    </div>
  );
}

export function AlternativeTeamCard({ member }: AlternativeTeamCardProps) {
  return (
    <article className="group flex flex-col">
      <TeamCardMedia member={member} />
      <div className="pt-4 sm:pt-8">
        <h3 className="font-sans text-lg font-extrabold leading-tight text-foreground sm:text-2xl sm:leading-none">
          {memberDisplayName(member)}
        </h3>
        <p className="mt-1.5 font-sans text-sm leading-snug text-foreground sm:mt-2 sm:text-lg sm:leading-none">
          {member.title}
        </p>
        <p className="mt-2 font-sans text-[13px] leading-snug text-[var(--foreground-muted)] sm:mt-4 sm:text-[15px] sm:leading-none">
          {member.location}
        </p>
        <p className="mt-3 font-sans text-[13px] leading-snug text-[var(--foreground-muted)] sm:mt-4 sm:text-[15px] sm:leading-normal">
          {member.bio}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 sm:mt-4">
          <a
            href={`mailto:${member.email}`}
            className={`${linkClass} transition hover:text-foreground focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--foreground)]`}
          >
            Email
          </a>
          <span className={`${linkClass} cursor-default`}>LinkedIn</span>
        </div>
      </div>
    </article>
  );
}
