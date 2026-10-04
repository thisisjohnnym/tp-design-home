"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { heroSequenceCursorRoster } from "./content";
import { morphBridge } from "./morph-bridge";
import { paintCardFace } from "./team-ring/cardTexture";
import {
  DRIFT_HEIGHT_CAP,
  DRIFT_HEIGHT_CAP_PHONE,
  GALLERY_PHONE_QUERY,
  PARALLAX_DEPTH,
} from "./WorkGallery";
import "./morph-card.css";

/**
 * The last card of the work gallery is not a work tile. It sits in an empty
 * slot of the collage (WorkGallery's `.hs-gallery__slot`), drifts with the
 * parallax like its neighbours, then — as the team ring scrolls in — leaves the
 * collage on an S-shaped path, flips over to show a team card, and lands on the
 * ring's front card, which takes over.
 *
 * Everything is scrubbed by the ring's own scroll-in progress (the same
 * 0 → 1 that tilts its camera), so the flip finishes exactly when the ring is
 * fully in view. The traveler is a DOM card because it has to cross the gallery
 * (which clips) into the team section; the ring is a canvas that can't draw
 * outside its box.
 */

/* Parallax speed while still part of the collage (>1 leads, like the cart). */
const TRAVELER_SPEED = 1.2;
/* The flight runs while the section's top travels from the viewport's bottom
   edge to this far above the viewport top (in viewport heights) — the point
   where the ring reads as fully in view. Longer than the ring's own camera
   scroll-in (TeamRing's IntroProbe), which is settled well before it. */
const FLIGHT_END = -0.15;
const INTRO_SPAN = 1 - FLIGHT_END;
/* Scroll distance past the landing, in viewport heights, over which the ring
   lets go of the landed card — and, scrolling back, glides home to it. */
const SETTLE_SPAN = 0.5;
/* How fast the card rushes to catch up with the scroll after waiting for the ring (1/s). */
const CATCH_UP_RATE = 7;
/* Sideways swing of the S, as a share of viewport width. */
const S_AMPLITUDE = 0.2;
/* Peak lift toward the viewer mid-flip, px of perspective depth. */
const LIFT = 150;
const PERSPECTIVE = 1400;
/* The member card's corner radius, from the card design (16 of 324). */
const CARD_RADIUS = 16 / 324;
/* Red placeholder; swap for artwork. Square corners, as in the Paper frame. */
const RED_RADIUS = 0;

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
/* Sine in-out: no stall at the ends, so the scrub never feels stuck. */
const ease = (t: number) => 0.5 - 0.5 * Math.cos(Math.PI * t);

function bezier(p0: number, p1: number, p2: number, p3: number, t: number) {
  const k = 1 - t;
  return (
    k * k * k * p0 + 3 * k * k * t * p1 + 3 * k * t * t * p2 + t * t * t * p3
  );
}

export function MorphCard() {
  const layerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const frontRef = useRef<HTMLDivElement>(null);
  const faceRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const layer = layerRef.current;
    const card = cardRef.current;
    const front = frontRef.current;
    const face = faceRef.current;
    if (!layer || !card || !front || !face) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const phone = window.matchMedia(GALLERY_PHONE_QUERY);
    const slotEl = document.querySelector<HTMLElement>(".hs-gallery__slot");
    const sceneEl = document.querySelector<HTMLElement>(".hs-team__scene");
    if (!slotEl || !sceneEl || reduceMotion.matches) return;

    /* Back face shows whichever member the ring hands the traveler (the card
       nearest the front when it left); repainted when that changes, which only
       happens while the traveler is gone. */
    let painted = morphBridge.index;
    let stopPaint = paintCardFace(heroSequenceCursorRoster[painted], face);

    morphBridge.active = true;

    /* Flight progress the card actually shows. Normally the scroll's own
       (scrubbed); but leaving the landing before the ring has parked its card
       at the front (the visitor dragged it) the card waits, as the ring's own
       card, until it is parked, then rushes to catch up with the scroll. */
    let shown = 0;
    let catching = false;

    const tick = (_time: number, deltaMs: number) => {
      const dt = Math.min(deltaMs, 50) / 1000;
      const vh = window.innerHeight;
      const vw = window.innerWidth;
      const scene = sceneEl.getBoundingClientRect();
      const home = slotEl.getBoundingClientRect();
      const layerBox = layer.getBoundingClientRect();
      const slot = morphBridge.slot;

      if (morphBridge.index !== painted) {
        painted = morphBridge.index;
        stopPaint();
        stopPaint = paintCardFace(heroSequenceCursorRoster[painted], face);
      }

      /* Scroll-in progress, as the ring computes it. Held at 0 until the ring
         has reported where its front card is. */
      const scroll = slot.valid
        ? clamp01((vh - scene.top) / (vh * INTRO_SPAN))
        : 0;
      if (scroll >= shown) {
        shown = scroll;
        catching = false;
      } else {
        if (!catching && shown >= 0.999 && !morphBridge.aligned) catching = true;
        if (!catching) {
          shown = scroll;
        } else if (shown < 0.999 || morphBridge.aligned) {
          shown += (scroll - shown) * (1 - Math.exp(-dt * CATCH_UP_RATE));
          if (shown - scroll < 0.004) {
            shown = scroll;
            catching = false;
          }
        }
      }
      const u = shown;
      /* A hard swap, never a crossfade: both cards are translucent glass, so
         any overlap shows as a ghost. The ring is exactly on the landing spot
         by now, so the swap is invisible. */
      const arrive = u >= 0.998 ? 1 : 0;
      const past = slot.valid
        ? clamp01((FLIGHT_END * vh - scene.top) / (SETTLE_SPAN * vh))
        : 0;
      morphBridge.landed = scroll >= 0.999;
      morphBridge.past = past;
      morphBridge.hold = scroll < 0.999 || past < 1;
      morphBridge.arrive = arrive;

      /* Start: the collage slot plus the drift a gallery tile would have there. */
      const runway = Math.min(
        vh,
        vw * (phone.matches ? DRIFT_HEIGHT_CAP_PHONE : DRIFT_HEIGHT_CAP),
      );
      const drift =
        ((TRAVELER_SPEED - 1) * PARALLAX_DEPTH * (runway + home.height)) / 2;
      const pass = clamp01((vh - home.top) / (vh + home.height));
      const x0 = home.left + home.width / 2;
      const y0 = home.top + home.height / 2 + lerp(drift, -drift, pass);

      /* End: the ring's front card (canvas-local → viewport). */
      const x3 = scene.left + slot.cx;
      const y3 = scene.top + slot.cy;

      const s = ease(u);
      const dx = x3 - x0;
      const dy = y3 - y0;
      /* Swing away from the target first, then across it: an S. */
      const side = dx <= 0 ? 1 : -1;
      const swing = vw * S_AMPLITUDE * side;
      const x = bezier(x0, x0 + swing, x3 - swing * 0.9, x3, s);
      const y = bezier(y0, y0 + dy * 0.3, y0 + dy * 0.72, y3, s);

      const w = lerp(home.width, slot.w || home.width, s);
      const h = lerp(home.height, slot.h || home.height, s);
      const radius = lerp(RED_RADIUS, CARD_RADIUS * (slot.w || w), s);

      /* Flip is the same scrub as the position, so it lands face-up with the
         card; the sway rides the S and settles flat. */
      const flip = 180 * s;
      const sway = -side * 8 * Math.sin(Math.PI * 2 * s);
      const lift = LIFT * Math.sin(Math.PI * s);

      /* Skip the paint while it is nowhere near the viewport. */
      const onScreen =
        arrive < 1 && y + h > -vh * 0.5 && y - h < vh * 1.5;
      card.style.visibility = onScreen ? "visible" : "hidden";
      if (!onScreen) {
        /* Faces set their own visibility below, which beats the card's. */
        front.style.visibility = "hidden";
        face.style.visibility = "hidden";
        return;
      }

      /* Each face is shown by angle as well as by backface-visibility, which
         browsers drop on faces that fade or sit in a flattened context. */
      front.style.visibility = flip < 90 ? "visible" : "hidden";
      face.style.visibility = flip < 90 ? "hidden" : "visible";

      card.style.width = `${w}px`;
      card.style.height = `${h}px`;
      card.style.borderRadius = `${radius}px`;
      card.style.setProperty("--hs-morph-fade", String(1 - arrive));
      card.style.transform = `translate3d(${x - w / 2 - layerBox.left}px, ${
        y - h / 2 - layerBox.top
      }px, 0) perspective(${PERSPECTIVE}px) translateZ(${lift}px) rotateZ(${sway}deg) rotateY(${flip}deg)`;
    };

    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      stopPaint();
      morphBridge.active = false;
      morphBridge.hold = false;
      morphBridge.arrive = 1;
    };
  }, []);

  return (
    <div className="hs-morph" ref={layerRef} aria-hidden="true">
      <div className="hs-morph__card" ref={cardRef}>
        <div
          className="hs-morph__side hs-morph__side--front"
          ref={frontRef}
        />
        <canvas className="hs-morph__side hs-morph__side--back" ref={faceRef} />
      </div>
    </div>
  );
}
