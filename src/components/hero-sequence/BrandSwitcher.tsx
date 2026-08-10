"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { heroSequenceBrands, heroSequenceMotion } from "./content";

function Chevron() {
  return (
    <svg
      className="hs-brand__chevron"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 9 L12 16 L19 9"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function BrandSwitcher() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const drumRef = useRef<HTMLSpanElement>(null);
  const rotorRef = useRef<HTMLSpanElement>(null);
  const sizerRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const previousIndex = useRef(0);
  const menuId = useId();

  const activeBrand = heroSequenceBrands[activeIndex];

  const syncWidth = () => {
    const sizer = sizerRefs.current[activeIndex];
    if (!sizer || !drumRef.current) return;
    gsap.set(drumRef.current, { width: sizer.offsetWidth });
  };

  useEffect(() => {
    syncWidth();
    window.addEventListener("resize", syncWidth);
    return () => window.removeEventListener("resize", syncWidth);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  useGSAP(
    () => {
      const rotor = rotorRef.current;
      const drum = drumRef.current;
      if (!rotor || !drum) return;

      const from = previousIndex.current;
      previousIndex.current = activeIndex;
      if (from === activeIndex) return;

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const nextWidth = sizerRefs.current[activeIndex]?.offsetWidth;

      if (reduceMotion) {
        gsap.set(rotor, { rotationX: -90 * activeIndex });
        if (nextWidth) gsap.set(drum, { width: nextWidth });
        return;
      }

      const outgoing = rotor.querySelectorAll<HTMLElement>(
        `[data-face="${from}"] .hs-brand__character`,
      );
      const incoming = rotor.querySelectorAll<HTMLElement>(
        `[data-face="${activeIndex}"] .hs-brand__character`,
      );

      const timeline = gsap.timeline();

      timeline
        .to(rotor, {
          rotationX: -90 * activeIndex,
          duration: heroSequenceMotion.brandRollDuration,
          ease: "power3.inOut",
        })
        .to(
          outgoing,
          {
            autoAlpha: 0,
            filter: `blur(${heroSequenceMotion.brandCharacterBlur}px)`,
            yPercent: 18,
            duration: heroSequenceMotion.brandCharacterDuration,
            ease: "power2.in",
            stagger: heroSequenceMotion.brandCharacterStagger,
          },
          0,
        )
        .fromTo(
          incoming,
          {
            autoAlpha: 0,
            filter: `blur(${heroSequenceMotion.brandCharacterBlur}px)`,
            yPercent: -18,
          },
          {
            autoAlpha: 1,
            filter: "blur(0px)",
            yPercent: 0,
            duration: heroSequenceMotion.brandCharacterDuration,
            ease: "power2.out",
            stagger: heroSequenceMotion.brandCharacterStagger,
            immediateRender: false,
          },
          0.1,
        );

      if (nextWidth) {
        timeline.to(
          drum,
          {
            width: nextWidth,
            duration: heroSequenceMotion.brandRollDuration,
            ease: "power3.inOut",
          },
          0,
        );
      }
    },
    { dependencies: [activeIndex], scope: rootRef },
  );

  return (
    <div className="hs-brand" ref={rootRef}>
      <button
        type="button"
        className="hs-brand__trigger"
        aria-expanded={open}
        aria-controls={menuId}
        aria-haspopup="listbox"
        onClick={() => setOpen((value) => !value)}
      >
        <span className="hs-sr-only">
          Change brand, currently {activeBrand.label}
        </span>

        <span className="hs-brand__drum" ref={drumRef} aria-hidden="true">
          <span className="hs-brand__window">
            <span className="hs-brand__rotor" ref={rotorRef}>
              {heroSequenceBrands.map((brand, index) => (
                <span
                  className="hs-brand__face"
                  data-face={index}
                  key={brand.id}
                >
                  {Array.from(brand.label).map((character, characterIndex) => (
                    <span
                      className="hs-brand__character"
                      key={`${brand.id}-${characterIndex}`}
                    >
                      {character === " " ? "\u00a0" : character}
                    </span>
                  ))}
                </span>
              ))}
            </span>
          </span>
        </span>

        <Chevron />
      </button>

      <span className="hs-brand__sizers" aria-hidden="true">
        {heroSequenceBrands.map((brand, index) => (
          <span
            className="hs-brand__sizer"
            key={brand.id}
            ref={(node) => {
              sizerRefs.current[index] = node;
            }}
          >
            {brand.label}
          </span>
        ))}
      </span>

      {open ? (
        <ul className="hs-brand__menu" id={menuId} role="listbox">
          {heroSequenceBrands.map((brand, index) => (
            <li key={brand.id} role="none">
              <button
                type="button"
                role="option"
                aria-selected={index === activeIndex}
                className="hs-brand__option"
                onClick={() => {
                  setActiveIndex(index);
                  setOpen(false);
                }}
              >
                {brand.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
