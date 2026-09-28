"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { heroSequenceWorkGallery } from "./content";
import { appendCurtainLine } from "./curtain-reveal";
import { curtainReveal } from "./team-fan-tuning";
import "./curtain-reveal.css";
import "./work-gallery.css";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Paper collage before the team section — image tiles only, no plate/grid.
 * Depth comes from per-tile scroll speeds while the stage scrolls through.
 */
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

      const stage = root.querySelector(".hs-gallery__stage") as HTMLElement;
      const tiles = gsap.utils.toArray<HTMLElement>(".hs-gallery__tile", root);
      if (!stage || tiles.length === 0) return;

      const triggers: ScrollTrigger[] = [];

      tiles.forEach((tile) => {
        const speed = Number(tile.dataset.speed ?? "1");
        /* Speed 1 rides with scroll. Below 1 lags (farther), above 1 leads (nearer). */
        const travel = (speed - 1) * stage.offsetHeight * 0.28;

        const tween = gsap.fromTo(
          tile,
          { y: 0 },
          {
            y: travel,
            ease: "none",
            scrollTrigger: {
              trigger: root,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
              invalidateOnRefresh: true,
            },
          },
        );

        if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
      });

      tiles.forEach((tile) => {
        const curtain = tile.querySelector(".hs-curtain") as HTMLElement;
        if (!curtain) return;

        const tl = gsap.timeline({ paused: true });
        appendCurtainLine(tl, curtain, 0, curtainReveal, {
          hideContent: true,
        });

        const trigger = ScrollTrigger.create({
          trigger: tile,
          start: "top bottom",
          once: true,
          onEnter: () => tl.play(0),
        });

        triggers.push(trigger);
      });

      return () => {
        triggers.forEach((trigger) => trigger.kill());
      };
    },
    { scope: rootRef },
  );

  return (
    <section
      className="hs-gallery"
      ref={rootRef}
      aria-label="Selected work"
    >
      <div className="hs-gallery__stage">
        {heroSequenceWorkGallery.map((tile) => (
          <figure
            className={`hs-gallery__tile hs-gallery__tile--${tile.id}`}
            data-speed={tile.speed}
            key={tile.id}
          >
            <div className="hs-curtain hs-gallery__curtain">
              <img
                className="hs-gallery__image hs-curtain__content"
                src={tile.src}
                alt={tile.alt}
                width={tile.pixelWidth}
                height={tile.pixelHeight}
                loading="lazy"
                decoding="async"
              />
              <span className="hs-curtain__mask" aria-hidden="true" />
            </div>
          </figure>
        ))}
      </div>
    </section>
  );
}
