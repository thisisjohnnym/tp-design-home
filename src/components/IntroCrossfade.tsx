"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useLayoutEffect, useRef, useState } from "react";
import { site } from "@/content/site";
import { teamClusterIntro } from "@/content/teamCluster";

const EASE = [0.22, 1, 0.36, 1] as const;
const DURATION = 0.32;

const ALL_PARAGRAPHS = [
  teamClusterIntro.paragraph,
  ...site.team.map((member) => member.bio),
];

const ALL_TITLES = [teamClusterIntro.title, ...site.team.map((member) => member.name)];
const ALL_ROLE_LABELS = [
  teamClusterIntro.meta[0],
  ...site.team.map((member) => member.title),
];
const ALL_LOCATIONS = [
  teamClusterIntro.meta[1],
  ...site.team.map((member) => member.location),
];

function longest(values: string[]) {
  return values.reduce((longestValue, current) =>
    current.length > longestValue.length ? current : longestValue,
  );
}

export const teamClusterLongestTitle = longest(ALL_TITLES);
export const teamClusterLongestRole = longest(ALL_ROLE_LABELS);
export const teamClusterLongestLocation = longest(ALL_LOCATIONS);

function useOpacityCrossfade() {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return {
      initial: false as const,
      animate: { opacity: 1 },
      exit: { opacity: 1 },
      transition: { duration: 0 },
    };
  }

  return {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: DURATION, ease: EASE },
  };
}

type IntroCrossfadeLineProps = {
  text: string;
  className?: string;
  layoutText?: string;
};

export function IntroCrossfadeLine({
  text,
  className,
  layoutText,
}: IntroCrossfadeLineProps) {
  const motionProps = useOpacityCrossfade();
  const reserve = layoutText ?? text;

  return (
    <span className="intro-crossfade-line">
      <span className="intro-crossfade-line__sizer" aria-hidden="true">
        {reserve}
      </span>
      <AnimatePresence initial={false}>
        <motion.span
          key={text}
          className={className}
          style={{ position: "absolute", top: 0, left: 0 }}
          {...motionProps}
        >
          {text}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

type IntroCrossfadeParagraphProps = {
  text: string;
  className?: string;
  wrapClassName?: string;
};

export function IntroCrossfadeParagraph({
  text,
  className,
  wrapClassName,
}: IntroCrossfadeParagraphProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [minHeight, setMinHeight] = useState<number | null>(null);
  const motionProps = useOpacityCrossfade();

  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap?.parentElement || !className) return;

    const probe = document.createElement("p");
    probe.className = className;
    probe.setAttribute("aria-hidden", "true");
    probe.style.position = "absolute";
    probe.style.visibility = "hidden";
    probe.style.pointerEvents = "none";
    probe.style.insetInlineStart = "0";
    probe.style.top = "0";
    probe.style.margin = "0";

    wrap.parentElement.appendChild(probe);

    let tallest = 0;
    for (const copy of ALL_PARAGRAPHS) {
      probe.textContent = copy;
      tallest = Math.max(tallest, probe.offsetHeight);
    }

    wrap.parentElement.removeChild(probe);
    setMinHeight(tallest);
  }, [className]);

  return (
    <div
      ref={wrapRef}
      className={wrapClassName}
      style={minHeight ? { minHeight: `${minHeight}px` } : undefined}
    >
      <AnimatePresence initial={false}>
        <motion.p
          key={text}
          className={className}
          style={{ position: "absolute", inset: 0, width: "100%" }}
          {...motionProps}
        >
          {text}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
