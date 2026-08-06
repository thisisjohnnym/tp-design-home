import {
  experimentContact,
  experimentHeadline,
  experimentHeadlineDrumWords,
  experimentResources,
} from "./content";
import { ExperimentCursors } from "./ExperimentCursors";

export function ExperimentHero() {
  return (
    <section className="experiment-hero" aria-labelledby="experiment-heading">
      <header className="experiment-hero__header">
        <div
          className="experiment-hero__logo-target"
          aria-label="Tapestry Design"
        />

        <div className="experiment-hero__meta experiment-hero__resources">
          <p className="experiment-hero__meta-title">Resources</p>
          <ul className="experiment-hero__meta-list">
            {experimentResources.map((resource) => (
              <li key={resource}>{resource}</li>
            ))}
          </ul>
        </div>

        <div className="experiment-hero__meta experiment-hero__contact">
          <p className="experiment-hero__meta-title">Contact</p>
          <address className="experiment-hero__meta-list">
            <a href={`mailto:${experimentContact.email}`}>
              {experimentContact.email}
            </a>
            <a href={experimentContact.phoneHref}>
              {experimentContact.phoneLabel}
            </a>
          </address>
        </div>
      </header>

      <h1
        className="experiment-hero__headline"
        id="experiment-heading"
        aria-label="We strategize experiences that shape retail"
      >
        <span className="experiment-hero__headline-line">
          WE{" "}
          <span className="experiment-headline-drum" aria-hidden="true">
            <span className="experiment-headline-drum__sizer">
              STRATEGIZE
            </span>
            <span className="experiment-headline-drum__rotor">
              {experimentHeadlineDrumWords.map((word) => (
                <span className="experiment-headline-drum__face" key={word}>
                  {Array.from(word).map((character, index) => (
                    <span
                      className="experiment-headline-drum__character"
                      key={`${word}-${index}`}
                    >
                      {character}
                    </span>
                  ))}
                </span>
              ))}
            </span>
          </span>
        </span>
        {experimentHeadline.map((line) => (
          <span key={line}>{line}</span>
        ))}
      </h1>

      <ExperimentCursors />
    </section>
  );
}
