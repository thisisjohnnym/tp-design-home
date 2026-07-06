import Link from "next/link";
import { site } from "@/content/site";
import { GridCell, PageGrid } from "./PageGrid";

export function SiteFooter() {
  return (
    <footer className="rule border-t">
      <PageGrid className="py-8">
        <GridCell className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="eyebrow text-ink-500">{site.name}</p>
            <p className="mt-2 font-sans text-caption text-ink-500">Tapestry, Inc. · Design</p>
          </div>
          <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2">
            {site.nav.slice(1).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="font-sans text-body-sm text-ink-500 transition hover:text-ink-900 dark:hover:text-ink-100"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </GridCell>
      </PageGrid>
    </footer>
  );
}
