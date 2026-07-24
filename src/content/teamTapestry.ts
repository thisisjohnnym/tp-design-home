export type TeamTapestryPlacement = {
  left: number;
  top: number;
};

export type TeamCardDriftPoint = { x: number; y: number };

export type TeamCardDrift = {
  points: TeamCardDriftPoint[];
  durationSec: number;
};

const TEAM_CARD_DRIFT_PATTERNS: TeamCardDriftPoint[][] = [
  [
    { x: 0, y: 0 },
    { x: 10, y: -7 },
    { x: -5, y: 9 },
    { x: 12, y: 3 },
    { x: 0, y: 0 },
  ],
  [
    { x: 0, y: 0 },
    { x: -9, y: 11 },
    { x: 11, y: -5 },
    { x: -4, y: -10 },
    { x: 0, y: 0 },
  ],
  [
    { x: 0, y: 0 },
    { x: 13, y: 8 },
    { x: -8, y: -6 },
    { x: 6, y: 12 },
    { x: 0, y: 0 },
  ],
  [
    { x: 0, y: 0 },
    { x: -12, y: -8 },
    { x: 9, y: 10 },
    { x: -6, y: 5 },
    { x: 0, y: 0 },
  ],
];

export function teamCardDrift(index: number): TeamCardDrift {
  const pattern = TEAM_CARD_DRIFT_PATTERNS[index % TEAM_CARD_DRIFT_PATTERNS.length];
  const scale = 0.9 + (index % 3) * 0.08;

  return {
    points: pattern.map((point) => ({
      x: Number((point.x * scale).toFixed(1)),
      y: Number((point.y * scale).toFixed(1)),
    })),
    durationSec: 8.2 + (index % 4) * 1.15,
  };
}

export function teamCardDriftTimes(pointCount: number) {
  if (pointCount <= 1) return [0];
  return Array.from({ length: pointCount }, (_, index) => index / (pointCount - 1));
}

export function teamCardDriftDelaySec(index: number) {
  return 0.35 + index * 0.42;
}

/** Percent positions from Figma frame 607:201 (1688 × 1131). */
export const teamTapestryLayout: Record<string, TeamTapestryPlacement> = {
  "Sean Kelly": { left: 11.55, top: 60.39 },
  "Wendy Chan": { left: 33.89, top: 7.34 },
  "Cong Kim": { left: 56.81, top: 10.26 },
  "Jonathan Martinez": { left: 35.43, top: 66.76 },
  "Mitra Raveendran": { left: 74.82, top: 16 },
  "Juliana Botero": { left: 13.57, top: 17.6 },
  "Gulsheen Bhatia": { left: 59.54, top: 63.84 },
  "Kat Guzman": { left: 81.22, top: 56.68 },
};
