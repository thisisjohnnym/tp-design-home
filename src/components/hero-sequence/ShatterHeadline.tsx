import {
  heroSequenceCursors,
  heroSequenceHeadline,
  heroSequenceHeadlineDrumWords,
  heroSequenceHeadlineLines,
} from "./content";
import "./curtain-reveal.css";

function CursorArrow() {
  return (
    <svg
      className="hs-cursor__svg"
      width="26"
      height="28"
      viewBox="0 0 26 28"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3 2.5 L3 22 L8.4 16.6 L12 24.8 L15.6 23.2 L12 15 L19.6 15 Z"
        fill="currentColor"
        stroke="var(--hs-light)"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** First headline verb — curtain-cycled instead of the old 3D drum. */
function CurtainVerb() {
  return (
    <span
      className="hs-shatter__word hs-shatter__word--curtain hs-curtain hs-curtain--inline"
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
              {line.map((word, wordIndex) => {
                if (lineIndex === 0 && wordIndex === 0) {
                  return <CurtainVerb key="curtain-verb" />;
                }

                return (
                  <span
                    className="hs-shatter__word"
                    data-word={word === "what's" ? "whats" : undefined}
                    key={`${word}-${lineIndex}-${wordIndex}`}
                    aria-hidden="true"
                  >
                    {word}
                  </span>
                );
              })}
            </span>
          ))}
        </h1>

        <div className="hs-cursors" aria-hidden="true">
          {heroSequenceCursors.map((cursor) => (
            <div
              className="hs-cursor"
              data-person={cursor.id}
              data-slot={cursor.slot}
              data-text={cursor.text}
              key={cursor.id}
            >
              <span className="hs-cursor__arrow">
                <CursorArrow />
              </span>
              <span className="hs-cursor__label">{cursor.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
