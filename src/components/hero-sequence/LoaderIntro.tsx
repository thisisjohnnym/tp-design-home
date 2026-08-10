import Image from "next/image";
import { heroSequenceLoaderWords } from "./content";

export function LoaderIntro() {
  return (
    <>
      <div className="hs-loader" aria-hidden="true" />

      <div className="hs-loader-mark" aria-hidden="true">
        <span className="hs-mark">
          {heroSequenceLoaderWords.map((word) => (
            <span className="hs-mark__face" key={word}>
              <span className="hs-mark__word">.{word}</span>
            </span>
          ))}

          <span className="hs-mark__face hs-mark__face--logo">
            <span className="hs-mark__logo">
              <Image
                src="/brand/tapestry-logo.svg"
                alt=""
                width={282}
                height={62}
                priority
              />
            </span>
            <span className="hs-mark__suffix">.design</span>
          </span>
        </span>
      </div>
    </>
  );
}
