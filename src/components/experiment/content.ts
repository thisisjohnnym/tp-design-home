import { heroV5Cursors } from "@/content/heroV5";

export const experimentLoaderWords = ["craft", "build", "think"] as const;

export const experimentResources = [
  "Professional accountability",
  "Feedback management",
  "Writing as a thinking tool",
  "Tapestry brands",
] as const;

export const experimentContact = {
  email: "design@tapestry.com",
  phoneLabel: "+1 - 800 - TAPESTRY",
  phoneHref: "tel:+180082737879",
} as const;

export const experimentHeadline = [
  "EXPERIENCES THAT",
  "SHAPE RETAIL",
] as const;

export const experimentHeadlineDrumWords = [
  "STRATEGIZE",
  "CRAFT",
  "BUILD",
  "DESIGN",
] as const;

export const experimentCursorRoster = heroV5Cursors.map(
  ({ id, name, text }) => ({ id, name, text }),
);

export const experimentCursorSlots = [
  "upper-left",
  "upper-right",
  "center",
  "middle-left",
  "middle-right",
  "lower-left",
  "lower-center",
  "lower-right",
] as const;

export const experimentMotion = {
  firstFaceDuration: 0.52,
  firstFaceHold: 0.3,
  rollDuration: 0.25,
  faceHold: 0.28,
  finalLogoHold: 0.34,
  revealDuration: 0.68,
  logoMoveDuration: 0.78,
  headlineWordHold: 4,
  headlineRollDuration: 0.8,
  headlineCharacterDuration: 0.45,
  headlineCharacterStagger: 0.090,
  headlineCharacterBlur: 8,
  cursorFadeDuration: 0.42,
  cursorFadeStagger: 0.04,
  cursorMoveDuration: 1.1,
  cursorMovePause: 0.34,
  cursorSettlePause: 0.8,
  cursorMoveRadius: 14,
} as const;
