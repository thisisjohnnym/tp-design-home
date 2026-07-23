import { TeamGallery } from "./TeamGallery";

export function TeamSection() {
  return (
    <section
      id="team"
      className="team-section team-section--tapestry scroll-mt-[var(--site-header-height)]"
      aria-label="The team"
    >
      <TeamGallery />
    </section>
  );
}
