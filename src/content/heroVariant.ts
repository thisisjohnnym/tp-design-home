export type HeroVariant = "current" | "v2";

export function resolveHeroVariant(searchParams?: { hero?: string }): HeroVariant {
  return searchParams?.hero === "v2" ? "v2" : "current";
}
