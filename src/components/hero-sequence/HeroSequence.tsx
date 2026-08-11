"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { CollabTitle } from "./CollabTitle";
import { LoaderIntro } from "./LoaderIntro";
import { MidCopy } from "./MidCopy";
import { ResourceCards } from "./ResourceCards";
import { SequenceNav } from "./SequenceNav";
import { ShatterHeadline } from "./ShatterHeadline";
import { SphereLeft, SphereRight } from "./Sphere";
import {
  heroSequenceBeats as beats,
  heroSequenceCollab,
  heroSequenceCursorRoster,
  heroSequenceCursorSlots,
  heroSequenceHeadlineDrumWords,
  heroSequenceIntro,
  heroSequenceMotion,
  sphereFrames,
  sphereNaturalWidth,
  sphereUnitFraction,
  type SphereFrame,
  type SpherePose,
} from "./content";

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollSmoother);

const vw = () => window.innerWidth;
const vh = () => window.innerHeight;

function lerpFrame(from: SphereFrame, to: SphereFrame, amount: number) {
  return {
    x: from.x + (to.x - from.x) * amount,
    y: from.y + (to.y - from.y) * amount,
    scale: from.scale + (to.scale - from.scale) * amount,
  };
}

export function HeroSequence() {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const select = gsap.utils.selector(root);
      const sequence = select(".hs-sequence")[0] as HTMLElement;
      const pin = select(".hs-pin")[0] as HTMLElement;
      const band = select(".hs-band")[0] as HTMLElement;
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
      const midLayer = select(".hs-layer--mid")[0] as HTMLElement;
      const logos = select(".hs-logos")[0] as HTMLElement;
      const collab = select(".hs-collab")[0] as HTMLElement;
      const collabBrand = select(".hs-collab__brand")[0] as HTMLElement;
      const spheres = {
        left: select('[data-sphere="left"]')[0] as HTMLElement,
        right: select('[data-sphere="right"]')[0] as HTMLElement,
      };
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
      const cardItems = select(".hs-cards__item") as HTMLElement[];

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      const bandRestHeight = () => {
        const value = getComputedStyle(root).getPropertyValue(
          "--hs-band-height",
        );
        return parseFloat(value) || 480;
      };

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
          reduceMotion: "(prefers-reduced-motion: reduce)",
          allowMotion: "(prefers-reduced-motion: no-preference)",
        },
        (context) => {
          const isMobile = Boolean(context.conditions?.isMobile);
          const reduceMotion = Boolean(context.conditions?.reduceMotion);
          const reduced = heroSequenceMotion.reduced;

          const blurAmount = (value: number) =>
            reduceMotion ? value * reduced.blur : value;
          const travel = reduceMotion
            ? heroSequenceMotion.wordTravel * reduced.travel
            : heroSequenceMotion.wordTravel;
          const midTravel = reduceMotion
            ? heroSequenceMotion.midCopyTravel * reduced.travel
            : heroSequenceMotion.midCopyTravel;
          const logosTravel = reduceMotion
            ? heroSequenceMotion.logosTravel * reduced.travel
            : heroSequenceMotion.logosTravel;

          const unit = () =>
            vw() *
            (isMobile ? sphereUnitFraction.mobile : sphereUnitFraction.desktop);

          const frame = (side: "left" | "right", key: SpherePose) => {
            const target = sphereFrames[side][key];
            if (!reduceMotion) return target;
            // Gentler journey: keep the story beats but compress the deltas
            // around the settled "lock" pose.
            return lerpFrame(sphereFrames[side].lock, target, reduced.sphereDelta);
          };

          const pose = (side: "left" | "right", key: SpherePose) => {
            const value = frame(side, key);
            return {
              x: () => vw() * value.x,
              y: () => vh() * value.y,
              // Storyboard scale is relative to the 875 wrapper, not the inner disc.
              scale: () => (unit() / sphereNaturalWidth) * value.scale,
            };
          };

          /**
           * Scrubbed pose-to-pose on one tween (shared ease). Split x/y eases
           * under scrub read as wobble — curve comes from lockArc keyframes.
           */
          const scrubSphereArc = (
            side: "left" | "right",
            fromKey: SpherePose,
            toKey: SpherePose,
            duration: number,
            at: number,
          ) => {
            timeline.fromTo(
              spheres[side],
              pose(side, fromKey),
              {
                ...pose(side, toKey),
                duration,
                ease: "none",
                immediateRender: false,
              },
              at,
            );
          };

          gsap.set(spheres.left, {
            zIndex: 1,
            transformOrigin: "center center",
            ...pose("left", "land"),
          });
          gsap.set(spheres.right, {
            zIndex: 2,
            transformOrigin: "center center",
            ...pose("right", "land"),
          });

          /* Soft scroll lock once logos are fully in — once per downward pass. */
          let logosHoldArmed = !reduceMotion;
          let logosHoldTimer: gsap.core.Tween | undefined;

          const releaseLogosHold = () => {
            smoother?.paused(false);
            documentElement.style.removeProperty("overflow");
          };

          const engageLogosHold = () => {
            if (reduceMotion || !logosHoldArmed) return;
            logosHoldArmed = false;
            if (smoother) {
              smoother.paused(true);
            } else {
              documentElement.style.overflow = "hidden";
            }
            logosHoldTimer?.kill();
            logosHoldTimer = gsap.delayedCall(
              heroSequenceMotion.logosHoldSeconds,
              releaseLogosHold,
            );
          };

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
                const pct = self.progress * beats.total;

                if (
                  cursorRosterAlive &&
                  self.progress > 0.002
                ) {
                  stopCursorRoster();
                }
                // Stop the verb drum once shatter owns the headline motion.
                if (self.progress > 0.002) stopHeadlineDrum();

                // Re-arm hold when the visitor scrolls back above the logos.
                if (pct < beats.logosInStart) {
                  logosHoldArmed = !reduceMotion;
                } else if (self.direction === 1 && pct >= beats.logosInEnd) {
                  engageLogosHold();
                }
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

          /* Beat 2 — spheres rise, then settle through a bowed lockArc mid
             (geometry = curve; linear scrub = no axis wobble). */
          (["left", "right"] as const).forEach((side) => {
            const riseDur = beats.spheresZoomEnd - beats.spheresRiseStart;
            const lockSpan = beats.spheresLockEnd - beats.spheresZoomEnd;
            const arcDur = lockSpan * 0.55;
            const settleDur = lockSpan - arcDur;

            scrubSphereArc(
              side,
              "land",
              "zoom",
              riseDur,
              beats.spheresRiseStart,
            );

            scrubSphereArc(
              side,
              "zoom",
              "lockArc",
              arcDur,
              beats.spheresZoomEnd,
            );

            scrubSphereArc(
              side,
              "lockArc",
              "lock",
              settleDur,
              beats.spheresZoomEnd + arcDur,
            );

            scrubSphereArc(
              side,
              "lock",
              "overlap",
              beats.spheresOverlapEnd - beats.spheresOverlapStart,
              beats.spheresOverlapStart,
            );
          });

          /* Left sphere grows and shifts left so the takeover never opens a
             black void on the left edge of the frame. */
          timeline.fromTo(
            spheres.left,
            {
              ...pose("left", "overlap"),
              transformOrigin: "50% 50%",
            },
            {
              ...pose("left", "takeover"),
              transformOrigin: "50% 50%",
              duration: beats.spheresTakeoverEnd - beats.spheresTakeoverStart,
              ease: "none",
              immediateRender: false,
            },
            beats.spheresTakeoverStart,
          );

          /* After takeover scale settles — keep the left field drifting on Y
             (slower than scroll) so it doesn’t freeze under the collab/band. */
          timeline.fromTo(
            spheres.left,
            {
              ...pose("left", "takeover"),
              transformOrigin: "50% 50%",
            },
            {
              ...pose("left", "takeoverParallax"),
              transformOrigin: "50% 50%",
              duration: beats.bandClipEnd - beats.spheresTakeoverEnd,
              ease: "none",
              immediateRender: false,
            },
            beats.spheresTakeoverEnd,
          );

          timeline.fromTo(
            spheres.right,
            pose("right", "overlap"),
            {
              ...pose("right", "takeover"),
              duration: beats.spheresTakeoverEnd - beats.spheresTakeoverStart,
              ease: "none",
              immediateRender: false,
            },
            beats.spheresTakeoverStart,
          );

          /* The left sphere rises above its sibling as they overlap. */
          timeline
            .set(spheres.left, { zIndex: 3 }, beats.spheresOverlapStart)
            .set(spheres.right, { zIndex: 2 }, beats.spheresOverlapStart);

          /* Beat 3 — mid copy rises from below, then keeps scrolling out. */
          timeline
            .fromTo(
              midLayer,
              { autoAlpha: 0, y: () => vh() * midTravel },
              {
                autoAlpha: 1,
                y: 0,
                duration: beats.midCopyInEnd - beats.midCopyInStart,
                // Linear tracks scrub so it reads as page scroll, not a pop-in.
                ease: "none",
              },
              beats.midCopyInStart,
            )
            .fromTo(
              midLayer,
              {
                filter: `blur(${blurAmount(heroSequenceMotion.midCopyBlur)}px)`,
              },
              {
                filter: "blur(0px)",
                duration: beats.midCopyBlurEnd - beats.midCopyInStart,
                ease: "none",
              },
              beats.midCopyInStart,
            )
            .to(
              midLayer,
              {
                autoAlpha: 0,
                y: () => -vh() * midTravel * 0.72,
                filter: `blur(${blurAmount(heroSequenceMotion.midCopyBlur)}px)`,
                duration: beats.midCopyOutEnd - beats.midCopyOutStart,
                ease: "none",
              },
              beats.midCopyOutStart,
            );

          /* Logos trail the mid copy slightly so the strip feels scroll-linked. */
          timeline
            .fromTo(
              logos,
              { autoAlpha: 0, y: () => vh() * logosTravel },
              {
                autoAlpha: 1,
                y: 0,
                duration: beats.logosInEnd - beats.logosInStart,
                ease: "none",
              },
              beats.logosInStart,
            )
            .to(
              logos,
              {
                autoAlpha: 0,
                y: () => -vh() * logosTravel * 1.1,
                duration: beats.logosOutEnd - beats.logosOutStart,
                ease: "none",
              },
              beats.logosOutStart,
            );

          /* Beat 4 — collab title enters centered (stair-step lines), then
             scrubs flush-left into the band. Transforms only — full copy stays
             in the DOM (no width morph for “on {brand}”). */
          const collabLines = select(".hs-collab__line") as HTMLElement[];

          const collabCenterY = () => {
            const layer = collab.parentElement;
            if (!layer) return 0;
            // Title rests at the bottom; lift it so its midpoint sits on the scene center.
            return -(layer.clientHeight / 2 - collab.offsetHeight / 2);
          };

          const collabLineIndent = () =>
            parseFloat(getComputedStyle(collab).fontSize) *
            heroSequenceCollab.lineIndentEm;

          /**
           * alignT: 0 = centered stair-step (line 2 indented),
           *         1 = band lock — both lines flush left (matches Paper frame 7).
           */
          const syncCollabLineAlign = (alignT: number) => {
            const t = Math.min(1, Math.max(0, alignT));
            const indent = collabLineIndent();
            const line0 = collabLines[0];
            const line1 = collabLines[1];
            if (!line0 || !line1) return;

            const stackWidth = Math.max(
              line0.offsetWidth,
              indent + line1.offsetWidth,
            );
            const centerPad = Math.max(
              0,
              (collab.clientWidth - stackWidth) / 2,
            );

            collabLines.forEach((line, index) => {
              const stepX = index === 0 ? 0 : indent;
              const centeredX = centerPad + stepX;
              // Locked: both lines at x = 0. Entrance: stair-step, optically centered.
              gsap.set(line, {
                x: centeredX * (1 - t),
              });
            });
          };

          gsap.set(collabBrand, { pointerEvents: "none" });
          syncCollabLineAlign(0);

          timeline
            .fromTo(
              collab,
              {
                autoAlpha: 0,
                y: () => collabCenterY() + vh() * 0.12 * travel,
                scale: reduceMotion ? 0.98 : 0.96,
                filter: `blur(${blurAmount(heroSequenceMotion.collabBlur)}px)`,
              },
              {
                autoAlpha: 1,
                y: () => collabCenterY(),
                scale: 1,
                filter: "blur(0px)",
                duration: beats.collabCenterInEnd - beats.collabCenterInStart,
                ease: "none",
                onUpdate: () => syncCollabLineAlign(0),
              },
              beats.collabCenterInStart,
            )
            .to(
              collab,
              {
                y: 0,
                duration: beats.collabMorphEnd - beats.collabMorphStart,
                // Soft scrub curve so the left settle eases, not linear-snaps.
                ease: "power2.inOut",
                onUpdate: function onCollabMorph() {
                  syncCollabLineAlign(this.ratio);
                  if (this.ratio > 0.55) {
                    gsap.set(collabBrand, { pointerEvents: "auto" });
                  } else {
                    gsap.set(collabBrand, { pointerEvents: "none" });
                  }
                },
              },
              beats.collabMorphStart,
            );

          /* Beat 5 — artwork clips to a header band. Pin + runway heights stay
             fixed (stable scrub range); cards sit under the band inside the pin
             and fill the revealed lower viewport — no dead void. */
          const clipDuration = beats.bandClipEnd - beats.bandClipStart;

          timeline.fromTo(
            band,
            { height: () => vh() },
            {
              height: () => bandRestHeight(),
              duration: clipDuration,
              ease: "none",
            },
            beats.bandClipStart,
          );

          /* Resource cards fade up as the band clips open space for them. */
          timeline.fromTo(
            cardItems,
            { autoAlpha: 0, y: 28 },
            {
              autoAlpha: 1,
              y: 0,
              duration: clipDuration,
              ease: "none",
              stagger: 0.08,
            },
            beats.bandClipStart,
          );

          return () => {
            logosHoldTimer?.kill();
            releaseLogosHold();
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
                <div className="hs-art-clip" aria-hidden="true">
                  <div className="hs-art">
                    <div className="hs-sphere-slot" data-sphere="right">
                      <SphereRight />
                    </div>
                    <div className="hs-sphere-slot" data-sphere="left">
                      <SphereLeft />
                    </div>
                  </div>
                </div>

                <div className="hs-band__inner">
                  <SequenceNav />

                  <div className="hs-scene">
                    <ShatterHeadline />
                    <MidCopy />
                    <CollabTitle />
                  </div>
                </div>
              </div>

              <ResourceCards />
            </div>

            <div className="hs-scrub-runway" aria-hidden="true" />
          </div>
        </div>
      </div>

      {/* Fixed loader stays outside ScrollSmoother content. */}
      <LoaderIntro />
    </div>
  );
}
