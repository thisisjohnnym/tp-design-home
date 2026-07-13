export type StatItem = {
  value: string;
  label: string;
  background: string;
  foreground: "light" | "dark";
};

export const statsItems: StatItem[] = [
  {
    value: "2468",
    label: "Prototypes created in the last 3 years",
    background: "#0062a0",
    foreground: "light",
  },
  {
    value: "75",
    label: "Projects completed",
    background: "#1c3240",
    foreground: "light",
  },
  {
    value: "135",
    label: "A/B tests designed in the last year",
    background: "#fbbe18",
    foreground: "dark",
  },
];
