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

/**
 * Centre card, plus one peeking in from each side (Paper 8MK-0, 440×956).
 * The side cards sit almost level with the centre, tipped ~5° outward, so
 * the phone reads as a flat deck rather than the desktop's rising arc.
 */
const phonePoses: readonly FanPose[] = [
  { x: -1.35, y: 0.04, rotation: -10, z: -80 },
  /* x is divided by the z -20 perspective shrink (1400 / 1420) so the
     projected centres land on Paper's −289 / +294 px. */
  { x: -0.666, y: 0.0105, rotation: -5.28, z: -20 },
  { x: 0, y: 0, rotation: 0, z: 64 },
  { x: 0.678, y: 0.0106, rotation: 4.88, z: -20 },
  { x: 1.35, y: 0.04, rotation: 10, z: -80 },
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
   * Short — just enough to read as a beat, not a dead stop right after the
   * brisk entrance locks in.
   */
  cycleAt: 0.02,
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
   * Keep the original span so the spheres glide at the same pace as the
   * headline scrub — the shorter .hs-team margin-top (not this value) is
   * what keeps the fan from reading over still-visible collage tiles.
   */
  start: "top 92%",
  /**
   * Title offset below centre at pan start, as a fraction of height.
   * 0 = the title rides with the page 1:1, like the collage above it.
   * Anything else makes it outrun the scroll during the entrance.
   */
  titleFrom: 0,
  /**
   * Pin progress where the exit begins. Fan cycling finishes just before
   * this; the rest is the orbit → zoom → fade handoff (see teamExit).
   * 550svh of cycling out of the 750svh runway keeps the fan's pace as before.
   */
  exitAt: 550 / 750,
} as const;

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

/** Team heading — same curtain, fired early in the entrance pan. */
export const teamTitleReveal = {
  ...curtainReveal,
  /** Entrance progress (0–1) when the one-shot curtain begins —
   *  about when the title's first line enters the bottom of the view. */
  playAt: 0.5,
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
  /**
   * Eases the accent sphere's arrival against the same 0–1 pan the lead
   * sphere uses linearly. A power-in curve holds it back through most of
   * the scroll, then lets it catch up to its resting spot — the mismatched
   * pace against the lead sphere is what reads as parallax depth; same
   * speed reads flat.
   */
  accentPanEase: "power1.in",
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

/**
 * Exit handoff from the Paper "meet the team card" frames 1–3:
 * the spheres orbit the headline (lead recedes behind it, accent swings in
 * front of the card), then the camera zooms into the accent sphere until it
 * fills the screen, and a short scroll more fades the scene out to reveal
 * the section below. Positions are fractions from the viewport centre; scales
 * map the full exports (801 / 1104 wide) onto the storyboard discs.
 */
export const teamExit = {
  /**
   * Share of the exit (0–1) spent orbiting and zooming. The exit is 200svh:
   * 110 orbiting and zooming, 50 fading, then 40 of clear scroll so the
   * zoomed sphere is gone before the services rise into view.
   */
  fadeAt: 110 / 200,
  /** Share of the exit (0–1) where the fade finishes. */
  fadeEnd: 160 / 200,
  /** Where frame 2 lands inside the orbit + zoom stretch (0–1). */
  orbitAt: 0.45,
  ease: "sine.inOut",
  fadeEase: "power1.in",
  lead: {
    x: [teamLeadOrb.x, -0.2616, -0.065],
    scale: [teamLeadOrb.scale, 497 / 801, 497 / 801],
    /** Slight rise mid-orbit so the path arcs instead of sliding flat. */
    lift: 0.025,
  },
  accent: {
    x: [teamAccentOrb.x, 0.274, 0.1465],
    scale: [teamAccentOrb.scale, 1519 / 1104, 4263 / 1104],
    /** Extra blur at full zoom, in art px (before the scale is applied). */
    blur: 7,
  },
} as const;

export type TeamOrbPath = {
  /** Centre x through rest → frame 2 → full zoom, as a fraction of width. */
  x: readonly number[];
  /** Scale through the same frames, in storyboard px per export px. */
  scale: readonly number[];
  yRest: number;
  yFan: number;
};

/**
 * Sphere placement per layout. Desktop and tablet share the 1512 storyboard;
 * the phone has its own frame (Paper 8MK-0, 440 wide) where the spheres are
 * far larger relative to the screen: a 320px lead disc tucked top-left and a
 * 504px accent low on the right. Exit frames keep the desktop's proportions.
 */
const desktopOrbs = {
  storyWidth: teamFanStoryWidth,
  lead: {
    x: teamExit.lead.x,
    scale: teamExit.lead.scale,
    yRest: teamLeadOrb.yRest,
    yFan: teamLeadOrb.yFan,
  },
  accent: {
    x: teamExit.accent.x,
    scale: teamExit.accent.scale,
    yRest: teamAccentOrb.yRest,
    yFan: teamAccentOrb.yFan,
  },
} as const;

/*
 * Paper's phone fills are tight crops, so match the visible discs rather than
 * the boxes: lead disc ≈ 304px (export disc 535.5 @1×), accent disc ≈ 294px
 * (export disc 661 @1×). yFan is measured at the frame's ~41% cycle, so it adds
 * back the fanDrift the loop subtracts by then.
 */
const phoneLeadScale = 304 / 535.5;
const phoneAccentScale = 294 / 661;

const phoneOrbs = {
  storyWidth: 440,
  lead: {
    x: [-0.529, -0.3, -0.07],
    scale: [phoneLeadScale, phoneLeadScale * 0.824, phoneLeadScale * 0.824],
    yRest: teamLeadOrb.yRest,
    yFan: -0.2505,
  },
  accent: {
    x: [0.679, 0.357, 0.191],
    scale: [phoneAccentScale, phoneAccentScale * 1.642, phoneAccentScale * 4.609],
    yRest: teamAccentOrb.yRest,
    yFan: 0.252,
  },
} as const;

export const teamOrbLayouts: Record<
  TeamLayout,
  { storyWidth: number; lead: TeamOrbPath; accent: TeamOrbPath }
> = {
  desktop: desktopOrbs,
  tablet: desktopOrbs,
  phone: phoneOrbs,
};
