import Image from "next/image";
import { memberDisplayName, type TeamMember } from "@/content/site";

type TeamGalleryCardProps = {
  member: TeamMember;
  className?: string;
};

export function posterAltText(member: TeamMember): string {
  return `Design poster chosen by ${member.name}`;
}

export function TeamGalleryCard({ member, className = "" }: TeamGalleryCardProps) {
  return (
    <article className={`flex flex-col ${className}`}>
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-ink-100 dark:bg-ink-800">
        <Image
          src={member.poster}
          alt={posterAltText(member)}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 ease-out motion-safe:group-hover:scale-[1.03] motion-reduce:transition-none"
          priority={false}
        />
      </div>
      <div className="pt-6">
        {member.posterLabel ? (
          <p className="eyebrow text-ink-500">{member.posterLabel}</p>
        ) : null}
        <h3 className="mt-2 font-sans text-headline font-bold">{memberDisplayName(member)}</h3>
        <p className="mt-1 font-sans text-body text-ink-700 dark:text-ink-200">{member.title}</p>
        <p className="mt-1 font-sans text-body-sm text-ink-500">{member.location}</p>
      </div>
    </article>
  );
}
