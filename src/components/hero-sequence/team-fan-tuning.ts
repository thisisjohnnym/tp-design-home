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
  { x: -0.427, y: 0.376, rotation: -23.9, z: -120 },
  { x: -0.333, y: 0.257, rotation: -15, z: -70 },
  { x: -0.254, y: 0.195, rotation: -5.3, z: -24 },
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

/** Where the first card sits before it joins the fan. */
export const teamFanPeek: FanPose = { x: 0, y: 0.42, rotation: 0, z: 0 };

export const teamFanTiming = {
  /** Share of the runway used to rise the first card in from below the headline. */
  intro: 0.14,
  /**
   * Portion of each step where a card stays parked on its station.
   * The rest of the step is the handoff to the next station.
   */
  hold: 0.62,
  introEase: "power2.inOut",
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
 * centre. Scale maps the 875px vector art onto the storyboard disc.
 */
export const teamLeadOrb = {
  x: -0.541,
  yRest: 0.53,
  yFan: -0.337,
  scale: 1863 / 875,
} as const;

/**
 * Softer sphere in the lower right, overlapping the open fan.
 * Starts cropped below the frame and rises into place just after the lead
 * sphere, before the cards begin to flip.
 */
export const teamAccentOrb = {
  x: 0.54,
  yRest: 0.92,
  yFan: 0.24,
  scale: 1023 / 875,
  /** Share of the pin used to arrive. A little past `teamFanTiming.intro`. */
  travel: 0.18,
} as const;
