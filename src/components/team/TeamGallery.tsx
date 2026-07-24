"use client";

import type { CSSProperties } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTime,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { site } from "@/content/site";
import {
  teamCardDrift,
  teamCardDriftDelaySec,
  teamCardDriftTimes,
  teamTapestryLayout,
} from "@/content/teamTapestry";
import { TeamTapestryCard } from "./TeamTapestryCard";

type TeamGalleryProps = {
  className?: string;
};

const TEAM_COUNT = site.team.length;
const WHEEL_RADIUS = 118;
const WHEEL_PHASE_END = 0.24;
const SPREAD_PHASE_END = 0.78;
const SPREAD_CLOCKWISE_DEG = 130;
const SPREAD_SETTLED_THRESHOLD = 0.97;
const SPREAD_SPRING = { stiffness: 90, damping: 28, mass: 0.85, restDelta: 0.0008 };

function useDocumentVisible() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const updateVisibility = () => setVisible(!document.hidden);
    updateVisibility();
    document.addEventListener("visibilitychange", updateVisibility);
    return () => document.removeEventListener("visibilitychange", updateVisibility);
  }, []);

  return visible;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function smoothstep(value: number): number {
  return value * value * (3 - 2 * value);
}

function scrollToSpread(scroll: number): number {
  if (scroll <= WHEEL_PHASE_END) return 0;

  const progress = clamp(
    (scroll - WHEEL_PHASE_END) / (SPREAD_PHASE_END - WHEEL_PHASE_END),
    0,
    1,
  );

  return smoothstep(progress);
}

function useWheelRotation(spreadProgress: MotionValue<number>, time: MotionValue<number>) {
  const frozenAngle = useRef<number | null>(null);
  const angleOffset = useRef(0);
  const wasSpreading = useRef(false);

  return useTransform([spreadProgress, time], ([spread, t]) => {
    const rawTime = (t as number) / 110;
    const isSpreading = (spread as number) > 0.001;

    if (!isSpreading) {
      if (wasSpreading.current && frozenAngle.current !== null) {
        angleOffset.current = frozenAngle.current - rawTime;
        frozenAngle.current = null;
      }

      wasSpreading.current = false;
      return rawTime + angleOffset.current;
    }

    if (!wasSpreading.current) {
      frozenAngle.current = rawTime + angleOffset.current;
      wasSpreading.current = true;
    }

    return frozenAngle.current!;
  });
}

function easeOutQuart(value: number): number {
  return 1 - (1 - value) ** 4;
}

type TeamIntroRevealProps = {
  spreadProgress: MotionValue<number>;
};

function TeamIntroReveal({ spreadProgress }: TeamIntroRevealProps) {
  const reveal = useTransform(spreadProgress, (global) =>
    easeOutQuart(clamp((global - 0.48) / 0.52, 0, 1)),
  );
  const opacity = useTransform(reveal, [0, 0.35, 1], [0, 0.2, 1]);
  const y = useTransform(reveal, [0, 1], [72, 0]);
  const scale = useTransform(reveal, [0, 1], [0.9, 1]);
  const blur = useTransform(reveal, (value) => `blur(${20 * (1 - value)}px)`);

  return (
    <motion.p
      className="team-tapestry__intro"
      style={{
        opacity,
        y,
        scale,
        filter: blur,
      }}
    >
      {site.teamIntro}
    </motion.p>
  );
}

type AnimatedTeamCardProps = {
  member: (typeof site.team)[number];
  index: number;
  placement: { left: number; top: number };
  spreadProgress: MotionValue<number>;
  documentVisible: boolean;
};

function AnimatedTeamCard({
  member,
  index,
  placement,
  spreadProgress,
  documentVisible,
}: AnimatedTeamCardProps) {
  const time = useTime();
  const [settled, setSettled] = useState(false);
  const baseAngle = (index / TEAM_COUNT) * 360 - 90;
  const drift = useMemo(() => teamCardDrift(index), [index]);
  const wheelRotation = useWheelRotation(spreadProgress, time);

  useMotionValueEvent(spreadProgress, "change", (spread) => {
    setSettled(spread >= SPREAD_SETTLED_THRESHOLD);
  });

  useEffect(() => {
    setSettled(spreadProgress.get() >= SPREAD_SETTLED_THRESHOLD);
  }, [spreadProgress]);

  const driftKeyframes = useMemo(
    () => ({
      x: drift.points.map((point) => point.x),
      y: drift.points.map((point) => point.y),
      times: teamCardDriftTimes(drift.points.length),
    }),
    [drift.points],
  );

  const shouldFloat = settled && documentVisible;

  const metaOpacity = useTransform(spreadProgress, [0.72, 1], [0, 1]);

  const left = useTransform(spreadProgress, (spread) => {
    const clampedSpread = clamp(spread, 0, 1);
    return `${50 + (placement.left - 50) * clampedSpread}%`;
  });

  const top = useTransform(spreadProgress, (spread) => {
    const clampedSpread = clamp(spread, 0, 1);
    return `${50 + (placement.top - 50) * clampedSpread}%`;
  });

  const x = useTransform([spreadProgress, wheelRotation], ([spread, wheelRot]) => {
    const clampedSpread = clamp(spread as number, 0, 1);
    const angleRad = ((baseAngle + (wheelRot as number)) * Math.PI) / 180;
    const wheelX = Math.cos(angleRad) * WHEEL_RADIUS * (1 - clampedSpread);
    const centerOffset = -50 * (1 - clampedSpread);

    return `calc(${centerOffset}% + ${wheelX}px)`;
  });

  const y = useTransform([spreadProgress, wheelRotation], ([spread, wheelRot]) => {
    const clampedSpread = clamp(spread as number, 0, 1);
    const angleRad = ((baseAngle + (wheelRot as number)) * Math.PI) / 180;
    const wheelY = Math.sin(angleRad) * WHEEL_RADIUS * (1 - clampedSpread);
    const centerOffset = -50 * (1 - clampedSpread);

    return `calc(${centerOffset}% + ${wheelY}px)`;
  });

  const rotate = useTransform([spreadProgress, wheelRotation], ([spread, wheelRot]) => {
    const clampedSpread = clamp(spread as number, 0, 1);
    const wheelAngle = baseAngle + (wheelRot as number);
    const stackRotation = (1 - clampedSpread) * (wheelAngle + 90);
    const clockwiseSpin = (1 - clampedSpread) * clampedSpread * 2 * SPREAD_CLOCKWISE_DEG;

    return stackRotation + clockwiseSpin;
  });

  const scale = useTransform(spreadProgress, (spread) => {
    const clampedSpread = clamp(spread, 0, 1);
    return 0.9 + clampedSpread * 0.1;
  });

  return (
    <motion.li
      className="team-tapestry__item"
      style={{
        left,
        top,
        x,
        y,
        rotate,
        scale,
        zIndex: 10 + index,
      }}
    >
      <motion.div
        className="team-tapestry__item-float"
        animate={shouldFloat ? { x: driftKeyframes.x, y: driftKeyframes.y } : { x: 0, y: 0 }}
        transition={
          shouldFloat
            ? {
                duration: drift.durationSec,
                repeat: Infinity,
                ease: "easeInOut",
                delay: teamCardDriftDelaySec(index),
                times: driftKeyframes.times,
              }
            : { duration: 0.2, ease: "easeOut" }
        }
      >
        <TeamTapestryCard member={member} metaOpacity={metaOpacity} />
      </motion.div>
    </motion.li>
  );
}

function TeamGalleryStatic({ className = "" }: TeamGalleryProps) {
  return (
    <div className={`team-tapestry ${className}`.trim()}>
      <div className="team-tapestry__intro-wrap">
        <p className="team-tapestry__intro">{site.teamIntro}</p>
      </div>
      <ul className="team-tapestry__cards list-none" aria-label="Team gallery">
        {site.team.map((member) => {
          const placement = teamTapestryLayout[member.name];
          if (!placement) return null;

          return (
            <li
              key={member.name}
              className="team-tapestry__item"
              style={
                {
                  "--card-left": `${placement.left}%`,
                  "--card-top": `${placement.top}%`,
                } as CSSProperties
              }
            >
              <TeamTapestryCard member={member} />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function TeamGallery({ className = "" }: TeamGalleryProps) {
  const reduceMotion = useReducedMotion();
  const documentVisible = useDocumentVisible();
  const trackRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  const targetSpread = useTransform(scrollYProgress, scrollToSpread);
  const spreadProgress = useSpring(targetSpread, SPREAD_SPRING);

  if (reduceMotion || isMobile) {
    return (
      <div className="team-section__scroll-track team-section__scroll-track--static">
        <TeamGalleryStatic className={className} />
      </div>
    );
  }

  return (
    <div ref={trackRef} className="team-section__scroll-track">
      <div className="team-section__sticky">
        <div className={`team-tapestry team-tapestry--animated ${className}`.trim()}>
          <motion.div
            className="team-tapestry__intro-wrap"
            style={{
              x: "-50%",
              y: "-50%",
            }}
          >
            <TeamIntroReveal spreadProgress={spreadProgress} />
          </motion.div>
          <ul className="team-tapestry__cards list-none" aria-label="Team gallery">
            {site.team.map((member, index) => {
              const placement = teamTapestryLayout[member.name];
              if (!placement) return null;

              return (
                <AnimatedTeamCard
                  key={member.name}
                  member={member}
                  index={index}
                  placement={placement}
                  spreadProgress={spreadProgress}
                  documentVisible={documentVisible}
                />
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
