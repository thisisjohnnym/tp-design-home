import Image from "next/image";
import { experimentLoaderWords } from "./content";

export function BrandMark() {
  return (
    <span className="experiment-brand-mark" aria-hidden="true">
      {experimentLoaderWords.map((word) => (
        <span className="experiment-brand-mark__face" key={word}>
          <span className="experiment-brand-mark__word">.{word}</span>
        </span>
      ))}

      <span className="experiment-brand-mark__face experiment-brand-mark__face--logo">
        <span className="experiment-brand-mark__logo">
          <Image
            src="/brand/tapestry-logo.svg"
            alt=""
            width={282}
            height={62}
            priority
          />
        </span>
        <span className="experiment-brand-mark__suffix">.design</span>
      </span>
    </span>
  );
}
