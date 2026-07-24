export type TeamClusterPlacement = {
  left: number;
  top: number;
};

export const teamClusterIntro = {
  title: "The team",
  meta: ["Product Design", "Worldwide"],
  paragraph:
    "We come from diverse backgrounds—with experience across startups, agencies, and in-house teams. Those different paths shape how we see problems, collaborate, and design. Together, we bring a wide range of perspectives to the table.",
} as const;

/** Percent positions from Figma 959:1258 gallery (805 × 864), cards 133px square. */
export const teamClusterLayout: Record<string, TeamClusterPlacement> = {
  "Juliana Botero": { left: 44.6, top: 6.71 },
  "Mitra Raveendran": { left: 76.52, top: 14.47 },
  "Sean Kelly": { left: 23.73, top: 26.39 },
  "Gulsheen Bhatia": { left: 66.09, top: 37.62 },
  "Kat Guzman": { left: 28.07, top: 53.59 },
  "Jonathan Martinez": { left: 80.37, top: 60.88 },
  "Cong Kim": { left: 51.68, top: 76.27 },
  "Wendy Chan": { left: 19.75, top: 80.79 },
};

export const teamClusterCardWidthPercent = 16.52;
