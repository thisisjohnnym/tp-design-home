/**
 * Exact Paper exports (2× PNGs). CSS displays at 1× art size; fan scale maps
 * onto the reference-frame discs without object-fit cropping.
 */

const ASSET_V = "20260928a";

/** 1× size of Frame@2x (6).png (1602×1596). */
const leadArt = { width: 801, height: 798 } as const;
/** 1× size of Frame@2x (7).png (2208×1978). */
const accentArt = { width: 1104, height: 989 } as const;

export function SphereLeft() {
  return (
    <img
      className="hs-sphere hs-sphere--lead"
      src={`/team/orb-lead.png?v=${ASSET_V}`}
      alt=""
      width={leadArt.width}
      height={leadArt.height}
      decoding="async"
      draggable={false}
    />
  );
}

export function SphereRight() {
  return (
    <img
      className="hs-sphere hs-sphere--accent"
      src={`/team/orb-accent.png?v=${ASSET_V}`}
      alt=""
      width={accentArt.width}
      height={accentArt.height}
      decoding="async"
      draggable={false}
    />
  );
}
