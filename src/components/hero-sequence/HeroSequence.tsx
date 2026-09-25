"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { CapabilitiesSection } from "./CapabilitiesSection";
import { LoaderIntro } from "./LoaderIntro";
import { SequenceNav } from "./SequenceNav";
import { TeamSection } from "./TeamSection";
import { bindTeamFan } from "./team-fan";
import { ShatterHeadline } from "./ShatterHeadline";
import {
  heroSequenceBeats as beats,
  heroSequenceCursorRoster,
  heroSequenceCursorSlots,
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
      const headlineDrumTrack = select(
        ".hs-headline-drum__track",
      )[0] as HTMLElement | undefined;
      const headlineRotor = select(
        ".hs-headline-drum__rotor",
      )[0] as HTMLElement | undefined;
      const headlineFaces = select(
        ".hs-headline-drum__face",
      ) as HTMLElement[];
      const headlineSizers = select(
        ".hs-headline-drum__sizer",
      ) as HTMLElement[];
      const headlineFaceCharacters = headlineFaces.map(
        (face) =>
          gsap.utils.toArray<HTMLElement>(
            face.querySelectorAll(".hs-headline-drum__character"),
          ),
      );
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

        cursors.forEach((cursor, index) => {
          const person = people[index];
          cursor.dataset.person = person.id;
          cursor.dataset.slot = slots[index];
          cursor.dataset.text = person.text;
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
      /* Headline drum — roll verbs on “Building”, soft-push “what's”     */
      /* ---------------------------------------------------------------- */

      let headlineLoop: gsap.core.Timeline | undefined;

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
      void document.fonts?.ready.then(() => fitShatterHeadline());

      const syncHeadlineDrumWidth = (faceIndex: number, animate: boolean) => {
        if (!headlineDrumTrack || !headlineSizers[faceIndex]) return;
        const nextWidth = headlineSizers[faceIndex].offsetWidth;

        if (!animate || prefersReducedMotion) {
          gsap.set(headlineDrumTrack, { width: nextWidth });
          fitShatterHeadline();
          return;
        }

        // Soft width change reflows “what's” beside the drum — no extra x nudge
        // (that would double-push on top of layout).
        gsap.to(headlineDrumTrack, {
          width: nextWidth,
          duration: heroSequenceMotion.headlineWidthDuration,
          ease: "power2.inOut",
          overwrite: "auto",
          onUpdate: fitShatterHeadline,
          onComplete: fitShatterHeadline,
        });
      };

      if (headlineRotor && headlineDrumTrack && headlineFaces.length > 0) {
        gsap.set(headlineRotor, {
          rotationX: 0,
          transformOrigin: "center center",
        });
        headlineFaceCharacters.forEach((characters, faceIndex) => {
          gsap.set(characters, {
            autoAlpha: faceIndex === 0 ? 1 : 0,
            filter: "blur(0px)",
            yPercent: 0,
          });
        });
        syncHeadlineDrumWidth(0, false);

        if (!prefersReducedMotion) {
          headlineLoop = gsap.timeline({ paused: true, repeat: -1 });

          heroSequenceHeadlineDrumWords.forEach((_, faceIndex) => {
            const stepLabel = `headline-face-${faceIndex}`;
            const nextIndex =
              (faceIndex + 1) % heroSequenceHeadlineDrumWords.length;
            const rotationX =
              (-360 / heroSequenceHeadlineDrumWords.length) * (faceIndex + 1);
            const outgoing = headlineFaceCharacters[faceIndex];
            const incoming = headlineFaceCharacters[nextIndex];

            headlineLoop!
              .addLabel(stepLabel, `+=${heroSequenceMotion.headlineWordHold}`)
              .call(() => {
                syncHeadlineDrumWidth(nextIndex, true);
              }, [], stepLabel)
              .to(
                headlineRotor,
                {
                  rotationX,
                  duration: heroSequenceMotion.headlineRollDuration,
                  ease: "power3.inOut",
                },
                stepLabel,
              )
              .to(
                outgoing,
                {
                  autoAlpha: 0,
                  filter: `blur(${heroSequenceMotion.headlineCharacterBlur}px)`,
                  yPercent: 18,
                  duration: heroSequenceMotion.headlineCharacterDuration,
                  ease: "power2.in",
                  stagger: heroSequenceMotion.headlineCharacterStagger,
                },
                stepLabel,
              )
              .fromTo(
                incoming,
                {
                  autoAlpha: 0,
                  filter: `blur(${heroSequenceMotion.headlineCharacterBlur}px)`,
                  yPercent: -18,
                },
                {
                  autoAlpha: 1,
                  filter: "blur(0px)",
                  yPercent: 0,
                  duration: heroSequenceMotion.headlineCharacterDuration,
                  ease: "power2.out",
                  stagger: heroSequenceMotion.headlineCharacterStagger,
                  immediateRender: false,
                },
                `${stepLabel}+=0.08`,
              );
          });

          // After a full turn, snap rotor back so the next loop doesn’t unwind.
          headlineLoop.call(() => {
            gsap.set(headlineRotor, { rotationX: 0 });
            headlineFaceCharacters.forEach((characters, faceIndex) => {
              gsap.set(characters, {
                autoAlpha: faceIndex === 0 ? 1 : 0,
                filter: "blur(0px)",
                yPercent: 0,
              });
            });
            syncHeadlineDrumWidth(0, true);
          });
        }
      }

      const startHeadlineDrum = () => {
        if (!headlineLoop || prefersReducedMotion) return;
        headlineLoop.play(0);
      };

      const stopHeadlineDrum = () => {
        headlineLoop?.pause();
      };

      if (skipIntro) {
        gsap.set([loader, loaderMark], { autoAlpha: 0, display: "none" });
        gsap.set([shatter, navLinks, navLogo], { autoAlpha: 1, y: 0 });
        ScrollTrigger.refresh();
        startCursorRoster();
        startHeadlineDrum();
        fitShatterHeadline();
      } else {
        documentElement.style.overflow = "hidden";
        smoother?.paused(true);

        gsap.set(navLogo, { autoAlpha: 0 });
        gsap.set(loader, { autoAlpha: 1, display: "grid" });
        gsap.set(firstWord, { autoAlpha: 0, filter: "blur(18px)", y: 10 });
        gsap.set([shatter, navLinks], { autoAlpha: 0, y: 28 });

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
              smoother?.paused(false);
              ScrollTrigger.refresh();
              startCursorRoster();
              startHeadlineDrum();
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
            [shatter, navLinks],
            {
              autoAlpha: 1,
              y: 0,
              duration: heroSequenceIntro.revealDuration,
              ease: "expo.out",
              stagger: 0.08,
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
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                getSequenceProgress = () => self.progress;

                if (
                  cursorRosterAlive &&
                  self.progress > 0.002
                ) {
                  stopCursorRoster();
                }
                // Stop the verb drum once shatter owns the headline motion.
                if (self.progress > 0.002) stopHeadlineDrum();

              },
            },
          });

          /* Beat 1 — headline shatters upward; cursors lift the same way, earlier.
             Long scrub span + power2.in = soft start, eased acceleration. */
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
              // Scrubbed ease: slow lift at first, then accelerates away.
              ease: "power2.in",
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
              ease: "power2.in",
              stagger: { each: 0.9, from: "random" },
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
        headlineLoop?.kill();
        shatterFitObserver?.disconnect();
        smoother?.kill();
        media.revert();
      };
    },
    { scope: rootRef },
  );

  return (
    <div className="hs-root" ref={rootRef}>
      {/* Stack (back → front): canvas → grid → fine noise → UI. */}
      <div className="hs-backdrop" aria-hidden="true" />
      <div className="hs-grid" aria-hidden="true">
        {Array.from({ length: 12 }, (_, index) => (
          <div className="hs-grid__col" key={index} />
        ))}
      </div>
      <div className="hs-noise" aria-hidden="true">
        <div className="hs-noise__drift" />
      </div>

      <div className="hs-smooth-wrapper">
        <div className="hs-smooth-content">
          <div className="hs-sequence">
            <div className="hs-pin">
              <div className="hs-band">
                <div className="hs-band__inner">
                  <SequenceNav />

                  <div className="hs-scene">
                    <ShatterHeadline />
                  </div>
                </div>
              </div>
            </div>

            <div className="hs-scrub-runway" aria-hidden="true" />
          </div>

          <TeamSection />

          <CapabilitiesSection />
        </div>
      </div>

      {/* Fixed loader stays outside ScrollSmoother content. */}
      <LoaderIntro />
    </div>
  );
}
