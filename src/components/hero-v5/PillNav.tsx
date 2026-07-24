"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { TapestryDesignLogo } from "@/components/brand/TapestryDesignLogo";
import { Icon } from "@/components/Icon";
import { useTheme } from "@/components/theme/ThemeProvider";
import { site } from "@/content/site";
import type { HeroV5Phase } from "@/content/heroV5";

type PillNavProps = {
  phase?: HeroV5Phase;
};

function PillDivider() {
  return <span className="mx-0.5 h-5 w-px shrink-0 bg-[var(--rule)]" aria-hidden />;
}

function PillThemeToggle() {
  const { mode, setMode, ready } = useTheme();

  if (!ready) return null;

  return (
    <div
      role="group"
      aria-label="Color mode"
      className="flex shrink-0 items-center rounded-full bg-[var(--ink-100)] p-0.5 dark:bg-[var(--ink-800)]"
    >
      <button
        type="button"
        onClick={() => setMode("light")}
        aria-label="Light mode"
        aria-pressed={mode === "light"}
        className={`flex size-8 items-center justify-center rounded-full transition-[background-color,color,transform] duration-200 ease-out active:scale-[0.94] ${
          mode === "light"
            ? "bg-[var(--background)] text-[var(--foreground)] shadow-sm"
            : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
        }`}
      >
        <Icon name="light_mode" size={18} weight={mode === "light" ? 600 : 400} />
      </button>
      <button
        type="button"
        onClick={() => setMode("dark")}
        aria-label="Dark mode"
        aria-pressed={mode === "dark"}
        className={`flex size-8 items-center justify-center rounded-full transition-[background-color,color,transform] duration-200 ease-out active:scale-[0.94] ${
          mode === "dark"
            ? "bg-[var(--background)] text-[var(--foreground)] shadow-sm"
            : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
        }`}
      >
        <Icon name="dark_mode" size={18} weight={mode === "dark" ? 600 : 400} fill={mode === "dark" ? 1 : 0} />
      </button>
    </div>
  );
}

function PillNavGlassFilter() {
  return (
    <svg className="pill-nav__filter-defs" aria-hidden="true" focusable="false">
      <filter
        id="pill-nav-glass-distortion"
        x="0%"
        y="0%"
        width="100%"
        height="100%"
        filterUnits="objectBoundingBox"
      >
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.012 0.012"
          numOctaves="1"
          seed="5"
          result="turbulence"
        />
        <feComponentTransfer in="turbulence" result="mapped">
          <feFuncR type="gamma" amplitude="1.1" exponent="8" offset="0.3" />
          <feFuncG type="gamma" amplitude="1" exponent="6" offset="0.2" />
          <feFuncB type="gamma" amplitude="0.9" exponent="4" offset="0.5" />
        </feComponentTransfer>
        <feGaussianBlur in="turbulence" stdDeviation="3" result="softMap" />
        <feSpecularLighting
          in="softMap"
          surfaceScale="7"
          specularConstant="1.5"
          specularExponent="150"
          lightingColor="#bde9ff"
          result="specLight"
        >
          <fePointLight x="-200" y="-200" z="300" />
        </feSpecularLighting>
        <feComposite
          in="specLight"
          operator="arithmetic"
          k1="0"
          k2="1"
          k3="1"
          k4="0"
          result="litImage"
        />
        <feDisplacementMap
          in="SourceGraphic"
          in2="softMap"
          scale="125"
          xChannelSelector="R"
          yChannelSelector="G"
        />
      </filter>
    </svg>
  );
}

export function PillNav({ phase }: PillNavProps) {
  const pathname = usePathname();
  const hasPhase = phase !== undefined;

  return (
    <header
      className="pill-nav pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-4"
      data-phase={hasPhase ? phase : undefined}
      style={{ paddingTop: "max(1rem, env(safe-area-inset-top))" }}
    >
      <PillNavGlassFilter />
      <nav aria-label="Primary" className="pill-nav__bar pointer-events-auto">
        <span className="pill-nav__glass-effect" aria-hidden />
        <span className="pill-nav__glass-tint" aria-hidden />
        <span className="pill-nav__glass-shine" aria-hidden />
        <div className="pill-nav__content">
          <Link
            href="/"
            aria-label="Tapestry home"
            className="flex shrink-0 items-center rounded-full px-1 py-1 text-[var(--foreground)] transition-opacity duration-200 ease-out hover:opacity-70 active:scale-[0.97]"
          >
            <TapestryDesignLogo className="h-7 w-auto" />
          </Link>

          <PillDivider />

          <ul className="flex min-w-0 items-center gap-0.5">
            {site.nav.map((item) => {
              const isPageLink = !item.href.startsWith("#");
              const active =
                isPageLink &&
                (pathname === item.href || pathname.startsWith(`${item.href}/`));

              return (
                <li key={item.href} className="shrink-0">
                  <Link
                    href={item.href}
                    className={`block whitespace-nowrap rounded-full px-3.5 py-1.5 font-sans text-[0.8125rem] font-medium tracking-[-0.01em] transition-[background-color,color,transform] duration-200 ease-out active:scale-[0.97] ${
                      active
                        ? "bg-[var(--foreground)] text-[var(--background)]"
                        : "text-[var(--foreground-muted)] hover:bg-[var(--ink-100)] hover:text-[var(--foreground)] dark:hover:bg-[var(--ink-800)]"
                    }`}
                    aria-current={active ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <PillDivider />
          <PillThemeToggle />
        </div>
      </nav>
    </header>
  );
}
