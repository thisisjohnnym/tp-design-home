export const heroSequenceLoaderWords = ["craft", "build", "think"] as const;

export const heroSequenceResources = [
  "Professional accountability",
  "Feedback management",
  "Writing as a thinking tool",
  "Tapestry brands",
] as const;

export const heroSequenceContact = {
  email: "design@tapestry.com",
  phoneLabel: "+1 - 800 - TAPESTRY",
  phoneHref: "tel:+180082737879",
} as const;

/**
 * Frame 1 headline. Words are individual nodes so the shatter beat can move
 * them at different rates. Lines are fixed — the block scales to fit the
 * viewport instead of reflowing words onto new rows.
 * The first slot is a drum that cycles `heroSequenceHeadlineDrumWords`.
 */
export const heroSequenceHeadlineLines = [
  ["Building", "what's"],
  ["next", "for", "coach"],
  ["&", "kate", "spade"],
] as const;

export const heroSequenceHeadline = heroSequenceHeadlineLines.flat();

/** Triangular drum faces for the first headline word (120° roll steps). */
export const heroSequenceHeadlineDrumWords = [
  "Designing",
  "Crafting",
  "Building",
] as const;

export const heroSequenceMidCopy = {
  lines: ["We're Tapestry's", "In-House strategy", "and experience team."],
  subhead:
    "Bringing together brand, product, customer insight, and design to turn ambitious ideas into world-class retail experiences",
} as const;

export const heroSequenceCollab = {
  /** Accessible label for the morphing collab title. */
  label: "How we collab & share on Kate Spade",
  /**
   * Stair-step indent for line 2, as a fraction of the title font-size.
   * Tuned so “share” sits under “collab” like the band reference.
   */
  lineIndentEm: 2.35,
} as const;

export type HeroSequenceBrand = {
  id: string;
  label: string;
};

export const heroSequenceBrands: HeroSequenceBrand[] = [
  { id: "kate-spade", label: "Kate Spade" },
  { id: "coach", label: "Coach" },
];

export const heroSequenceCursors = [
  {
    id: "mitra",
    name: "Mitra Raveendran",
    slot: "a",
    text: "white",
  },
  {
    id: "wendy",
    name: "Wendy Chan",
    slot: "b",
    text: "white",
  },
  {
    id: "kat",
    name: "Kat Guzman",
    slot: "c",
    text: "white",
  },
  {
    id: "sean",
    name: "Sean Kelly",
    slot: "d",
    text: "black",
  },
] as const;

/** Full team roster — slots cycle through everyone so the hero isn’t a fixed four. */
export const heroSequenceCursorRoster = [
  { id: "kat", name: "Kat Guzman", text: "white" },
  { id: "johnny", name: "Johnny Martinez", text: "white" },
  { id: "mitra", name: "Mitra Raveendran", text: "white" },
  { id: "wendy", name: "Wendy Chan", text: "white" },
  { id: "sean", name: "Sean Kelly", text: "black" },
  { id: "cong", name: "Cong Kim", text: "black" },
  { id: "gulsheen", name: "Gulsheen Bhatia", text: "white" },
  { id: "juliana", name: "Juliana Botero", text: "white" },
] as const;

export const heroSequenceCursorSlots = ["a", "b", "c", "d"] as const;

export const heroSequenceCards = [
  { title: "Grid System", href: "#" },
  { title: "Logo Assets", href: "#" },
  { title: "Fonts", href: "#" },
  { title: "Imagery", href: "#" },
  { title: "Spacing System", href: "#" },
  { title: "Buttons", href: "#" },
] as const;

export type SphereFrame = { x: number; y: number; scale: number };

export type SpherePose =
  | "land"
  | "zoom"
  | "lockArc"
  | "lock"
  | "overlap"
  | "takeover";

/**
 * Sphere keyframes read off the Paper storyboard. `x` is a fraction of the
 * viewport width and `y` a fraction of the viewport height, both measured from
 * the viewport centre to the sphere centre. `scale` is relative to the sphere's
 * natural 875px width in the source artwork.
 *
 * Path: land (frame 1, below) → zoom (frame 3, large/close) → lockArc (bowed
 * mid) → lock (frame 4). “Collapse” means zoomed-in → resting scale, not
 * lateral squeeze.
 */
export const sphereNaturalWidth = 875;

/**
 * Sphere width at scale 1, as a fraction of the viewport width. The storyboard
 * is 1512px wide, so 875 / 1512 keeps desktop identical to the artboard; phones
 * need a much larger fraction for the spheres to read at all.
 */
export const sphereUnitFraction = {
  desktop: 875 / 1512,
  mobile: 1.1,
} as const;

export const sphereFrames: Record<
  "left" | "right",
  Record<SpherePose, SphereFrame>
> = {
  left: {
    // Fully below the fold — never visible at land.
    land: { x: -0.015, y: 1.55, scale: 2.911 },
    // Frame 3 — still zoomed in; crowns fill the lower half.
    // Nudged slightly left so rise isn’t a pure vertical then a hard X cut.
    zoom: { x: -0.11, y: 0.689, scale: 2.911 },
    // Bowed mid between zoom and lock — rise ahead of the left settle.
    lockArc: { x: -0.14, y: 0.34, scale: 2.2 },
    // Frame 4 — scale down into the resting lock composition.
    lock: { x: -0.29, y: 0.145, scale: 1.665 },
    // Frame 5 — slide together (same scale as lock).
    overlap: { x: -0.182, y: 0.156, scale: 1.665 },
    // Frame 6 — expand past the left edge while scaling so the frame stays filled
    // (Paper places the takeover disc left of centre; drifting right left a void).
    takeover: { x: -0.2, y: 0.1, scale: 6.4 },
  },
  right: {
    land: { x: 0.922, y: 1.35, scale: 2.335 },
    zoom: { x: 1.05, y: -0.093, scale: 2.335 },
    // Arc in from the right — y dips slightly so the path isn’t a flat slide.
    lockArc: { x: 0.58, y: -0.15, scale: 1.78 },
    lock: { x: 0.246, y: -0.079, scale: 1.336 },
    overlap: { x: 0.146, y: -0.046, scale: 1.336 },
    takeover: { x: 0.146, y: -0.046, scale: 1.336 },
  },
};

/**
 * Beats are expressed on a 0-100 scrub scale so the labels stay readable while
 * the scroll length changes per breakpoint.
 */
export const heroSequenceBeats = {
  shatterStart: 0,
  /** Longer span — premium soft lift, not a snap exit. */
  shatterEnd: 26,
  /** Gentle cascade; last word starts at stagger × 7 ≈ 4.3. */
  shatterStagger: 0.62,
  cursorsOutEnd: 18,
  /**
   * Spheres rise with the last departing word so the handoff stays continuous.
   */
  spheresRiseStart: 4.5,
  spheresZoomEnd: 28,
  spheresLockEnd: 40,
  midCopyInStart: 24,
  midCopyBlurEnd: 34,
  midCopyInEnd: 40,
  logosInStart: 34,
  logosInEnd: 40,
  /** Soft dwell — logos register, then motion continues without a hard stare. */
  logosOutStart: 45,
  logosOutEnd: 51,
  // Overlap picks up as logos exit — no long idle strip.
  spheresOverlapStart: 45,
  spheresOverlapEnd: 53,
  midCopyOutStart: 47,
  midCopyOutEnd: 57,
  spheresTakeoverStart: 53,
  spheresTakeoverEnd: 73,
  // Collab title rides the scale-up instead of waiting for it to finish.
  collabCenterInStart: 55,
  collabCenterInEnd: 69,
  // Band clip begins before takeover ends so the cut isn’t a hard handoff.
  bandClipStart: 69,
  bandClipEnd: 100,
  collabMorphStart: 69,
  collabMorphEnd: 87,
  total: 100,
} as const;

export const heroSequenceMotion = {
  /**
   * Direct scrub — playhead tracks scroll 1:1. ScrollSmoother (when enabled)
   * eases the scroll input itself so frames feel continuous without scrub lag.
   */
  scrub: true as const,
  /** Desktop ScrollSmoother lag in seconds. Touch / reduced-motion stay native. */
  smooth: 1.15,
  /** How far the shattered words travel, as a fraction of viewport height. */
  wordTravel: 1.45,
  /**
   * Mid copy rises from below the fold, then continues upward on exit —
   * sells the “scrolling past” read while the spheres morph.
   */
  midCopyTravel: 0.82,
  /** Extra lag under the mid layer so logos trail the title slightly. */
  logosTravel: 0.14,
  /** Soft scroll lock once logos are fully in — a beat, not a stare. */
  logosHoldSeconds: 0.7,
  wordBlur: 16,
  cursorBlur: 22,
  /** Seconds each cursor group stays before swapping to the next teammates. */
  cursorRosterHold: 4.2,
  /** Whole-cursor fade when a roster group swaps. */
  cursorRosterFade: 0.42,
  cursorRosterStagger: 0.06,
  /** Idle headline drum — hold each verb before rolling to the next. */
  headlineWordHold: 2.8,
  headlineRollDuration: 0.78,
  headlineCharacterDuration: 0.42,
  headlineCharacterStagger: 0.05,
  headlineCharacterBlur: 8,
  /** Soft width ease while the drum pushes “what's” aside. */
  headlineWidthDuration: 0.78,
  midCopyBlur: 22,
  collabBlur: 26,
  brandRollDuration: 0.62,
  brandCharacterDuration: 0.36,
  brandCharacterStagger: 0.045,
  brandCharacterBlur: 10,
  /** Multipliers applied when the visitor prefers reduced motion. */
  reduced: {
    blur: 0.35,
    travel: 0.62,
    /** How much of the sphere scale/position delta to keep. */
    sphereDelta: 0.55,
  },
} as const;

export const heroSequenceIntro = {
  firstFaceDuration: 0.52,
  firstFaceHold: 0.3,
  rollDuration: 0.25,
  faceHold: 0.28,
  finalLogoHold: 0.34,
  revealDuration: 0.68,
  logoMoveDuration: 0.78,
} as const;
