import Image from "next/image";
import { memberDisplayName, type TeamMember } from "@/content/site";
import { posterAltText } from "@/components/team/TeamGalleryCard";

type AlternativeTeamCardProps = {
  member: TeamMember;
};

const IMAGE_SIZES = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw";

function TeamCardMedia({ member }: { member: TeamMember }) {
  return (
    <div className="relative aspect-[304/406] w-full overflow-hidden bg-[var(--ink-100)]">
      <Image
        src={member.poster}
        alt={posterAltText(member)}
        fill
        sizes={IMAGE_SIZES}
        className="object-cover"
      />
    </div>
  );
}

function TeamCardFlipMedia({ member }: { member: TeamMember & { photo: string } }) {
  return (
    <div
      className="group relative aspect-[304/406] w-full overflow-hidden bg-[var(--ink-100)] [perspective:1000px]"
      tabIndex={0}
      aria-label={`${member.name} design poster. Hover or focus to reveal portrait.`}
    >
      <div className="absolute inset-0 transition-transform duration-700 ease-out [transform-style:preserve-3d] motion-safe:group-hover:[transform:rotateY(180deg)] motion-safe:group-focus-within:[transform:rotateY(180deg)]">
        <div className="absolute inset-0 overflow-hidden bg-[#ea1801] [backface-visibility:hidden]">
          <Image
            src={member.poster}
            alt={posterAltText(member)}
            fill
            sizes={IMAGE_SIZES}
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <Image
            src={member.photo}
            alt={`Portrait of ${member.name}`}
            fill
            sizes={IMAGE_SIZES}
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
}

export function AlternativeTeamCard({ member }: AlternativeTeamCardProps) {
  const hasFlip = "photo" in member && Boolean(member.photo);

  return (
    <article className="flex flex-col">
      {hasFlip ? (
        <TeamCardFlipMedia member={member as TeamMember & { photo: string }} />
      ) : (
        <TeamCardMedia member={member} />
      )}
      <div className="pt-8">
        <h3 className="font-sans text-2xl font-extrabold leading-none text-[var(--foreground)]">
          {memberDisplayName(member)}
        </h3>
        <p className="mt-2 font-sans text-lg leading-none text-[var(--foreground)]">{member.title}</p>
        <p className="mt-4 font-sans text-[15px] leading-none text-[var(--foreground-muted)]">
          {member.location}
        </p>
      </div>
    </article>
  );
}
