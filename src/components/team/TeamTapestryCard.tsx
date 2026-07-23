"use client";

import type { MotionValue } from "framer-motion";
import { motion } from "framer-motion";
import Image from "next/image";
import { memberDisplayName, type TeamMember } from "@/content/site";

type TeamTapestryCardProps = {
  member: TeamMember;
  metaOpacity?: MotionValue<number>;
};

const IMAGE_SIZES = "(max-width: 768px) 45vw, 13vw";

export function TeamTapestryCard({ member, metaOpacity }: TeamTapestryCardProps) {
  const photo = ("photo" in member ? member.photo : undefined) ?? member.poster;

  return (
    <article className="team-tapestry-card group">
      <div className="team-tapestry-card__media">
        <Image
          src={photo}
          alt={`Portrait of ${member.name}`}
          fill
          sizes={IMAGE_SIZES}
          className="object-cover"
        />
        <div
          className="team-tapestry-card__poster absolute inset-0 opacity-0 transition-opacity duration-500 ease-out motion-safe:group-hover:opacity-100 motion-safe:group-focus-within:opacity-100 motion-reduce:transition-none"
          aria-hidden
        >
          <Image src={member.poster} alt="" fill sizes={IMAGE_SIZES} className="object-cover" />
        </div>
        <div className="team-tapestry-card__scrim" aria-hidden />
        <motion.div
          className="team-tapestry-card__meta"
          style={{ opacity: metaOpacity ?? 1 }}
        >
          <h3 className="team-tapestry-card__name">{memberDisplayName(member)}</h3>
          <p className="team-tapestry-card__title">{member.title}</p>
        </motion.div>
        <span className="team-tapestry-card__mark" aria-hidden />
      </div>
    </article>
  );
}
