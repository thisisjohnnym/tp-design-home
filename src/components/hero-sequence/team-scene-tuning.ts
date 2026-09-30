export type TeamLayout = "desktop" | "tablet" | "phone";

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

/** Team heading — same curtain, fired as the section comes into view. */
export const teamTitleReveal = {
  ...curtainReveal,
  /** Viewport line the section top crosses to play the one-shot curtain. */
  start: "top 55%",
} as const;

export type TeamRingMaterial = "fabric" | "plastic" | "paper";

/**
 * WebGL card ring (team-ring/TeamRing.tsx). Values were dialed in on the
 * Forge canvas (sturdy-dune). Nothing is tied to scroll except the camera's
 * settle-in tilt: the ring idles, and the visitor can drag or fling it.
 */
export const teamRing = {
  material: "fabric" as TeamRingMaterial,
  /** Camera elevation, degrees — higher opens a bigger gap for the headline. */
  tilt: 24,
  /** Ease the tilt from `introFrom` to `tilt` as the section scrolls in. */
  scrollIntro: true,
  introFrom: 40,
  /** Camera roll, degrees. */
  roll: 0,
  /** Card width multiplier (world units × 1.9). */
  cardSize: 1.4,
  /** Gap between cards around the ring, as a multiple of card width. */
  spacing: 2.3,
  /** Share of the view width the ring spans on landscape screens. */
  fitWidth: 0.99,
  /** Idle spin, radians per second. */
  autoSpeed: 0.06,
  direction: "left" as "left" | "right",
  dragSensitivity: 0.5,
  /** Depth-of-field blur on far cards. */
  blur: 1.05,
  /** How far far cards fade toward the page colour. */
  depthFade: 0.8,
  /** How much cards bend and ripple with speed. */
  flex: 1.7,
  /** Camera drift toward the pointer; 0 turns it off. */
  parallax: 1,
  /** Page canvas colour (--hs-canvas) that far cards fade into. */
  fog: "#080806",
};

/** Storyboard width the sphere boxes were drawn on. */
const desktopStoryWidth = 1512;

export type TeamOrbRest = {
  /** Centre offset from the viewport centre, as a fraction of width. */
  x: number;
  /** Centre offset from the viewport centre, as a fraction of height. */
  y: number;
  /** Storyboard px per export px. */
  scale: number;
};

/*
 * Resting sphere art, lifted from the old fan's settled frame.
 * Desktop scale maps the exports (801 / 1104 wide) onto the reference discs
 * (603 / 925). Phone (Paper 8MK-0, 440 wide) matches the visible discs
 * rather than the boxes: 304 over the 535.5 export disc, 294 over 661.
 */
export const teamOrbLayouts: Record<
  TeamLayout,
  { storyWidth: number; lead: TeamOrbRest; accent: TeamOrbRest }
> = {
  desktop: {
    storyWidth: desktopStoryWidth,
    lead: { x: -0.4375, y: -0.2765, scale: 603 / 801 },
    accent: { x: 0.5195, y: 0.1843, scale: 925 / 1104 },
  },
  tablet: {
    storyWidth: desktopStoryWidth,
    lead: { x: -0.4375, y: -0.2765, scale: 603 / 801 },
    accent: { x: 0.5195, y: 0.1843, scale: 925 / 1104 },
  },
  phone: {
    storyWidth: 440,
    lead: { x: -0.529, y: -0.2505, scale: 304 / 535.5 },
    accent: { x: 0.679, y: 0.252, scale: 294 / 661 },
  },
};

/**
 * Sphere boxes render at this share of the full 1× art size, and the scale
 * divides by it, so on-screen size is unchanged. WebKit rasterizes a layer at
 * its box size × device pixels, ignoring a downscaling transform, so a
 * full-size box on a 3× phone held ~150MB of sphere bitmaps.
 */
export const teamOrbArtScale: Record<TeamLayout, number> = {
  desktop: 0.85,
  tablet: 0.85,
  phone: 0.5,
};
