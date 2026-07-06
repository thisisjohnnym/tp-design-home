"use client";

import { motion, useReducedMotion } from "framer-motion";

const orbs = [
  { size: "min(90vw, 720px)", x: "-10%", y: "-15%", color: "var(--accent)", opacity: 0.14, duration: 28 },
  { size: "min(70vw, 560px)", x: "55%", y: "10%", color: "var(--foreground)", opacity: 0.08, duration: 32 },
  { size: "min(50vw, 420px)", x: "20%", y: "55%", color: "var(--accent)", opacity: 0.1, duration: 24 },
] as const;

export function HeroMotionBackground() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-[var(--background)]" />
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-3xl will-change-transform"
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
            background: orb.color,
            opacity: orb.opacity,
          }}
          animate={
            reduceMotion
              ? undefined
              : {
                  x: [0, 40, -24, 0],
                  y: [0, -32, 20, 0],
                  scale: [1, 1.06, 0.96, 1],
                }
          }
          transition={
            reduceMotion
              ? undefined
              : {
                  duration: orb.duration,
                  repeat: Infinity,
                  ease: "easeInOut",
                }
          }
        />
      ))}
      <div className="hero-grain absolute inset-0 opacity-[0.35] mix-blend-multiply dark:opacity-[0.2] dark:mix-blend-soft-light" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--background)]" />
    </div>
  );
}
