"use client";

import { useEffect, useState } from "react";

/** "design" rolled through four languages, ending back on English. */
export const HERO_V5_WORDS = [
  "Design",
  "Diseño",
  "Thiết kế",
  "設計",
  "Design",
] as const;

export type HeroV5Phase = "intro" | "roll" | "expand" | "cursors" | "settled";

const FINAL_WORD_INDEX = HERO_V5_WORDS.length - 1;

type Step = { at: number; phase?: HeroV5Phase; wordIndex?: number };

/** Autoplay timeline (ms offsets from mount). ~300ms per language hold. */
const TIMELINE: Step[] = [
  { at: 0, phase: "intro", wordIndex: 0 },
  { at: 300, phase: "roll", wordIndex: 1 },
  { at: 600, wordIndex: 2 },
  { at: 900, wordIndex: 3 },
  { at: 1200, wordIndex: 4 },
  { at: 1600, phase: "expand" },
  { at: 4200, phase: "cursors" },
  { at: 5500, phase: "settled" },
];

type TimelineState = { phase: HeroV5Phase; wordIndex: number };

/**
 * Drives the v5 hero reveal as a one-shot timed sequence. Respects
 * prefers-reduced-motion by jumping straight to the settled end-state.
 */
export function useHeroV5Timeline(canStart = true): TimelineState {
  const [state, setState] = useState<TimelineState>({
    phase: "intro",
    wordIndex: 0,
  });

  useEffect(() => {
    if (!canStart) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion) {
      setState({ phase: "settled", wordIndex: FINAL_WORD_INDEX });
      return;
    }

    let started = false;
    let timers: number[] = [];

    const start = () => {
      if (started) return;
      started = true;
      timers = TIMELINE.map((step) =>
        window.setTimeout(() => {
          setState((prev) => ({
            phase: step.phase ?? prev.phase,
            wordIndex: step.wordIndex ?? prev.wordIndex,
          }));
        }, step.at),
      );
    };

    start();

    return () => {
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, [canStart]);

  return state;
}
