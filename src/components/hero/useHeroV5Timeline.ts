"use client";

import { useEffect, useState } from "react";
import { HERO_V5_TEXT_START_MS } from "./heroV5Timing";

export type HeroV5Phase = "bloom" | "cursors" | "settled";

type Step = { at: number; phase: HeroV5Phase };

/** Autoplay timeline (ms offsets from mount). */
const TIMELINE: Step[] = [
  { at: 0, phase: "bloom" },
  { at: HERO_V5_TEXT_START_MS, phase: "cursors" },
  { at: HERO_V5_TEXT_START_MS + 1200, phase: "settled" },
];

/**
 * Drives the v5 hero reveal as a one-shot timed sequence. Respects
 * prefers-reduced-motion by jumping straight to the settled end-state.
 */
export function useHeroV5Timeline(): HeroV5Phase {
  const [phase, setPhase] = useState<HeroV5Phase>("bloom");

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion) {
      setPhase("settled");
      return;
    }

    const timers = TIMELINE.map((step) =>
      window.setTimeout(() => setPhase(step.phase), step.at),
    );

    return () => {
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  return phase;
}
