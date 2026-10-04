import {
  heroSequenceHeadline,
  heroSequenceHeadlineDrumWords,
  heroSequenceHeadlineLines,
  heroSequenceHeadlinePhoneBreaks,
} from "./content";
import { Fragment } from "react";
import "./curtain-reveal.css";

/** First headline verb — curtain-cycled instead of the old 3D drum. */
function CurtainVerb() {
  return (
    <span
      className="hs-shatter__word hs-shatter__word--curtain hs-curtain hs-curtain--inline hs-curtain--text"
      aria-hidden="true"
      data-curtain-verb="true"
    >
      <span className="hs-curtain__sizers" aria-hidden="true">
        {heroSequenceHeadlineDrumWords.map((word) => (
          <span className="hs-curtain__sizer" key={`sizer-${word}`}>
            {word}
          </span>
        ))}
      </span>
      <span className="hs-curtain__content">
        {heroSequenceHeadlineDrumWords[0]}
      </span>
      <span className="hs-curtain__mask" aria-hidden="true" />
    </span>
  );
}

export function ShatterHeadline() {
  return (
    <div className="hs-layer hs-layer--shatter">
      <div className="hs-shatter">
        <h1
          className="hs-shatter__headline"
          aria-label={heroSequenceHeadline.join(" ")}
        >
          {heroSequenceHeadlineLines.map((line, lineIndex) => (
            <span className="hs-shatter__line" key={`line-${lineIndex}`}>
              {line.map((word, wordIndex) => (
                <Fragment key={`${word}-${lineIndex}-${wordIndex}`}>
                  {lineIndex === 0 && wordIndex === 0 ? (
                    <CurtainVerb />
                  ) : (
                    <span
                      className="hs-shatter__word"
                      data-word={word === "what's" ? "whats" : undefined}
                      aria-hidden="true"
                    >
                      {word}
                    </span>
                  )}
                  {/* Phone-only row break; desktop keeps the line spans. */}
                  {heroSequenceHeadlinePhoneBreaks.includes(word) && (
                    <span className="hs-shatter__break" aria-hidden="true" />
                  )}
                </Fragment>
              ))}
            </span>
          ))}
        </h1>
      </div>
    </div>
  );
}
