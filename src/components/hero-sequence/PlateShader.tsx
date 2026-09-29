"use client";

import { HalftoneDots } from "@paper-design/shaders-react";

/**
 * Site plate shader — Paper HalftoneDots frame (Hero sequence).
 * Sits behind the grid strokes; params match the design export.
 */
/**
 * Cap the plate at 2× device pixels. It only draws a faint grain, and at a
 * 3× phone's full density its WebGL buffers were a large share of the memory
 * that got iOS Safari's tab killed. Not rendered into markup, so SSR is safe.
 */
const maxPixelCount =
  typeof window === "undefined"
    ? undefined
    : Math.round(window.screen.width * window.screen.height * 4);

export function PlateShader() {
  return (
    <div className="hs-plate" aria-hidden="true">
      <HalftoneDots
        className="hs-plate__shader"
        contrast={1}
        originalColors={false}
        inverted={false}
        grid="hex"
        radius={1.25}
        size={0.56}
        scale={1}
        grainSize={0}
        type="gooey"
        fit="cover"
        colorFront="#00000000"
        colorBack="#00000000"
        grainOverlay={0.09}
        grainMixer={0.03}
        width="100%"
        height="100%"
        maxPixelCount={maxPixelCount}
      />
    </div>
  );
}
