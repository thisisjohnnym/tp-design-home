"use client";

import { useEffect, useState } from "react";
import {
  HERO_V5_WORDS,
  heroV5Copy,
  heroV5Cursors,
  heroV5CssVars,
  heroV5Motion,
  type HeroV5Phase,
} from "@/content/heroV5";
import { HeroTeamCursor } from "./HeroTeamCursor";
import { HeroViewport } from "./HeroViewport";
import { HeroWordSlot } from "./HeroWordSlot";
import { PillNav } from "./PillNav";

function useHeroV5Phase() {
  const [phase, setPhase] = useState<HeroV5Phase>("bloom");

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPhase("settled");
      return;
    }

    const timers = heroV5Motion.phases.map(({ at, phase: nextPhase }) =>
      window.setTimeout(() => setPhase(nextPhase), at),
    );

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  return phase;
}

function useHeroV5WordIndex(settled: boolean) {
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    if (!settled) {
      setWordIndex(0);
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let index = 0;
    let intervalId = 0;

    const advance = () => {
      index = (index + 1) % HERO_V5_WORDS.length;
      setWordIndex(index);
    };

    const timeoutId = window.setTimeout(() => {
      advance();
      intervalId = window.setInterval(advance, heroV5Motion.wordRotateIntervalMs);
    }, heroV5Motion.wordRotateInitialDelayMs);

    return () => {
      window.clearTimeout(timeoutId);
      window.clearInterval(intervalId);
    };
  }, [settled]);

  return wordIndex;
}

function HeroCanvas() {
  return <div className="hero-v5__canvas" aria-hidden />;
}

export function HeroSectionV5() {
  const phase = useHeroV5Phase();
  const settled = phase === "settled";
  const wordIndex = useHeroV5WordIndex(settled);
  const cursorsActive = phase === "cursors" || phase === "settled";

  return (
    <HeroViewport style={heroV5CssVars}>
      <PillNav phase={phase} />
      <section data-hero-section className="hero-v5" data-phase={phase} aria-label="Introduction">
        <HeroCanvas />
        <div className="hero-v5__frame">
          <div className="hero-v5__copy">
            <h1 className="hero-v5__headline">
              <span className="hero-v5__headline-line">
                <span className="hero-v5__headline-phrase">
                  <HeroWordSlot words={HERO_V5_WORDS} wordIndex={wordIndex} />
                  <span className="hero-v5__headline-suffix">{heroV5Copy.suffix}</span>
                </span>
              </span>
              <span className="hero-v5__headline-line">{heroV5Copy.line2}</span>
            </h1>
            <p className="hero-v5__subhead">{heroV5Copy.subhead}</p>
          </div>

          <div className="hero-v5__cursors">
            {heroV5Cursors.map((cursor) => (
              <HeroTeamCursor key={cursor.id} cursor={cursor} active={cursorsActive} />
            ))}
          </div>
        </div>
      </section>
    </HeroViewport>
  );
}
