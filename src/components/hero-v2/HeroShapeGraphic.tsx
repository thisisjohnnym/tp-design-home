"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  heroTranslationMotion,
  type HeroTranslationPhase,
} from "@/content/heroTranslationV2";

type HeroShapeGraphicProps = {
  shapeSrc: string;
  shapeRotation: number;
  phase: HeroTranslationPhase;
};

export function HeroShapeGraphic({ shapeSrc, shapeRotation, phase }: HeroShapeGraphicProps) {
  const reduceMotion = useReducedMotion();
  const { shapeSpinDegrees, shapeEnterScale, shapeExitScale, easing } = heroTranslationMotion;

  const isIntro = phase === "intro";
  const isHold = phase === "hold";
  const isShapeExit = phase === "shapeExit";
  const isVisible = isIntro || isHold || isShapeExit;

  if (reduceMotion) {
    if (!isVisible) return null;

    return (
      <div
        className="hero-v2__shape hero-v2__shape--resting"
        style={{ transform: `rotate(${shapeRotation}deg)` }}
        aria-hidden
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={shapeSrc} alt="" className="hero-v2__shape-image" />
      </div>
    );
  }

  if (!isVisible) return null;

  if (isIntro || isHold) {
    return (
      <motion.div
        key={`${shapeSrc}-active`}
        className="hero-v2__shape hero-v2__shape--resting"
        aria-hidden
        initial={
          isIntro
            ? {
                rotate: shapeRotation + shapeSpinDegrees,
                scale: shapeEnterScale,
              }
            : false
        }
        animate={{
          rotate: shapeRotation,
          scale: 1,
        }}
        transition={
          isIntro
            ? {
                delay: heroTranslationMotion.shapeEnterDelayMs / 1000,
                duration: heroTranslationMotion.shapeEnterDurationMs / 1000,
                ease: easing,
              }
            : { duration: 0 }
        }
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={shapeSrc} alt="" className="hero-v2__shape-image" />
      </motion.div>
    );
  }

  if (isShapeExit) {
    return (
      <motion.div
        className="hero-v2__shape hero-v2__shape--resting"
        aria-hidden
        initial={{
          rotate: shapeRotation,
          scale: 1,
        }}
        animate={{
          rotate: shapeRotation,
          scale: shapeExitScale,
        }}
        transition={{
          duration: heroTranslationMotion.shapeExitDurationMs / 1000,
          ease: easing,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={shapeSrc} alt="" className="hero-v2__shape-image" />
      </motion.div>
    );
  }

  return null;
}
