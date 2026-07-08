"use client";

import { useEffect, useState } from "react";
import { HERO_V5_VERB_HOLD_MS, HERO_V5_VERB_WORDS } from "./heroV5VerbWords";

/**
 * Cycles the headline verb after the intro sequence settles.
 * Respects prefers-reduced-motion — stays on "Craft".
 */
export function useHeroV5VerbRoll(active: boolean): number {
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    if (!active) {
      setWordIndex(0);
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    let index = 0;
    const interval = window.setInterval(() => {
      index = (index + 1) % HERO_V5_VERB_WORDS.length;
      setWordIndex(index);
    }, HERO_V5_VERB_HOLD_MS);

    return () => window.clearInterval(interval);
  }, [active]);

  return wordIndex;
}
