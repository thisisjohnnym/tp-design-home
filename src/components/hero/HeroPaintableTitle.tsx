"use client";

import { useHeroPaint } from "./HeroPaintContext";

const TITLE = "Design Team";

export function HeroPaintableTitle() {
  const { registerLetter, getLetterColor } = useHeroPaint();

  return (
    <h1 className="hero-section__title" aria-label={TITLE}>
      {TITLE.split("").map((char, index) => {
        if (char === " ") {
          return (
            <span key={index} className="hero-section__title-space" aria-hidden>
              {" "}
            </span>
          );
        }

        const color = getLetterColor(index);

        return (
          <span
            key={index}
            ref={(element) => registerLetter(index, element)}
            data-hero-letter={index}
            className="hero-section__title-letter"
            style={color ? { color } : undefined}
            aria-hidden
          >
            {char}
          </span>
        );
      })}
      <span className="sr-only">{TITLE}</span>
    </h1>
  );
}
