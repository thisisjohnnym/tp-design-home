"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const INTRO_SESSION_KEY = "tapestry-intro-seen";
const LOADING_MS = 2200;
const EASE = [0.22, 1, 0.36, 1] as const;

type Phase = "loading" | "weAre" | "reveal" | "exit";

type IntroAnimationProps = {
  onComplete: () => void;
};

export function IntroAnimation({ onComplete }: IntroAnimationProps) {
  const reduceMotion = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("loading");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (reduceMotion || sessionStorage.getItem(INTRO_SESSION_KEY)) {
      onComplete();
      return;
    }
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [reduceMotion, onComplete]);

  useEffect(() => {
    if (reduceMotion || sessionStorage.getItem(INTRO_SESSION_KEY)) return;

    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const elapsed = now - start;
      const next = Math.min(100, Math.round((elapsed / LOADING_MS) * 100));
      setProgress(next);
      if (next < 100) {
        frame = requestAnimationFrame(tick);
      } else {
        window.setTimeout(() => setPhase("weAre"), 280);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reduceMotion]);

  useEffect(() => {
    if (reduceMotion) return;

    if (phase === "weAre") {
      const id = window.setTimeout(() => setPhase("reveal"), 1000);
      return () => clearTimeout(id);
    }
    if (phase === "reveal") {
      const id = window.setTimeout(() => setPhase("exit"), 1200);
      return () => clearTimeout(id);
    }
    if (phase === "exit") {
      sessionStorage.setItem(INTRO_SESSION_KEY, "1");
      const id = window.setTimeout(() => {
        document.body.style.overflow = "";
        onComplete();
      }, 750);
      return () => clearTimeout(id);
    }
  }, [phase, reduceMotion, onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-[var(--background)] text-[var(--foreground)]"
      initial={{ opacity: 1 }}
      animate={phase === "exit" ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 0.7, ease: EASE }}
      aria-hidden={phase === "exit"}
      role="presentation"
    >
      {/* Percentage loader — inspired by Hugeinc.com 0% intro */}
      <AnimatePresence mode="wait">
        {phase === "loading" ? (
          <motion.div
            key="loading"
            className="absolute left-[var(--grid-margin)] top-8 font-sans text-[clamp(3rem,12vw,7rem)] font-bold leading-none tracking-[-0.04em] md:top-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.35 } }}
          >
            {progress}
            <span className="text-[0.45em] align-top">%</span>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* We are + center line */}
      <AnimatePresence>
        {(phase === "weAre" || phase === "reveal") && (
          <motion.div
            key="we-are"
            className="relative z-20 flex items-center justify-center gap-6 md:gap-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === "weAre" ? 1 : 0 }}
            transition={{ duration: phase === "weAre" ? 0.5 : 0.35, ease: EASE }}
          >
            <span className="display-tight font-sans text-[clamp(2.5rem,10vw,5.5rem)] font-bold leading-none">
              We
            </span>
            <motion.div
              className="w-px shrink-0 bg-[var(--foreground)]"
              initial={{ height: 0 }}
              animate={{ height: phase === "weAre" ? "clamp(3rem, 14vh, 7rem)" : "clamp(3rem, 14vh, 7rem)" }}
              transition={{ duration: 0.65, ease: EASE }}
            />
            <span className="display-tight font-sans text-[clamp(2.5rem,10vw,5.5rem)] font-bold leading-none">
              are
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Title revealed as center line opens */}
      <motion.div
        className="relative z-10 px-[var(--grid-margin)] text-center"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{
          opacity: phase === "reveal" || phase === "exit" ? 1 : 0,
          scale: phase === "reveal" || phase === "exit" ? 1 : 0.98,
        }}
        transition={{ duration: 0.55, ease: EASE, delay: phase === "reveal" ? 0.15 : 0 }}
      >
        <h1 className="display-tight font-sans text-[clamp(2.25rem,9vw,5rem)] font-bold leading-[0.95] tracking-[-0.03em]">
          <span className="block">Tapestry</span>
          <span className="mt-1 block text-ink-700 dark:text-ink-200">Design Team</span>
        </h1>
      </motion.div>

      {/* Split curtains — line opens to reveal title */}
      <AnimatePresence>
        {phase === "reveal" || phase === "exit" ? (
          <>
            <motion.div
              key="curtain-left"
              className="absolute inset-y-0 left-0 z-30 w-1/2 bg-[var(--background)]"
              style={{ transformOrigin: "right center" }}
              initial={{ scaleX: 1, x: 0 }}
              animate={{ scaleX: 0, x: "-2%" }}
              transition={{ duration: 1.05, ease: EASE }}
            />
            <motion.div
              key="curtain-right"
              className="absolute inset-y-0 right-0 z-30 w-1/2 bg-[var(--background)]"
              style={{ transformOrigin: "left center" }}
              initial={{ scaleX: 1, x: 0 }}
              animate={{ scaleX: 0, x: "2%" }}
              transition={{ duration: 1.05, ease: EASE }}
            />
            <motion.div
              key="center-line"
              className="absolute inset-y-0 left-1/2 z-40 w-px -translate-x-1/2 bg-[var(--foreground)]"
              initial={{ scaleY: 1, opacity: 1 }}
              animate={{ scaleY: 0, opacity: 0 }}
              transition={{ duration: 1.05, ease: EASE }}
              style={{ transformOrigin: "center center" }}
            />
          </>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}
