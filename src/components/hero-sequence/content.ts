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
 * The first slot cycles `heroSequenceHeadlineDrumWords` via yellow curtain.
 */
export const heroSequenceHeadlineLines = [
  ["Building", "what's"],
  ["next", "for", "coach"],
  ["&", "kate", "spade"],
] as const;

export const heroSequenceHeadline = heroSequenceHeadlineLines.flat();

/**
 * Phone headline (Paper 8IP-0) re-breaks into four rows:
 * Building / what's next / for coach & / kate spade.
 * Each entry is the word a phone row ends on.
 */
export const heroSequenceHeadlinePhoneBreaks: readonly string[] = [
  "Building",
  "next",
  "&",
];

/** Verbs cycled on the first headline word (curtain cover → swap → uncover). */
export const heroSequenceHeadlineDrumWords = [
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
    tone: "blue",
    text: "white",
  },
  {
    id: "wendy",
    name: "Wendy Chan",
    slot: "b",
    tone: "red",
    text: "white",
  },
  {
    id: "johnny",
    name: "Jonathan Martinez",
    slot: "c",
    tone: "purple",
    text: "white",
  },
  {
    id: "sean",
    name: "Sean Kelly",
    slot: "d",
    tone: "yellow",
    text: "black",
  },
] as const;

/**
 * Full team roster — slots cycle through everyone so the hero isn’t a fixed four.
 * Names, roles, cities, and emails match the public team page.
 * `portrait` is a stand-in stock photo until each person has their own.
 * A single role keeps “ui/ux team” on the right. A manager title splits into two lines.
 */
const teamBio =
  "Approaching every project with deep user-centered insight and overt passion for the craft, Sean has been the fresh creative force behind market-defining experiences for Coach and Kate Spade.";

const teamLabel = "ui/ux team";

export const heroSequenceCursorRoster = [
  {
    id: "sean",
    name: "Sean Kelly",
    given: "Sean",
    family: "Kelly",
    text: "black",
    role: "ux director",
    roleAside: teamLabel,
    place: "chicago, il",
    email: "sean.kelly@tapestry.com",
    linkedin: "https://www.linkedin.com/in/seankellydesign",
    bio: teamBio,
    portrait:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=800&h=1060&q=80&crop=faces",
  },
  {
    id: "wendy",
    name: "Wendy Chan",
    given: "Wendy",
    family: "Chan",
    text: "white",
    role: "sr. manager",
    roleAside: "digital designer",
    place: "new york, ny",
    email: "wendy.chan@tapestry.com",
    linkedin: "https://www.linkedin.com/in/wendybydesign",
    bio: teamBio,
    portrait:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&h=1060&q=80&crop=faces",
  },
  {
    id: "cong",
    name: "Cong Kim",
    given: "Cong",
    family: "Kim",
    text: "black",
    role: "sr. product designer",
    roleAside: teamLabel,
    place: "new york, ny",
    email: "cong.kim@tapestry.com",
    linkedin: "https://www.linkedin.com/in/congkim94",
    bio: teamBio,
    portrait:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&h=1060&q=80&crop=faces",
  },
  {
    id: "johnny",
    name: "Jonathan Martinez",
    given: "Jonathan",
    family: "Martinez",
    text: "white",
    role: "sr. product designer",
    roleAside: teamLabel,
    place: "argentina, ba",
    email: "jonathan.martinez@tapestry.com",
    linkedin: "https://www.linkedin.com/in/thisisjohnnym",
    bio: teamBio,
    portrait:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&h=1060&q=80&crop=faces",
  },
  {
    id: "mitra",
    name: "Mitra Raveendran",
    given: "Mitra",
    family: "Raveendran",
    text: "white",
    role: "ux designer",
    roleAside: teamLabel,
    place: "new york, ny",
    email: "mitra.raveendran@tapestry.com",
    linkedin: "https://www.linkedin.com/in/mitraraveendran",
    bio: teamBio,
    portrait:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&h=1060&q=80&crop=faces",
  },
  {
    id: "juliana",
    name: "Juliana Botero",
    given: "Juliana",
    family: "Botero",
    text: "white",
    role: "product designer",
    roleAside: teamLabel,
    place: "sarasota, fl",
    email: "juliana.botero@tapestry.com",
    linkedin: "https://www.linkedin.com/in/juliana-botero-a2605ba",
    bio: teamBio,
    portrait:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&h=1060&q=80&crop=faces",
  },
  {
    id: "gulsheen",
    name: "Gulsheen Bhatia",
    given: "Gulsheen",
    family: "Bhatia",
    text: "white",
    role: "ux designer",
    roleAside: teamLabel,
    place: "new york, ny",
    email: "gulsheen.bhatia@tapestry.com",
    linkedin: "https://www.linkedin.com/in/gulsheen-kaur-bhatia-9682a0227",
    bio: teamBio,
    portrait:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=800&h=1060&q=80&crop=faces",
  },
] as const;

export const heroSequenceCursorSlots = ["a", "b", "c", "d"] as const;

/** MTA line colors for hero cursors. Each visible group draws distinct tones,
 *  so no two cursors on screen share a color. Yellow takes black ink, as on
 *  the N Q R bullet; the rest take white. */
export const heroSequenceCursorTones = [
  { id: "red", text: "white" }, // 1 2 3
  { id: "orange", text: "white" }, // B D F M
  { id: "yellow", text: "black" }, // N Q R W
  { id: "green", text: "white" }, // 4 5 6
  { id: "blue", text: "white" }, // A C E
  { id: "purple", text: "white" }, // 7
] as const;

/** Shared card chrome. Member lines live on each roster entry. */
export const heroSequenceTeamCard = {
  pattern: "/team/card-pattern.webp",
} as const;

/** Lead paragraph beside the capabilities list (Paper 7NG-0). */
export const heroSequenceCapabilitiesIntro =
  "Bringing together brand, product, customer insight, and design to turn ambitious ideas into world-class retail experiences";

/** Capabilities accordion. `number` is the small index above each title,
 *  set in a subway-line bullet (`lineColor` fill, `lineInk` numeral);
 *  `titleLines` sets the display break (Paper 7NG-0).
 *  `image` is a stand-in still until final service photography is ready. */
export const heroSequenceCapabilities = [
  {
    id: "experience",
    number: "01",
    lineColor: "#fd6615",
    lineInk: "#ffffff",
    title: "Experience Design",
    titleLines: ["Experience", "Design"],
    image:
      "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?auto=format&fit=crop&w=960&h=540&q=80",
    services: [
      "UX Design",
      "UI Design",
      "Interaction Design",
      "Accessibility",
      "Information Architecture",
      "Prototyping",
    ],
  },
  {
    id: "visual",
    number: "02",
    lineColor: "#b635a9",
    lineInk: "#ffffff",
    title: "Visual & Brand",
    titleLines: ["Visual &", "Brand"],
    image:
      "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=960&h=540&q=80",
    services: [
      "Visual Design",
      "Art Direction",
      "Motion",
      "Illustration",
      "Photography Direction",
      "Content Design",
    ],
  },
  {
    id: "commerce",
    number: "03",
    lineColor: "#03933e",
    lineInk: "#ffffff",
    title: "Commerce & Innovation",
    titleLines: ["Commerce", "& Innovation"],
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=960&h=540&q=80",
    services: [
      "AI Experiences",
      "Personalization",
      "Product Discovery",
      "Product Pages",
      "Checkout",
      "Omnichannel",
    ],
  },
  {
    id: "research",
    number: "04",
    lineColor: "#fcdb23",
    lineInk: "#000000",
    title: "Research & Systems",
    titleLines: ["Research", "& Systems"],
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=960&h=540&q=80",
    services: [
      "UX Research",
      "Analytics",
      "A/B Testing",
      "Design Systems",
      "Components",
      "Design Tokens",
    ],
  },
] as const;

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
  | "takeover"
  | "takeoverParallax";

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
    // After scale settles — slow Y drift through band clip (bg parallax).
    takeoverParallax: { x: -0.2, y: -0.14, scale: 6.4 },
  },
  right: {
    land: { x: 0.922, y: 1.35, scale: 2.335 },
    zoom: { x: 1.05, y: -0.093, scale: 2.335 },
    // Arc in from the right — y dips slightly so the path isn’t a flat slide.
    lockArc: { x: 0.58, y: -0.15, scale: 1.78 },
    lock: { x: 0.246, y: -0.079, scale: 1.336 },
    overlap: { x: 0.146, y: -0.046, scale: 1.336 },
    takeover: { x: 0.146, y: -0.046, scale: 1.336 },
    takeoverParallax: { x: 0.146, y: -0.046, scale: 1.336 },
  },
};

/**
 * Beats are expressed on a 0-100 scrub scale so the labels stay readable while
 * the scroll length changes per breakpoint.
 */
export const heroSequenceBeats = {
  shatterStart: 0,
  /** Stretch across most of the scrub so the break matches page pace. */
  shatterEnd: 88,
  /** Gentle cascade across the longer exit. */
  shatterStagger: 1.4,
  cursorsOutEnd: 62,
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
  /** Custom pointer — yellow trail ease (seconds). Arrow stays nearly live. */
  pointerLag: 0.55,
  pointerArrowLag: 0.08,
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

/**
 * Parallax collage before the team section (Paper 8BV-0 desktop, 6WC-0 phone).
 * `speed` drives scroll depth: under 1 lags (far), over 1 leads (near).
 * Pixel sizes are 1× frame exports used for intrinsic aspect hints.
 * `mobileSrc` swaps in the phone frame's crop; tiles without one that the
 * phone layout drops are hidden in CSS.
 */
export const heroSequenceWorkGallery = [
  {
    id: "pdp",
    src: "/gallery/pdp.webp",
    alt: "Kate Spade product detail page for a black shoulder bag",
    speed: 0.55,
    pixelWidth: 883,
    pixelHeight: 764,
  },
  {
    id: "carousel",
    src: "/gallery/carousel.webp",
    alt: "Yellow product feature carousel cards",
    speed: 0.81,
    phoneSpeed: 0.72,
    pixelWidth: 367,
    pixelHeight: 437,
  },
  {
    id: "cart",
    src: "/gallery/cart.webp",
    mobileSrc: "/gallery/cart-mobile.webp",
    alt: "Kate Spade mobile cart with a rose smoke crossbody",
    speed: 1,
    phoneSpeed: 0.82,
    pixelWidth: 736,
    pixelHeight: 647,
  },
  {
    id: "logo",
    src: "/gallery/logo-c.webp",
    mobileSrc: "/gallery/logo-c-mobile.webp",
    alt: "Gold Coach C hardware on sage leather",
    speed: 1.29,
    phoneSpeed: 1.28,
    pixelWidth: 269,
    pixelHeight: 357,
  },
  {
    id: "testimonial",
    src: "/gallery/testimonial.webp",
    alt: "Customer testimonials mobile screen",
    speed: 1.51,
    pixelWidth: 261,
    pixelHeight: 344,
  },
  {
    id: "lifestyle",
    src: "/gallery/lifestyle.webp",
    mobileSrc: "/gallery/lifestyle-mobile.webp",
    alt: "Model wearing a pink kate spade crossbody",
    speed: 1.72,
    phoneSpeed: 1.6,
    pixelWidth: 139,
    pixelHeight: 437,
  },
] as const;
