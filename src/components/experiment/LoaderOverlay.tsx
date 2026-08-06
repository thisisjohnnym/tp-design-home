import { BrandMark } from "./BrandMark";

export function LoaderOverlay() {
  return (
    <>
      <div className="experiment-loader" aria-hidden="true" />

      <div className="experiment-loader-mark" aria-hidden="true">
        <BrandMark />
      </div>
    </>
  );
}
