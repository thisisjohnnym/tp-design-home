"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ThemeControls } from "@/components/theme/ThemeControls";
import { heroV3 } from "@/content/heroV3";

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

export function HeroNav() {
  const pathname = usePathname();
  const hash = useHash();

  return (
    <nav aria-label="Primary" className="flex justify-end">
      <div className="max-w-[calc(100vw-2*var(--grid-margin)-8rem)] overflow-x-auto rounded-full bg-white/90 py-px pr-4 backdrop-blur-[2px] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex h-[46px] items-center gap-0.5 p-1.5">
          <ul className="flex items-center gap-0.5">
            {heroV3.nav.map((item) => {
              const normalizedHash = item.href.startsWith("#") ? item.href : null;
              const active = normalizedHash
                ? pathname === "/hero-v3" && hash === normalizedHash
                : pathname === item.href;

              return (
                <li key={item.href} className="shrink-0">
                  <Link
                    href={item.href}
                    className={`flex h-[34px] items-center rounded-full px-4 font-sans text-xs font-medium uppercase leading-[18px] tracking-[1.5px] transition ${
                      active
                        ? "bg-[#111] text-white"
                        : "text-[#4c4b4b] hover:bg-[#f5f5f5] hover:text-[#111]"
                    }`}
                    aria-current={active ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <ThemeControls variant="heroV3" />
        </div>
      </div>
    </nav>
  );
}
