export type HeroTranslationPhase = "intro" | "hold" | "shapeExit" | "bgTransition";

export type HeroTranslationStep = {
  word: string;
  background: string;
  shapeSrc: string;
  shapeRotation: number;
};

/** Figma 775:248 — resting word order: Design → Diseño → thiết kế → デザイン */
export const HERO_TRANSLATION_STEPS: HeroTranslationStep[] = [
  {
    word: "Design",
    background: "#1b594e",
    shapeSrc: "/hero/translation/moon.svg",
    shapeRotation: 0,
  },
  {
    word: "Diseño",
    background: "#17183b",
    shapeSrc: "/hero/translation/flower.svg",
    shapeRotation: -45,
  },
  {
    word: "thiết kế",
    background: "#fe5d62",
    shapeSrc: "/hero/translation/rectangle.svg",
    shapeRotation: 0,
  },
  {
    word: "デザイン",
    background: "#5c91ad",
    shapeSrc: "/hero/translation/misc.svg",
    shapeRotation: 45,
  },
];

export function getNextStepIndex(stepIndex: number) {
  return (stepIndex + 1) % HERO_TRANSLATION_STEPS.length;
}

export function getBackgroundForPhase(stepIndex: number) {
  return HERO_TRANSLATION_STEPS[stepIndex]!.background;
}

export function getLettersDurationMs(word: string) {
  return word.length * heroTranslationMotion.letterDelayMs + heroTranslationMotion.lettersEndBufferMs;
}

export function getIntroDurationMs(word: string) {
  const lettersDuration = getLettersDurationMs(word);
  const shapeDuration =
    heroTranslationMotion.shapeEnterDelayMs + heroTranslationMotion.shapeEnterDurationMs;
  return Math.max(lettersDuration, shapeDuration);
}

export function getPhaseDurationMs(phase: HeroTranslationPhase, word: string) {
  switch (phase) {
    case "intro":
      return getIntroDurationMs(word);
    case "hold":
      return heroTranslationMotion.holdMs;
    case "shapeExit":
      return heroTranslationMotion.shapeExitDurationMs;
    case "bgTransition":
      return heroTranslationMotion.bgTransitionDurationMs;
    default:
      return heroTranslationMotion.holdMs;
  }
}

export const heroTranslationMotion = {
  letterDelayMs: 50,
  lettersEndBufferMs: 80,
  shapeEnterDelayMs: 160,
  shapeEnterDurationMs: 520,
  holdMs: 750,
  shapeExitDurationMs: 380,
  bgTransitionDurationMs: 650,
  shapeSpinDegrees: -90,
  shapeEnterScale: 0,
  shapeExitScale: 0,
  easing: [0.22, 1, 0.36, 1] as const,
  letterEasing: [0.33, 1, 0.68, 1] as const,
} as const;
