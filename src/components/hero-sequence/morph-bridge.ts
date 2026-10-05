/**
 * Shared state between the gallery's traveler card (MorphCard.tsx) and the
 * team carousel (TeamCarousel.tsx). Both run their own frame loops, so they
 * meet through this module instead of props. Single instance only.
 */
export const morphBridge = {
  /** The traveler is engaged. False (reduced motion, no gallery slot) leaves the carousel untouched. */
  active: false,
  /** Member the traveler shows. Written by the carousel while flying and once the cards have taken over. */
  index: 0,
  /** Flight progress, 0 → 1, written by the traveler. The carousel scrolls one name in with it. */
  progress: 1,
  /** The flight is complete: the traveler sits on the card slot and the carousel may be dragged. */
  landed: true,
  /**
   * The carousel's own cards have replaced the traveler. Until then the
   * traveler IS the centre card and follows `out`; the carousel takes over
   * only once a drag has carried that card out of sight, so the swap is never seen.
   */
  handoff: true,
  /** Where the carousel wants the traveler's card while it stands in: slide (px), turn (deg), opacity. */
  out: { x: 0, turn: 0, o: 1 },
};
