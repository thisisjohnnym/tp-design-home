"use client";

import type { HeroV5Cursor } from "./heroV5Cursors";

type HeroV5CursorLabelProps = {
  cursor: HeroV5Cursor;
  active: boolean;
};

/** Recreated Figma multiplayer cursor arrow — points up-left; mirrored for right-side labels. */
function CursorArrow({ color }: { color: string }) {
  return (
    <svg
      className="hero-v5__cursor-svg"
      width="26"
      height="28"
      viewBox="0 0 26 28"
      fill="none"
      aria-hidden
    >
      <path
        d="M3 2.5 L3 22 L8.4 16.6 L12 24.8 L15.6 23.2 L12 15 L19.6 15 Z"
        fill={color}
        stroke="#ffffff"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * A single Figma cursor-chat label: coloured pointer + rounded name pill.
 * Positioned as a % of the reference frame; flies in from `enter` when active.
 */
export function HeroV5CursorLabel({ cursor, active }: HeroV5CursorLabelProps) {
  const style = {
    left: `${cursor.x}%`,
    top: `${cursor.y}%`,
    "--enter-x": `${cursor.enter.x}px`,
    "--enter-y": `${cursor.enter.y}px`,
    "--order": cursor.order,
    "--pill-fill": cursor.fill,
    "--pill-border": cursor.border,
    "--pill-shadow": cursor.shadow,
  } as React.CSSProperties;

  return (
    <div
      className="hero-v5__cursor"
      data-side={cursor.side}
      data-active={active ? "true" : "false"}
      data-text={cursor.text}
      style={style}
    >
      <span className="hero-v5__cursor-arrow">
        <CursorArrow color={cursor.fill} />
      </span>
      <span className="hero-v5__cursor-pill">{cursor.name}</span>
    </div>
  );
}
