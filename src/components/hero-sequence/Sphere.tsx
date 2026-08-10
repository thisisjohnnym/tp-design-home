/**
 * Vector rebuild of the two Paper sphere illustrations. The storyboard frames
 * used raster fills only because Paper previews scaled bitmaps poorly, so the
 * source of truth here is the native effect stack: a hard-clipped gradient disc
 * with blurred glow capsules and a black rim stroke (blurred for soft shading).
 * The disc silhouette itself is not blurred — only the inner glow layers are.
 *
 * The markup stays at its natural 875x933 size; the scroll timeline scales and
 * moves the wrapper, which keeps every gradient and blur resolution independent.
 */

type SphereProps = {
  variant: "left" | "right";
};

function SphereRim() {
  return (
    <svg
      className="hs-sphere__rim"
      viewBox="-100.5 -416.101 488 898.203"
      width="488"
      height="898.203"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fillRule="evenodd"
        d="M310.267 360.322C-202.26 261.629 27.311 -74.417 180.359 -298.447"
        fill="none"
        stroke="var(--hs-sphere-rim)"
        strokeWidth="73"
      />
    </svg>
  );
}

function Sphere({ variant }: SphereProps) {
  return (
    <div className={`hs-sphere hs-sphere--${variant}`} aria-hidden="true">
      <div className="hs-sphere__core">
        <span className="hs-sphere__blob hs-sphere__blob--haze" />
        <span className="hs-sphere__blob hs-sphere__blob--violet" />
        <span className="hs-sphere__blob hs-sphere__blob--amber" />
        <span className="hs-sphere__blob hs-sphere__blob--ember" />
        <span className="hs-sphere__blob hs-sphere__blob--amber-top" />
        <span className="hs-sphere__blob hs-sphere__blob--core-light" />
        <SphereRim />
      </div>

      <span className="hs-sphere__spill hs-sphere__spill--warm" />
      <span className="hs-sphere__spill hs-sphere__spill--indigo" />
    </div>
  );
}

export function SphereLeft() {
  return <Sphere variant="left" />;
}

export function SphereRight() {
  return <Sphere variant="right" />;
}
