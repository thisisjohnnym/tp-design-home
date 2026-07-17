/** tapestry.design hero v2 motion — Figma frame 346:5 */

export const HERO_V3_EASE = [0.22, 1, 0.36, 1] as const;

export const heroV3Motion = {
  nav: {
    duration: 0.75,
    ease: HERO_V3_EASE,
    delay: 0.35,
  },
  logo: {
    duration: 0.6,
    ease: HERO_V3_EASE,
  },
} as const;
