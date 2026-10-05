import { heroSequenceCursorRoster } from "./content";
import { TeamCarousel } from "./TeamCarousel";
import "./team-section.css";

export function TeamSection() {
  return (
    <section id="team" className="hs-team" aria-labelledby="hs-team-heading">
      <h2 className="hs-team__heading" id="hs-team-heading">
        Meet the team behind the work
      </h2>

      <div className="hs-team__scene">
        <TeamCarousel members={heroSequenceCursorRoster} />
      </div>

      {/* The carousel is decorative; this is the team for screen readers and keyboards. */}
      <ul className="hs-team__roster">
        {heroSequenceCursorRoster.map((person) => (
          <li key={person.id}>
            {person.name}, {person.role}. {person.bio}{" "}
            <a href={`mailto:${person.email}`}>Email {person.name}</a>{" "}
            <a href={person.linkedin} target="_blank" rel="noreferrer">
              {person.name} on LinkedIn
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
