"use client";

import { PillNav } from "@/components/layout/PillNav";
import { HeroV2Viewport } from "./HeroV2Viewport";
import { HeroV5CursorLabel } from "./HeroV5CursorLabel";
import { HeroV5RollingWord } from "./HeroV5RollingWord";
import { HERO_V5_CURSORS } from "./heroV5Cursors";
import { useHeroV5Timeline } from "./useHeroV5Timeline";
import { useHeroV5VerbRoll } from "./useHeroV5VerbRoll";
import { heroV5BloomTimingStyle } from "./heroV5Timing";
import { HERO_V5_VERB_WORDS } from "./heroV5VerbWords";

const SUBHEADLINE =
  "Uniting brand, product, and customer insight across Coach & Kate Spade.";

/** Design-tool canvas grid — radial bloom behind the title. */
function HeroV5CanvasGrid() {
  return <div className="hero-v5__canvas" aria-hidden />;
}

/**
 * v5 hero — canvas bloom, then headline + cursors reveal together.
 * After the intro settles, the lead verb rolls through four variants.
 */
export function HeroSectionV5() {
  const phase = useHeroV5Timeline();
  const verbRollActive = phase === "settled";
  const verbIndex = useHeroV5VerbRoll(verbRollActive);
  const cursorsActive = phase === "cursors" || phase === "settled";

  return (
    <HeroV2Viewport style={heroV5BloomTimingStyle}>
      <PillNav phase={phase} />

      <section data-hero-section className="hero-v5" data-phase={phase}>
        <HeroV5CanvasGrid />

        <div className="hero-v5__frame">
          <div className="hero-v5__copy">
            <h1 className="hero-v5__headline">
              <span className="hero-v5__headline-line">
                <span className="hero-v5__headline-phrase">
                  <HeroV5RollingWord words={HERO_V5_VERB_WORDS} wordIndex={verbIndex} />
                  <span className="hero-v5__headline-suffix">Experiences</span>
                </span>
              </span>
              <span className="hero-v5__headline-line">That Shape Retail</span>
            </h1>
            <p className="hero-v5__subhead">{SUBHEADLINE}</p>
          </div>

          <div className="hero-v5__cursors">
            {HERO_V5_CURSORS.map((cursor) => (
              <HeroV5CursorLabel key={cursor.id} cursor={cursor} active={cursorsActive} />
            ))}
          </div>
        </div>
      </section>
    </HeroV2Viewport>
  );
}
