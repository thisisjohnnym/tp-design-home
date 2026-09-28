export type TeamLayout = "desktop" | "tablet" | "phone";

export type FanPose = {
  /** Offset of the card centre from the viewport centre, as a fraction of width. */
  x: number;
  /** Offset of the card centre from the viewport centre, as a fraction of height. */
  y: number;
  /** Flat fan angle, degrees. */
  rotation: number;
  /** Depth toward the camera. Positive is closer. */
  z: number;
};

/**
 * Stations along the travel path, in order.
 * Entry (off the lower left) → left fan → centre → right fan → exit (upper right).
 * Proportions are read off the desktop team fan (1512×982): card centres, then
 * converted to fractions of the viewport so the same arc scales down.
 */
const desktopPoses: readonly FanPose[] = [
  { x: -0.78, y: 0.62, rotation: -32, z: -180 },
  { x: -0.48, y: 0.4, rotation: -24, z: -120 },
  { x: -0.36, y: 0.3, rotation: -16, z: -70 },
  { x: -0.26, y: 0.2, rotation: -6, z: -24 },
  { x: 0, y: 0, rotation: 0, z: 80 },
  { x: 0.294, y: -0.068, rotation: 6.44, z: 8 },
  { x: 0.405, y: -0.156, rotation: 11.19, z: -64 },
  { x: 0.523, y: -0.249, rotation: 21.18, z: -120 },
  { x: 0.72, y: -0.4, rotation: 28, z: -180 },
];

/** Centre card, plus two on each side. */
const tabletPoses: readonly FanPose[] = [
  { x: -0.72, y: 0.5, rotation: -26, z: -150 },
  { x: -0.46, y: 0.28, rotation: -16, z: -90 },
  { x: -0.28, y: 0.14, rotation: -6, z: -28 },
  { x: 0, y: 0, rotation: 0, z: 72 },
  { x: 0.3, y: -0.06, rotation: 7, z: 4 },
  { x: 0.5, y: -0.18, rotation: 15, z: -80 },
  { x: 0.78, y: -0.36, rotation: 24, z: -150 },
];

/** Centre card, plus one on each side. */
const phonePoses: readonly FanPose[] = [
  { x: -0.92, y: 0.46, rotation: -18, z: -100 },
  { x: -0.42, y: 0.16, rotation: -12, z: -36 },
  { x: 0, y: 0, rotation: 0, z: 64 },
  { x: 0.42, y: -0.1, rotation: 12, z: -36 },
  { x: 0.96, y: -0.34, rotation: 20, z: -100 },
];

export const teamFanLayouts = {
  desktop: { poses: desktopPoses, center: 4 },
  tablet: { poses: tabletPoses, center: 3 },
  phone: { poses: phonePoses, center: 2 },
} as const;

/**
 * Where card 0 (Sean) sits at the ready fan, relative to centre.
 * -1 = left of centre, face-down, waiting to flip when cycling starts.
 */
export const teamFanReadyOffset = {
  desktop: -1,
  tablet: -1,
  phone: -1,
} as const;

export const teamFanTiming = {
  /**
   * How far into the entrance pan before cards start assembling (0–1).
   * Assemble runs while the section scrolls into view — not the cycle.
   */
  cardAt: 0.12,
  /**
   * Share of pin progress before cycling begins.
   * ~half a screen on the shortened runway.
   */
  cycleAt: 0.06,
  /**
   * How strongly each station eases in/out (1 = linear-ish in-out, higher = softer arrival).
   * Single continuous curve — no mid-step pause before the centre.
   */
  stationEase: 1.55,
  introEase: "power2.inOut",
} as const;

/**
 * One scrubbed camera pan: the whole scene rises into place together,
 * then keeps rising out as you scroll past.
 */
export const teamEntrance = {
  /**
   * When the pin's top hits this viewport line, the pan begins.
   * Later = less overlap with the departing hero headline.
   */
  start: "top 68%",
  /** Title offset below centre at pan start, as a fraction of height. */
  titleFrom: 0.28,
  /**
   * Pin progress where the exit pan begins.
   * Fan cycling finishes just before this; the rest is the camera continuing up.
   */
  exitAt: 0.86,
  /**
   * Exit rise as a fraction of viewport height (layers move up).
   * Title leads the spheres slightly so parallax continues on the way out —
   * not a separate fast exit.
   */
  titleLeave: 0.72,
  leadLeave: 0.48,
  accentLeave: 0.58,
  cardLeave: 0.7,
} as const;

/**
 * Soft lag on the spheres so they keep a little momentum after scroll.
 * Seconds for quickTo to catch the scrubbed target.
 */
export const teamOrbMomentum = {
  lead: 0.38,
  accent: 0.48,
  /** Extra rise after lock, as a fraction of height, scrubbed with the fan. */
  fanDrift: 0.045,
} as const;

/**
 * Resting lean while cards are still lined up.
 * Stronger the closer a card is to centre, then flat on the centre card.
 */
export const teamQueueTilt = {
  /** Peak lean, degrees. Raise this to tip the queue more. */
  degrees: 8,
  /** Stations from centre where the lean has faded to nothing. */
  fadeOutAt: 7.5,
  /** Stations from centre where the lean is already at full strength. */
  fullBy: 1.5,
  /** Inside this distance the centre card stays straight. */
  flatWithin: 0.12,
  /** By this distance the lean has finished settling onto the centre card. */
  settledBy: 0.67,
  /** Pitch as a share of the side-to-side lean. 1 means they match. */
  pitch: 0.7,
} as const;

/** Storyboard width the sphere boxes were drawn on. */
export const teamFanStoryWidth = 1512;

/**
 * Big sphere: low and cropped on the left before the fan, then risen into the
 * upper left once the cards are open. Centres are fractions from the viewport
 * centre. Scale maps the full export (801×798) onto the reference disc (603×603).
 */
export const teamLeadOrb = {
  x: -0.4375,
  yRest: 0.53,
  yFan: -0.2765,
  scale: 603 / 801,
} as const;

/**
 * Softer sphere in the lower right, overlapping the open fan.
 * Rises on the same camera-pan clock as the lead sphere. Scale maps the
 * full export (1104×989) onto the reference disc (925×974).
 */
export const teamAccentOrb = {
  x: 0.5195,
  yRest: 0.92,
  yFan: 0.1843,
  scale: 925 / 1104,
} as const;
