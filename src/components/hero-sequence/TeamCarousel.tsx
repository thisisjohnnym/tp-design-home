"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { morphBridge } from "./morph-bridge";
import type { TeamCardMember } from "./team-card-face";

/**
 * Team carousel (Paper 1CY-0 / 1EQ-0): one glass member card at the centre,
 * giant first names behind it. Drag sideways and the card slides with the
 * pointer while it fades out and the next one fades in; the names behind move
 * more slowly, which is the parallax. Releasing snaps to a card.
 *
 * Plain DOM, no canvas: one position `p` (card index, fractional while
 * dragging) drives the cards and the names strip.
 */

/* Pointer travel (px) before a press turns into a drag. */
const DRAG_SLOP = 6;
/* How far from the centre (in cards) a card is still visible. */
const FADE_REACH = 0.65;
/* A card travels this share of the viewport width per step — the finger's pace. */
const STEP_VW = 0.9;
/* …and never less than this many times the average name pitch, so the names
   (which cover one pitch per step) always move slower than the card. */
const STEP_PITCH = 1.7;
/* The incoming card holds back this share of the fade, so it lands after the
   outgoing one has cleared. */
const STAGGER = 0.4;
/* Card turn at the far end of its fade, degrees, and the lens it turns under. */
const FLIP_DEG = 80;
const PERSPECTIVE = 1400;
/* Cards moved per card-step of finger travel: above 1, a short drag goes
   further than the finger. */
const DRAG_GAIN = 1.7;
/* How fast the strip catches up with the finger while dragging (1/s). */
const FOLLOW_RATE = 26;
/* Fling look-ahead, seconds of release velocity: how far momentum carries. */
const FLING = 0.38;
/* Most cards one fling may skip past, and the fastest it may be thrown (cards/s). */
const FLING_MAX = 5;
const VEL_MAX = 9;
/* The settle spring, critically damped, and held from passing its card. */
const SPRING_K = 55;
const SPRING_DAMP = 1;
/* Sideways wheel / trackpad swipes move the strip too; this much idle snaps it. */
const WHEEL_GAIN = 1.2;
const WHEEL_IDLE_MS = 140;
/* …but not within this long of the page being scrolled vertically. */
const WHEEL_VERTICAL_MS = 300;
/* Elastic stretch, scrubbed by the drag: the further the strip has been pulled
   from where the drag began, the more each name is pushed away from the middle
   one (px per slot of distance, per card pulled), so the leading names run ahead
   and the others trail. After release the stretch eases back to nothing. */
const STRETCH_PX = 110;
/* Stretch per card pulled, its cap, and how fast it normalizes after release (1/s). */
const STRETCH_PER_CARD = 2;
const STRETCH_MAX = 1.5;
const STRETCH_RELEASE = 6;
/* Page-scroll lag, seconds of scroll velocity the card layer trails by. The
   words don't lag vertically — they scroll with the page and only trail the
   card sideways, when dragged. Capped as a share of the viewport height. */
const LAG_CARD = 0.12;
const LAG_MAX = 0.22;
/* How quickly the lag follows changes in scroll speed (1/s). */
const LAG_RATE = 14;
/* Magnetic hover: over the section the card leans toward the pointer and the
   words (further back) lean the same way, less, for depth. px at the
   section's edge. It eases back to nothing on leaving, while the page scrolls,
   and whenever the traveler is standing in for the card. */
const MAG_CARD = { x: 24, y: 18 };
const MAG_NAMES = { x: 9, y: 6 };
/* The dotted line (Paper 2IN-0: 5px dashes, 66.8px apart) rides the names'
   travel at this share, so it trails them for depth. It is a repeating
   pattern, so its offset wraps at one dash pitch. */
const DOT_PITCH = 66.8;
const DOT_PARALLAX = 0.35;
/* A critically damped spring (no overshoot) so it starts and stops softly;
   ω in 1/s — 4.5 takes roughly 800ms to come to rest. */
const MAG_OMEGA = 4.5;
/* Page scroll faster than this (px/s) counts as scrolling. */
const MAG_SCROLL_QUIET = 40;
/* Names are laid out three times over so the strip wraps with neighbours on
   both sides. The middle copy is the real one. */
const COPIES = 3;

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const smooth = (t: number) => t * t * (3 - 2 * t);
/* Sine in-out, the traveler's easing, so the names ride its flight. */
const ease = (t: number) => 0.5 - 0.5 * Math.cos(Math.PI * t);
const mod = (x: number, n: number) => ((x % n) + n) % n;

export function TeamCarousel({
  members,
}: {
  members: readonly TeamCardMember[];
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const namesRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<HTMLDivElement>(null);
  const lagRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const stage = stageRef.current;
    const names = namesRef.current;
    const dots = dotsRef.current;
    const lag = lagRef.current;
    const cards = cardRefs.current;
    const count = members.length;
    if (!stage || !names || !dots || !lag || count === 0) return;

    const root = document.documentElement;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    /* p: current position in cards. target: where it settles. index: the
       member at the centre, and the one the traveler lands on. */
    const s = {
      p: 0,
      target: 0,
      vel: 0,
      index: 0,
      dragging: false,
      pressed: false,
      pointerId: -1,
      x0: 0,
      y0: 0,
      x: 0,
      t: 0,
      step: 1,
      traveling: false,
      /* Where the finger says p should be while dragging; p follows it. */
      pt: 0,
      /* Settle velocity, cards/s. */
      v: 0,
      wheelAt: 0,
      /* How far the drag pulled the strip, as the names' stretch, and where it began. */
      stretch: 0,
      dragFrom: 0,
      /* Magnetic hover: pointer position in the stage (-1…1), whether it is
         over it, and the eased lean. */
      hx: 0,
      hy: 0,
      hover: false,
      mx: 0,
      my: 0,
      mvx: 0,
      mvy: 0,
      /* Scroll-lag offset (px) of the card layer. */
      offC: 0,
      scrollV: 0,
      top: NaN,
      /* +1 while p is rising (cards arrive from the right), -1 falling. */
      dir: 1,
    };
    let centers: number[] = [];
    let applied = { p: NaN, stretch: NaN, traveling: false };

    /* Name centres along the strip, and the card step they imply. */
    const measure = () => {
      centers = Array.from(names.children, (el) => {
        const span = el as HTMLElement;
        return span.offsetLeft + span.offsetWidth / 2;
      });
      const pitch = (centers[count * 2] - centers[count]) / count;
      s.step = Math.max(window.innerWidth * STEP_VW, pitch * STEP_PITCH);
      applied = { p: NaN, stretch: NaN, traveling: false };
    };

    /* Name strip position for p: linear between neighbouring centres, so a
       whole card step always lands the next name dead centre. */
    const nameCenter = (pw: number) => {
      const t = pw + count;
      const i = Math.floor(t);
      const f = t - i;
      return centers[i] + (centers[i + 1] - centers[i]) * f;
    };

    const render = () => {
      const pw = mod(s.p, count);
      /* Stretched names: slots from the centre times the stretch. */
      const amp = s.stretch * STRETCH_PX;
      const t = pw + count;
      for (let i = 0; i < names.children.length; i += 1) {
        const r = Math.max(-3, Math.min(3, i - t));
        (names.children[i] as HTMLElement).style.transform =
          amp > 0.05 ? `translate3d(${r * amp}px, 0, 0)` : "";
      }
      const standIn =
        morphBridge.active && morphBridge.landed && !morphBridge.handoff;
      if (Math.abs(s.p - applied.p) > 1e-4) s.dir = s.p > applied.p ? 1 : -1;
      if (centers.length) {
        names.style.transform = `translate3d(${
          -nameCenter(pw) + s.mx * MAG_NAMES.x
        }px, ${s.my * MAG_NAMES.y}px, 0)`;
        dots.style.transform = `translate3d(${mod(
          -nameCenter(pw) * DOT_PARALLAX + s.mx * MAG_NAMES.x * 0.5,
          DOT_PITCH,
        )}px, 0, 0)`;
      }
      for (let i = 0; i < count; i += 1) {
        const card = cards[i];
        if (!card) continue;
        let d = i - pw;
        if (d > count / 2) d -= count;
        else if (d < -count / 2) d += count;
        /* Coming toward the centre: held back by STAGGER. Leaving: straight away. */
        const near = clamp01(1 - Math.abs(d) / FADE_REACH);
        const incoming = d * s.dir > 0;
        const o = smooth(
          incoming ? clamp01((near - STAGGER) / (1 - STAGGER)) : near,
        );
        /* Faces the side it is leaving toward (or arriving from). */
        const turn = Math.sign(d) * (1 - o) * FLIP_DEG;
        if (standIn && i === morphBridge.index) {
          /* The traveler is this card for now: it follows `out`, and the
             cards take over once it has faded out of sight. */
          morphBridge.out.x = d * s.step;
          morphBridge.out.turn = turn;
          morphBridge.out.o = o;
          card.style.visibility = "hidden";
          if (o <= 0.002) morphBridge.handoff = true;
          continue;
        }
        card.style.visibility = o > 0.002 ? "visible" : "hidden";
        card.style.opacity = String(o);
        card.style.pointerEvents = o > 0.7 ? "auto" : "none";
        card.style.transform = `perspective(${PERSPECTIVE}px) translate3d(${d * s.step}px, 0, 0) rotateY(${turn}deg)`;
      }
    };

    const tick = (_time: number, deltaMs: number) => {
      const dt = Math.min(deltaMs, 50) / 1000;
      /* Flying in: the strip is scripted and the carousel can't be touched. */
      const flying = morphBridge.active && !morphBridge.landed;

      if (flying) {
        /* Back to the member the traveler shows, if the cards hadn't taken over. */
        if (!morphBridge.handoff) s.index = morphBridge.index;
        /* The traveler is still in flight: the strip rolls one name in from
           the right with it, ending on the card it lands on. */
        s.dragging = false;
        s.pressed = false;
        s.vel = 0;
        s.v = 0;
        s.p = s.index - (1 - ease(morphBridge.progress));
        s.target = s.index;
      } else {
        if (s.dragging) {
          /* Ease toward the finger rather than hard-follow it. */
          s.p += (s.pt - s.p) * (1 - Math.exp(-dt * FOLLOW_RATE));
        } else {
          if (s.wheelAt && performance.now() - s.wheelAt > WHEEL_IDLE_MS) {
            s.wheelAt = 0;
            s.target = Math.round(s.target);
          }
          /* Spring to the target; a fling's velocity carries on through it. */
          const diff = s.target - s.p;
          if (Math.abs(diff) < 0.0005 && Math.abs(s.v) < 0.002) {
            s.p = s.target;
            s.v = 0;
          } else {
            const damping = 2 * Math.sqrt(SPRING_K) * SPRING_DAMP;
            s.v += (SPRING_K * diff - damping * s.v) * dt;
            s.p += s.v * dt;
            /* Never carry past the card. */
            if (diff * (s.target - s.p) < 0) {
              s.p = s.target;
              s.v = 0;
            }
          }
        }
        s.index = mod(Math.round(s.p), count);
        /* The traveler keeps its member until the cards take over. */
        if (!morphBridge.active || morphBridge.handoff) {
          morphBridge.index = s.index;
        }
      }

      /* Elastic stretch: scrubbed while dragging, eased out after release. */
      if (flying) s.stretch = 0;
      else if (s.dragging) {
        s.stretch = Math.min(
          STRETCH_MAX,
          Math.abs(s.p - s.dragFrom) * STRETCH_PER_CARD,
        );
      } else s.stretch *= Math.exp(-dt * STRETCH_RELEASE);
      if (s.stretch < 0.003) s.stretch = 0;

      /* Scroll lag: the layers trail the page's own movement, then catch up.
         Off while the traveler flies in, so it lands on a still slot. */
      const top = stage.getBoundingClientRect().top;
      if (!Number.isNaN(s.top) && dt > 0) {
        const v = (top - s.top) / dt;
        s.scrollV += (v - s.scrollV) * (1 - Math.exp(-dt * LAG_RATE));
      }
      s.top = top;
      const cap = window.innerHeight * LAG_MAX;
      /* Exactly still while the traveler flies in or stands in for the card, so
         it sits dead on its slot; once the cards take over the lag eases in. */
      const standingIn =
        morphBridge.active && morphBridge.landed && !morphBridge.handoff;
      const on = !flying && !standingIn && !reduceMotion.matches;
      const follow = 1 - Math.exp(-dt * LAG_RATE);
      const lagTo = (current: number, gain: number) =>
        on
          ? current +
            (Math.max(-cap, Math.min(cap, -s.scrollV * gain)) - current) *
              follow
          : 0;
      const offC = lagTo(s.offC, LAG_CARD);
      const lagged = Math.abs(offC - s.offC) > 0.01;
      /* Magnetic lean: toward the pointer while it hovers and the page is
         still; otherwise it drains away. Exactly 0 around the traveler. */
      const leaning = s.hover && on && Math.abs(s.scrollV) < MAG_SCROLL_QUIET;
      /* Spring each axis toward the pointer (or toward rest). */
      const spring = (x: number, v: number, to: number) => {
        const a = MAG_OMEGA * MAG_OMEGA * (to - x) - 2 * MAG_OMEGA * v;
        const nv = v + a * dt;
        return [x + nv * dt, nv] as const;
      };
      const [mx, mvx] = on ? spring(s.mx, s.mvx, leaning ? s.hx : 0) : [0, 0];
      const [my, mvy] = on ? spring(s.my, s.mvy, leaning ? s.hy : 0) : [0, 0];
      s.mvx = mvx;
      s.mvy = mvy;
      const leaned =
        Math.abs(mx - s.mx) > 0.0002 || Math.abs(my - s.my) > 0.0002;
      s.mx = mx;
      s.my = my;
      if (lagged || leaned) {
        s.offC = offC;
        lag.style.transform = `translate3d(${s.mx * MAG_CARD.x}px, ${
          offC + s.my * MAG_CARD.y
        }px, 0)`;
      }

      if (flying !== applied.traveling) {
        stage.toggleAttribute("data-flying", flying);
      }
      if (
        s.p !== applied.p ||
        s.stretch !== applied.stretch ||
        leaned ||
        flying !== applied.traveling ||
        standingIn ||
        lagged
      ) {
        render();
      }
      applied = { p: s.p, stretch: s.stretch, traveling: flying };
    };

    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      if (morphBridge.active && !morphBridge.landed) return;
      s.pressed = true;
      s.pt = s.p;
      s.pointerId = e.pointerId;
      s.x0 = s.x = e.clientX;
      s.y0 = e.clientY;
      s.t = performance.now();
    };
    const onMove = (e: PointerEvent) => {
      if (!s.pressed || e.pointerId !== s.pointerId) return;
      if (!s.dragging) {
        const dx = Math.abs(e.clientX - s.x0);
        const dy = Math.abs(e.clientY - s.y0);
        if (Math.max(dx, dy) < DRAG_SLOP) return;
        /* A mostly vertical move is the page scrolling, not a drag: let go so
           we never hold the press (or capture the pointer) against it. */
        if (dy > dx) {
          s.pressed = false;
          return;
        }
        /* Capture only once it is a drag, so a plain click still reaches the
           card's links. */
        s.dragging = true;
        stage.setAttribute("data-dragged", "");
        s.pt = s.p;
        s.dragFrom = s.p;
        s.v = 0;
        s.wheelAt = 0;
        stage.setPointerCapture(e.pointerId);
        stage.toggleAttribute("data-dragging", true);
      }
      const now = performance.now();
      const dp = (-(e.clientX - s.x) / s.step) * DRAG_GAIN;
      const dt = Math.max(8, now - s.t) / 1000;
      s.pt += dp;
      s.vel += (dp / dt - s.vel) * 0.5;
      s.x = e.clientX;
      s.t = now;
    };
    const onUp = (e: PointerEvent) => {
      if (e.pointerId !== s.pointerId) return;
      const wasPressed = s.pressed;
      s.pressed = false;
      if (!s.dragging) {
        if (wasPressed && e.type === "pointerup") clickName(e);
        return;
      }
      s.dragging = false;
      stage.toggleAttribute("data-dragging", false);
      if (stage.hasPointerCapture(e.pointerId)) {
        stage.releasePointerCapture(e.pointerId);
      }
      const from = Math.round(s.p);
      const v = Math.max(-VEL_MAX, Math.min(VEL_MAX, s.vel));
      const to = Math.round(s.p + v * FLING);
      s.target = Math.min(from + FLING_MAX, Math.max(from - FLING_MAX, to));
      /* Keep the throw's speed: the spring takes it from here. */
      s.v = v;
      s.vel = 0;
    };

    /* A tap on a name (not a link) brings that name to the centre. */
    const clickName = (e: PointerEvent) => {
      if ((e.target as Element).closest("a")) return;
      const here = mod(s.p, count) + count;
      const spans = Array.from(names.children);
      const hit = spans.findIndex((el) => {
        const r = el.getBoundingClientRect();
        return (
          e.clientX >= r.left &&
          e.clientX <= r.right &&
          e.clientY >= r.top &&
          e.clientY <= r.bottom
        );
      });
      if (hit < 0) return;
      s.target = Math.round(s.p) + (hit - Math.round(here));
      s.v = 0;
    };

    let lastVertical = 0;
    const onWheel = (e: WheelEvent) => {
      if (morphBridge.active && !morphBridge.landed) return;
      /* Vertical scrolling must never be touched: a trackpad's tail end often
         carries a stray sideways delta. Only a clearly horizontal swipe, with
         no vertical scrolling in the last moment, moves the strip. */
      const now = performance.now();
      if (Math.abs(e.deltaX) < Math.abs(e.deltaY) * 2) {
        lastVertical = now;
        return;
      }
      if (now - lastVertical < WHEEL_VERTICAL_MS) return;
      s.target += (e.deltaX / s.step) * WHEEL_GAIN;
      s.wheelAt = performance.now();
    };

    /* The yellow pointer dot grows into a "Drag" pill over the stage, and
       goes back to a dot over the card's links (PointerEffect.tsx). */
    const hint = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const overLink = (e.target as Element).closest("a") !== null;
      root.classList.toggle("hs-drag-hint", !overLink);
    };
    const unhint = () => root.classList.remove("hs-drag-hint");

    /* Pointer position inside the stage, for the magnetic lean. */
    const lean = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const r = stage.getBoundingClientRect();
      s.hx = Math.max(
        -1,
        Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1),
      );
      s.hy = Math.max(
        -1,
        Math.min(1, ((e.clientY - r.top) / r.height) * 2 - 1),
      );
      s.hover = true;
    };
    const unlean = () => {
      s.hover = false;
    };

    stage.addEventListener("pointerdown", onDown);
    stage.addEventListener("pointermove", onMove);
    stage.addEventListener("pointerup", onUp);
    stage.addEventListener("pointercancel", onUp);
    stage.addEventListener("lostpointercapture", onUp);
    stage.addEventListener("wheel", onWheel, { passive: true });
    stage.addEventListener("pointermove", lean);
    stage.addEventListener("pointerover", hint);
    stage.addEventListener("pointerleave", unhint);
    stage.addEventListener("pointerleave", unlean);

    measure();
    render();
    const resize = new ResizeObserver(measure);
    resize.observe(stage);
    document.fonts.ready.then(measure).catch(() => {});

    /* Only run while the section is near the viewport. The margin is a full
       viewport below so the traveler's flight is covered. */
    let running = false;
    const watch = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting === running) return;
        running = entry.isIntersecting;
        if (running) gsap.ticker.add(tick);
        else gsap.ticker.remove(tick);
      },
      { rootMargin: "100% 0px" },
    );
    watch.observe(stage);

    /* Reduced motion keeps the drag but drops the settle glide. */
    if (reduceMotion.matches) s.p = s.target = 0;

    return () => {
      watch.disconnect();
      gsap.ticker.remove(tick);
      resize.disconnect();
      stage.removeEventListener("pointerdown", onDown);
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerup", onUp);
      stage.removeEventListener("pointercancel", onUp);
      stage.removeEventListener("lostpointercapture", onUp);
      stage.removeEventListener("wheel", onWheel);
      stage.removeEventListener("pointermove", lean);
      stage.removeEventListener("pointerover", hint);
      stage.removeEventListener("pointerleave", unlean);
      stage.removeEventListener("pointerleave", unhint);
      unhint();
      stage.removeAttribute("data-flying");
      stage.removeAttribute("data-dragging");
      stage.removeAttribute("data-dragged");
    };
  }, [members]);

  return (
    <div className="hs-team__stage" ref={stageRef}>
      {/* Decorative: the roster below is the accessible version. */}
      <div className="hs-team__names" ref={namesRef} aria-hidden="true">
        {Array.from({ length: COPIES }, (_, copy) =>
          members.map((member) => (
            <span className="hs-team__name" key={`${copy}-${member.id}`}>
              {member.given}
            </span>
          )),
        )}
      </div>

      {/* Dotted line through the names: a drag hint that trails them. */}
      <div className="hs-team__dots" ref={dotsRef} aria-hidden="true" />

      <div className="hs-team__lag" ref={lagRef}>
        <div className="hs-team__cards" aria-hidden="true">
          {members.map((member, i) => (
            <article
              className="hs-team__card"
              key={member.id}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
            >
              <div className="hs-team__portrait">
                {/* eslint-disable-next-line @next/next/no-img-element -- remote stand-in photos, sized by the card */}
                <img
                  alt=""
                  className="hs-team__photo"
                  decoding="async"
                  draggable={false}
                  loading="lazy"
                  src={member.portrait}
                />
                <div className="hs-team__meta">
                  <span>{member.role}</span>
                  <span>{member.roleAside}</span>
                </div>
                <p className="hs-team__given">{member.given}—</p>
                <p className="hs-team__family">{member.family}</p>
                <div className="hs-team__links">
                  <a href={`mailto:${member.email}`} tabIndex={-1}>
                    Email
                  </a>
                  <a
                    href={member.linkedin}
                    rel="noreferrer"
                    tabIndex={-1}
                    target="_blank"
                  >
                    LinkedIn
                  </a>
                  <span>{member.place}</span>
                </div>
              </div>
              <p className="hs-team__bio">{member.bio}</p>
            </article>
          ))}
        </div>

        {/* Where the traveler lands; same box as a card at rest. */}
        <div className="hs-team__slot" aria-hidden="true" />
      </div>

      <p className="hs-team__hint" aria-hidden="true">
        Drag left or right
      </p>
    </div>
  );
}
