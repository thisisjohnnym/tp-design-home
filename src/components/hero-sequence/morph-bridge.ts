/**
 * Shared state between the gallery's traveler card (MorphCard.tsx, DOM) and the
 * team ring (team-ring/RingScene.tsx, WebGL). Both run their own frame loops,
 * so they meet through this module instead of props. Single instance only.
 */
export const morphBridge = {
  /** The traveler is engaged. False (reduced motion, no gallery slot) leaves the ring untouched. */
  active: false,
  /** Ring slot that receives the traveler: the card nearest the front when it left. */
  index: 0,
  /** Traveler still in flight: the ring holds that slot at the front and hides its card. */
  hold: false,
  /** The ring has its traveler card exactly at the front (written by the ring each frame). */
  aligned: true,
  /** The traveler has landed (flight complete); the ring may be in its settle stretch. */
  landed: false,
  /**
   * How far past the landing the page has scrolled, 0 → 1. Over this stretch
   * the ring is still pinned to the landed card and lets go gradually.
   */
  past: 1,
  /** 0 → ring card hidden, traveler shown · 1 → ring card shown, traveler gone. Never in between. */
  arrive: 1,
  /**
   * Where the ring's front card sits right now, in CSS px from the canvas's
   * top-left. Written by the ring each frame; the traveler lands on it.
   */
  slot: { valid: false, cx: 0, cy: 0, w: 0, h: 0 },
};
