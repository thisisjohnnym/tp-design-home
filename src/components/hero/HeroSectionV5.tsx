"use client";

import { useState } from "react";
import { PillNav } from "@/components/layout/PillNav";
import { HeroV2Viewport } from "./HeroV2Viewport";
import { HeroV5CursorLabel } from "./HeroV5CursorLabel";
import { HeroV5RollingWord } from "./HeroV5RollingWord";
import { HERO_V5_CURSORS } from "./heroV5Cursors";
import { useHeroV5Timeline } from "./useHeroV5Timeline";

/** Design-tool canvas grid — radial bloom behind the title. */
function HeroV5CanvasGrid() {
  return <div className="hero-v5__canvas" aria-hidden />;
}

/**
 * v5 hero — autoplayed "Design Team" reveal building toward Figma frame 900:849.
 */
export function HeroSectionV5() {
  const [slotReady, setSlotReady] = useState(false);
  const { phase, wordIndex } = useHeroV5Timeline(slotReady);
  const cursorsActive = phase === "expand" || phase === "cursors" || phase === "settled";

  return (
    <HeroV2Viewport>
      <PillNav phase={phase} />

      <section data-hero-section className="hero-v5" data-phase={phase}>
        <HeroV5CanvasGrid />

        <div className="hero-v5__frame">
          <div className="hero-v5__title">
            <span className="hero-v5__design">
              <HeroV5RollingWord wordIndex={wordIndex} onReady={() => setSlotReady(true)} />
            </span>
            <span className="hero-v5__team">Team</span>
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
