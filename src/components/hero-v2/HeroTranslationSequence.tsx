"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import {
  getBackgroundForPhase,
  getNextStepIndex,
  getPhaseDurationMs,
  HERO_TRANSLATION_STEPS,
  heroTranslationMotion,
  type HeroTranslationPhase,
} from "@/content/heroTranslationV2";
import { HeroShapeGraphic } from "./HeroShapeGraphic";
import { HeroTranslationTitle } from "./HeroTranslationTitle";

function getNextPhase(phase: HeroTranslationPhase): HeroTranslationPhase {
  switch (phase) {
    case "intro":
      return "hold";
    case "hold":
      return "shapeExit";
    case "shapeExit":
      return "bgTransition";
    case "bgTransition":
      return "intro";
    default:
      return "intro";
  }
}

export function HeroTranslationSequence() {
  const reduceMotion = useReducedMotion();
  const [stepIndex, setStepIndex] = useState(0);
  const [phase, setPhase] = useState<HeroTranslationPhase>("intro");

  const step = HERO_TRANSLATION_STEPS[stepIndex]!;
  const background = getBackgroundForPhase(stepIndex);
  const isBgTransition = phase === "bgTransition";

  useEffect(() => {
    document.documentElement.style.setProperty("--hero-v2-bg", background);
    document.documentElement.style.backgroundColor = background;

    return () => {
      document.documentElement.style.removeProperty("--hero-v2-bg");
      document.documentElement.style.removeProperty("background-color");
    };
  }, [background]);

  const advancePhase = useCallback(() => {
    setPhase((current) => {
      const next = getNextPhase(current);
      if (next === "bgTransition") {
        setStepIndex((index) => getNextStepIndex(index));
      }
      return next;
    });
  }, []);

  useEffect(() => {
    if (reduceMotion) return;

    const duration = getPhaseDurationMs(phase, step.word);
    const timer = window.setTimeout(advancePhase, duration);
    return () => window.clearTimeout(timer);
  }, [phase, step.word, advancePhase, reduceMotion]);

  useEffect(() => {
    if (reduceMotion === true) {
      setPhase("hold");
      setStepIndex(0);
    }
  }, [reduceMotion]);

  const displayPhase = reduceMotion ? "hold" : phase;
  const displayStepIndex = reduceMotion ? 0 : stepIndex;
  const displayStep = HERO_TRANSLATION_STEPS[displayStepIndex]!;
  const displayBackground = reduceMotion ? displayStep.background : background;

  return (
    <>
      <motion.div
        className="hero-v2__backdrop"
        aria-hidden
        animate={{ backgroundColor: displayBackground }}
        transition={{
          duration: reduceMotion
            ? 0
            : isBgTransition
              ? heroTranslationMotion.bgTransitionDurationMs / 1000
              : 0,
          ease: heroTranslationMotion.easing,
        }}
      />
      <section
        className="hero-v2"
        style={{ minHeight: "calc(100dvh - var(--site-header-height, 4.75rem))" }}
        aria-label="Introduction"
      >
        <div className="hero-v2__stage">
          <HeroShapeGraphic
            key={`shape-${displayStepIndex}`}
            shapeSrc={displayStep.shapeSrc}
            shapeRotation={displayStep.shapeRotation}
            phase={displayPhase}
          />
          <HeroTranslationTitle
            key={`title-${displayStepIndex}`}
            word={displayStep.word}
            phase={displayPhase}
          />
        </div>
      </section>
    </>
  );
}
