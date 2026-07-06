"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { site } from "@/content/site";

const ROTATE_MS = 2000;
const ITEM_HEIGHT = 72;

function opacityForDistance(distance: number): number {
  if (distance === 0) return 1;
  if (distance === 1) return 0.35;
  return 0.18;
}

type DesignCapabilitiesShowcaseProps = {
  /** Show description for the active capability below the headline */
  showDescription?: boolean;
  /** Compact layout for home section */
  compact?: boolean;
};

export function DesignCapabilitiesShowcase({
  showDescription = true,
  compact = false,
}: DesignCapabilitiesShowcaseProps) {
  const reduceMotion = useReducedMotion();
  const capabilities = site.capabilities;
  const defaultIndex = Math.max(0, capabilities.findIndex((c) => c.label === "UI/UX"));
  const [activeIndex, setActiveIndex] = useState(defaultIndex);
  const active = capabilities[activeIndex];

  useEffect(() => {
    if (reduceMotion) return;
    const id = setInterval(() => {
      setActiveIndex((i) => (i + 1) % capabilities.length);
    }, ROTATE_MS);
    return () => clearInterval(id);
  }, [capabilities.length, reduceMotion]);

  const headlineSize = compact
    ? "text-[clamp(2.5rem,8vw,4.5rem)]"
    : "text-[clamp(3rem,10vw,6rem)]";
  const suffixSize = compact
    ? "text-[clamp(2.5rem,8vw,4.5rem)]"
    : "text-[clamp(3rem,10vw,6rem)]";

  return (
    <div className={compact ? "mt-8" : "mt-4"}>
      <div
        className="flex flex-wrap items-center gap-x-3 md:gap-x-5"
        aria-live="polite"
        aria-atomic="true"
      >
        <span
          className={`display-tight shrink-0 font-sans font-bold leading-none text-ink-900 dark:text-ink-50 ${headlineSize}`}
        >
          Design
        </span>

        <div
          className="relative overflow-hidden"
          style={{ height: ITEM_HEIGHT * 5 }}
          aria-hidden
        >
          <motion.ul
            className="flex flex-col"
            animate={
              reduceMotion
                ? undefined
                : { y: -(activeIndex * ITEM_HEIGHT) + ITEM_HEIGHT * 2 }
            }
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            style={{ willChange: "transform" }}
          >
            {capabilities.map((cap, index) => {
              const distance = Math.abs(index - activeIndex);
              const isActive = index === activeIndex;

              return (
                <li
                  key={cap.label}
                  className="flex items-center font-sans font-bold leading-none"
                  style={{ height: ITEM_HEIGHT }}
                >
                  <span
                    className={`whitespace-nowrap transition-colors duration-500 ${suffixSize} ${
                      isActive
                        ? "text-ink-900 dark:text-ink-50"
                        : "text-ink-300 dark:text-ink-600"
                    }`}
                    style={{ opacity: opacityForDistance(distance) }}
                  >
                    {cap.label}
                  </span>
                </li>
              );
            })}
          </motion.ul>
        </div>
      </div>

      <p className="sr-only">{active.title}</p>

      {showDescription ? (
        <AnimatePresence mode="wait">
          <motion.p
            key={active.label}
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.4 }}
            className={`max-w-prose font-sans text-ink-600 dark:text-ink-300 ${
              compact ? "mt-8 text-body" : "mt-10 text-body-lg"
            }`}
          >
            {active.description}
          </motion.p>
        </AnimatePresence>
      ) : null}
    </div>
  );
}
