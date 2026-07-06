import { site } from "@/content/site";
import { TeamGalleryCard } from "./TeamGalleryCard";

type TeamGalleryProps = {
  variant?: "home" | "page";
  showIntro?: boolean;
  className?: string;
};

export function TeamGallery({
  showIntro = true,
  className = "",
}: TeamGalleryProps) {
  return (
    <div className={className}>
      {showIntro ? (
        <p className="max-w-[32.5rem] font-sans text-[clamp(1.25rem,2.22vw,2rem)] font-normal leading-[1.3] tracking-[0.0125em] text-[var(--foreground)]">
          {site.teamIntro}
        </p>
      ) : null}

      <ul
        className="mt-10 grid list-none grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-10 lg:grid-cols-4 lg:gap-12"
        aria-label="Team gallery"
      >
        {site.team.map((member) => (
          <li key={member.name} className="group">
            <TeamGalleryCard member={member} className="h-full" />
          </li>
        ))}
      </ul>
    </div>
  );
}
