import { heroSequenceCursorRoster, heroSequenceTeamCard } from "./content";
import { SphereLeft, SphereRight } from "./Sphere";
import "./curtain-reveal.css";
import "./sphere.css";
import "./team-section.css";

function TeamLight({ back = false }: { back?: boolean }) {
  return (
    <span className={back ? "hs-team__glare hs-team__glare--back" : "hs-team__glare"}>
      <span className="hs-team__glare-spot" />
    </span>
  );
}

export function TeamSection() {
  return (
    <section id="team" className="hs-team" aria-labelledby="hs-team-heading">
      <div className="hs-team__pin">
        <div className="hs-team__orbs" aria-hidden="true">
          <div className="hs-team__orb hs-team__orb--lead">
            <SphereLeft />
          </div>
        </div>

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

        <ol className="hs-team__stage">
          {heroSequenceCursorRoster.map((person) => (
            <li
              className="hs-team__card"
              data-person={person.id}
              key={person.id}
            >
              <div className="hs-team__flip">
                <div className="hs-team__tilt">
                <div className="hs-team__face hs-team__face--front">
                  <div className="hs-team__shell">
                    <div className="hs-team__portrait">
                      <div className="hs-team__art">
                        <img
                          className="hs-team__photo"
                          src={person.portrait}
                          alt=""
                        />
                        <span className="hs-team__wash" />
                      </div>
                      <div className="hs-team__copy">
                        <div className="hs-team__meta">
                          <p className="hs-team__role">{person.role}</p>
                          <p className="hs-team__aside">{person.roleAside}</p>
                        </div>
                        <div className="hs-team__name">
                          <p className="hs-team__given">{person.given}—</p>
                          <p className="hs-team__family">{person.family}</p>
                        </div>
                        <div className="hs-team__spacer" />
                        <div className="hs-team__links">
                          <a
                            className="hs-team__link"
                            href={`mailto:${person.email}`}
                            aria-label={`Email ${person.name}`}
                          >
                            Email
                          </a>
                          <a
                            className="hs-team__link"
                            href={person.linkedin}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={`${person.name} on LinkedIn`}
                          >
                            LinkedIn
                          </a>
                          <p className="hs-team__place">{person.place}</p>
                        </div>
                      </div>
                    </div>
                    <p className="hs-team__bio">{person.bio}</p>
                    <TeamLight />
                  </div>
                </div>
                <div className="hs-team__face hs-team__face--back" aria-hidden="true">
                  <div className="hs-team__shell">
                    <img
                      className="hs-team__pattern"
                      src={heroSequenceTeamCard.pattern}
                      alt=""
                      decoding="async"
                    />
                    <TeamLight back />
                  </div>
                </div>
                </div>
              </div>
            </li>
          ))}
        </ol>

        <div className="hs-team__orbs hs-team__orbs--front" aria-hidden="true">
          <div className="hs-team__orb hs-team__orb--accent">
            <SphereRight />
          </div>
        </div>

        {/* Paper team artboard progress — curtain-revealed when cycling starts. */}
        <div
          className="hs-team__progress hs-curtain"
          aria-hidden="true"
          data-on="false"
          data-revealed="false"
        >
          <div className="hs-curtain__content hs-team__progress-body">
            <div className="hs-team__progress-fill" />
            <div className="hs-team__progress-glow" />
          </div>
          <span className="hs-curtain__mask" aria-hidden="true" />
        </div>
      </div>

      <div className="hs-team__runway" aria-hidden="true" />
    </section>
  );
}
