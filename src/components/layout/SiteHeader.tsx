"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { ThemeControls } from "@/components/theme/ThemeControls";
import { site } from "@/content/site";

const SCROLL_DELTA_THRESHOLD = 8;
const TOP_REVEAL_OFFSET = 16;

function useHash() {
  const [hash, setHash] = useState("");

  useEffect(() => {
    const updateHash = () => setHash(window.location.hash);
    updateHash();
    window.addEventListener("hashchange", updateHash);
    return () => window.removeEventListener("hashchange", updateHash);
  }, []);

  return hash;
}

export function SiteHeader() {
  const pathname = usePathname();
  const hash = useHash();
  const reduceMotion = useReducedMotion();
  const headerRef = useRef<HTMLElement>(null);
  const lastScrollYRef = useRef(0);
  const tickingRef = useRef(false);
  const [scrollState, setScrollState] = useState<"visible" | "hidden">("visible");

  useLayoutEffect(() => {
    const root = document.documentElement;

    const updateHeaderHeight = () => {
      const height = headerRef.current?.offsetHeight;
      if (height) {
        root.style.setProperty("--site-header-height", `${height}px`);
      }
    };

    updateHeaderHeight();

    const observer = new ResizeObserver(updateHeaderHeight);
    if (headerRef.current) {
      observer.observe(headerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      setScrollState("visible");
      return;
    }

    lastScrollYRef.current = window.scrollY;

    const updateScrollState = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollYRef.current;

      if (currentY <= TOP_REVEAL_OFFSET) {
        setScrollState("visible");
      } else if (delta > SCROLL_DELTA_THRESHOLD) {
        setScrollState("hidden");
      } else if (delta < -SCROLL_DELTA_THRESHOLD) {
        setScrollState("visible");
      }

      lastScrollYRef.current = currentY;
      tickingRef.current = false;
    };

    const onScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;
      requestAnimationFrame(updateScrollState);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [reduceMotion]);

  useEffect(() => {
    setScrollState("visible");
    lastScrollYRef.current = window.scrollY;
  }, [pathname, hash]);

  return (
    <header
      ref={headerRef}
      className="site-header sticky top-0 z-50 bg-background"
      data-scroll-state={scrollState}
      style={{ paddingTop: "max(0.75rem, env(safe-area-inset-top))" }}
    >
      <div className="site-header__inner">
        <Link href="/" className="site-header__logo shrink-0 transition hover:opacity-80">
          <Image
            src="/brand/tapestry-logo.svg"
            alt="Tapestry"
            width={120}
            height={28}
            priority
            className="h-[1.75rem] w-auto md:h-[1.875rem]"
          />
        </Link>

        <div className="site-header-pill">
          <div className="site-header-pill__inner">
            <nav aria-label="Primary">
              <ul className="site-header-pill__links">
                {site.nav.map((item) => {
                  const normalizedHash = item.href.startsWith("/#")
                    ? item.href.slice(1)
                    : item.href.startsWith("#")
                      ? item.href
                      : null;
                  const active = normalizedHash
                    ? pathname === "/" && hash === normalizedHash
                    : pathname === item.href;

                  return (
                    <li key={item.href + item.label}>
                      <Link
                        href={item.href}
                        className={`site-header-pill__link${active ? " site-header-pill__link--active" : ""}`}
                        aria-current={active ? "page" : undefined}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
            <ThemeControls variant="nav" />
          </div>
        </div>
      </div>
    </header>
  );
}
