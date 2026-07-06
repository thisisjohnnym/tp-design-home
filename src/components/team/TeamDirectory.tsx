"use client";

import { useMemo, useState } from "react";
import { site } from "@/content/site";
import { TeamMemberCard } from "@/components/ui/TeamMemberCard";

export function TeamDirectory() {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("all");

  const locations = useMemo(() => {
    const unique = new Set(site.team.map((m) => m.location));
    return ["all", ...Array.from(unique).sort()];
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return site.team.filter((member) => {
      const matchesLocation = location === "all" || member.location === location;
      if (!q) return matchesLocation;
      const haystack = `${member.name} ${member.title} ${member.location}`.toLowerCase();
      return matchesLocation && haystack.includes(q);
    });
  }, [query, location]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <label className="flex flex-1 flex-col gap-2">
          <span className="eyebrow text-ink-500">Search</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Name, role, or location"
            className="rule rounded border bg-transparent px-4 py-3 font-coachtopia text-body outline-none focus:ring-2 focus:ring-ink-900/20 dark:focus:ring-ink-50/20"
          />
        </label>
        <label className="flex flex-col gap-2 sm:w-56">
          <span className="eyebrow text-ink-500">Location</span>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="rule rounded border bg-transparent px-4 py-3 font-coachtopia text-body outline-none focus:ring-2 focus:ring-ink-900/20 dark:focus:ring-ink-50/20"
          >
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc === "all" ? "All locations" : loc}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p className="font-coachtopia text-body-sm text-ink-500">
        {filtered.length} {filtered.length === 1 ? "member" : "members"}
      </p>

      {filtered.length === 0 ? (
        <p className="font-coachtopia text-body text-ink-500">No team members match your search.</p>
      ) : (
        <div className="grid gap-2 md:grid-cols-2">
          {filtered.map((member) => (
            <TeamMemberCard key={member.name} member={member} />
          ))}
        </div>
      )}
    </div>
  );
}
