import Image from "next/image";
import { Icon } from "@/components/Icon";
import type { FontDownload, LogoDownload } from "@/content/resources";

type ResourceDownloadCardProps = {
  item: LogoDownload | FontDownload;
  previewSrc?: string;
  previewBg?: "light" | "dark";
};

export function ResourceDownloadCard({
  item,
  previewSrc,
  previewBg = "light",
}: ResourceDownloadCardProps) {
  const variant = "variant" in item ? item.variant : undefined;

  return (
    <article className="resources__card resources__card--download">
      {previewSrc ? (
        <div
          className={`resources__preview resources__preview--${previewBg}`}
          aria-hidden
        >
          <Image
            src={previewSrc}
            alt=""
            width={120}
            height={27}
            className="resources__preview-image"
          />
        </div>
      ) : (
        <div className="resources__preview resources__preview--font" aria-hidden>
          <span className="resources__font-sample">Aa</span>
        </div>
      )}

      <div className="resources__card-body">
        <h3 className="resources__card-title">
          {item.title}
          {variant ? (
            <span className="resources__card-variant"> — {variant}</span>
          ) : null}
        </h3>

        <a
          href={item.href}
          download={item.fileName}
          className="resources__download-link"
        >
          <Icon name="download" size={20} />
          Download
        </a>
      </div>
    </article>
  );
}
