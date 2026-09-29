"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { heroSequenceWorkGallery } from "./content";
import "./work-gallery.css";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/** Apple Pay mark from Paper 6WC-0, drawn in its own 127×56 pill box. */
function ApplePayMark() {
  return (
    <svg viewBox="-27 -6.08 127 56.161" xmlns="http://www.w3.org/2000/svg">
      <path
        transform="translate(29.75 14)"
        fill="currentColor"
        d="M-10.19 0.444C-10.773 1.131-11.705 1.673-12.638 1.597-12.754 0.666-12.298-0.322-11.764-0.932-11.18-1.64-10.161-2.144-9.335-2.182-9.238-1.213-9.617-0.264-10.19 0.444ZM-9.345 1.78C-10.695 1.702-11.85 2.546-12.493 2.546-13.143 2.546-14.125 1.82-15.193 1.839-16.582 1.858-17.875 2.643-18.583 3.893-20.041 6.391-18.962 10.092-17.555 12.127-16.864 13.134-16.038 14.239-14.951 14.201-13.921 14.161-13.512 13.531-12.269 13.531-11.016 13.531-10.656 14.201-9.568 14.18-8.441 14.161-7.732 13.174-7.042 12.166-6.255 11.023-5.934 9.909-5.915 9.85-5.934 9.831-8.092 9.008-8.111 6.527-8.13 4.454-6.411 3.466-6.333 3.408-7.304 1.974-8.82 1.82-9.345 1.78ZM-1.542-1.029L-1.542 14.075 0.809 14.075 0.809 8.911 4.063 8.911C7.036 8.911 9.124 6.876 9.124 3.931 9.124 0.986 7.074-1.029 4.141-1.029ZM0.809 0.948L3.518 0.948C5.559 0.948 6.725 2.032 6.725 3.941 6.725 5.849 5.559 6.944 3.509 6.944L0.809 6.944ZM13.419 14.19C14.896 14.19 16.266 13.445 16.887 12.262L16.936 12.262 16.936 14.075 19.112 14.075 19.112 6.557C19.112 4.376 17.363 2.971 14.673 2.971 12.176 2.971 10.329 4.396 10.262 6.353L12.379 6.353C12.554 5.423 13.419 4.813 14.604 4.813 16.042 4.813 16.849 5.481 16.849 6.712L16.849 7.544 13.915 7.719C11.184 7.884 9.708 8.998 9.708 10.935 9.708 12.892 11.233 14.19 13.419 14.19ZM14.051 12.398C12.798 12.398 12.001 11.798 12.001 10.878 12.001 9.928 12.768 9.376 14.235 9.288L16.849 9.124 16.849 9.976C16.849 11.39 15.644 12.398 14.051 12.398ZM22.017 18.182C24.311 18.182 25.389 17.31 26.331 14.665L30.46 3.118 28.07 3.118 25.301 12.04 25.253 12.04 22.484 3.118 20.026 3.118 24.009 14.113 23.795 14.781C23.436 15.915 22.853 16.35 21.813 16.35 21.629 16.35 21.269 16.331 21.124 16.312L21.124 18.123C21.26 18.163 21.842 18.182 22.017 18.182Z"
      />
    </svg>
  );
}

/**
 * Paper collage before the team section — image tiles only, no plate/grid.
 * Tiles hold their Paper positions; each settles in as it scrolls up.
 * NYC wayfinding marks (arrows, a street-sign label, stray UI chips) sit
 * beside the tile they point at.
 */
/* Starting zoom of a tile's image inside its frame; settles to 1. */
const TILE_ENTER_SCALE = 1.15;
const TILE_ENTER_DURATION = 1.8;
/* Matches the hero's phone breakpoint (HeroSequence isMobile). */
const GALLERY_PHONE_QUERY = "(max-width: 699px)";

export function WorkGallery() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      if (prefersReducedMotion) return;

      const tiles = gsap.utils.toArray<HTMLElement>(".hs-gallery__tile", root);
      if (tiles.length === 0) return;

      const triggers: ScrollTrigger[] = [];

      /*
       * Settle-in: each tile's image starts zoomed in and plays down to 1
       * once the tile clears the bottom edge. The tile clips, so the frame
       * never grows past its Paper size. Reverses when scrolled back below
       * the fold so it replays.
       */
      tiles.forEach((tile) => {
        const picture = tile.querySelector(".hs-gallery__picture");
        if (!picture) return;

        const tween = gsap.fromTo(
          picture,
          { scale: TILE_ENTER_SCALE },
          {
            scale: 1,
            duration: TILE_ENTER_DURATION,
            ease: "power2.out",
            scrollTrigger: {
              trigger: tile,
              start: "top 90%",
              toggleActions: "play none none reverse",
            },
          },
        );

        if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
      });

      return () => {
        triggers.forEach((trigger) => trigger.kill());
      };
    },
    { scope: rootRef },
  );

  return (
    <section
      id="works"
      className="hs-gallery"
      ref={rootRef}
      aria-label="Selected work"
    >
      <div className="hs-gallery__stage">
        {heroSequenceWorkGallery.map((tile) => (
          <figure
            className={`hs-gallery__tile hs-gallery__tile--${tile.id}`}
            key={tile.id}
          >
            <picture className="hs-gallery__picture">
              {"mobileSrc" in tile && (
                <source media={GALLERY_PHONE_QUERY} srcSet={tile.mobileSrc} />
              )}
              <img
                className="hs-gallery__image"
                src={tile.src}
                alt={tile.alt}
                width={tile.pixelWidth}
                height={tile.pixelHeight}
                loading="lazy"
                decoding="async"
              />
            </picture>
          </figure>
        ))}

        {/* Decorative wayfinding — the tiles already carry the alt text. */}
        <span
          className="hs-gallery__ui hs-gallery__arrow hs-gallery__arrow--in"
          aria-hidden="true"
        >
          ↘
        </span>
        <span
          className="hs-gallery__ui hs-gallery__sign"
          aria-hidden="true"
        >
          <span className="hs-gallery__sign-bullet">KS</span>
          <span className="hs-gallery__sign-text">
            PDP Ave.
            <br />
            Kate Spade St.
          </span>
        </span>
        <span
          className="hs-gallery__ui hs-gallery__pay"
          aria-hidden="true"
        >
          <ApplePayMark />
        </span>
        <span
          className="hs-gallery__ui hs-gallery__cta"
          aria-hidden="true"
        >
          Add to Cart
        </span>
        <span
          className="hs-gallery__ui hs-gallery__arrow hs-gallery__arrow--out"
          aria-hidden="true"
        >
          ↙
        </span>
      </div>
    </section>
  );
}
