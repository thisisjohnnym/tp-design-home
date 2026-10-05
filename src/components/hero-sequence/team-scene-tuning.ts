/**
 * Shared yellow curtain timing (right → left):
 * 1px fade → expand over hidden content → shrink to reveal.
 * One-shot, not scrubbed.
 */
export const curtainReveal = {
  ease: "power2.inOut",
  stagger: 0.12,
  /** ~1.2s per line: appear + expand + shrink. */
  appearDuration: 0.22,
  expandDuration: 0.42,
  shrinkDuration: 0.56,
} as const;
