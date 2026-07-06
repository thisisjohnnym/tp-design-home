"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { site } from "@/content/site";
import { INTRO_EASE, introTransitions } from "@/content/heroIntro";
import { heroLayout } from "@/content/grid";
import { GridCell, PageGrid } from "@/components/layout/PageGrid";
import { HeroIntroSequence } from "./HeroIntroSequence";
import { HeroShaderBackground } from "./HeroShaderBackground";

const HERO_INTRO_KEY = "tapestry-hero-intro-seen";

function shouldSkipHeroIntro(): boolean {
  if (typeof window === "undefined") return false;
  if (sessionStorage.getItem(HERO_INTRO_KEY)) return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function HeroSection() {
  const reduceMotion = useReducedMotion();
  const [introComplete, setIntroComplete] = useState(false);
  const [introExiting, setIntroExiting] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (shouldSkipHeroIntro()) {
      setIntroComplete(true);
    }
    setReady(true);
  }, []);

  const handleExitStart = useCallback(() => {
    setIntroExiting(true);
  }, []);

  const handleIntroComplete = useCallback(() => {
    sessionStorage.setItem(HERO_INTRO_KEY, "1");
    setIntroComplete(true);
    setIntroExiting(false);
  }, []);

  const showBanner = introComplete || reduceMotion || introExiting;
  const bannerTransition = introExiting
    ? {
        duration: introTransitions.tapestryToBanner.duration,
        ease: INTRO_EASE,
      }
    : { duration: 0.7, ease: INTRO_EASE };

  const bodyPartner = site.hero.body[1];

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative flex min-h-[calc(100dvh-var(--site-header-height,4.75rem))] flex-col overflow-hidden bg-transparent text-[var(--foreground)]"
    >
      {ready && !introComplete && !reduceMotion ? (
        <HeroIntroSequence onComplete={handleIntroComplete} onExitStart={handleExitStart} />
      ) : null}

      <HeroShaderBackground visible={showBanner} exiting={introExiting} />

      <PageGrid
        className={`relative z-10 min-h-full flex-1 items-start content-start py-12 md:py-16 ${
          showBanner ? "" : "pointer-events-none opacity-0"
        }`}
      >
        <motion.div
          className="contents"
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          animate={showBanner ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={bannerTransition}
        >
          <GridCell span={heroLayout.headlineSpan} spanMobile={12}>
            <p className="relative -ml-2.5 inline-flex min-h-[39px] w-fit max-w-full items-center bg-[var(--accent)] px-2.5 font-sans text-[clamp(1.125rem,1.67vw,1.5rem)] font-bold leading-none tracking-[0.0125em]">
              TAPESTRY&apos;S DESIGN TEAM
            </p>

            <h1
              id="hero-heading"
              className="mt-6 max-w-[50.5rem] font-sans text-[clamp(2.5rem,5.56vw,5rem)] font-bold uppercase leading-[0.95] tracking-[-0.02em] md:mt-8"
            >
              {site.tagline}
            </h1>
          </GridCell>

          <GridCell
            span={heroLayout.bodySpan}
            spanMobile={12}
            className="mt-8 md:mt-0 md:pt-[clamp(8rem,38.5vh,24.6875rem)]"
          >
            <p className="max-w-[30.3125rem] font-sans text-[clamp(1.25rem,2.22vw,2rem)] leading-[1.3] tracking-[0.0125em] text-[var(--foreground)]">
              {bodyPartner}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3 md:mt-10">
              <Link
                href="/team"
                className="inline-flex items-center gap-2 rounded-full bg-ink-900 px-10 py-4 font-sans text-[clamp(1.125rem,1.67vw,1.5rem)] font-bold leading-[1.3] text-ink-50 transition hover:opacity-90 dark:bg-ink-50 dark:text-ink-900"
              >
                Meet the team
                <span aria-hidden>→</span>
              </Link>
              <Link
                href="/how-we-work"
                className="rule inline-flex items-center gap-2 rounded-full border-2 px-10 py-4 font-sans text-[clamp(1.125rem,1.67vw,1.5rem)] font-bold leading-[1.3] text-[var(--foreground)] transition hover:bg-ink-100/40 dark:hover:bg-ink-800/40"
              >
                How we work
              </Link>
            </div>
          </GridCell>
        </motion.div>
      </PageGrid>

      <span className="sr-only">
        {site.name} — {site.tagline}
      </span>
    </section>
  );
}
