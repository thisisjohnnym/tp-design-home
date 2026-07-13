import Image from "next/image";
import { memberDisplayName, type TeamMember } from "@/content/site";

type TeamGalleryCardProps = {
  member: TeamMember;
  figureIndex: number;
  className?: string;
};

export function posterAltText(member: TeamMember): string {
  return `Design poster chosen by ${member.name}`;
}

export function TeamGalleryCard({ member, figureIndex, className = "" }: TeamGalleryCardProps) {
  const figureLabel = `Fig. ${String(figureIndex).padStart(2, "0")}`;

  return (
    <article className={`flex flex-col ${className}`}>
      <div className="editorial-figure-label">
        <p className="eyebrow text-ink-500">{figureLabel}</p>
        {member.posterLabel ? (
          <p className="eyebrow text-right text-ink-300">{member.posterLabel}</p>
        ) : null}
      </div>

      <div className="editorial-figure-frame">
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-ink-100 dark:bg-ink-800">
          <Image
            src={member.poster}
            alt={posterAltText(member)}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-[1.04] motion-reduce:transition-none"
            priority={false}
          />
        </div>
      </div>

      <div className="mt-5 border-t border-[var(--rule)] pt-5">
        <h3 className="font-sans text-headline font-bold leading-tight">
          {memberDisplayName(member)}
        </h3>
        <p className="mt-1.5 font-sans text-body text-ink-700 dark:text-ink-200">{member.title}</p>
        <p className="mt-1 font-sans text-body-sm text-ink-500">{member.location}</p>
      </div>
    </article>
  );
}
