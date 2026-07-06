"use client";

import { motion, useReducedMotion } from "framer-motion";

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.12 },
  },
};

const item = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const line = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const },
  },
};

type HeroTypographyProps = {
  line1: string;
  line2: string;
  tagline: string;
  body: readonly string[];
};

export function HeroTypography({ line1, line2, tagline, body }: HeroTypographyProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="relative z-10"
      variants={container}
      initial={reduceMotion ? false : "hidden"}
      animate={reduceMotion ? false : "show"}
    >
      <div>
        <motion.h1 variants={line} className="display-tight font-coach font-bold leading-[0.92]">
          <span className="block text-[clamp(3.5rem,14vw,10rem)] tracking-[-0.04em]">
            {line1}
          </span>
          <span className="mt-1 block text-[clamp(3rem,11vw,8rem)] tracking-[-0.035em] text-ink-700 dark:text-ink-200">
            {line2}
            <span className="text-ink-400 dark:text-ink-500">.</span>
          </span>
        </motion.h1>
      </div>

      <motion.p
        variants={item}
        className="mt-8 font-coach text-display-md font-bold text-ink-500 dark:text-ink-400 md:mt-12"
      >
        {tagline}
      </motion.p>

      <motion.div variants={item} className="mt-8 space-y-4 md:mt-10">
        {body.map((paragraph) => (
          <p
            key={paragraph}
            className="max-w-prose font-coachtopia text-body-lg text-ink-600 dark:text-ink-300"
          >
            {paragraph}
          </p>
        ))}
      </motion.div>
    </motion.div>
  );
}
