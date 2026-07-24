import Image from "next/image";
import type { TeamMember } from "@/content/site";

type TeamImageCardProps = {
  member: TeamMember;
};

const IMAGE_SIZES = "(max-width: 768px) 45vw, 13vw";

export function TeamImageCard({ member }: TeamImageCardProps) {
  const photo = ("photo" in member ? member.photo : undefined) ?? member.poster;

  return (
    <article className="team-cluster-card" tabIndex={-1}>
      <div className="team-cluster-card__media">
        <Image
          src={photo}
          alt={`Portrait of ${member.name}`}
          fill
          sizes={IMAGE_SIZES}
          className="object-cover"
        />
      </div>
    </article>
  );
}
