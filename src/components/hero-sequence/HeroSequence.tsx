"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { startAutoscroll } from "@/lib/debug/autoscroll";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { CapabilitiesSection } from "./CapabilitiesSection";
import { HeroFan } from "./HeroFan";
import { LoaderIntro } from "./LoaderIntro";
import { PointerEffect } from "./PointerEffect";
import { PlateShader } from "./PlateShader";
import { SequenceNav } from "./SequenceNav";
import { MorphCard } from "./MorphCard";
import { TeamSection } from "./TeamSection";
import { WorkGallery } from "./WorkGallery";
import { WorkRecords } from "./work-records/WorkRecords";
import {
  clearCurtainState,
  createCurtainReveal,
  createCurtainWordCycle,
  restCurtainWord,
} from "./curtain-reveal";
import { bindHeroFan } from "./hero-fan";
import { createRowWipe } from "./wipe-reveal";
import { bindTeamScene } from "./team-scene";
import { ShatterHeadline } from "./ShatterHeadline";
import { curtainReveal } from "./team-scene-tuning";
import {
  heroSequenceFan,
  heroSequenceHeadlineLines,
  heroSequenceParallax,
  heroSequenceHeadlineDrumWords,
  heroSequenceIntro,
  heroSequenceMotion,
} from "./content";

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollSmoother);

const vh = () => window.innerHeight;

const SHOW_WORK_RECORDS = false;

export function HeroSequence() {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const select = gsap.utils.selector(root);
      const sequence = select(".hs-sequence")[0] as HTMLElement;
      const shatter = select(".hs-shatter")[0] as HTMLElement;
      const words = select(".hs-shatter__word") as HTMLElement[];
      const curtainVerb = select(
        '[data-curtain-verb="true"]',
      )[0] as HTMLElement | undefined;
      const navCurtains = select(".hs-nav__curtain") as HTMLElement[];
      const fanScroll = select(".hs-fan__scroll")[0] as HTMLElement;
      const fanScrollTilt = select(".hs-fan__scrolltilt")[0] as HTMLElement;
      const navLinks = select(".hs-nav__links")[0] as HTMLElement;
      const loader = select(".hs-loader")[0] as HTMLElement;
      const loaderMark = select(".hs-loader-mark")[0] as HTMLElement;
      const markDrum = select(".hs-mark")[0] as HTMLElement;
      const firstWord = select(
        ".hs-mark__face:first-child .hs-mark__word",
      )[0] as HTMLElement;
      const navLogo = select(".hs-nav__logo")[0] as HTMLElement;

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      /* ---------------------------------------------------------------- */
      /* Loader intro (runs once, independent of breakpoint changes)       */
      /* ---------------------------------------------------------------- */

      const fan = bindHeroFan(root, prefersReducedMotion);
      const zoom = heroSequenceFan.zoomDuration;

      const skipIntro = prefersReducedMotion || window.scrollY > 4;
      const documentElement = document.documentElement;
      const finePointer = window.matchMedia(
        "(hover: hover) and (pointer: fine)",
      ).matches;

      /* Crash triage: ?off=shader,team,glass,... switches features off on a
         device (rules at the end of hero-sequence.css). No-op without it. */
      const debugOff = new Set(
        new URLSearchParams(window.location.search)
          .get("off")
          ?.split(",")
          .map((token) => token.trim())
          .filter(Boolean) ?? [],
      );
      if (debugOff.size > 0) {
        document.documentElement.dataset.off = [...debugOff].join(" ");
      }

      /* ScrollSmoother eases native scroll on desktop. Touch / reduced-motion
         keep native scrolling (Safari jitter + a11y). */
      let smoother: ScrollSmoother | undefined;
      if (finePointer && !prefersReducedMotion) {
        const wrapper = select(".hs-smooth-wrapper")[0] as HTMLElement;
        const content = select(".hs-smooth-content")[0] as HTMLElement;
        smoother = ScrollSmoother.create({
          wrapper,
          content,
          smooth: heroSequenceMotion.smooth,
          effects: false,
          smoothTouch: false,
        });
      }

      /* iOS scrolls on the compositor while scrubbed pins update on the main
         thread, so pinned scenes stutter against the page. Normalizing moves
         touch scroll onto the JS thread (in sync with the pins) and stops
         Safari's toolbar resizing the viewport mid-scroll. It scrolls
         programmatically, which bypasses the intro's overflow lock, so it is
         only switched on once the page is released. */
      const normalizeTouchScroll =
        !smoother && ScrollTrigger.isTouch === 1 && !debugOff.has("normalize");
      let stopAutoscroll: (() => void) | undefined;
      const enableTouchScroll = () => {
        if (normalizeTouchScroll) ScrollTrigger.normalizeScroll(true);
        stopAutoscroll ??= startAutoscroll();
      };

      gsap.set(markDrum, { rotationX: 0, transformOrigin: "center center" });
      gsap.set(loaderMark, {
        filter: "none",
        scale: 1,
        transformOrigin: "center center",
        x: 0,
        y: 0,
      });

      /* ---------------------------------------------------------------- */
      /* Headline verb curtain + nav link curtains (replace drumroll)      */
      /* ---------------------------------------------------------------- */

      let headlineVerbCycle: gsap.core.Timeline | undefined;
      let headlineVerbRunning = false;
      /* The verb only starts cycling once the headline has wiped in. */
      let headlineVerbReady = false;
      /* Keep fixed line breaks; scale the whole shatter block to the viewport
         width so words never wrap onto a new row when space gets tight. */
      const fitShatterHeadline = () => {
        if (!shatter) return;
        const headline = select(".hs-shatter__headline")[0] as
          | HTMLElement
          | undefined;
        if (!headline) return;

        /* The block shrink-wraps its lines, so measure the layer around it.
           Transform origin comes from CSS (centered desktop, bottom-left phone). */
        gsap.set(shatter, { scale: 1 });
        const available = shatter.parentElement?.clientWidth ?? 0;
        const needed = headline.scrollWidth;
        if (available <= 0 || needed <= 0) return;
        gsap.set(shatter, { scale: Math.min(1, available / needed) });
      };

      const shatterFitObserver =
        typeof ResizeObserver !== "undefined"
          ? new ResizeObserver(() => fitShatterHeadline())
          : undefined;
      shatterFitObserver?.observe(shatter);
      requestAnimationFrame(fitShatterHeadline);
      /* Variable-font swap reflows text below the hero (team bios, capability
         lists). Without a refresh here, ScrollTrigger/ScrollSmoother keep the
         shorter pre-swap measurements and the page stops scrolling wherever
         that stale "end" landed — most visible in Chrome, where the fallback
         face differs from HelveticaNowVar more than Safari's does. */
      void document.fonts?.ready.then(() => {
        fitShatterHeadline();
        ScrollTrigger.refresh();
      });

      if (curtainVerb) {
        headlineVerbCycle = createCurtainWordCycle(
          curtainVerb,
          heroSequenceHeadlineDrumWords,
          {
            ...curtainReveal,
            holdDuration: heroSequenceMotion.headlineWordHold,
          },
          {
            reduceMotion: prefersReducedMotion,
            onWordChange: fitShatterHeadline,
          },
        );
      }

      const navCurtainTl = createCurtainReveal(navCurtains, curtainReveal, {
        reduceMotion: prefersReducedMotion,
        paused: true,
      });

      /* Whole headline wipes in row by row (same bar as the nav and team
         heading). Words stay plain visible text until armed. */
      const headlineEl = select(".hs-shatter__headline")[0] as HTMLElement;
      const headlineWipe = createRowWipe(headlineEl, {
        timing: curtainReveal,
        words,
        onCover: (covered) => {
          /* The verb's own curtain sits at "hidden"; show its word with its row. */
          if (curtainVerb && covered.includes(curtainVerb)) {
            restCurtainWord(curtainVerb);
          }
        },
        onComplete: () => {
          headlineVerbReady = true;
          startHeadlineVerb();
          fitShatterHeadline();
        },
      });

      const startHeadlineVerb = () => {
        if (
          !headlineVerbCycle ||
          prefersReducedMotion ||
          headlineVerbRunning ||
          !headlineVerbReady
        ) {
          return;
        }
        headlineVerbRunning = true;

        if (curtainVerb) {
          const content = curtainVerb.querySelector(".hs-curtain__content");
          if (content) {
            content.textContent = heroSequenceHeadlineDrumWords[0] ?? "";
          }
          restCurtainWord(curtainVerb);
        }
        headlineVerbCycle.restart(true);
        fitShatterHeadline();
      };

      const stopHeadlineVerb = () => {
        if (!headlineVerbRunning) return;
        headlineVerbRunning = false;
        headlineVerbCycle?.pause();
        if (curtainVerb) restCurtainWord(curtainVerb);
      };

      const revealNavCurtains = () => {
        if (prefersReducedMotion || !navCurtainTl) {
          navCurtains.forEach((line) => {
            line.style.setProperty("--hs-curtain-content-opacity", "1");
            line.style.setProperty("--hs-curtain-mask-opacity", "0");
            line.style.setProperty("--hs-curtain-wipe", "0");
          });
          return;
        }
        navCurtainTl.play(0);
      };

      if (skipIntro) {
        headlineVerbReady = true;
        gsap.set(loader, { autoAlpha: 0, display: "none" });
        /* The drum stays on the lead slide, resting on its logo face. */
        gsap.set(markDrum, { rotationX: -270 });
        fan.rest();
        gsap.set([shatter, navLinks, navLogo], {
          autoAlpha: 1,
          y: 0,
        });
        ScrollTrigger.refresh();
        enableTouchScroll();
        revealNavCurtains();
        startHeadlineVerb();
        fitShatterHeadline();
      } else {
        /* overflow:hidden alone blocks all user-driven scroll during the
           loader. We used to also call smoother.paused(true) here, but that
           installs a GSAP Observer that force-reverts ANY scroll attempt
           (wheel/touch/keyboard) back to the pre-pause position until
           paused(false) runs — if the intro timeline ever stalls (a
           backgrounded tab, a dropped frame) before reaching "reveal", the
           page is left permanently unscrollable with no visible cause. */
        documentElement.style.overflow = "hidden";

        gsap.set(navLogo, { autoAlpha: 0 });
        fan.prepare();
        gsap.set(loader, { autoAlpha: 1, display: "grid" });
        gsap.set(firstWord, { autoAlpha: 0, filter: "blur(18px)", y: 10 });
        headlineWipe.arm();
        /* Links stay in place; curtains reveal the labels. */
        gsap.set(navLinks, { autoAlpha: 1, y: 0 });

        const intro = gsap.timeline({ defaults: { ease: "power3.inOut" } });

        intro
          .to(firstWord, {
            autoAlpha: 1,
            filter: "blur(0px)",
            y: 0,
            duration: heroSequenceIntro.firstFaceDuration,
            ease: "power2.out",
          })
          .to(
            markDrum,
            { rotationX: -90, duration: heroSequenceIntro.rollDuration },
            `+=${heroSequenceIntro.firstFaceHold}`,
          )
          .to(
            markDrum,
            { rotationX: -180, duration: heroSequenceIntro.rollDuration },
            `+=${heroSequenceIntro.faceHold}`,
          )
          .to(
            markDrum,
            { rotationX: -270, duration: heroSequenceIntro.rollDuration },
            `+=${heroSequenceIntro.faceHold}`,
          )
          .addLabel("reveal", `+=${heroSequenceIntro.finalLogoHold}`)
          .call(
            () => {
              documentElement.style.removeProperty("overflow");
              ScrollTrigger.refresh();
              enableTouchScroll();
                    revealNavCurtains();
              startHeadlineVerb();
              fitShatterHeadline();
            },
            [],
            `reveal+=${zoom * 0.5}`,
          )
          /* The yellow loader and the fan's lead slide are the same colour, so
             the loader drops away instantly and the camera pulls back from
             the slide beneath it. */
          .set(loader, { autoAlpha: 0, display: "none" }, "reveal")
          .add(fan.zoomOut(), "reveal")
          /* The paused drum is moved onto the lead slide at the start of
             fan.zoomOut, so the wordmark stays in the fan. The nav wordmark
             fades in at its own position. */
          /* The headline wipes in row by row once the camera is mostly out. */
          .call(() => headlineWipe.play(), [], `reveal+=${zoom * 0.5}`)
          .to(
            navLogo,
            { autoAlpha: 1, duration: 0.6, ease: "power2.out" },
            `reveal+=${zoom * 0.55}`,
          );
      }

      /* ---------------------------------------------------------------- */
      /* Scrubbed sequence                                                 */
      /* ---------------------------------------------------------------- */

      const media = gsap.matchMedia();

      media.add(
        {
          all: "all",
          isMobile: "(max-width: 699px)",
          isTablet: "(min-width: 700px) and (max-width: 1100px)",
          reduceMotion: "(prefers-reduced-motion: reduce)",
          allowMotion: "(prefers-reduced-motion: no-preference)",
        },
        (context) => {
          const isMobile = Boolean(context.conditions?.isMobile);
          const isTablet = Boolean(context.conditions?.isTablet);
          const reduceMotion = Boolean(context.conditions?.reduceMotion);

          /* The hero scrolls away with the page. Extra drift on top of that
             gives the depth: each headline line gets a little, the fan gets
             more, so it climbs a touch faster than the type. */
          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: sequence,
              start: "top top",
              end: "bottom top",
              scrub: heroSequenceMotion.scrub,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                /* The verb keeps cycling until the headline has left. */
                if (self.progress > 0.98) stopHeadlineVerb();
                else startHeadlineVerb();
              },
            },
          });

          let fanTimeline: gsap.core.Timeline | undefined;

          if (!reduceMotion) {
            const lineOfWord = heroSequenceHeadlineLines.flatMap((line, row) =>
              line.map(() => row),
            );
            const drift = (fraction: number) => () => -vh() * fraction;

            words.forEach((word, index) => {
              timeline.to(
                word,
                {
                  y: drift(heroSequenceParallax.lineDrift[lineOfWord[index]]),
                  ease: "none",
                  duration: 1,
                },
                0,
              );
            });
            /* The fan has its own, laggier scrub so it carries a little
               inertia and doesn't look glued to the page. */
            fanTimeline = gsap.timeline({
              scrollTrigger: {
                trigger: sequence,
                start: "top top",
                end: "bottom top",
                scrub: heroSequenceParallax.fanScrub,
                invalidateOnRefresh: true,
              },
            });
            /* Pitch the fan upward as the hero leaves. Its own wrapper, so it
               adds to the resting tilt instead of replacing it. */
            fanTimeline.fromTo(
              fanScrollTilt,
              { rotationX: 0 },
              {
                rotationX: heroSequenceParallax.tiltDegrees,
                ease: heroSequenceParallax.fanEase,
                duration: 1,
              },
              0,
            );
            fanTimeline.to(
              fanScroll,
              {
                y: drift(heroSequenceParallax.fanDrift),
                ease: heroSequenceParallax.fanEase,
                duration: 1,
              },
              0,
            );
          }

          const releaseTeam = debugOff.has("teamjs")
            ? () => {}
            : bindTeamScene(root, {
                reduceMotion,
                layout: isMobile ? "phone" : isTablet ? "tablet" : "desktop",
              });

          return () => {
            releaseTeam();
            fanTimeline?.scrollTrigger?.kill();
            fanTimeline?.kill();
            timeline.scrollTrigger?.kill();
            timeline.kill();
          };
        },
        root,
      );

      return () => {
        documentElement.style.removeProperty("overflow");
        stopHeadlineVerb();
        headlineWipe.kill();
        headlineVerbCycle?.kill();
        navCurtainTl?.kill();
        navCurtains.forEach(clearCurtainState);
        if (curtainVerb) clearCurtainState(curtainVerb);
        shatterFitObserver?.disconnect();
        fan.kill();
        smoother?.kill();
        if (normalizeTouchScroll) ScrollTrigger.normalizeScroll(false);
        stopAutoscroll?.();
        media.revert();
      };
    },
    { scope: rootRef },
  );

  return (
    <div className="hs-root" ref={rootRef}>
      {/* Stack (back → front): Paper HalftoneDots plate → grid → UI. */}
      <PlateShader />
      <div className="hs-grid" aria-hidden="true">
        {Array.from({ length: 12 }, (_, index) => (
          <div className="hs-grid__col" key={index} />
        ))}
      </div>

      <div className="hs-smooth-wrapper">
        <div className="hs-smooth-content">
          <div className="hs-sequence">
            <div className="hs-pin">
              <div className="hs-band">
                <HeroFan />
                <div className="hs-band__inner">
                  {/* Reserves the nav’s expanded height so the hero scene does
                      not jump when the fixed overlay is moved out of flow. */}
                  <div className="hs-nav-spacer" aria-hidden="true" />

                  <div className="hs-scene">
                    <ShatterHeadline />
                  </div>

                </div>
              </div>
            </div>

          </div>

          <WorkGallery />
          {/* Record browser is hidden (not deleted); flip to bring it back. */}
          {SHOW_WORK_RECORDS && <WorkRecords />}

          <TeamSection />
          <MorphCard />

          <CapabilitiesSection />
        </div>
      </div>

      {/* Fixed chrome stays outside ScrollSmoother so it is not trapped by the
          smoothed transform layer. */}
      <SequenceNav />
      <LoaderIntro />
      <PointerEffect />
    </div>
  );
}
