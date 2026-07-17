import Image from "next/image";
import type { WorkProject } from "@/content/work";

type WorkCardProps = {
  project: WorkProject;
};

export function WorkCard({ project }: WorkCardProps) {
  return (
    <article className="our-work__card" aria-label={project.title}>
      <div className="our-work__card-media">
        <Image
          src={project.image}
          alt={project.alt}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="our-work__card-image"
        />
      </div>
    </article>
  );
}
