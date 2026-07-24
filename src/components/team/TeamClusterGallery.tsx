"use client";

import type { CSSProperties } from "react";
import { useRef, useState } from "react";
import {
  IntroCrossfadeLine,
  IntroCrossfadeParagraph,
  teamClusterLongestLocation,
  teamClusterLongestRole,
  teamClusterLongestTitle,
} from "@/components/IntroCrossfade";
import type { TeamMember } from "@/content/site";
import { site } from "@/content/site";
import { teamClusterIntro, teamClusterLayout } from "@/content/teamCluster";
import { TeamConnectionGraph } from "./TeamConnectionGraph";
import { TeamImageCard } from "./TeamImageCard";

function getIntroContent(activeMember: TeamMember | null) {
  if (!activeMember) {
    return {
      title: teamClusterIntro.title,
      meta: [...teamClusterIntro.meta],
      paragraph: teamClusterIntro.paragraph,
    };
  }

  return {
    title: activeMember.name,
    meta: [activeMember.title, activeMember.location],
    paragraph: activeMember.bio,
  };
}

export function TeamClusterGallery() {
  const cardsRef = useRef<HTMLUListElement>(null);
  const [activeMember, setActiveMember] = useState<TeamMember | null>(null);
  const intro = getIntroContent(activeMember);

  const resetActiveMember = (relatedTarget: EventTarget | null) => {
    if (!cardsRef.current?.contains(relatedTarget as Node)) {
      setActiveMember(null);
    }
  };

  return (
    <div className="team-cluster">
      <div
        className={`team-cluster__intro${activeMember ? " team-cluster__intro--member" : ""}`}
        aria-live="polite"
      >
        <div className="team-cluster__heading">
          <h2 className="team-cluster__title-wrap">
            <IntroCrossfadeLine
              text={intro.title}
              layoutText={teamClusterLongestTitle}
              className="team-cluster__title"
            />
          </h2>
          <p className="team-cluster__meta">
            <span className="team-cluster__meta-slot">
              <IntroCrossfadeLine
                text={intro.meta[0]}
                layoutText={teamClusterLongestRole}
                className="team-cluster__meta-line"
              />
            </span>
            <span className="team-cluster__meta-divider" aria-hidden />
            <span className="team-cluster__meta-slot">
              <IntroCrossfadeLine
                text={intro.meta[1]}
                layoutText={teamClusterLongestLocation}
                className="team-cluster__meta-line"
              />
            </span>
          </p>
        </div>
        <IntroCrossfadeParagraph
          text={intro.paragraph}
          className="team-cluster__paragraph"
          wrapClassName="team-cluster__paragraph-wrap"
        />
      </div>

      <ul
        ref={cardsRef}
        className="team-cluster__gallery list-none"
        aria-label="Team gallery"
        onMouseLeave={(event) => resetActiveMember(event.relatedTarget)}
        onBlur={(event) => resetActiveMember(event.relatedTarget)}
      >
        <TeamConnectionGraph
          cardsRef={cardsRef}
          inkRgb="220, 232, 255"
          dashed
          neighborCount={3}
        />
        {site.team.map((member) => {
          const placement = teamClusterLayout[member.name];
          if (!placement) return null;

          return (
            <li
              key={member.name}
              className="team-cluster__item"
              tabIndex={0}
              aria-label={`${member.name}, ${member.title}`}
              style={
                {
                  "--card-left": `${placement.left}%`,
                  "--card-top": `${placement.top}%`,
                } as CSSProperties
              }
              onMouseEnter={() => setActiveMember(member)}
              onFocus={() => setActiveMember(member)}
            >
              <TeamImageCard member={member} />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
