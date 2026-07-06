/** Figma hero intro — frame 346:5 */

export type HeroVariant = "current" | "v2" | "v5";

/** Flip to compare hero designs locally */
export const HERO_VARIANT: HeroVariant = "v5";

export const ALT_HERO_EASE = [0.22, 1, 0.36, 1] as const;

export const alternativeHeroMotion = {
  text: {
    duration: 1.1,
    ease: ALT_HERO_EASE,
    delay: 0.15,
  },
  /** Seconds to hold centered title before settling to the bottom */
  textHold: 1.5,
  textSettle: {
    duration: 1.35,
    ease: ALT_HERO_EASE,
  },
  nav: {
    duration: 0.75,
    ease: ALT_HERO_EASE,
    delay: 0.1,
  },
  logo: {
    duration: 0.6,
    ease: ALT_HERO_EASE,
  },
} as const;

/** Centered intro — Figma 346:373 (150px on 1401px artboard) */
export const ALT_HERO_TITLE_INTRO_SIZE = "clamp(2.75rem,10.7vw,9.375rem)";

/** Full-width hero lockup at bottom of viewport */
export const ALT_HERO_TITLE_HERO_SIZE = "clamp(3.75rem,17.5vw,14.5rem)";

/** Intro scale relative to final hero size (vw ratio) */
export const ALT_HERO_TITLE_INTRO_SCALE = 10.7 / 17.5;

export const ALT_HERO_TITLE_BOTTOM_PADDING = "clamp(3rem,5vw,4.5rem)";
