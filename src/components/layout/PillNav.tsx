"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/Icon";
import type { HeroV5Phase } from "@/components/hero/useHeroV5Timeline";
import { useTheme } from "@/components/theme/ThemeProvider";
import { alternativeAssets, pillNavItems } from "@/content/alternative";

type PillNavProps = {
  /** When set, nav reveals in sync with the hero v5 canvas bloom. */
  phase?: HeroV5Phase;
};

function PillDivider() {
  return <span className="mx-0.5 h-5 w-px shrink-0 bg-[var(--rule)]" aria-hidden />;
}

function ModeToggle() {
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

export function PillNav({ phase }: PillNavProps) {
  const pathname = usePathname();
  const animated = phase !== undefined;
  const preReveal = animated && (phase === "intro" || phase === "roll");

  return (
    <header
      className="pill-nav pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-4"
      data-phase={animated ? phase : undefined}
      style={{ paddingTop: "max(1rem, env(safe-area-inset-top))" }}
    >
      <nav
        aria-label="Primary"
        aria-hidden={preReveal}
        className={`pill-nav__bar pointer-events-auto flex h-[3.25rem] max-w-[calc(100vw-2rem)] items-center gap-1 rounded-full border border-[var(--rule)] bg-[var(--background)]/92 py-1 pl-3 pr-1.5 shadow-[0_10px_40px_rgba(0,0,0,0.08)] backdrop-blur-xl dark:shadow-[0_10px_40px_rgba(0,0,0,0.4)] ${
          preReveal ? "opacity-0" : ""
        }`}
      >
        <Link
          href="/"
          aria-label="Tapestry home"
          className="flex shrink-0 items-center rounded-full px-1 py-1 transition-opacity duration-200 ease-out hover:opacity-70 active:scale-[0.97]"
        >
          <Image
            src={alternativeAssets.tprLogo}
            alt=""
            width={28}
            height={36}
            priority
            className="h-7 w-auto dark:invert"
          />
        </Link>

        <PillDivider />

        <ul className="flex min-w-0 items-center gap-0.5">
          {pillNavItems.map((item) => {
            const active =
              !item.href.startsWith("#") &&
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
        <ModeToggle />
      </nav>
    </header>
  );
}
