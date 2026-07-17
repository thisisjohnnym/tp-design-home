"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  heroTranslationMotion,
  type HeroTranslationPhase,
} from "@/content/heroTranslationV2";

type HeroTranslationTitleProps = {
  word: string;
  phase: HeroTranslationPhase;
};

export function HeroTranslationTitle({ word, phase }: HeroTranslationTitleProps) {
  const reduceMotion = useReducedMotion();
  const [visibleLetters, setVisibleLetters] = useState(0);

  const isIntro = phase === "intro";
  const isBgTransition = phase === "bgTransition";
  const showFullWord = phase === "hold" || phase === "shapeExit";

  useEffect(() => {
    if (reduceMotion || !isIntro) return;

    setVisibleLetters(0);
    let count = 0;
    const interval = window.setInterval(() => {
      count += 1;
      setVisibleLetters(count);
      if (count >= word.length) {
        window.clearInterval(interval);
      }
    }, heroTranslationMotion.letterDelayMs);

    return () => window.clearInterval(interval);
  }, [isIntro, word, reduceMotion]);

  if (reduceMotion) {
    return (
      <h1 className="hero-v2__title" aria-label={word}>
        {word}
      </h1>
    );
  }

  if (isBgTransition) {
    return (
      <h1 className="hero-v2__title hero-v2__title--hidden" aria-label={word}>
        <span className="sr-only">{word}</span>
      </h1>
    );
  }

  if (showFullWord) {
    return (
      <h1 className="hero-v2__title" aria-label={word}>
        <span className="hero-v2__title-word" aria-hidden>
          {word}
        </span>
        <span className="sr-only">{word}</span>
      </h1>
    );
  }

  return (
    <h1 className="hero-v2__title" aria-label={word}>
      <span className="hero-v2__title-word" aria-hidden>
        {word.split("").map((char, index) => (
          <motion.span
            key={`${word}-${index}`}
            className="hero-v2__title-letter"
            initial={{ opacity: 0 }}
            animate={{ opacity: index < visibleLetters ? 1 : 0 }}
            transition={{
              duration: 0.18,
              ease: heroTranslationMotion.letterEasing,
            }}
          >
            {char}
          </motion.span>
        ))}
      </span>
      <span className="sr-only">{word}</span>
    </h1>
  );
}
