"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { heroSequenceNavLinks } from "./content";
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

/* Matches the hero's phone breakpoint (HeroSequence isMobile). */
const PHONE_QUERY = "(max-width: 699px)";

export function SequenceNav() {
  const [open, setOpen] = useState(false);
  /* The page's own overflow, restored when the menu closes (the loader sets
     it too). */
  const priorOverflow = useRef("");
  const openRef = useRef(false);
  const linksRef = useRef<HTMLElement>(null);
  const veilRef = useRef<HTMLSpanElement>(null);
  const menuTween = useRef<gsap.core.Timeline | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const lockupRef = useRef<HTMLSpanElement>(null);
  const bloomRef = useRef<HTMLSpanElement>(null);
  const clipRef = useRef<HTMLSpanElement>(null);
  const bloomTween = useRef<gsap.core.Timeline | null>(null);
  const originRef = useRef({ x: 0, y: 0 });

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

  /*
   * Phone menu choreography. Opening: the page scales back like a zoom out
   * while a black veil blurs in over it, then the links rise in one after
   * another, "Close menu" last. Closing plays it back out in the same order.
   * The page's transform is cleared at the end so ScrollSmoother is untouched.
   */
  const play = contextSafe((next: boolean) => {
    const nav = linksRef.current;
    const veil = veilRef.current;
    const page = document.querySelector<HTMLElement>(".hs-smooth-wrapper");
    if (!nav || !veil || !page) return;
    const items = gsap.utils.toArray<HTMLElement>(".hs-nav__link", nav);
    const close = nav.querySelector<HTMLElement>(".hs-nav__close");
    if (!close) return;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = (seconds: number) => (calm ? 0.01 : seconds);
    const header = navRef.current;

    menuTween.current?.kill();
    if (next) {
      header?.setAttribute("data-shown", "");
      const step = t(0.09);
      menuTween.current = gsap
        .timeline()
        .set(page, { transformOrigin: "50% 42%" })
        .to(
          page,
          { scale: 0.86, borderRadius: 28, duration: t(0.9), ease: "power3.inOut" },
          0,
        )
        .fromTo(
          veil,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: t(0.7), ease: "power2.out" },
          0,
        )
        .fromTo(
          items,
          { y: 56, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: t(0.85),
            ease: "power3.out",
            stagger: step,
          },
          t(0.3),
        )
        .fromTo(
          close,
          { y: 24, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: t(0.6), ease: "power3.out" },
          t(0.3) + step * items.length,
        );
    } else {
      menuTween.current = gsap
        .timeline({
          onComplete: () => {
            header?.removeAttribute("data-shown");
            gsap.set(page, { clearProps: "transform,borderRadius" });
          },
        })
        .to(
          close,
          { y: -16, autoAlpha: 0, duration: t(0.3), ease: "power2.in" },
          0,
        )
        .to(
          items,
          {
            y: -40,
            autoAlpha: 0,
            duration: t(0.45),
            ease: "power2.in",
            stagger: t(0.06),
          },
          t(0.05),
        )
        .to(
          page,
          { scale: 1, borderRadius: 0, duration: t(0.8), ease: "power3.inOut" },
          t(0.15),
        )
        .to(
          veil,
          { autoAlpha: 0, duration: t(0.5), ease: "power2.in" },
          t(0.35),
        );
    }
  });
  const playRef = useRef(play);
  playRef.current = play;

  const closeMenu = useCallback(() => {
    if (!openRef.current) return;
    openRef.current = false;
    document.documentElement.style.overflow = priorOverflow.current;
    setOpen(false);
    playRef.current(false);
  }, []);

  const openMenu = () => {
    openRef.current = true;
    priorOverflow.current = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    setOpen(true);
    play(true);
  };

  /* Phone menu: Escape closes it, and so does growing past the phone width. */
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu();
    };
    const phone = window.matchMedia(PHONE_QUERY);
    const onWide = () => {
      if (!phone.matches) closeMenu();
    };
    window.addEventListener("keydown", onKey);
    phone.addEventListener("change", onWide);
    return () => {
      window.removeEventListener("keydown", onKey);
      phone.removeEventListener("change", onWide);
    };
  }, [open, closeMenu]);

  /* ScrollSmoother moves content with transforms, so native hash jumps land
     in the wrong place — route in-page links through it when it is active. */
  const onLinkClick = (event: MouseEvent<HTMLAnchorElement>) => {
    closeMenu();
    const hash = event.currentTarget.hash;
    if (!hash) return;
    const target = document.querySelector<HTMLElement>(hash);
    if (!target) return;

    event.preventDefault();
    const smoother = ScrollSmoother.get();
    if (smoother) smoother.scrollTo(target, true, "top top");
    else target.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", hash);
  };

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
    <header
      ref={navRef}
      className="hs-nav"
      data-open={open ? "" : undefined}
    >
      {/* Fixed overlay target for the loader mark hand-off, then stays sticky
          for the rest of the page alongside the links. */}
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

      {/* Phone only: the links live in a full-screen menu. */}
      <button
        type="button"
        className="hs-nav__menu"
        aria-controls="hs-nav-links"
        aria-expanded={open}
        onClick={openMenu}
      >
        Menu
      </button>

      <nav
        className="hs-nav__links"
        id="hs-nav-links"
        aria-label="Primary"
        ref={linksRef}
      >
        <span className="hs-nav__veil" ref={veilRef} aria-hidden="true" />
        {heroSequenceNavLinks.map((link) => (
          <a
            key={link.label}
            className="hs-nav__link"
            href={link.href}
            onClick={link.href.startsWith("#") ? onLinkClick : closeMenu}
          >
            <CurtainLabel>{link.label}</CurtainLabel>
          </a>
        ))}
        <button type="button" className="hs-nav__close" onClick={closeMenu}>
          <svg
            className="hs-nav__close-icon"
            viewBox="0 0 22 22"
            aria-hidden="true"
          >
            <path d="M5 5l12 12M17 5L5 17" />
          </svg>
          Close menu
        </button>
      </nav>
    </header>
  );
}
