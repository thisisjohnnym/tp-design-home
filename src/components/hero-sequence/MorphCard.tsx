"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { heroSequenceCursorRoster } from "./content";
import { morphBridge } from "./morph-bridge";
import { paintCardFace } from "./team-card-face";
import {
  DRIFT_HEIGHT_CAP,
  DRIFT_HEIGHT_CAP_PHONE,
  GALLERY_PHONE_QUERY,
  FLIGHT_END,
  PARALLAX_DEPTH,
} from "./WorkGallery";
import "./morph-card.css";

/**
 * The last card of the work gallery is not a work tile. It sits in an empty
 * slot of the collage (WorkGallery's `.hs-gallery__slot`), drifts with the
 * parallax like its neighbours, then — as the team ring scrolls in — leaves the
 * collage on an S-shaped path, flips over to show a team card, and lands on the
 * team carousel's card slot, where the carousel's own card takes over.
 *
 * Everything is scrubbed by scroll, so the flip finishes exactly when the team
 * section is fully in view. The carousel scrolls one name in on the same
 * progress (morphBridge.progress). The traveler lives outside both sections
 * because it has to cross the gallery (which clips) into the team section.
 */

/* Parallax speed while still part of the collage (>1 leads, like the cart). */
const TRAVELER_SPEED = 1.2;
/* The flight runs while the section's top travels from the viewport's bottom
   edge to this far below the viewport top (in viewport heights) — roughly where
   the names sit mid-screen — so the card has landed, and the carousel is live,
   before the section is fully in view. */
const INTRO_SPAN = 1 - FLIGHT_END;
/* Sideways swing of the S, as a share of viewport width. */
const S_AMPLITUDE = 0.2;
/* Peak lift toward the viewer mid-flip, px of perspective depth. */
const LIFT = 150;
const PERSPECTIVE = 1400;
/* Each half of the back-up swap: cards fade out, then the traveler fades in. */
const DIP_MS = 150;
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
    const landEl = document.querySelector<HTMLElement>(".hs-team__slot");
    if (!slotEl || !sceneEl || !landEl || reduceMotion.matches) return;

    /* Back face shows whichever member the carousel hands the traveler (its
       current card when it left); repainted when that changes, which only
       happens while the traveler is gone. */
    let painted = morphBridge.index;
    let stopPaint = paintCardFace(heroSequenceCursorRoster[painted], face);

    morphBridge.active = true;
    let wasLanded = false;
    let dipAt = -Infinity;

    const tick = () => {
      const vh = window.innerHeight;
      const vw = window.innerWidth;
      const scene = sceneEl.getBoundingClientRect();
      const land = landEl.getBoundingClientRect();
      const home = slotEl.getBoundingClientRect();
      const layerBox = layer.getBoundingClientRect();

      if (morphBridge.index !== painted) {
        painted = morphBridge.index;
        stopPaint();
        stopPaint = paintCardFace(heroSequenceCursorRoster[painted], face);
      }

      /* The section's top travels from the viewport's bottom edge (0) to
         FLIGHT_END below the top (1). */
      const u = clamp01((vh - scene.top) / (vh * INTRO_SPAN));
      /* The traveler stays as the card once landed. The carousel's own card
         replaces it only after the visitor moves — scrolling on past the
         section's top, or pressing the carousel — so the swap hides in motion.
         A hard swap, never a crossfade: both are translucent glass, so any
         overlap shows as a ghost. */
      const landed = u >= 0.998;
      /* Scrolling back up after the cards took over: they fade out first, then
         the traveler fades in, one after the other so they never overlap. */
      if (!landed && wasLanded && morphBridge.handoff)
        dipAt = performance.now();
      if (!landed) {
        morphBridge.handoff = false;
        /* Start from rest, not from wherever the last drag left the card. */
        Object.assign(morphBridge.out, { x: 0, turn: 0, o: 1 });
      }
      wasLanded = landed;
      const dip = clamp01((performance.now() - dipAt - DIP_MS) / DIP_MS);
      const arrive = landed && morphBridge.handoff ? 1 : 0;
      morphBridge.progress = u;
      morphBridge.landed = landed;

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

      /* End: the carousel's card slot. */
      const x3 = land.left + land.width / 2;
      const y3 = land.top + land.height / 2;

      const s = ease(u);
      const dx = x3 - x0;
      const dy = y3 - y0;
      /* Swing away from the target first, then across it: an S. */
      const side = dx <= 0 ? 1 : -1;
      const swing = vw * S_AMPLITUDE * side;
      /* Landed and still standing in for the card: follow the drag. */
      const hold = landed && !morphBridge.handoff;
      const out = morphBridge.out;
      const x =
        bezier(x0, x0 + swing, x3 - swing * 0.9, x3, s) + (hold ? out.x : 0);
      const y = bezier(y0, y0 + dy * 0.3, y0 + dy * 0.72, y3, s);

      const w = lerp(home.width, land.width, s);
      const h = lerp(home.height, land.height, s);
      const radius = lerp(RED_RADIUS, CARD_RADIUS * land.width, s);

      /* Flip is the same scrub as the position, so it lands face-up with the
         card; the sway rides the S and settles flat. */
      const flip = 180 * s;
      const sway = -side * 8 * Math.sin(Math.PI * 2 * s);
      const lift = LIFT * Math.sin(Math.PI * s);

      /* Skip the paint while it is nowhere near the viewport. */
      const onScreen = arrive < 1 && y + h > -vh * 0.5 && y - h < vh * 1.5;
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
      card.toggleAttribute("data-landed", landed);
      card.style.setProperty(
        "--hs-morph-fade",
        String((hold ? out.o : 1) * dip),
      );
      card.style.transform = `translate3d(${x - w / 2 - layerBox.left}px, ${
        y - h / 2 - layerBox.top
      }px, 0) perspective(${PERSPECTIVE}px) translateZ(${lift}px) rotateZ(${sway}deg) rotateY(${flip + (hold ? out.turn : 0)}deg)`;
    };

    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      stopPaint();
      morphBridge.active = false;
      morphBridge.progress = 1;
      morphBridge.landed = true;
      morphBridge.handoff = true;
    };
  }, []);

  return (
    <div className="hs-morph" ref={layerRef} aria-hidden="true">
      <div className="hs-morph__card" ref={cardRef}>
        <div className="hs-morph__side hs-morph__side--front" ref={frontRef}>
          {/* The section's title, set on the card (the real heading is in the gallery). */}
          <span className="hs-morph__title">
            Meet the
            <br />
            people behind
            <br />
            the work
          </span>
        </div>
        <canvas className="hs-morph__side hs-morph__side--back" ref={faceRef} />
      </div>
    </div>
  );
}
