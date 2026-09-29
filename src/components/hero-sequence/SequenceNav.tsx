"use client";

import Image from "next/image";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type PointerEvent,
  type ReactNode,
} from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { heroSequenceContact, heroSequenceResources } from "./content";
import "./curtain-reveal.css";

gsap.registerPlugin(useGSAP);

function CurtainLabel({ children }: { children: ReactNode }) {
  return (
    <span className="hs-curtain hs-curtain--inline hs-curtain--text hs-nav__curtain">
      <span className="hs-curtain__content">{children}</span>
      <span className="hs-curtain__mask" aria-hidden="true" />
    </span>
  );
}

export function SequenceNav() {
  const navRef = useRef<HTMLElement>(null);
  const lockupRef = useRef<HTMLSpanElement>(null);
  const bloomRef = useRef<HTMLSpanElement>(null);
  const clipRef = useRef<HTMLSpanElement>(null);
  const bloomTween = useRef<gsap.core.Timeline | null>(null);
  const originRef = useRef({ x: 0, y: 0 });

  const menuRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();

  const { contextSafe } = useGSAP(
    () => {
      const nav = navRef.current;
      if (!nav) return;

      const root = nav.closest(".hs-root") as HTMLElement | null;

      const syncSpacerHeight = () => {
        root?.style.setProperty("--hs-nav-height", `${nav.offsetHeight}px`);
      };

      syncSpacerHeight();
      const resizeObserver = new ResizeObserver(syncSpacerHeight);
      resizeObserver.observe(nav);

      return () => {
        resizeObserver.disconnect();
        root?.style.removeProperty("--hs-nav-height");
      };
    },
    { scope: navRef },
  );

  /* Close on outside press or Escape while open. */
  useEffect(() => {
    if (!menuOpen) return;

    const onPointerDown = (event: globalThis.PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setMenuOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setMenuOpen(false);
      menuRef.current?.querySelector<HTMLButtonElement>(".hs-nav__menu-toggle")?.focus();
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  const onPointerEnter = contextSafe((event: PointerEvent<HTMLSpanElement>) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lockup = lockupRef.current;
    const bloom = bloomRef.current;
    const clip = clipRef.current;
    if (!lockup || !bloom || !clip) return;

    const rect = lockup.getBoundingClientRect();
    const scaleX = rect.width / lockup.offsetWidth || 1;
    const scaleY = rect.height / lockup.offsetHeight || 1;
    const x = (event.clientX - rect.left) / scaleX;
    const y = (event.clientY - rect.top) / scaleY;
    const radius = Math.hypot(
      Math.max(x, lockup.offsetWidth - x),
      Math.max(y, lockup.offsetHeight - y),
    );

    originRef.current = { x, y };

    bloomTween.current?.kill();
    gsap.set(bloom, {
      opacity: 1,
      filter: "blur(0px)",
    });
    bloomTween.current = gsap
      .timeline({
        onComplete: () => {
          gsap.set(bloom, { filter: "blur(0px)" });
          gsap.set(clip, { clipPath: `circle(0px at ${x}px ${y}px)` });
        },
      })
      .fromTo(
        clip,
        { clipPath: `circle(0px at ${x}px ${y}px)` },
        {
          clipPath: `circle(${radius}px at ${x}px ${y}px)`,
          duration: 0.5,
          ease: "power2.out",
        },
        0,
      )
      .to(
        bloom,
        {
          opacity: 0,
          filter: "blur(12px)",
          duration: 0.55,
          ease: "power2.in",
        },
        0.8,
      );
  });

  const onPointerLeave = contextSafe(() => {
    const bloom = bloomRef.current;
    const clip = clipRef.current;
    if (!bloom || !clip) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Leave early: skip the hold and fade out from the current fill.
    if (gsap.getProperty(bloom, "opacity") as number <= 0.01) return;

    const { x, y } = originRef.current;
    bloomTween.current?.kill();
    bloomTween.current = gsap.timeline({
      onComplete: () => {
        gsap.set(bloom, { filter: "blur(0px)" });
        gsap.set(clip, { clipPath: `circle(0px at ${x}px ${y}px)` });
      },
    }).to(bloom, {
      opacity: 0,
      filter: "blur(12px)",
      duration: 0.45,
      ease: "power2.out",
    });
  });

  return (
    <header ref={navRef} className="hs-nav">
      {/* Fixed overlay target for the loader mark hand-off, then stays sticky
          for the rest of the page alongside the Menu toggle. */}
      <div className="hs-nav__logo-target">
        <span className="hs-nav__logo">
          <span
            ref={lockupRef}
            className="hs-nav__logo-lockup"
            onPointerEnter={onPointerEnter}
            onPointerLeave={onPointerLeave}
          >
            <span className="hs-nav__logo-img">
              <Image
                src="/brand/tapestry-logo.svg"
                alt="Tapestry Design"
                width={282}
                height={62}
                priority
              />
            </span>
            <span className="hs-nav__logo-suffix" aria-hidden="true">
              .design
            </span>
            <span ref={bloomRef} className="hs-nav__logo-bloom" aria-hidden="true">
              <span ref={clipRef} className="hs-nav__logo-bloom-clip">
                <span className="hs-nav__logo-img hs-nav__logo-img--bloom">
                  <Image
                    src="/brand/tapestry-logo.svg"
                    alt=""
                    width={282}
                    height={62}
                  />
                </span>
                <span className="hs-nav__logo-suffix">.design</span>
              </span>
            </span>
          </span>
        </span>
      </div>

      <div
        ref={menuRef}
        className={`hs-nav__links hs-nav__menu${menuOpen ? " is-open" : ""}`}
      >
        <button
          type="button"
          className="hs-nav__menu-toggle"
          aria-expanded={menuOpen}
          aria-controls={menuId}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="hs-nav__menu-badge" aria-hidden="true">
            {menuOpen ? "X" : "M"}
          </span>
          <CurtainLabel>Menu</CurtainLabel>
        </button>

        <div
          id={menuId}
          className="hs-nav__panel"
          inert={!menuOpen}
          aria-hidden={!menuOpen}
        >
          <div className="hs-nav__group">
            <p className="hs-nav__group-title">Resources</p>
            <ul className="hs-nav__list">
              {heroSequenceResources.map((resource) => (
                <li key={resource}>
                  <a href="#resources" onClick={() => setMenuOpen(false)}>
                    {resource}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="hs-nav__group">
            <p className="hs-nav__group-title">Contact</p>
            <address className="hs-nav__list hs-nav__list--contact">
              <a href={`mailto:${heroSequenceContact.email}`}>
                {heroSequenceContact.email}
              </a>
              <a href={heroSequenceContact.phoneHref}>
                {heroSequenceContact.phoneLabel}
              </a>
            </address>
          </div>
        </div>
      </div>
    </header>
  );
}
