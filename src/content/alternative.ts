export const alternativeAssets = {
  tapestryLogo: "/alternative/tapestry-logo.svg",
  tprLogo: "/brand/tpr-logo.png",
  heroBackground: "/alternative/hero-background.jpg",
  themeControls: "/alternative/theme-controls.png",
  essenceIcons: {
    crafters: "/alternative/icon-crafters.svg",
    intentional: "/alternative/icon-intentional.svg",
    human: "/alternative/icon-human.svg",
  },
} as const;

export const alternativeNav = [
  { href: "/team", label: "Team" },
  { href: "/capabilities", label: "Capabilities" },
  { href: "/what-we-manage", label: "What we manage" },
  { href: "/how-we-work", label: "How we work" },
  { href: "#resources", label: "Resources" },
  { href: "/contact", label: "Contact" },
] as const;

export const pillNavItems = [
  { href: "#resources", label: "Resources" },
  { href: "/contact", label: "Contact" },
] as const;

export const alternativeIntro =
  "We create, maintain, and evolve user experiences across\nTapestry brands' digital touchpoints.";

export const alternativeEssence = [
  {
    key: "crafters",
    title: "We're crafters",
    description:
      "We believe great craft is how trust is earned. We refine, question, and polish — not for perfection, but because the work deserves it, and so do the people who use it.",
    icon: alternativeAssets.essenceIcons.crafters,
    iconFirst: true,
  },
  {
    key: "intentional",
    title: "We're intentional",
    description:
      "We move with purpose, not just speed. Curiosity drives us and taste guides us. We sweat the details. Every pattern, decision, and pixel has a reason; we take thoughtful risks and reimagine what's possible.",
    icon: alternativeAssets.essenceIcons.intentional,
    iconFirst: false,
  },
  {
    key: "human",
    title: "We're human",
    description:
      "We look for ways to support each other. We take ownership and choose trust over ego. We create space to have fun and find joy in creating together.",
    icon: alternativeAssets.essenceIcons.human,
    iconFirst: true,
  },
] as const;

export const alternativeCapabilities = [
  "User Experience",
  "Products",
  "Strategy",
  "User Research",
  "Prototypes",
  "Systems",
] as const;

export const alternativeStats = [
  {
    value: "2468",
    label: "Prototypes created in the last 3 years",
    bg: "#0062a0",
    text: "#ffffff",
  },
  {
    value: "75",
    label: "Projects completed",
    bg: "#1c3240",
    text: "#ffffff",
  },
  {
    value: "135",
    label: "A/B tests designed in the last year",
    bg: "#fbbe18",
    text: "#000000",
  },
] as const;

export const alternativeProcess = [
  {
    step: "01",
    title: "Frame",
    description:
      "Clarify the user need, business context, constraints, and success criteria.",
    offset: 0,
  },
  {
    step: "02",
    title: "Explore",
    description: "Generate concepts, flows, prototypes, or pattern options",
    offset: 1,
  },
  {
    step: "03",
    title: "Align",
    description: "Review with stakeholders, engineering, product, and design peers.",
    offset: 2,
  },
  {
    step: "04",
    title: "Test",
    description:
      "Validate concepts with users, stakeholders, and real-world constraints before committing.",
    offset: 0,
  },
  {
    step: "05",
    title: "Iterate",
    description:
      "Refine based on feedback, edge cases, accessibility, and implementation realities.",
    offset: 1,
  },
  {
    step: "06",
    title: "Deliver",
    description:
      "Ship polished artifacts, document decisions, and hand off with clarity to partners.",
    offset: 2,
  },
] as const;
