"use client";

import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { site } from "@/content/site";
import { ThemeControls } from "@/components/theme/ThemeControls";
import { GridCell, PageGrid } from "./PageGrid";

const navItems = site.nav.map((item) => ({
  ...item,
  shortLabel:
    item.href === "/what-we-manage"
      ? "Manage"
      : item.href === "/how-we-work"
        ? "Process"
        : item.href === "/capabilities"
          ? "Caps"
          : item.label,
}));

export function SiteHeader() {
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);

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

  return (
    <header
      ref={headerRef}
      className="site-header pointer-events-none sticky top-0 z-50 bg-[var(--background)]/88 backdrop-blur-xl"
      style={{ paddingTop: "max(0.75rem, env(safe-area-inset-top))" }}
    >
      <PageGrid className="py-3 md:py-4">
        <GridCell>
          <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 md:gap-4">
            <Link
              href="/"
              className="pointer-events-auto eyebrow shrink-0 justify-self-start transition hover:opacity-80"
            >
              Tapestry · Design
            </Link>

            <nav
              aria-label="Primary"
              className="pointer-events-auto max-w-[min(100vw-12rem,42rem)] justify-self-center overflow-x-auto rounded-full border border-[var(--rule)] bg-transparent [-ms-overflow-style:none] [scrollbar-width:none] md:max-w-none [&::-webkit-scrollbar]:hidden"
            >
              <ul className="flex items-center gap-0.5 p-1.5">
                {navItems.map((item) => {
                  const active =
                    item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

                  return (
                    <li key={item.href} className="shrink-0">
                      <Link
                        href={item.href}
                        className={`block whitespace-nowrap rounded-full px-3.5 py-2 font-sans text-[0.6875rem] font-medium uppercase tracking-[0.12em] transition md:px-4 md:text-[0.75rem] ${
                          active
                            ? "bg-[var(--foreground)] text-[var(--background)]"
                            : "text-[var(--foreground-muted)] hover:bg-[var(--ink-100)] hover:text-[var(--foreground)] dark:hover:bg-[var(--ink-800)]"
                        }`}
                        aria-current={active ? "page" : undefined}
                      >
                        <span className="md:hidden">{item.shortLabel}</span>
                        <span className="hidden md:inline">{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="pointer-events-auto justify-self-end">
              <ThemeControls />
            </div>
          </div>
        </GridCell>
      </PageGrid>
    </header>
  );
}
