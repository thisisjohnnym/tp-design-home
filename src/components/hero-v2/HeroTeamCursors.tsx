"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { heroCursorsV2 } from "@/content/heroCursorsV2";
import { TeamMemberCursor } from "../hero/TeamMemberCursor";

export function HeroTeamCursors() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [interactive, setInteractive] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const coarseQuery = window.matchMedia("(pointer: coarse)");
    const updateInteractive = () => {
      setInteractive(!reduceMotion && !coarseQuery.matches);
    };

    updateInteractive();
    coarseQuery.addEventListener("change", updateInteractive);
    return () => coarseQuery.removeEventListener("change", updateInteractive);
  }, [reduceMotion]);

  return (
    <div ref={containerRef} className="hero-team-cursors pointer-events-none absolute inset-0 z-20">
      {heroCursorsV2.map((config, index) => (
        <TeamMemberCursor
          key={config.name}
          config={config}
          containerRef={containerRef}
          interactive={interactive}
          zIndex={activeIndex === index ? 30 : 20 + index}
          onActivate={() => setActiveIndex(index)}
        />
      ))}
    </div>
  );
}
