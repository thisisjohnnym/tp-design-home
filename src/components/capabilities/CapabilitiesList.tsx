import { site } from "@/content/site";

export function CapabilitiesList() {
  return (
    <ul className="space-y-10 border-t border-[var(--rule)] pt-10">
      {site.capabilities.map((cap) => (
        <li
          key={cap.label}
          className="grid gap-3 border-b border-[var(--rule)] pb-10 last:border-0 md:grid-cols-[minmax(12rem,1fr)_2fr] md:gap-10"
        >
          <h2 className="font-sans text-[clamp(1.75rem,4vw,2.75rem)] font-bold leading-tight text-ink-900 dark:text-ink-50">
            {cap.title}
          </h2>
          <p className="font-sans text-body-lg text-ink-600 dark:text-ink-300">{cap.description}</p>
        </li>
      ))}
    </ul>
  );
}
