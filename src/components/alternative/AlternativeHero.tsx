"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { alternativeAssets } from "@/content/alternative";
import {
  ALT_HERO_EASE,
  ALT_HERO_TITLE_BOTTOM_PADDING,
  ALT_HERO_TITLE_HERO_SIZE,
  ALT_HERO_TITLE_INTRO_SCALE,
  alternativeHeroMotion,
} from "@/content/alternativeHero";
import { HeroShaderBackground } from "@/components/hero/HeroShaderBackground";
import { SMOKESCREEN_1 } from "@/content/heroShader";
import { AlternativeNav } from "./AlternativeNav";

type HeroTextPhase = "enter" | "settle";

type TitleOffsets = {
  center: number;
  settle: number;
};

export function AlternativeHero() {
  const reduceMotion = useReducedMotion();
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const padMeasureRef = useRef<HTMLDivElement>(null);
  const [showNav, setShowNav] = useState(false);
  const [textPhase, setTextPhase] = useState<HeroTextPhase>("enter");
  const [titleOffsets, setTitleOffsets] = useState<TitleOffsets>({ center: 0, settle: 0 });
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const isSettled = textPhase === "settle";

  const measureTitleOffsets = useCallback(() => {
    const hero = heroRef.current;
    const title = titleRef.current;
    if (!hero || !title) return;

    const heroHeight = hero.offsetHeight;
    const bottomPad = padMeasureRef.current?.offsetHeight ?? 0;
    const visualHeight = title.getBoundingClientRect().height;
    const fullHeight = visualHeight / (isSettled ? 1 : ALT_HERO_TITLE_INTRO_SCALE);

    setTitleOffsets({
      center: -visualHeight / 2,
      settle: heroHeight / 2 - bottomPad - fullHeight,
    });
  }, [isSettled]);

  useLayoutEffect(() => {
    measureTitleOffsets();
    window.addEventListener("resize", measureTitleOffsets);
    return () => window.removeEventListener("resize", measureTitleOffsets);
  }, [measureTitleOffsets, textPhase]);

  useEffect(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];

    if (reduceMotion) {
      setShowNav(true);
      setTextPhase("settle");
      return;
    }

    const enterMs =
      (alternativeHeroMotion.text.delay + alternativeHeroMotion.text.duration) * 1000;

    timersRef.current.push(
      setTimeout(() => setShowNav(true), enterMs),
      setTimeout(
        () => setTextPhase("settle"),
        enterMs + alternativeHeroMotion.textHold * 1000
      )
    );

    return () => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };
  }, [reduceMotion]);

  const settleTransition = {
    duration: alternativeHeroMotion.textSettle.duration,
    ease: ALT_HERO_EASE,
  };

  return (
    <section
      aria-labelledby="alt-hero-heading"
      className="relative w-full overflow-hidden"
      style={{ backgroundColor: SMOKESCREEN_1.background }}
    >
      <div ref={heroRef} className="relative min-h-[100svh] w-full">
        <HeroShaderBackground visible />

        <div
          ref={padMeasureRef}
          aria-hidden
          className="pointer-events-none invisible absolute h-0 w-0"
          style={{ paddingBottom: ALT_HERO_TITLE_BOTTOM_PADDING }}
        />

        <motion.div
          className="absolute left-[var(--grid-margin)] top-8 z-20 md:top-10"
          initial={reduceMotion ? false : { opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: alternativeHeroMotion.logo.duration,
            ease: ALT_HERO_EASE,
          }}
        >
          <Link href="/" className="relative block h-[27px] w-[120px]" aria-label="Tapestry home">
            <Image
              src={alternativeAssets.tapestryLogo}
              alt=""
              fill
              className="object-contain object-left"
              priority
            />
          </Link>
        </motion.div>

        <div className="absolute inset-0 z-10 px-[var(--grid-margin)]">
          <motion.h1
            ref={titleRef}
            id="alt-hero-heading"
            className="absolute left-0 right-0 top-1/2 w-full pb-12 text-center font-sans font-extrabold leading-[0.9] tracking-[-0.02em] text-white will-change-transform"
            style={{
              fontSize: ALT_HERO_TITLE_HERO_SIZE,
              transformOrigin: "center center",
            }}
            initial={
              reduceMotion
                ? false
                : {
                    opacity: 0,
                    filter: "blur(10px)",
                    scale: ALT_HERO_TITLE_INTRO_SCALE * 0.94,
                  }
            }
            animate={{
              opacity: 1,
              filter: "blur(0px)",
              y: isSettled ? titleOffsets.settle : titleOffsets.center,
              scale: isSettled ? 1 : ALT_HERO_TITLE_INTRO_SCALE,
            }}
            transition={{
              opacity: {
                duration: alternativeHeroMotion.text.duration,
                ease: ALT_HERO_EASE,
                delay: alternativeHeroMotion.text.delay,
              },
              filter: {
                duration: alternativeHeroMotion.text.duration,
                ease: ALT_HERO_EASE,
                delay: alternativeHeroMotion.text.delay,
              },
              y: isSettled ? settleTransition : { duration: 0 },
              scale: isSettled
                ? settleTransition
                : {
                    duration: alternativeHeroMotion.text.duration,
                    ease: ALT_HERO_EASE,
                    delay: alternativeHeroMotion.text.delay,
                  },
              default: { duration: 0 },
            }}
          >
            Design Team
          </motion.h1>
        </div>

        <AnimatePresence>
          {showNav ? (
            <motion.div
              className="absolute right-[var(--grid-margin)] top-8 z-20 md:top-[30px]"
              initial={reduceMotion ? false : { opacity: 0, x: 32, clipPath: "inset(0 100% 0 0 round 9999px)" }}
              animate={{ opacity: 1, x: 0, clipPath: "inset(0 0% 0 0 round 9999px)" }}
              exit={{ opacity: 0, x: 24 }}
              transition={{
                duration: alternativeHeroMotion.nav.duration,
                ease: ALT_HERO_EASE,
                delay: alternativeHeroMotion.nav.delay,
              }}
            >
              <AlternativeNav />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </section>
  );
}
