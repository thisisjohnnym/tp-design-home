export type EssenceKey = "crafters" | "intentional" | "human";

export type EssenceItem = {
  key: EssenceKey;
  number: string;
  title: string;
  description: string;
  color: string;
};

export const ESSENCE_SECTION_BG = "#f2f2f2";

export const essenceItems: EssenceItem[] = [
  {
    key: "crafters",
    number: "01.",
    title: "We're crafters",
    description:
      "We believe great craft is how trust is earned. We refine, question, and polish — not for perfection, but because the work deserves it, and so do the people who use it.",
    color: "#369c8a",
  },
  {
    key: "human",
    number: "02.",
    title: "We're human",
    description:
      "We look for ways to support each other. We take ownership and choose trust over ego. We create space to have fun and find joy in creating together.",
    color: "#46a2ff",
  },
  {
    key: "intentional",
    number: "03.",
    title: "We're intentional",
    description:
      "We move with purpose, not just speed. Curiosity drives us and taste guides us. We sweat the details. Every pattern, decision, and pixel has a reason; we take thoughtful risks and reimagine what's possible.",
    color: "#ff777c",
  },
];
