export const resourcesIntro = {
  eyebrow: "Brand & collaboration",
  title: "Resources",
  description:
    "Reference our feedback guides to collaborate with clarity.",
} as const;

export type FeedbackGuide = {
  id: string;
  title: string;
  description: string;
  href: string;
};

export const feedbackGuides: FeedbackGuide[] = [
  {
    id: "give-feedback",
    title: "How to give feedback",
    description:
      "Principles and prompts for sharing constructive, actionable feedback with the team.",
    href: "https://example.com/give-feedback",
  },
  {
    id: "receive-feedback",
    title: "How to receive feedback",
    description:
      "Guidance for listening openly, asking clarifying questions, and turning input into better work.",
    href: "https://example.com/receive-feedback",
  },
];
