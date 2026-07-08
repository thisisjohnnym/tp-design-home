"use client";

import { AlternativeHomeSections } from "@/components/alternative/AlternativeHomeSections";
import { HeroSectionV5 } from "@/components/hero/HeroSectionV5";

export function HomePage() {
  return (
    <div className="bg-[var(--background)] text-[var(--foreground)]">
      <HeroSectionV5 />
      <AlternativeHomeSections />
    </div>
  );
}
