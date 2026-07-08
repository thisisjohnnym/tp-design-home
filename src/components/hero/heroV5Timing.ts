import type { CSSProperties } from "react";

/** Shared hero v5 animation timing — keep JS timeline and CSS in sync. */

export const HERO_V5_BLOOM_DELAY_MS = 80;
export const HERO_V5_BLOOM_DURATION_MS = 1100;
export const HERO_V5_BLOOM_GAP_MS = 200;

/** Bloom reads as complete around ~55% through the eased expand. */
export const HERO_V5_BLOOM_VISUAL_RATIO = 0.55;

export const HERO_V5_BLOOM_END_MS =
  HERO_V5_BLOOM_DELAY_MS + HERO_V5_BLOOM_DURATION_MS;

export const HERO_V5_TEXT_START_MS =
  HERO_V5_BLOOM_DELAY_MS +
  HERO_V5_BLOOM_DURATION_MS * HERO_V5_BLOOM_VISUAL_RATIO +
  HERO_V5_BLOOM_GAP_MS;

/** Text and cursors begin together after the bloom gap */
export const HERO_V5_CURSORS_START_MS = HERO_V5_TEXT_START_MS;

export const heroV5BloomTimingStyle = {
  "--hero-v5-bloom-duration": `${HERO_V5_BLOOM_DURATION_MS}ms`,
  "--hero-v5-bloom-delay": `${HERO_V5_BLOOM_DELAY_MS}ms`,
  "--hero-v5-text-start": `${HERO_V5_TEXT_START_MS}ms`,
} as CSSProperties;
