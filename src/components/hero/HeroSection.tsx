"use client";

import { HeroPaintProvider } from "./HeroPaintContext";
import { HeroPaintableTitle } from "./HeroPaintableTitle";
import { HeroTeamCursors } from "./HeroTeamCursors";

export function HeroSection() {
  return (
    <HeroPaintProvider>
      <section
        className="hero-section relative overflow-hidden bg-background"
        style={{ minHeight: "calc(100dvh - var(--site-header-height, 4.75rem))" }}
        aria-label="Introduction"
      >
        <HeroPaintableTitle />
        <HeroTeamCursors />
      </section>
    </HeroPaintProvider>
  );
}
