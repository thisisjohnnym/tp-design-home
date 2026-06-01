import Link from "next/link";

const versions = [
  {
    id: "v1",
    label: "01",
    name: "Editorial",
    description: "Type-led. Monumental display type on warm off-white. Extreme scale contrast, thin rules, large negative space.",
    palette: ["#F7F5F0", "#0C0B09", "#9B9490"],
    href: "/v1",
  },
  {
    id: "v2",
    label: "02",
    name: "Dark Studio",
    description: "Cinematic. Charcoal ground with warm off-white type. One amber accent. Dense zones alternating with open field.",
    palette: ["#141210", "#EDE9E2", "#C49A5A"],
    href: "/v2",
  },
  {
    id: "v3",
    label: "03",
    name: "Warm System",
    description: "Modular. Parchment ground, espresso type, clay accent. Structured capability cards and a library-like component grid.",
    palette: ["#F2EBD9", "#1A130A", "#D4956A"],
    href: "/v3",
  },
];

export default function VersionSelector() {
  return (
    <main className="min-h-screen bg-[#F7F5F0]">
      {/* Header */}
      <div className="border-b border-[#E2DDD8] px-[20px] h-12 flex items-center justify-between">
        <span className="text-[11px] uppercase tracking-[0.2em] text-[#0C0B09] font-medium">
          tapestry.design
        </span>
        <span className="text-[11px] uppercase tracking-[0.2em] text-[#9B9490]">
          Design explorations
        </span>
      </div>

      {/* Hero label */}
      <div className="px-[20px] pt-24 pb-12">
        <p className="text-[11px] uppercase tracking-[0.25em] text-[#9B9490] mb-6">
          Landing page · 3 directions
        </p>
        <h1 className="text-[clamp(2.5rem,6vw,7rem)] font-black leading-[0.88] tracking-tight text-[#0C0B09] uppercase">
          Choose a<br />direction.
        </h1>
      </div>

      {/* Version list */}
      <div className="px-[20px] border-t border-[#E2DDD8]">
        {versions.map((v, i) => (
          <Link key={v.id} href={v.href} className="group block">
            <div
              className={`flex items-start gap-8 py-10 ${
                i < versions.length - 1 ? "border-b border-[#E2DDD8]" : ""
              }`}
            >
              {/* Number */}
              <span className="text-[clamp(3rem,5vw,5.5rem)] font-black leading-none tracking-tight text-[#E2DDD8] group-hover:text-[#0C0B09] transition-colors duration-300 select-none w-28 shrink-0">
                {v.label}
              </span>

              {/* Content */}
              <div className="flex-1 pt-2">
                <div className="flex items-baseline gap-4 mb-3">
                  <h2 className="text-2xl font-black tracking-tight text-[#0C0B09] uppercase">
                    {v.name}
                  </h2>
                </div>
                <p className="text-sm text-[#5C5752] leading-relaxed max-w-md">
                  {v.description}
                </p>
              </div>

              {/* Palette swatches */}
              <div className="hidden md:flex items-center gap-1.5 pt-3 shrink-0">
                {v.palette.map((color) => (
                  <span
                    key={color}
                    className="w-5 h-5 rounded-full border border-[#E2DDD8]"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>

              {/* Arrow */}
              <div className="hidden md:block pt-3 shrink-0">
                <span className="text-[11px] uppercase tracking-[0.2em] text-[#9B9490] group-hover:text-[#0C0B09] transition-colors">
                  View →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Footer */}
      <div className="px-[20px] py-8 border-t border-[#E2DDD8] mt-12">
        <p className="text-[11px] uppercase tracking-[0.2em] text-[#9B9490]">
          tapestry.design · Product Design · Cong Kim, Juliana Botero · 2026
        </p>
      </div>
    </main>
  );
}
