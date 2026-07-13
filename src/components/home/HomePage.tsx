"use client";

import { HomeSections } from "@/components/home/HomeSections";
import { HeroSectionV5 } from "@/components/hero/HeroSectionV5";

export function HomePage() {
  return (
    <div className="bg-[var(--background)] text-[var(--foreground)]">
      <HeroSectionV5 />
      <HomeSections />
    </div>
  );
}
