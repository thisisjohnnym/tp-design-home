/** Figma prototype intro — frames 233:5 → 233:12 → 233:14 → 241:79 → 233:21 */

export const HERO_V3_INTRO_COLORS = {
  yellow: "#ffcb00",
  black: "#000000",
  white: "#ffffff",
} as const;

export const HERO_V3_INTRO_ASSETS = {
  hi: "/hero-intro/hi.svg",
  weAre: "/hero-intro/we-are.svg",
} as const;

/** HI vector aspect (397.309 × 301.6) */
export const HERO_V3_HI_ASPECT = 397.309 / 301.6;

/** WE ARE logo aspect (448.569 × 91.528) */
export const HERO_V3_WE_ARE_ASPECT = 448.569 / 91.528;

export const HERO_V3_INTRO_EASE = [0.22, 1, 0.36, 1] as const;

export type HeroV3IntroPhase =
  | "hi"
  | "hi-we-are"
  | "team-lines"
  | "team-tapestry"
  | "exit"
  | "done";

export const heroV3IntroTransitions = {
  hiHold: { delay: 0.65, duration: 0 },
  hiToWeAre: { duration: 1.05, ease: HERO_V3_INTRO_EASE },
  weAreHold: { delay: 0.35, duration: 0 },
  weAreToTeam: { duration: 0.95, ease: HERO_V3_INTRO_EASE },
  teamLinesHold: { delay: 0.5, duration: 0 },
  teamToTapestry: { duration: 0.5, ease: HERO_V3_INTRO_EASE },
  tapestryHold: { delay: 1.1, duration: 0 },
  exit: { duration: 0.7, ease: HERO_V3_INTRO_EASE },
  tapestryToBanner: { duration: 0.7, ease: HERO_V3_INTRO_EASE },
} as const;

export const HERO_V3_HI_START_WIDTH_VW = 27.6;
export const HERO_V3_WE_ARE_LOGO_WIDTH_VW = 31.2;
export const HERO_V3_HI_SCALE_END = 4.6;
export const HERO_V3_WE_ARE_SCALE_FILL = 11.5;
