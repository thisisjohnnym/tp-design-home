import dynamic from "next/dynamic";
import { heroSequenceCursorRoster } from "./content";
import "./curtain-reveal.css";
import "./team-section.css";

/* three.js only loads in the browser, and only in this chunk. */
const TeamRing = dynamic(
  () => import("./team-ring/TeamRing").then((mod) => mod.TeamRing),
  { ssr: false },
);

export function TeamSection() {
  return (
    <section id="team" className="hs-team" aria-labelledby="hs-team-heading">
      <div className="hs-team__scene">
        <TeamRing members={heroSequenceCursorRoster} />

        <h2 className="hs-team__title" id="hs-team-heading">
          <span className="hs-team__title-line hs-curtain hs-curtain--text">
            <span className="hs-curtain__content">Meet the team</span>
            <span className="hs-curtain__mask" aria-hidden="true" />
          </span>
          <span className="hs-team__title-line hs-curtain hs-curtain--text">
            <span className="hs-curtain__content">behind the work</span>
            <span className="hs-curtain__mask" aria-hidden="true" />
          </span>
        </h2>
      </div>

      {/* The ring is a canvas; this is the team for screen readers and keyboards. */}
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
