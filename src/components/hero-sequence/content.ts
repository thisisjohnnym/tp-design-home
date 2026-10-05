export const heroSequenceLoaderWords = ["craft", "build", "think"] as const;

export const heroSequenceContact = {
  email: "design@tapestry.com",
  phoneLabel: "+1 - 800 - TAPESTRY",
  phoneHref: "tel:+180082737879",
} as const;

/** Top-right nav links (Paper 81I-0). Hash targets are section ids. */
export const heroSequenceNavLinks = [
  { label: "Resources", href: "#resources" },
  { label: "Team", href: "#team" },
  { label: "Works", href: "#works" },
  { label: "Contact", href: `mailto:${heroSequenceContact.email}` },
] as const;

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

export const heroSequenceCursors = [
  {
    id: "mitra",
    name: "Mitra Raveendran",
    slot: "a",
    tone: "green",
    text: "white",
  },
  {
    id: "wendy",
    name: "Wendy Chan",
    slot: "b",
    tone: "orange",
    text: "black",
  },
  {
    id: "johnny",
    name: "Jonathan Martinez",
    slot: "c",
    tone: "red",
    text: "white",
  },
  {
    id: "sean",
    name: "Sean Kelly",
    slot: "d",
    tone: "blue",
    text: "white",
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
    name: "Johnny Martinez",
    given: "Johnny",
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

/** Hero cursor tones (Paper 81I-0). Each group of four draws them without
 *  replacement, so no two cursors on screen share a color. Orange takes
 *  black ink; the rest take white. */
export const heroSequenceCursorTones = [
  { id: "green", text: "white" },
  { id: "orange", text: "black" },
  { id: "red", text: "white" },
  { id: "blue", text: "white" },
] as const;

/** Shared card chrome. Member lines live on each roster entry. */
export const heroSequenceTeamCard = {
  pattern: "/team/card-pattern-inverted.webp",
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
  /** Scroll cue is gone well before the work gallery rises under it. */
  scrollCueOutEnd: 8,
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
  wordBlur: 48,
  cursorBlur: 56,
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
 * Hero scroll parallax. The hero scrolls away with the page; these are extra
 * upward drifts on top of that, as a fraction of the viewport height by the
 * time the hero has left. Keep the fan above every line so it climbs faster.
 */
export const heroSequenceParallax = {
  /** Per headline line, top to bottom. */
  lineDrift: [0.15, 0.1, 0.05],
  fanDrift: 0.3,
  /** Extra pitch (degrees) the fan gains by the time the hero has left, so it
   *  tips upward as you scroll. Positive tips the top away, negative toward you. */
  tiltDegrees: 30,
  /** Seconds the fan trails the scroll by. Longer = more inertia: it keeps
   *  drifting after the page stops, then settles. The headline stays tight. */
  fanScrub: 1.6,
  /** Eases in and out, so the fan starts and finishes at the page's own speed
   *  and only picks up extra speed in between: no jump at either end. */
  fanEase: "sine.inOut",
} as const;

/**
 * Hero fan (Paper I8-0). 9 slides are defined here and each is duplicated
 * directly opposite itself on the ring, so they render as 18. The middle entry is the `lead`: the
 * flat-colour slide the loader camera starts zoomed into, so keep it the loader
 * yellow and image-free. Other slides take a flat `bg` or an `image` (cover,
 * placed at `pos`). Nothing else reads this list.
 */
export const heroSequenceFan = {
  /** Camera pull-back from the lead slide to the resting hero. */
  zoomDuration: 1.8,
  /**
   * Shape of the pull-back's speed curve: speed(t) ∝ t^start · (1-t)^tail.
   * `start` softens the take-off from rest; `tail` sets the landing. 1 is a
   * straight-line ramp to a stop (what sine.inOut does, and reads as a linear
   * end); 2 is a quadratic settle; 3+ finishes early and the fan seems to
   * arrive then sit. Between 2 and 3 is the sweet spot.
   */
  easeStart: 1.3,
  easeTail: 2.2,
  /** Seconds per full turn of the resting fan. */
  spinSeconds: 36,
  slides: [
    { id: "trench", image: "/fan/slide-3.jpg", pos: "50% 30%" },
    { id: "product", image: "/fan/slide-2.jpg", pos: "50% 40%" },
    { id: "navy", bg: "#0b1f6b" },
    { id: "portrait", image: "/fan/slide-4.jpg", pos: "38% 30%" },
    { id: "lead", bg: "#ffcd00", lead: true },
    { id: "coffee", image: "/fan/slide-5.jpg", pos: "45% 50%" },
    { id: "mark", image: "/fan/slide-6.jpg", pos: "35% 50%" },
    { id: "fog", bg: "#f0f0f0" },
    { id: "cart", image: "/fan/slide-1.jpg", pos: "20% 20%" },
  ],
} as const;

/**
 * Record browser before the team section (Paper 9DZ-0 / 9L3-0 / 9UQ-0 / 9RA-0).
 * Each work is one slab on the wheel. `art` is composed onto a 16:9 card:
 * `contain` sits a screen capture on `bg`, `cover` fills the card with a photo.
 * Titles and tags are placeholders until real case studies are named.
 */
export const heroSequenceWorks = [
  {
    id: "gradient-mesh",
    title: "Gradient Systems",
    tags: ["Visual Design"],
    year: "2026",
    art: "/gallery/placeholders/01-gradient-mesh.svg",
    fit: "cover",
    bg: "#12102b",
  },
  {
    id: "wireframe",
    title: "Wireframe Kit",
    tags: ["UX/UI"],
    year: "2026",
    art: "/gallery/placeholders/02-wireframe.svg",
    fit: "cover",
    bg: "#f4f4f1",
  },
  {
    id: "color-palette",
    title: "Color Palette",
    tags: ["Design System"],
    year: "2026",
    art: "/gallery/placeholders/03-color-palette.svg",
    fit: "cover",
    bg: "#fbf7ef",
  },
  {
    id: "type-specimen",
    title: "Type Specimen",
    tags: ["Typography"],
    year: "2026",
    art: "/gallery/placeholders/04-type-specimen.svg",
    fit: "cover",
    bg: "#1c1c1b",
  },
  {
    id: "icon-grid",
    title: "Icon Library",
    tags: ["Design System"],
    year: "2026",
    art: "/gallery/placeholders/05-icon-grid.svg",
    fit: "cover",
    bg: "#3a5bff",
  },
  {
    id: "ui-cards",
    title: "Card Components",
    tags: ["UX/UI"],
    year: "2025",
    art: "/gallery/placeholders/06-ui-cards.svg",
    fit: "cover",
    bg: "#e9e6ff",
  },
  {
    id: "layout-grid",
    title: "Layout Grid",
    tags: ["UX/UI", "Research"],
    year: "2025",
    art: "/gallery/placeholders/07-layout-grid.svg",
    fit: "cover",
    bg: "#ffffff",
  },
  {
    id: "vector-curves",
    title: "Vector Curves",
    tags: ["Branding"],
    year: "2025",
    art: "/gallery/placeholders/08-vector-curves.svg",
    fit: "cover",
    bg: "#0f172a",
  },
  {
    id: "device-mockup",
    title: "Mobile Mockup",
    tags: ["UX/UI"],
    year: "2025",
    art: "/gallery/placeholders/09-device-mockup.svg",
    fit: "cover",
    bg: "#ffd9c7",
  },
  {
    id: "motion-trails",
    title: "Motion Trails",
    tags: ["Motion"],
    year: "2025",
    art: "/gallery/placeholders/10-motion-trails.svg",
    fit: "cover",
    bg: "#7c3aed",
  },
] as const;

export type HeroSequenceWork = (typeof heroSequenceWorks)[number];

/**
 * Parallax collage before the team section (Paper 1PW-0 desktop, 6WC-0 phone).
 * `speed` drives scroll depth: under 1 lags (far), over 1 leads (near) — and the
 * same number is how far the tile flies out when the camera zooms to the
 * traveler card. `phoneSpeed` overrides it on the phone stack.
 * Sources are 2× exports of the tile frames; `mobileSrc` swaps in the phone
 * frame's crop. Tiles the phone layout drops are hidden in CSS.
 */
export const heroSequenceWorkGallery = [
  {
    id: "pdp",
    src: "/gallery/v2/pdp.webp",
    alt: "Kate Spade product detail page for a black shoulder bag",
    speed: 0.55,
    phoneSpeed: 0.85,
  },
  {
    id: "carousel",
    src: "/gallery/v2/carousel.webp",
    alt: "Yellow product feature carousel cards",
    speed: 0.8,
    phoneSpeed: 0.9,
  },
  {
    id: "cart-green",
    src: "/gallery/v2/cart-green.webp",
    alt: "Kate Spade mobile cart on a green field",
    speed: 1,
    phoneSpeed: 1,
  },
  {
    id: "cart",
    src: "/gallery/v2/cart-blue.webp",
    alt: "Kate Spade mobile cart with a rose smoke crossbody",
    speed: 1.15,
    phoneSpeed: 1.1,
  },
  {
    id: "logo-top",
    src: "/gallery/v2/logo-c.webp",
    alt: "Gold Coach C hardware on sage leather",
    speed: 1.45,
    phoneSpeed: 1.3,
  },
  {
    id: "logo-mid",
    src: "/gallery/v2/logo-c.webp",
    alt: "Gold Coach C hardware on sage leather",
    speed: 1.3,
  },
  {
    id: "testimonial",
    src: "/gallery/v2/testimonial-light.webp",
    alt: "Customer testimonials mobile screen",
    speed: 1.6,
    phoneSpeed: 1.35,
  },
  {
    id: "testimonial-tall",
    src: "/gallery/v2/testimonial-tall.webp",
    alt: "Customer testimonials mobile screen on a light field",
    speed: 1.9,
    phoneSpeed: 1.5,
  },
] as const;
