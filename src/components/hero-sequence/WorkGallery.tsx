"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { heroSequenceWorkGallery } from "./content";
import "./work-gallery.css";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Paper collage before the team section — framed artwork only.
 * Depth comes from per-tile scroll speeds; each image also settles in as
 * its tile scrolls up. The section clips, so drifting tiles never paint
 * over the hero above or the team below.
 */
/*
 * Parallax strength: a tile's drift is (speed − 1) × this × its own pass
 * through the viewport. Measured per tile (not per stage) so neighbours'
 * relative drift stays bounded by the viewport and the spacing in CSS holds.
 */
export const PARALLAX_DEPTH = 0.55;
/*
 * Spacing scales with width but drift with viewport height, so the height
 * term is capped at this multiple of width — portrait tablets would
 * otherwise out-drift the gaps. Phone has its own taller stack.
 */
export const DRIFT_HEIGHT_CAP = 0.75;
export const DRIFT_HEIGHT_CAP_PHONE = 2.2;
/* Starting zoom of a tile's image inside its frame; settles to 1. */
const TILE_ENTER_SCALE = 1.15;
const TILE_ENTER_DURATION = 1.8;
/* Matches the hero's phone breakpoint (HeroSequence isMobile). */
export const GALLERY_PHONE_QUERY = "(max-width: 699px)";

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
      const phoneQuery = window.matchMedia(GALLERY_PHONE_QUERY);

      /*
       * Speed 1 rides with scroll. Above 1 leads (nearer): starts low and
       * rises past its layout spot. Below 1 lags (farther): starts high and
       * sinks. Zero offset when the tile is centred in the viewport, so the
       * CSS layout is exact mid-pass.
       */
      tiles.forEach((tile) => {
        const speed = () =>
          Number(
            (phoneQuery.matches && tile.dataset.speedPhone) ||
              tile.dataset.speed ||
              "1",
          );
        const drift = () => {
          const cap = phoneQuery.matches
            ? DRIFT_HEIGHT_CAP_PHONE
            : DRIFT_HEIGHT_CAP;
          const runway = Math.min(
            window.innerHeight,
            window.innerWidth * cap,
          );
          return (
            ((speed() - 1) * PARALLAX_DEPTH * (runway + tile.offsetHeight)) / 2
          );
        };

        const tween = gsap.fromTo(
          tile,
          { y: () => drift() },
          {
            y: () => -drift(),
            ease: "none",
            scrollTrigger: {
              trigger: tile,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
              invalidateOnRefresh: true,
            },
          },
        );

        if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
      });

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
            data-speed={tile.speed}
            data-speed-phone={"phoneSpeed" in tile ? tile.phoneSpeed : undefined}
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

        {/* Empty slot for the traveler card (MorphCard.tsx) — it passes for the
            collage's last tile, then leaves for the team ring. */}
        <div className="hs-gallery__slot" aria-hidden="true" />
      </div>
    </section>
  );
}
