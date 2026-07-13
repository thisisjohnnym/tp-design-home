"use client";

import { useState } from "react";
import { Reveal } from "@/components/Reveal";
import { site } from "@/content/site";
import { AlternativeTeamCard, type TeamView } from "./AlternativeTeamCard";
import { WarholFilters } from "./WarholPortrait";

type TeamGalleryProps = {
  className?: string;
};

const VIEW_OPTIONS: { value: TeamView; label: string }[] = [
  { value: "faces", label: "Team Lineup" },
  { value: "art", label: "Art Gallery" },
];

export function TeamGallery({ className = "" }: TeamGalleryProps) {
  const [view, setView] = useState<TeamView>("art");

  return (
    <div className={className}>
      <WarholFilters />
      <Reveal>
        <div
          className="mb-[clamp(2rem,4vw,3rem)] flex justify-start"
          role="group"
          aria-label="Gallery view"
        >
          <div className="inline-flex rounded-full border border-[var(--rule)] p-1">
            {VIEW_OPTIONS.map((option) => {
              const active = view === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setView(option.value)}
                  className={`rounded-full px-4 py-2 font-sans text-[14px] font-semibold uppercase tracking-[0.12em] transition ${
                    active
                      ? "bg-foreground text-background"
                      : "text-foreground hover:opacity-70"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      </Reveal>

      <ul
        className="grid list-none grid-cols-1 gap-x-12 gap-y-16 sm:grid-cols-2 lg:grid-cols-4"
        aria-label="Team gallery"
      >
        {site.team.map((member, index) => (
          <li key={member.name}>
            <Reveal delay={index * 0.06}>
              <AlternativeTeamCard member={member} view={view} />
            </Reveal>
          </li>
        ))}
      </ul>
    </div>
  );
}
