/** Smokescreen 1 — https://shaders.com/collection/smokescreen/77e87f9f-add2-470a-ae55-8760075f28f1 */
export const HERO_V3_SMOKESCREEN = {
  background: "#040414",
  smoke: {
    speed: 6.2,
    colorA: "#c2dbdc",
    colorB: "#0484fc",
    detail: 7,
    spread: 60,
    gravity: 0.5,
    direction: 36,
    intensity: 1,
    colorDecay: 1.4,
    colorSpace: "linear" as const,
    emitRadius: 0.08,
    dissipation: 0.2,
    mouseRadius: 0.07,
    mouseInfluence: 0.8,
    emitFrom: { type: "mouse-position" as const, originX: 0, originY: 0 },
  },
} as const;
