import { Icon } from "@/components/Icon";
import type { FeedbackGuide } from "@/content/resources";

type ResourceLinkCardProps = {
  guide: FeedbackGuide;
};

export function ResourceLinkCard({ guide }: ResourceLinkCardProps) {
  return (
    <article className="resources__card resources__card--link">
      <div className="resources__link-icon" aria-hidden>
        <Icon name="description" size={28} />
      </div>

      <div className="resources__card-body">
        <h3 className="resources__card-title">{guide.title}</h3>
        <p className="resources__card-description">{guide.description}</p>

        <a
          href={guide.href}
          target="_blank"
          rel="noopener noreferrer"
          className="resources__external-link"
        >
          View guide
          <Icon name="open_in_new" size={18} />
        </a>
      </div>
    </article>
  );
}
