"use client";

import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTime,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { site } from "@/content/site";
import { teamTapestryLayout } from "@/content/teamTapestry";
import { TeamTapestryCard } from "./TeamTapestryCard";

type TeamGalleryProps = {
  className?: string;
};

const TEAM_COUNT = site.team.length;
const WHEEL_RADIUS = 118;
const SPREAD_TRIGGER = 0.2;
const COLLAPSE_TRIGGER = 0.1;
const SPREAD_DURATION = 1.35;
const COLLAPSE_DURATION = 1.1;
const SPREAD_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const CARD_STAGGER = 0.045;

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function staggeredSpread(globalSpread: number, index: number): number {
  const delay = index * CARD_STAGGER;
  const window = 1 - delay;

  if (window <= 0) return globalSpread >= 1 ? 1 : 0;
  return clamp((globalSpread - delay) / window, 0, 1);
}

function computeWheelRotation(time: number, spinBoost: number, spread: number): number {
  const idle = (time / 48) % 360;
  return idle + spinBoost * (1 - spread);
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
  spinBoost: MotionValue<number>;
};

function AnimatedTeamCard({
  member,
  index,
  placement,
  spreadProgress,
  spinBoost,
}: AnimatedTeamCardProps) {
  const time = useTime();

  const baseAngle = (index / TEAM_COUNT) * 360 - 90;

  const cardSpread = useTransform(spreadProgress, (global) => staggeredSpread(global, index));
  const metaOpacity = useTransform(cardSpread, [0.72, 1], [0, 1]);

  const left = useTransform(cardSpread, (spread) => `${50 + (placement.left - 50) * spread}%`);

  const top = useTransform(cardSpread, (spread) => `${50 + (placement.top - 50) * spread}%`);

  const x = useTransform([cardSpread, time, spinBoost], (values) => {
    const spread = values[0] as number;
    const t = values[1] as number;
    const boost = values[2] as number;
    const wheelRotation = computeWheelRotation(t, boost, spread);
    const angleRad = ((baseAngle + wheelRotation) * Math.PI) / 180;
    const wheelX = Math.cos(angleRad) * WHEEL_RADIUS * (1 - spread);
    const centerOffset = -50 * (1 - spread);

    if (spread >= 0.999) return "0%";
    return `calc(${centerOffset}% + ${wheelX}px)`;
  });

  const y = useTransform([cardSpread, time, spinBoost], (values) => {
    const spread = values[0] as number;
    const t = values[1] as number;
    const boost = values[2] as number;
    const wheelRotation = computeWheelRotation(t, boost, spread);
    const angleRad = ((baseAngle + wheelRotation) * Math.PI) / 180;
    const wheelY = Math.sin(angleRad) * WHEEL_RADIUS * (1 - spread);
    const centerOffset = -50 * (1 - spread);

    if (spread >= 0.999) return "0%";
    return `calc(${centerOffset}% + ${wheelY}px)`;
  });

  const rotate = useTransform([cardSpread, time, spinBoost], (values) => {
    const spread = values[0] as number;
    const t = values[1] as number;
    const boost = values[2] as number;
    const wheelRotation = computeWheelRotation(t, boost, spread);
    const wheelAngle = baseAngle + wheelRotation;

    return (1 - spread) * (wheelAngle + 90);
  });

  const scale = useTransform(cardSpread, [0, 1], [0.9, 1]);

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
      <TeamTapestryCard member={member} metaOpacity={metaOpacity} />
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
  const trackRef = useRef<HTMLDivElement>(null);
  const phaseRef = useRef<"wheel" | "spread">("wheel");
  const spreadAnimationRef = useRef<ReturnType<typeof animate> | null>(null);
  const spinAnimationRef = useRef<ReturnType<typeof animate> | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  const spreadProgress = useMotionValue(0);
  const spinBoost = useMotionValue(0);

  const stopAnimations = () => {
    spreadAnimationRef.current?.stop();
    spinAnimationRef.current?.stop();
  };

  const runSpread = () => {
    stopAnimations();
    spinAnimationRef.current = animate(spinBoost, 0, {
      duration: SPREAD_DURATION * 0.85,
      ease: SPREAD_EASE,
    });
    spreadAnimationRef.current = animate(spreadProgress, 1, {
      duration: SPREAD_DURATION,
      ease: SPREAD_EASE,
    });
  };

  const runCollapse = (scroll: number) => {
    stopAnimations();
    const targetBoost = Math.min(scroll / SPREAD_TRIGGER, 1) * 600;
    spinAnimationRef.current = animate(spinBoost, targetBoost, {
      duration: COLLAPSE_DURATION * 0.75,
      ease: SPREAD_EASE,
    });
    spreadAnimationRef.current = animate(spreadProgress, 0, {
      duration: COLLAPSE_DURATION,
      ease: SPREAD_EASE,
    });
  };

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener("change", update);
    return () => {
      media.removeEventListener("change", update);
      stopAnimations();
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (scroll) => {
    if (scroll >= SPREAD_TRIGGER && phaseRef.current === "wheel") {
      phaseRef.current = "spread";
      runSpread();
      return;
    }

    if (scroll < COLLAPSE_TRIGGER && phaseRef.current === "spread") {
      phaseRef.current = "wheel";
      runCollapse(scroll);
      return;
    }

    if (phaseRef.current === "wheel") {
      spinBoost.set(Math.min(scroll / SPREAD_TRIGGER, 1) * 600);
    }
  });

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
                  spinBoost={spinBoost}
                />
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
