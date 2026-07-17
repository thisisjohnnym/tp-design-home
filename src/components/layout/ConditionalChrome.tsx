"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "next/navigation";
import { SiteHeader } from "./SiteHeader";

export function ConditionalChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideSiteHeader = pathname === "/" || pathname === "/hero-v3";

  useLayoutEffect(() => {
    const root = document.documentElement;

    if (pathname === "/hero-v3") {
      root.dataset.heroVariant = "v3";
    } else if (root.dataset.heroVariant === "v3") {
      delete root.dataset.heroVariant;
    }

    if (pathname === "/") {
      root.style.setProperty("--site-header-height", "0px");
    } else {
      root.style.removeProperty("--site-header-height");
    }
  }, [pathname]);

  return (
    <>
      {!hideSiteHeader ? <SiteHeader /> : null}
      {children}
    </>
  );
}
