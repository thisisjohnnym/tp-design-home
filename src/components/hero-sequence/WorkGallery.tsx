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
/*
 * Elastic scroll lag. Each tile chases the page's scroll position on its own
 * underdamped spring, so while the page moves the tiles hang back, then
 * catch up when it stops. The tiles nearest the direction of travel are the
 * stiffest (they move first), and the stiffness falls away toward the far end,
 * so the response staggers across the collage — and so does the catch-up.
 * The content moves up when scrolling down, so the top tiles lead then.
 * ω is in 1/s; ζ < 1 lets a tile ease a touch past and come back.
 */
const LAG_OMEGA_LEAD = 20;
const LAG_OMEGA_TRAIL = 9;
const LAG_DAMPING = 0.6;
/* Most a tile may trail, as a share of the viewport height. */
const LAG_MAX = 0.12;
/*
 * Camera zoom into the traveler card. From the moment the slot has peeked into
 * view by SLOT_PEEK of its height until the team section's top reaches the
 * bottom edge (where the traveler's flight begins), the collage scales about
 * the traveler's slot. The slot itself runs
 * from SLOT_START to full size; every tile scales by its own depth (its speed),
 * so the nearer ones fly outward faster than the farther ones.
 */
const SLOT_PEEK = 0.1;
const SLOT_START = 0.6;
const ZOOM_GAIN = 1 / SLOT_START - 1;
/* Matches the hero's phone breakpoint (HeroSequence isMobile). */
export const GALLERY_PHONE_QUERY = "(max-width: 699px)";

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

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
          const runway = Math.min(window.innerHeight, window.innerWidth * cap);
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

      /*
       * Elastic lag, driven by the page's own (smoothed) movement: the stage's
       * top edge. Written to the `translate` property so it stacks on the
       * parallax transform GSAP owns. Runs only while the collage is near.
       */
      const stage = root.querySelector<HTMLElement>(".hs-gallery__stage");
      const slot = root.querySelector<HTMLElement>(".hs-gallery__slot");
      if (stage && slot) {
        /*
         * Camera zoom: every tile scales about the traveler slot's centre, by
         * its own depth. Origins are in each tile's own box, from layout
         * offsets (stage is the offset parent), so transforms never feed back.
         */
        const depth = tiles.map((tile) => {
          const speed = Number(
            (phoneQuery.matches && tile.dataset.speedPhone) ||
              tile.dataset.speed ||
              "1",
          );
          return speed;
        });
        const measure = () => {
          const ax = slot.offsetLeft + slot.offsetWidth / 2;
          const ay = slot.offsetTop + slot.offsetHeight / 2;
          slot.style.transformOrigin = "50% 50%";
          tiles.forEach((tile) => {
            tile.style.transformOrigin = `${ax - tile.offsetLeft}px ${
              ay - tile.offsetTop
            }px`;
          });
        };
        measure();
        slot.style.scale = String(SLOT_START);
        const resize = new ResizeObserver(measure);
        resize.observe(stage);
        const scene = document.querySelector<HTMLElement>(".hs-team__scene");

        const lag = tiles.map(() => ({ pos: NaN, vel: 0, shown: 0 }));
        let last = NaN;
        /* +1 scrolling down, -1 up; keeps its last value once the page stops. */
        let dir = 1;

        const tick = (_time: number, deltaMs: number) => {
          const dt = Math.min(deltaMs, 50) / 1000;
          if (dt <= 0) return;
          const vh = window.innerHeight;
          const pos = -stage.getBoundingClientRect().top;
          if (!Number.isNaN(last) && Math.abs(pos - last) > 0.5) {
            dir = pos > last ? 1 : -1;
          }
          last = pos;
          const cap = vh * LAG_MAX;

          /* Camera zoom progress: 0 until the traveler's slot has peeked into
             view by SLOT_PEEK of its height, then 0 → 1 up to where the
             traveler's flight begins (the team section's top at the bottom
             edge). The slot's centre is steady under its own scale, so it is
             what the position is read from. */
          if (scene) {
            const box = slot.getBoundingClientRect();
            const center = box.top + box.height / 2;
            const baseH = slot.offsetHeight * SLOT_START;
            const start = vh - SLOT_PEEK * baseH + baseH / 2;
            const end = vh - (scene.getBoundingClientRect().top - center);
            const raw = clamp01((start - center) / Math.max(1, start - end));
            const z = 0.5 - 0.5 * Math.cos(Math.PI * raw);
            slot.style.scale = String(SLOT_START * (1 + ZOOM_GAIN * z));
            tiles.forEach((tile, i) => {
              tile.style.scale = String(1 + ZOOM_GAIN * z * depth[i]);
            });
          }

          tiles.forEach((tile, i) => {
            const st = lag[i];
            if (Number.isNaN(st.pos)) st.pos = pos;
            /* How far toward the leading edge this tile sits (0 trailing → 1
               leading). The page's content moves up when scrolling down, so the
               leaders are the top tiles then, the bottom ones scrolling up:
               they pull the rest along behind them. Its centre's place in the
               viewport, flipped with the direction. */
            const box = tile.getBoundingClientRect();
            const n = Math.min(1, Math.max(0, (box.top + box.height / 2) / vh));
            const lead = dir > 0 ? 1 - n : n;
            const omega =
              LAG_OMEGA_TRAIL + (LAG_OMEGA_LEAD - LAG_OMEGA_TRAIL) * lead;

            const accel =
              omega * omega * (pos - st.pos) - 2 * LAG_DAMPING * omega * st.vel;
            st.vel += accel * dt;
            st.pos += st.vel * dt;

            const offset = Math.max(-cap, Math.min(cap, pos - st.pos));
            if (Math.abs(offset) < 0.05 && Math.abs(st.vel) < 1) {
              st.pos = pos;
              st.vel = 0;
              if (st.shown !== 0) {
                st.shown = 0;
                tile.style.translate = "";
              }
              return;
            }
            st.shown = offset;
            tile.style.translate = `0 ${offset}px`;
          });
        };

        const run = ScrollTrigger.create({
          trigger: root,
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) => {
            if (self.isActive) {
              last = NaN;
              lag.forEach((st) => {
                st.pos = NaN;
                st.vel = 0;
              });
              gsap.ticker.add(tick);
            } else {
              gsap.ticker.remove(tick);
              tiles.forEach((tile) => {
                tile.style.translate = "";
              });
            }
          },
        });
        triggers.push(run);
        const stop = () => gsap.ticker.remove(tick);
        const killAll = () => {
          stop();
          resize.disconnect();
          slot.style.scale = "";
          tiles.forEach((tile) => {
            tile.style.translate = "";
            tile.style.scale = "";
            tile.style.transformOrigin = "";
          });
        };
        return () => {
          killAll();
          triggers.forEach((trigger) => trigger.kill());
        };
      }

      return () => {
        triggers.forEach((trigger) => trigger.kill());
      };
    },
    { scope: rootRef },
  );

  const tileFor = (id: (typeof heroSequenceWorkGallery)[number]["id"]) => {
    const tile = heroSequenceWorkGallery.find((t) => t.id === id)!;
    return (
      <figure
        className={`hs-gallery__tile hs-gallery__tile--${tile.id}`}
        data-speed={tile.speed}
        data-speed-phone={"phoneSpeed" in tile ? tile.phoneSpeed : undefined}
      >
        <picture className="hs-gallery__picture">
          {"mobileSrc" in tile && (
            <source media={GALLERY_PHONE_QUERY} srcSet={tile.mobileSrc} />
          )}
          {/* eslint-disable-next-line @next/next/no-img-element -- sized by the tile frame */}
          <img
            className="hs-gallery__image"
            src={tile.src}
            alt={tile.alt}
            loading="lazy"
            decoding="async"
          />
        </picture>
      </figure>
    );
  };

  /*
   * Paper 1PW-0: a column of three flex rows, each a space-between line of
   * columns that place their tile (start / center / end) — no absolute
   * positioning. Sizes are in 1512ths of the stage (CSS), which caps at 1820px.
   */
  return (
    <section
      id="works"
      className="hs-gallery"
      ref={rootRef}
      aria-labelledby="hs-gallery-heading"
    >
      <h2 className="hs-gallery__heading" id="hs-gallery-heading">
        Meet the people behind the work
      </h2>
      <div className="hs-gallery__stage">
        <div className="hs-gallery__rows">
          <div className="hs-gallery__row hs-gallery__row--one">
            <div className="hs-gallery__col hs-gallery__col--logo-top">
              {tileFor("logo-top")}
            </div>
            <div className="hs-gallery__col hs-gallery__col--cart">
              {tileFor("cart")}
            </div>
            <div className="hs-gallery__col hs-gallery__col--testimonial">
              {tileFor("testimonial")}
            </div>
          </div>

          <div className="hs-gallery__row hs-gallery__row--two">
            <div className="hs-gallery__col hs-gallery__col--pdp">
              {tileFor("pdp")}
            </div>
            <div className="hs-gallery__col hs-gallery__col--stack">
              <div className="hs-gallery__col hs-gallery__col--carousel">
                {tileFor("carousel")}
              </div>
              {tileFor("logo-mid")}
            </div>
          </div>

          <div className="hs-gallery__row hs-gallery__row--three">
            <div className="hs-gallery__col hs-gallery__col--cart-green">
              {tileFor("cart-green")}
            </div>
            <div className="hs-gallery__col hs-gallery__col--slot">
              {/* Where the traveler card (MorphCard.tsx) starts: it passes for
                  the collage's last tile, then leaves for the team section. */}
              <div className="hs-gallery__slot" aria-hidden="true" />
            </div>
            <div className="hs-gallery__col hs-gallery__col--tall">
              {tileFor("testimonial-tall")}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
