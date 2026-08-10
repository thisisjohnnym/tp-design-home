import { BrandLogos } from "./BrandLogos";
import { heroSequenceMidCopy } from "./content";

export function MidCopy() {
  return (
    <div className="hs-layer hs-layer--mid">
      <div className="hs-mid">
        <p className="hs-mid__title">
          {heroSequenceMidCopy.lines.map((line) => (
            <span className="hs-mid__line" key={line}>
              {line}
            </span>
          ))}
        </p>
        <p className="hs-mid__subhead">{heroSequenceMidCopy.subhead}</p>
      </div>

      <BrandLogos />
    </div>
  );
}
