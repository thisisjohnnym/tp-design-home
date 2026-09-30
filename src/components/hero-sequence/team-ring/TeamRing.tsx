"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent,
  type RefObject,
} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { teamRing, type TeamRingMaterial } from "../team-scene-tuning";
import type { TeamCardMember } from "./cardTexture";
import {
  RingScene,
  frontAngleFor,
  frontIndexFor,
  type IntroState,
  type MaterialFeel,
  type RingMotion,
  type RingSettings,
} from "./RingScene";

export type TeamRingProps = {
  members: readonly TeamCardMember[];
  material?: TeamRingMaterial;
  /** camera elevation in degrees — higher opens a bigger gap for the headline */
  tilt?: number;
  /** animate the tilt from `introFrom` to `tilt` as the section scrolls into view */
  scrollIntro?: boolean;
  /** camera tilt in degrees before the section is in view */
  introFrom?: number;
  /** camera roll in degrees */
  roll?: number;
  cardSize?: number;
  spacing?: number;
  /** auto-rotation in radians per second */
  autoSpeed?: number;
  direction?: "left" | "right";
  dragSensitivity?: number;
  blur?: number;
  depthFade?: number;
  flex?: number;
  /** camera drift toward the pointer; 0 turns it off */
  parallax?: number;
};

const feels: Record<TeamRingMaterial, MaterialFeel> = {
  fabric: { stiffness: 38, damping: 4.5, ripple: 1, gloss: 0.04 },
  plastic: { stiffness: 120, damping: 7, ripple: 0.3, gloss: 0.22 },
  paper: { stiffness: 240, damping: 24, ripple: 0.12, gloss: 0.02 },
};

/** Pointer travel (px) before a press turns into a drag. */
const DRAG_SLOP = 6;

/**
 * Scroll-into-view progress: 0 while the section's top is at the viewport's
 * bottom edge, 1 once it has scrolled (nearly) to the top. Read per frame so
 * it tracks ScrollSmoother's eased transform, not the raw scroll position.
 */
function IntroProbe({
  el,
  intro,
}: {
  el: RefObject<HTMLDivElement | null>;
  intro: RefObject<IntroState>;
}) {
  useFrame(() => {
    const node = el.current;
    if (!node) return;
    const vh = window.innerHeight || 1;
    const top = node.getBoundingClientRect().top;
    intro.current.progress = Math.min(1, Math.max(0, (vh - top) / (vh * 0.85)));
  });
  return null;
}

/**
 * Team cards on a WebGL ring: fabric-like cards, depth blur, a scroll-in camera
 * tilt. Drag or fling to spin; click a card to focus it, then drag to move
 * the focus between cards. Clicking Email / LinkedIn on the front card opens it. Never holds the page — vertical scrolling passes straight through.
 */
export function TeamRing({
  members,
  material = teamRing.material,
  tilt = teamRing.tilt,
  scrollIntro = teamRing.scrollIntro,
  introFrom = teamRing.introFrom,
  roll = teamRing.roll,
  cardSize = teamRing.cardSize,
  spacing = teamRing.spacing,
  autoSpeed = teamRing.autoSpeed,
  direction = teamRing.direction,
  dragSensitivity = teamRing.dragSensitivity,
  blur = teamRing.blur,
  depthFade = teamRing.depthFade,
  flex = teamRing.flex,
  parallax = teamRing.parallax,
}: TeamRingProps) {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [onScreen, setOnScreen] = useState(false);
  const wrapper = useRef<HTMLDivElement>(null);
  const dirSign = direction === "right" ? 1 : -1;
  const motion = useRef<RingMotion>({
    angle: 0,
    vel: dirSign * autoSpeed,
    dir: dirSign,
    dragging: false,
    focus: null,
    focusAngle: 0,
  });
  const press = useRef({
    id: -1,
    down: false,
    x0: 0,
    y0: 0,
    x: 0,
    t: 0,
    /** The drag started with a card focused: it scrubs between cards. */
    focusDrag: false,
  });
  const intro = useRef<IntroState>({ progress: 0 });

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  /* Stop rendering entirely while the section is off screen. */
  useEffect(() => {
    const el = wrapper.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setOnScreen(entry.isIntersecting),
      { rootMargin: "10% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    motion.current.dir = dirSign;
  }, [dirSign]);

  /* Focus: one card turned to the front and brought forward while the rest
     step back. The section gets [data-focused] so the headline can clear out. */
  const setFocus = useCallback(
    (index: number | null) => {
      const m = motion.current;
      if (m.focus === index) return;
      m.focus = index;
      if (index !== null) {
        m.focusAngle = frontAngleFor(index, members.length, m.angle);
      }
      wrapper.current
        ?.closest(".hs-team")
        ?.toggleAttribute("data-focused", index !== null);
    },
    [members.length],
  );
  const clearFocus = useCallback(() => setFocus(null), [setFocus]);

  /* Clicks outside the ring, Esc, or scrolling the section away all let go. */
  useEffect(() => {
    const onDocDown = (e: globalThis.PointerEvent) => {
      if (!wrapper.current?.contains(e.target as Node)) clearFocus();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") clearFocus();
    };
    document.addEventListener("pointerdown", onDocDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDocDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [clearFocus]);

  useEffect(() => {
    if (!onScreen) clearFocus();
  }, [onScreen, clearFocus]);

  const settings = useMemo<RingSettings>(
    () => ({
      members,
      fog: teamRing.fog,
      feel: feels[material],
      cardWidth: 1.9 * cardSize,
      spacing,
      tilt,
      introFrom,
      scrollIntro: scrollIntro && !reducedMotion,
      roll,
      autoSpeed: reducedMotion ? 0 : autoSpeed,
      blur,
      depthFade,
      flex: reducedMotion ? flex * 0.3 : flex,
      parallax: reducedMotion ? 0 : parallax,
      fitWidth: teamRing.fitWidth,
    }),
    [
      members,
      material,
      cardSize,
      spacing,
      tilt,
      introFrom,
      scrollIntro,
      roll,
      autoSpeed,
      reducedMotion,
      blur,
      depthFade,
      flex,
      parallax,
    ],
  );

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    press.current = {
      id: e.pointerId,
      down: true,
      x0: e.clientX,
      y0: e.clientY,
      x: e.clientX,
      t: performance.now(),
      focusDrag: false,
    };
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const p = press.current;
    const m = motion.current;
    if (!p.down || e.pointerId !== p.id) return;
    if (!m.dragging) {
      if (Math.hypot(e.clientX - p.x0, e.clientY - p.y0) < DRAG_SLOP) return;
      /* Capture only once it is a drag, so a plain click still reaches the
         canvas and lands on a card link. */
      m.dragging = true;
      e.currentTarget.setPointerCapture(e.pointerId);
      p.focusDrag = m.focus !== null;
    }
    const now = performance.now();
    const width = wrapper.current?.clientWidth ?? window.innerWidth;
    const dA =
      ((e.clientX - p.x) / width) * Math.PI * 1.1 * dragSensitivity;
    const dt = Math.max(8, now - p.t) / 1000;
    m.angle += dA;
    m.vel += (dA / dt - m.vel) * 0.5;
    p.x = e.clientX;
    p.t = now;
    // Focus follows whichever card is passing the front.
    if (p.focusDrag) m.focus = frontIndexFor(m.angle, members.length);
  };
  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    const p = press.current;
    const m = motion.current;
    if (e.pointerId !== p.id) return;
    p.down = false;
    if (!m.dragging) return;
    m.dragging = false;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    if (p.focusDrag) {
      // Settle on the card the drag (plus a little of its fling) lands on.
      const index = frontIndexFor(m.angle + m.vel * 0.25, members.length);
      m.focus = index;
      m.focusAngle = frontAngleFor(index, members.length, m.angle);
      return;
    }
    // A fling sets the new cruising direction.
    if (Math.abs(m.vel) > 0.3) m.dir = m.vel > 0 ? 1 : -1;
  };

  return (
    <div
      ref={wrapper}
      className="hs-team__stage"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <Canvas
        className="hs-team__canvas"
        dpr={[1, 2]}
        flat
        frameloop={onScreen ? "always" : "never"}
        gl={{ antialias: true, alpha: true }}
        camera={{ fov: 34, position: [0, 4, 12] }}
        onPointerMissed={clearFocus}
      >
        <IntroProbe el={wrapper} intro={intro} />
        <RingScene
          settings={settings}
          motion={motion}
          intro={intro}
          onSelect={setFocus}
        />
      </Canvas>
    </div>
  );
}
