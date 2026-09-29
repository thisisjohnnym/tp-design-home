"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { startAutoscroll } from "@/lib/debug/autoscroll";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { CapabilitiesSection } from "./CapabilitiesSection";
import { LoaderIntro } from "./LoaderIntro";
import { PointerEffect } from "./PointerEffect";
import { PlateShader } from "./PlateShader";
import { SequenceNav } from "./SequenceNav";
import { TeamSection } from "./TeamSection";
import { WorkGallery } from "./WorkGallery";
import {
  clearCurtainState,
  createCurtainReveal,
  createCurtainWordCycle,
  playCurtainWordIntro,
  restCurtainWord,
} from "./curtain-reveal";
import { bindTeamFan } from "./team-fan";
import { ShatterHeadline } from "./ShatterHeadline";
import { curtainReveal } from "./team-fan-tuning";
import {
  heroSequenceBeats as beats,
  heroSequenceCursorRoster,
  heroSequenceCursorSlots,
  heroSequenceCursorTones,
  heroSequenceHeadlineDrumWords,
  heroSequenceIntro,
  heroSequenceMotion,
} from "./content";

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollSmoother);

const vh = () => window.innerHeight;

export function HeroSequence() {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const select = gsap.utils.selector(root);
      const sequence = select(".hs-sequence")[0] as HTMLElement;
      const pin = select(".hs-pin")[0] as HTMLElement;
      const shatter = select(".hs-shatter")[0] as HTMLElement;
      const words = select(".hs-shatter__word") as HTMLElement[];
      const curtainVerb = select(
        '[data-curtain-verb="true"]',
      )[0] as HTMLElement | undefined;
      const navCurtains = select(".hs-nav__curtain") as HTMLElement[];
      const cursors = select(".hs-cursor") as HTMLElement[];
      const cursorLabels = select(".hs-cursor__label") as HTMLElement[];
      const navLinks = select(".hs-nav__links")[0] as HTMLElement;
      const loader = select(".hs-loader")[0] as HTMLElement;
      const loaderMark = select(".hs-loader-mark")[0] as HTMLElement;
      const markDrum = select(".hs-mark")[0] as HTMLElement;
      const firstWord = select(
        ".hs-mark__face:first-child .hs-mark__word",
      )[0] as HTMLElement;
      const logoFace = select(".hs-mark__face--logo")[0] as HTMLElement;
      const logoTarget = select(".hs-nav__logo-target")[0] as HTMLElement;
      const navLogo = select(".hs-nav__logo")[0] as HTMLElement;

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      /* ---------------------------------------------------------------- */
      /* Loader intro (runs once, independent of breakpoint changes)       */
      /* ---------------------------------------------------------------- */

      const markRestTransform = () => {
        const markRect = logoFace.getBoundingClientRect();
        const targetRect = logoTarget.getBoundingClientRect();

        return {
          x:
            targetRect.left +
            targetRect.width / 2 -
            (markRect.left + markRect.width / 2),
          y:
            targetRect.top +
            targetRect.height / 2 -
            (markRect.top + markRect.height / 2),
          scale: targetRect.width / markRect.width,
        };
      };

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
      /* Cursor roster — cycle full team through the 4 slots               */
      /* Whole cursors fade out → swap people/slots → fade in. Stops once */
      /* shatter scrub owns the cursors so the two motions don’t fight.   */
      /* ---------------------------------------------------------------- */

      const cursorGroupSize = cursors.length;
      const shuffledRoster = gsap.utils.shuffle([
        ...heroSequenceCursorRoster,
      ]);
      const cursorGroups: (typeof heroSequenceCursorRoster)[number][][] = [];
      for (let i = 0; i < shuffledRoster.length; i += cursorGroupSize) {
        const chunk = shuffledRoster.slice(i, i + cursorGroupSize);
        while (chunk.length < cursorGroupSize) {
          chunk.push(shuffledRoster[chunk.length % shuffledRoster.length]);
        }
        cursorGroups.push(chunk);
      }
      let cursorGroupIndex = 0;
      let cursorRosterAlive = !prefersReducedMotion;
      let cursorRosterSwap: gsap.core.Timeline | undefined;
      let getSequenceProgress = () => 0;

      const cursorRosterTick = gsap.delayedCall(
        heroSequenceMotion.cursorRosterHold,
        function cursorRosterRepeat() {
          swapCursorGroup();
          if (cursorRosterAlive) {
            cursorRosterTick.restart(true);
          }
        },
      );
      cursorRosterTick.pause();

      const applyCursorGroup = () => {
        const people = gsap.utils.shuffle([
          ...cursorGroups[cursorGroupIndex],
        ]);
        const slots = gsap.utils.shuffle([...heroSequenceCursorSlots]);
        // Draw without replacement so no two cursors in a group share a color.
        const tones = gsap.utils.shuffle([...heroSequenceCursorTones]);

        cursors.forEach((cursor, index) => {
          const person = people[index];
          const tone = tones[index % tones.length];
          cursor.dataset.person = person.id;
          cursor.dataset.slot = slots[index];
          cursor.dataset.tone = tone.id;
          cursor.dataset.text = tone.text;
          cursorLabels[index].textContent = person.name;
        });
      };

      applyCursorGroup();

      const stopCursorRoster = () => {
        cursorRosterAlive = false;
        cursorRosterTick.pause();
        cursorRosterSwap?.kill();
        cursorRosterSwap = undefined;
      };

      const swapCursorGroup = () => {
        if (!cursorRosterAlive) return;
        if (getSequenceProgress() > 0.002) {
          stopCursorRoster();
          return;
        }

        cursorGroupIndex = (cursorGroupIndex + 1) % cursorGroups.length;

        const fade = prefersReducedMotion
          ? 0
          : heroSequenceMotion.cursorRosterFade;
        const stagger = heroSequenceMotion.cursorRosterStagger;

        if (fade <= 0) {
          applyCursorGroup();
          return;
        }

        cursorRosterSwap?.kill();
        // Fade the whole cursor (arrow + label), swap the group, fade back in.
        cursorRosterSwap = gsap
          .timeline()
          .to(cursors, {
            autoAlpha: 0,
            filter: "blur(10px)",
            duration: fade,
            ease: "power2.in",
            stagger: { each: stagger, from: "random" },
          })
          .add(applyCursorGroup)
          .to(cursors, {
            autoAlpha: 1,
            filter: "blur(0px)",
            duration: fade,
            ease: "power2.out",
            stagger: { each: stagger, from: "random" },
          });
      };

      const startCursorRoster = () => {
        if (prefersReducedMotion) return;
        cursorRosterAlive = true;
        cursorRosterTick.restart(true);
      };

      /* ---------------------------------------------------------------- */
      /* Headline verb curtain + nav link curtains (replace drumroll)      */
      /* ---------------------------------------------------------------- */

      let headlineVerbCycle: gsap.core.Timeline | undefined;
      let headlineVerbIntro: gsap.core.Timeline | undefined;
      let headlineVerbRunning = false;
      let headlineVerbIntroduced = false;
      /* Keep fixed line breaks; scale the whole shatter block to the viewport
         width so words never wrap onto a new row when space gets tight. */
      const fitShatterHeadline = () => {
        if (!shatter) return;
        const headline = select(".hs-shatter__headline")[0] as
          | HTMLElement
          | undefined;
        if (!headline) return;

        gsap.set(shatter, { scale: 1, transformOrigin: "left bottom" });
        const available = shatter.clientWidth;
        const needed = headline.scrollWidth;
        if (available <= 0 || needed <= 0) return;
        gsap.set(shatter, {
          scale: Math.min(1, available / needed),
          transformOrigin: "left bottom",
        });
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

      const startHeadlineVerb = () => {
        if (!headlineVerbCycle || prefersReducedMotion || headlineVerbRunning) {
          return;
        }
        headlineVerbRunning = true;

        if (!headlineVerbIntroduced && curtainVerb) {
          headlineVerbIntroduced = true;
          headlineVerbIntro?.kill();
          headlineVerbIntro = playCurtainWordIntro(
            curtainVerb,
            curtainReveal,
            headlineVerbCycle,
            fitShatterHeadline,
          );
          return;
        }

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
        headlineVerbIntro?.pause(0);
        headlineVerbIntro?.kill();
        headlineVerbIntro = undefined;
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
        gsap.set([loader, loaderMark], { autoAlpha: 0, display: "none" });
        gsap.set([shatter, navLinks, navLogo], { autoAlpha: 1, y: 0 });
        ScrollTrigger.refresh();
        enableTouchScroll();
        startCursorRoster();
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
        gsap.set(loader, { autoAlpha: 1, display: "grid" });
        gsap.set(firstWord, { autoAlpha: 0, filter: "blur(18px)", y: 10 });
        gsap.set(shatter, { autoAlpha: 0, y: 28 });
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
              startCursorRoster();
              revealNavCurtains();
              startHeadlineVerb();
              fitShatterHeadline();
            },
            [],
            "reveal",
          )
          .to(
            loader,
            { autoAlpha: 0, duration: heroSequenceIntro.revealDuration },
            "reveal",
          )
          .to(
            loaderMark,
            {
              filter: "invert(1)",
              duration: heroSequenceIntro.revealDuration * 0.55,
            },
            "reveal+=0.15",
          )
          .to(
            loaderMark,
            {
              x: () => markRestTransform().x,
              y: () => markRestTransform().y,
              scale: () => markRestTransform().scale,
              duration: heroSequenceIntro.logoMoveDuration,
              ease: "expo.inOut",
              transformOrigin: "center center",
            },
            "reveal",
          )
          .set(
            loader,
            { display: "none" },
            `reveal+=${heroSequenceIntro.revealDuration}`,
          )
          .to(
            shatter,
            {
              autoAlpha: 1,
              y: 0,
              duration: heroSequenceIntro.revealDuration,
              ease: "expo.out",
            },
            "reveal",
          )
          /* Hand the wordmark over to the nav so it scrolls with the page. */
          .to(
            navLogo,
            { autoAlpha: 1, duration: 0.2 },
            `reveal+=${heroSequenceIntro.logoMoveDuration}`,
          )
          .set(
            loaderMark,
            { autoAlpha: 0, display: "none" },
            `reveal+=${heroSequenceIntro.logoMoveDuration + 0.2}`,
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
          const reduced = heroSequenceMotion.reduced;

          const blurAmount = (value: number) =>
            reduceMotion ? value * reduced.blur : value;
          const travel = reduceMotion
            ? heroSequenceMotion.wordTravel * reduced.travel
            : heroSequenceMotion.wordTravel;

          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: sequence,
              start: "top top",
              end: "bottom bottom",
              scrub: heroSequenceMotion.scrub,
              pin,
              pinSpacing: false,
        /* Crash triage: ?off=fixedpin pins with transforms, not position: fixed. */
        pinType: document.documentElement.dataset.off?.split(" ").includes("fixedpin")
          ? "transform"
          : undefined,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                getSequenceProgress = () => self.progress;

                if (
                  cursorRosterAlive &&
                  self.progress > 0.002
                ) {
                  stopCursorRoster();
                }
                /*
                 * Pause the verb cycle while shatter owns the headline;
                 * restart cleanly when the hero returns to rest.
                 */
                if (self.progress > 0.002) stopHeadlineVerb();
                else startHeadlineVerb();

              },
            },
          });

          /* Beat 1 — headline shatters upward; cursors lift the same way.
             Scrub span matches page pace (ease none, long runway). */
          const wordSpan = beats.shatterEnd - beats.shatterStart;
          const wordDuration = Math.max(
            0.01,
            wordSpan - beats.shatterStagger * (words.length - 1),
          );

          timeline.to(
            words,
            {
              y: () => -vh() * travel,
              autoAlpha: 0,
              filter: `blur(${blurAmount(heroSequenceMotion.wordBlur)}px)`,
              duration: wordDuration,
              // Even scrub — matches the rest of the page’s scroll pace.
              ease: "none",
              stagger: beats.shatterStagger,
            },
            beats.shatterStart,
          );

          timeline.to(
            cursors,
            {
              // Same upward shatter read as the words — they just finish sooner.
              y: () => -vh() * travel,
              autoAlpha: 0,
              filter: `blur(${blurAmount(heroSequenceMotion.cursorBlur)}px)`,
              duration: beats.cursorsOutEnd - beats.shatterStart,
              ease: "none",
              stagger: { each: 1.6, from: "random" },
            },
            beats.shatterStart,
          );


          const releaseTeam = bindTeamFan(root, {
            reduceMotion,
            layout: isMobile ? "phone" : isTablet ? "tablet" : "desktop",
          });

          return () => {
            releaseTeam();
            timeline.scrollTrigger?.kill();
            timeline.kill();
          };
        },
        root,
      );

      return () => {
        documentElement.style.removeProperty("overflow");
        stopCursorRoster();
        cursorRosterTick.kill();
        stopHeadlineVerb();
        headlineVerbIntro?.kill();
        headlineVerbCycle?.kill();
        navCurtainTl?.kill();
        navCurtains.forEach(clearCurtainState);
        if (curtainVerb) clearCurtainState(curtainVerb);
        shatterFitObserver?.disconnect();
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

            <div className="hs-scrub-runway" aria-hidden="true" />
          </div>

          <WorkGallery />

          <TeamSection />

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
