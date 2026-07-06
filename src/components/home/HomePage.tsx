"use client";

import { AlternativeHero } from "@/components/alternative/AlternativeHero";
import { AlternativeHeroV2 } from "@/components/alternative/AlternativeHeroV2";
import { AlternativeHomeSections } from "@/components/alternative/AlternativeHomeSections";
import { HeroSectionV5 } from "@/components/hero/HeroSectionV5";
import { HERO_VARIANT } from "@/content/alternativeHero";

function HomeHero() {
  if (HERO_VARIANT === "v5") return <HeroSectionV5 />;
  if (HERO_VARIANT === "v2") return <AlternativeHeroV2 />;
  return <AlternativeHero />;
}

export function HomePage() {
  return (
    <div className="bg-[var(--background)] text-[var(--foreground)]">
      <HomeHero />
      <AlternativeHomeSections />
    </div>
  );
}
