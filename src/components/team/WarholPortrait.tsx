import Image from "next/image";
import type { CSSProperties } from "react";
import { getWarholPalette } from "@/content/warholPalettes";

type WarholPortraitProps = {
  src: string;
  alt: string;
  name: string;
  sizes: string;
  className?: string;
};

function TropicalFoliage() {
  return (
    <svg
      className="warhol-portrait__foliage"
      viewBox="0 0 304 406"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <path
        className="warhol-portrait__leaf warhol-portrait__leaf--a"
        d="M-20 120 C40 40, 120 20, 180 80 C140 140, 80 180, -10 200 Z"
      />
      <path
        className="warhol-portrait__leaf warhol-portrait__leaf--b"
        d="M320 260 C260 180, 200 150, 140 200 C180 280, 250 340, 330 380 Z"
      />
      <path
        className="warhol-portrait__leaf warhol-portrait__leaf--c"
        d="M40 360 C80 300, 140 280, 200 320 C160 380, 100 420, 30 410 Z"
      />
      <path
        className="warhol-portrait__leaf warhol-portrait__leaf--d"
        d="M260 40 C220 80, 200 140, 240 180 C300 140, 330 80, 310 10 Z"
      />
    </svg>
  );
}

export function WarholFilters() {
  return (
    <svg aria-hidden className="pointer-events-none absolute size-0 overflow-hidden">
      <defs>
        <filter id="warhol-posterize" colorInterpolationFilters="sRGB">
          <feComponentTransfer>
            <feFuncR type="discrete" tableValues="0 0.45 0.8 1" />
            <feFuncG type="discrete" tableValues="0 0.45 0.8 1" />
            <feFuncB type="discrete" tableValues="0 0.45 0.8 1" />
          </feComponentTransfer>
          <feColorMatrix
            type="matrix"
            values="1.2 0 0 0 -0.1
                    0 1.2 0 0 -0.1
                    0 0 1.2 0 -0.1
                    0 0 0 1 0"
          />
        </filter>
      </defs>
    </svg>
  );
}

export function WarholPortrait({ src, alt, name, sizes, className = "" }: WarholPortraitProps) {
  const palette = getWarholPalette(name);

  return (
    <div
      className={`warhol-portrait ${className}`.trim()}
      style={
        {
          "--warhol-bg": palette.background,
          "--warhol-skin": palette.skin,
          "--warhol-shadow": palette.shadow,
          "--warhol-highlight": palette.highlight,
          "--warhol-leaf-a": palette.leafA,
          "--warhol-leaf-b": palette.leafB,
        } as CSSProperties
      }
    >
      <TropicalFoliage />
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        loading="eager"
        className="warhol-portrait__photo object-cover object-center"
      />
      <span className="warhol-portrait__skin" aria-hidden />
      <span className="warhol-portrait__shadow" aria-hidden />
      <span className="warhol-portrait__highlight" aria-hidden />
      <span className="warhol-portrait__glow" aria-hidden />
    </div>
  );
}
