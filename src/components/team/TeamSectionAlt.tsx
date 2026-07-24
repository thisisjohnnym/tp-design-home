import { TeamClusterGallery } from "./TeamClusterGallery";

export function TeamSectionAlt() {
  return (
    <section
      id="team-alt"
      className="team-section team-section--cluster scroll-mt-[var(--site-header-height)]"
      aria-label="The team"
    >
      <TeamClusterGallery />
    </section>
  );
}
