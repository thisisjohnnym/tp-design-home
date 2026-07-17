import Image from "next/image";
import Link from "next/link";
import { InteractiveDots } from "@/components/interactive-dots/InteractiveDots";
import { SectionWave } from "@/components/ui/SectionWave";
import { site } from "@/content/site";

const FOOTER_BG = "#1B594E";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <SectionWave
        fill={FOOTER_BG}
        position="top"
        className="site-footer__wave"
      />
      <InteractiveDots />
      <div className="site-footer__content px-[var(--grid-margin)] pb-10 pt-6">
        <div className="mx-auto flex max-w-[85rem] flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-4">
            <Image
              src="/brand/tapestry-logo-light.svg"
              alt=""
              width={120}
              height={32}
              className="h-8 w-auto"
            />
            <p className="font-sans text-sm text-white/60">
              Tapestry Design Team · Tapestry, Inc.
            </p>
          </div>
          <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2">
            {site.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="font-sans text-sm uppercase tracking-[0.12em] text-white/70 transition hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
