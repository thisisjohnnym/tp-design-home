"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  HERO_V3_HI_ASPECT,
  HERO_V3_HI_SCALE_END,
  HERO_V3_HI_START_WIDTH_VW,
  HERO_V3_INTRO_ASSETS,
  HERO_V3_INTRO_COLORS,
  HERO_V3_INTRO_EASE,
  HERO_V3_WE_ARE_ASPECT,
  HERO_V3_WE_ARE_LOGO_WIDTH_VW,
  HERO_V3_WE_ARE_SCALE_FILL,
  heroV3IntroTransitions,
  type HeroV3IntroPhase,
} from "@/content/heroIntroV3";

type HeroIntroSequenceProps = {
  onComplete: () => void;
  onExitStart?: () => void;
};

function bgForPhase(phase: HeroV3IntroPhase): string {
  if (phase === "hi") return HERO_V3_INTRO_COLORS.yellow;
  if (phase === "hi-we-are") return HERO_V3_INTRO_COLORS.black;
  return HERO_V3_INTRO_COLORS.white;
}

export function HeroIntroSequence({ onComplete, onExitStart }: HeroIntroSequenceProps) {
  const reduceMotion = useReducedMotion();
  const [phase, setPhase] = useState<HeroV3IntroPhase>("hi");
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const exitStartedRef = useRef(false);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  const schedule = useCallback((fn: () => void, ms: number) => {
    const id = setTimeout(fn, ms);
    timersRef.current.push(id);
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      onComplete();
      return;
    }
    return clearTimers;
  }, [reduceMotion, onComplete, clearTimers]);

  useEffect(() => {
    if (reduceMotion || phase === "done") return;

    clearTimers();

    if (phase === "hi") {
      schedule(() => setPhase("hi-we-are"), heroV3IntroTransitions.hiHold.delay * 1000);
      return;
    }

    if (phase === "team-lines") {
      const ms =
        (heroV3IntroTransitions.weAreToTeam.duration +
          heroV3IntroTransitions.teamLinesHold.delay) *
        1000;
      schedule(() => setPhase("team-tapestry"), ms);
      return;
    }

    if (phase === "team-tapestry") {
      schedule(() => setPhase("exit"), heroV3IntroTransitions.tapestryHold.delay * 1000);
      return;
    }

    if (phase === "exit") {
      if (!exitStartedRef.current) {
        exitStartedRef.current = true;
        onExitStart?.();
      }
      schedule(() => {
        setPhase("done");
        onComplete();
      }, heroV3IntroTransitions.exit.duration * 1000);
    }
  }, [phase, reduceMotion, onComplete, onExitStart, schedule, clearTimers]);

  const handleHiWeAreComplete = useCallback(() => {
    schedule(() => setPhase("team-lines"), heroV3IntroTransitions.weAreHold.delay * 1000);
  }, [schedule]);

  if (reduceMotion || phase === "done") {
    return null;
  }

  const showHi = phase === "hi" || phase === "hi-we-are";
  const showWeAre =
    phase === "hi-we-are" || phase === "team-lines" || phase === "team-tapestry";
  const showWhiteFrame = phase === "team-lines" || phase === "team-tapestry";
  const showTapestry = phase === "team-tapestry";

  const hiScale = phase === "hi" ? 1 : HERO_V3_HI_SCALE_END;
  const weAreScale =
    phase === "hi-we-are"
      ? 1
      : phase === "team-lines" || phase === "team-tapestry"
        ? HERO_V3_WE_ARE_SCALE_FILL
        : 1;
  const weAreCentered = phase === "hi-we-are";

  return (
    <motion.div
      className="fixed inset-0 z-[60] h-[100svh] min-h-[100dvh] w-full overflow-hidden"
      initial={{ opacity: 1 }}
      animate={{ opacity: phase === "exit" ? 0 : 1 }}
      transition={{ duration: heroV3IntroTransitions.exit.duration, ease: HERO_V3_INTRO_EASE }}
      aria-hidden
      role="presentation"
    >
      <motion.div
        className="absolute inset-0"
        animate={{ backgroundColor: bgForPhase(phase) }}
        transition={{
          duration:
            phase === "hi-we-are"
              ? heroV3IntroTransitions.hiToWeAre.duration
              : phase === "team-lines"
                ? heroV3IntroTransitions.weAreToTeam.duration
                : 0.35,
          ease: HERO_V3_INTRO_EASE,
        }}
      />

      {showHi && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
          <motion.div
            className="relative"
            style={{
              width: `${HERO_V3_HI_START_WIDTH_VW}vw`,
              aspectRatio: String(HERO_V3_HI_ASPECT),
              transformOrigin: "center center",
            }}
            initial={{ scale: 1, opacity: 1 }}
            animate={{ scale: hiScale, opacity: 1 }}
            transition={{
              duration:
                phase === "hi-we-are"
                  ? heroV3IntroTransitions.hiToWeAre.duration
                  : heroV3IntroTransitions.weAreToTeam.duration,
              ease: HERO_V3_INTRO_EASE,
            }}
            onAnimationComplete={() => {
              if (phase === "hi-we-are") handleHiWeAreComplete();
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={HERO_V3_INTRO_ASSETS.hi} alt="" className="size-full object-contain" />
          </motion.div>
        </div>
      )}

      {showWeAre && (
        <div
          className={
            weAreCentered
              ? "pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden"
              : "pointer-events-none absolute inset-0 overflow-hidden"
          }
        >
          <motion.div
            className={weAreCentered ? "relative" : "absolute left-1/2 top-0 -translate-x-1/2"}
            style={{
              width: `${HERO_V3_WE_ARE_LOGO_WIDTH_VW}vw`,
              aspectRatio: String(HERO_V3_WE_ARE_ASPECT),
              transformOrigin: weAreCentered ? "center center" : "top center",
            }}
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: weAreScale, opacity: 1 }}
            transition={{
              duration:
                phase === "hi-we-are"
                  ? heroV3IntroTransitions.hiToWeAre.duration * 0.65
                  : heroV3IntroTransitions.weAreToTeam.duration,
              ease: HERO_V3_INTRO_EASE,
              delay: phase === "hi-we-are" ? heroV3IntroTransitions.hiToWeAre.duration * 0.25 : 0,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={HERO_V3_INTRO_ASSETS.weAre} alt="" className="size-full object-contain" />
          </motion.div>
        </div>
      )}

      {showWhiteFrame && (
        <div className="pointer-events-none absolute inset-0">
          <motion.div
            className="absolute left-[var(--grid-margin)] top-[calc(50%-315px)] font-sans text-[clamp(3rem,14.6vw,13.125rem)] font-bold leading-[0.92] tracking-[-0.02em] text-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: heroV3IntroTransitions.weAreToTeam.duration * 0.5,
              ease: HERO_V3_INTRO_EASE,
              delay: heroV3IntroTransitions.weAreToTeam.duration * 0.35,
            }}
          >
            THE
            <br />
            DESIGN
            <br />
            <span className="inline-flex items-center gap-16">
              <span>TEAM</span>
              <motion.span
                className="inline-flex h-[54px] w-[246px] shrink-0 items-center justify-center overflow-hidden bg-[#ffcb00] [font-size:0]"
                initial={{ opacity: 0, y: 8 }}
                animate={{
                  opacity: showTapestry ? 1 : 0,
                  y: showTapestry ? 0 : 8,
                }}
                transition={{
                  duration: heroV3IntroTransitions.teamToTapestry.duration,
                  ease: HERO_V3_INTRO_EASE,
                }}
                aria-hidden
              >
                <span className="font-sans text-[clamp(1.125rem,1.75vw,1.5rem)] font-bold leading-none tracking-[0.02em] text-black">
                  @ TAPESTRY
                </span>
              </motion.span>
            </span>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
