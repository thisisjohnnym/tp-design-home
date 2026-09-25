"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { ExperimentHero } from "./ExperimentHero";
import { LoaderOverlay } from "./LoaderOverlay";
import {
  experimentCursorRoster,
  experimentCursorSlots,
  experimentMotion,
} from "./content";

gsap.registerPlugin(useGSAP, CustomEase);

const headlineDrumEase = CustomEase.create(
  "experimentHeadlineDrum",
  "0.66, 0.266, 0, 0.793",
);

export function ExperimentPage() {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const select = gsap.utils.selector(root);
      const loader = select(".experiment-loader")[0] as HTMLElement;
      const movingMark = select(".experiment-loader-mark")[0] as HTMLElement;
      const drum = select(".experiment-brand-mark")[0] as HTMLElement;
      const firstFaceWord = select(
        ".experiment-brand-mark__face:first-child .experiment-brand-mark__word",
      )[0] as HTMLElement;
      const finalLogoFace = select(
        ".experiment-brand-mark__face--logo",
      )[0] as HTMLElement;
      const logoTarget = select(
        ".experiment-hero__logo-target",
      )[0] as HTMLElement;
      const headline = select(".experiment-hero__headline")[0] as HTMLElement;
      const headlineDrum = select(
        ".experiment-headline-drum__rotor",
      )[0] as HTMLElement;
      const headlineFaces = select(
        ".experiment-headline-drum__face",
      ) as HTMLElement[];
      const headlineFaceCharacters = headlineFaces.map((face) =>
        Array.from(
          face.querySelectorAll<HTMLElement>(
            ".experiment-headline-drum__character",
          ),
        ),
      );
      const heroCursors = select(".experiment-cursor") as HTMLElement[];
      const heroCursorLabels = heroCursors.map(
        (cursor) =>
          cursor.querySelector<HTMLElement>(".experiment-cursor__label")!,
      );
      const heroMeta = select(".experiment-hero__meta") as HTMLElement[];

      const restTransform = () => {
        const markRect = finalLogoFace.getBoundingClientRect();
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

      const media = gsap.matchMedia();

      media.add(
        {
          reduceMotion: "(prefers-reduced-motion: reduce)",
          allowMotion: "(prefers-reduced-motion: no-preference)",
        },
        (context) => {
          const reduceMotion = context.conditions?.reduceMotion;
          const shuffledRoster = gsap.utils.shuffle([
            ...experimentCursorRoster,
          ]);
          const groupSize = heroCursors.length;
          const cursorGroups: (typeof experimentCursorRoster)[number][][] =
            [];
          for (let i = 0; i < shuffledRoster.length; i += groupSize) {
            const chunk = shuffledRoster.slice(i, i + groupSize);
            while (chunk.length < groupSize) {
              chunk.push(shuffledRoster[chunk.length % shuffledRoster.length]);
            }
            cursorGroups.push(chunk);
          }
          const shuffledSlots = gsap.utils.shuffle([
            ...experimentCursorSlots,
          ]);
          const cursorSlotGroups = [
            shuffledSlots.slice(0, heroCursors.length),
            shuffledSlots.slice(heroCursors.length),
          ];
          let cursorGroupIndex = 0;

          const applyCursorGroup = () => {
            const people = gsap.utils.shuffle([
              ...cursorGroups[cursorGroupIndex],
            ]);
            const slots = gsap.utils.shuffle([
              ...cursorSlotGroups[cursorGroupIndex],
            ]);

            heroCursors.forEach((cursor, index) => {
              const person = people[index];

              cursor.dataset.person = person.id;
              cursor.dataset.slot = slots[index];
              cursor.dataset.text = person.text;
              heroCursorLabels[index].textContent = person.name;
            });
          };

          applyCursorGroup();

          gsap.set(loader, { autoAlpha: 1, display: "grid" });
          gsap.set(movingMark, {
            filter: "none",
            scale: 1,
            transformOrigin: "center center",
            x: 0,
            y: 0,
          });
          gsap.set(drum, {
            rotationX: 0,
            transformOrigin: "center center",
          });
          gsap.set(headlineDrum, {
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
          gsap.set(heroCursors, {
            autoAlpha: reduceMotion ? 1 : 0,
            filter: reduceMotion ? "blur(0px)" : "blur(12px)",
            x: 0,
            y: 0,
          });
          gsap.set(firstFaceWord, {
            autoAlpha: 0,
            filter: "blur(18px)",
            y: 10,
          });

          if (reduceMotion) {
            gsap.set(loader, { autoAlpha: 0, display: "none" });
            gsap.set(firstFaceWord, { autoAlpha: 1, filter: "none", y: 0 });
            gsap.set(drum, { rotationX: -270 });
            gsap.set([headline, heroMeta], { autoAlpha: 1, y: 0 });
            gsap.set(movingMark, {
              ...restTransform(),
              filter: "invert(1)",
              transformOrigin: "center center",
            });
            return;
          }

          gsap.set([headline, heroMeta], { autoAlpha: 0, y: 32 });

          const headlineLoop = gsap.timeline({
            paused: true,
            repeat: -1,
          });

          [-90, -180, -270, -360].forEach((rotationX, faceIndex) => {
            const stepLabel = `headline-face-${faceIndex}`;
            const outgoingCharacters = headlineFaceCharacters[faceIndex];
            const incomingCharacters =
              headlineFaceCharacters[(faceIndex + 1) % headlineFaces.length];

            headlineLoop
              .addLabel(stepLabel, `+=${experimentMotion.headlineWordHold}`)
              .to(
                headlineDrum,
                {
                  rotationX,
                  duration: experimentMotion.headlineRollDuration,
                  ease: headlineDrumEase,
                },
                stepLabel,
              )
              .to(
                outgoingCharacters,
                {
                  autoAlpha: 0,
                  filter: `blur(${experimentMotion.headlineCharacterBlur}px)`,
                  yPercent: 18,
                  duration: experimentMotion.headlineCharacterDuration,
                  ease: headlineDrumEase,
                  stagger: experimentMotion.headlineCharacterStagger,
                },
                stepLabel,
              )
              .fromTo(
                incomingCharacters,
                {
                  autoAlpha: 0,
                  filter: `blur(${experimentMotion.headlineCharacterBlur}px)`,
                  yPercent: -18,
                },
                {
                  autoAlpha: 1,
                  filter: "blur(0px)",
                  yPercent: 0,
                  duration: experimentMotion.headlineCharacterDuration,
                  ease: headlineDrumEase,
                  stagger: experimentMotion.headlineCharacterStagger,
                  immediateRender: false,
                },
                stepLabel,
              );
          });

          const cursorLoop = gsap.timeline({
            paused: true,
            repeat: -1,
            repeatRefresh: true,
            onRepeat: () => {
              cursorGroupIndex = (cursorGroupIndex + 1) % cursorGroups.length;
              applyCursorGroup();
            },
          });

          const randomCursorOffset = () =>
            gsap.utils.random(
              -experimentMotion.cursorMoveRadius,
              experimentMotion.cursorMoveRadius,
              1,
            );
          const movingCursors = gsap.utils
            .shuffle([...heroCursors])
            .slice(0, 2);

          cursorLoop
            .set(heroCursors, {
              autoAlpha: 0,
              filter: "blur(12px)",
              x: 0,
              y: 0,
            })
            .to(heroCursors, {
              autoAlpha: 1,
              filter: "blur(0px)",
              duration: experimentMotion.cursorFadeDuration,
              ease: "power2.out",
              stagger: {
                each: experimentMotion.cursorFadeStagger,
                from: "random",
              },
            });

          movingCursors.forEach((cursor) => {
            cursorLoop.to(
              cursor,
              {
                x: randomCursorOffset,
                y: randomCursorOffset,
                duration: experimentMotion.cursorMoveDuration,
                ease: "power2.inOut",
              },
              `+=${experimentMotion.cursorMovePause}`,
            );
          });

          cursorLoop.to(
            heroCursors,
            {
              autoAlpha: 0,
              filter: "blur(12px)",
              duration: experimentMotion.cursorFadeDuration,
              ease: "power2.in",
              stagger: {
                each: experimentMotion.cursorFadeStagger,
                from: "random",
              },
            },
            `+=${experimentMotion.cursorSettlePause}`,
          );

          const timeline = gsap.timeline({
            defaults: { ease: "power3.inOut" },
          });

          timeline
            .to(
              firstFaceWord,
              {
                autoAlpha: 1,
                filter: "blur(0px)",
                y: 0,
                duration: experimentMotion.firstFaceDuration,
                ease: "power2.out",
              },
            )
            .to(
              drum,
              {
                rotationX: -90,
                duration: experimentMotion.rollDuration,
              },
              `+=${experimentMotion.firstFaceHold}`,
            )
            .to(
              drum,
              {
                rotationX: -180,
                duration: experimentMotion.rollDuration,
              },
              `+=${experimentMotion.faceHold}`,
            )
            .to(
              drum,
              {
                rotationX: -270,
                duration: experimentMotion.rollDuration,
              },
              `+=${experimentMotion.faceHold}`,
            )
            .addLabel("reveal", `+=${experimentMotion.finalLogoHold}`)
            .call(
              () => {
                headlineLoop.play(0);
                cursorLoop.play(0);
              },
              [],
              "reveal",
            )
            .to(
              loader,
              {
                autoAlpha: 0,
                duration: experimentMotion.revealDuration,
              },
              "reveal",
            )
            .to(
              movingMark,
              {
                filter: "invert(1)",
                duration: experimentMotion.revealDuration * 0.55,
              },
              "reveal+=0.15",
            )
            .to(
              movingMark,
              {
                x: () => restTransform().x,
                y: () => restTransform().y,
                scale: () => restTransform().scale,
                duration: experimentMotion.logoMoveDuration,
                ease: "expo.inOut",
                transformOrigin: "center center",
              },
              "reveal",
            )
            .set(
              loader,
              { display: "none" },
              `reveal+=${experimentMotion.revealDuration}`,
            )
            .to(
              headline,
              {
                autoAlpha: 1,
                y: 0,
                duration: experimentMotion.revealDuration,
                ease: "expo.out",
              },
              "reveal",
            )
            .to(
              heroMeta,
              {
                autoAlpha: 1,
                y: 0,
                duration: experimentMotion.revealDuration,
                ease: "expo.out",
                stagger: 0.08,
              },
              "reveal",
            );

          return () => {
            cursorLoop.kill();
            headlineLoop.kill();
            timeline.kill();
          };
        },
        root,
      );

      return () => media.revert();
    },
    { scope: rootRef },
  );

  return (
    <div className="experiment-shell" ref={rootRef}>
      <ExperimentHero />
      <LoaderOverlay />
    </div>
  );
}
