import Link from "next/link";
import { capabilities, team, process, components, ownership } from "@/data/content";

// ─── Palette ─────────────────────────────────────────────────────────────────
// Ground: #141210   Type: #EDE9E2   Muted: #6B6560   Accent: #C49A5A
// Mode: Dark cinematic field + restrained editorial

const STATUS_STYLES: Record<string, string> = {
  Published: "bg-[#EDE9E2] text-[#141210]",
  "In Review": "bg-[#2A2824] text-[#9B9490] border border-[#3A3733]",
  Exploratory: "border border-[#3A3733] text-[#6B6560]",
  Deprecated: "text-[#4A4744] line-through",
};

function Badge({ status }: { status: string }) {
  return (
    <span className={`inline-flex px-2 py-px text-[9px] uppercase tracking-[0.15em] ${STATUS_STYLES[status] ?? ""}`}>
      {status}
    </span>
  );
}

export default function V2() {
  return (
    <div className="bg-[#141210] text-[#EDE9E2] min-h-screen">

      {/* ── Nav ──────────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#141210]/95 backdrop-blur-sm border-b border-[#2A2824]">
        <div className="px-[20px] h-11 flex items-center justify-between">
          <span className="text-[11px] uppercase tracking-[0.2em] font-medium text-[#EDE9E2]">tapestry.design</span>
          <div className="hidden md:flex items-center gap-8">
            {["Team", "Capabilities", "How We Work", "Components", "Resources"].map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(/ /g, "-")}`}
                className="text-[11px] uppercase tracking-[0.12em] text-[#6B6560] hover:text-[#EDE9E2] transition-colors">
                {item}
              </a>
            ))}
          </div>
          <Link href="/" className="text-[11px] uppercase tracking-[0.12em] text-[#6B6560] hover:text-[#EDE9E2] transition-colors">
            ← All versions
          </Link>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="pt-11 min-h-screen flex flex-col justify-end relative overflow-hidden">
        {/* Amber accent band — single bounded color event */}
        <div className="absolute top-0 left-0 right-0 h-px bg-[#C49A5A]" />

        <div className="px-[20px] pb-0">
          {/* Ambient top label */}
          <div className="pt-24 mb-auto">
            <p className="text-[11px] uppercase tracking-[0.3em] text-[#C49A5A] mb-1">
              tapestry.design
            </p>
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#4A4744]">
              Product Design · Tapestry, Inc.
            </p>
          </div>
        </div>

        {/* Giant type block — low, pressing bottom */}
        <div className="px-[20px] pb-20 mt-auto">
          <h1 className="text-[clamp(3rem,10vw,12rem)] font-black leading-[0.84] tracking-tight uppercase mb-0">
            Designing<br />
            <span className="text-[#6B6560]">the</span> connective<br />
            tissue.
          </h1>
        </div>

        {/* Horizontal zone separator */}
        <div className="border-t border-[#2A2824] px-[20px] py-8">
          <div className="grid grid-cols-24 gap-[8px]">
            <div className="col-span-24 lg:col-span-11">
              <p className="text-sm text-[#9B9490] leading-relaxed">
                We create reusable patterns that help product teams move faster
                while keeping the experience consistent across our product ecosystem.
              </p>
            </div>
            <div className="col-span-24 lg:col-span-5 lg:col-start-20 flex items-center gap-6">
              <a href="#components" className="text-[11px] uppercase tracking-[0.18em] text-[#C49A5A] hover:text-[#EDE9E2] transition-colors border-b border-[#C49A5A] pb-0.5">
                Explore components
              </a>
              <a href="#team" className="text-[11px] uppercase tracking-[0.18em] text-[#6B6560] hover:text-[#EDE9E2] transition-colors">
                Meet the team
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Capabilities ─────────────────────────────────────────────────── */}
      <section id="capabilities" className="border-t border-[#2A2824] py-28 px-[20px]">
        <div className="grid grid-cols-24 gap-[8px] mb-20">
          <div className="col-span-24 lg:col-span-3">
            <p className="text-[10px] uppercase tracking-[0.22em] text-[#4A4744]">02</p>
          </div>
          <div className="col-span-24 lg:col-span-10 lg:col-start-5">
            <h2 className="text-[clamp(1.75rem,4vw,4.5rem)] font-black leading-[0.88] tracking-tight uppercase">
              What<br />we do.
            </h2>
          </div>
          <div className="hidden lg:block col-span-10 lg:col-start-16 self-end">
            <p className="text-sm text-[#4A4744] leading-relaxed">
              We partner across product, engineering, and leadership to shape
              experiences that are useful, consistent, and thoughtfully crafted.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#2A2824]">
          {capabilities.map((cap) => (
            <div key={cap.id} className="bg-[#141210] p-8 hover:bg-[#1C1916] transition-colors">
              <div className="flex items-start justify-between mb-6">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#C49A5A]">{cap.id}</span>
              </div>
              <h3 className="text-base font-semibold tracking-tight mb-3">{cap.name}</h3>
              <p className="text-sm text-[#6B6560] leading-relaxed">{cap.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── What We Manage ───────────────────────────────────────────────── */}
      <section className="border-t border-[#2A2824] py-28 px-[20px] bg-[#0E0C0A]">
        <div className="grid grid-cols-24 gap-[8px] mb-16">
          <div className="col-span-24 lg:col-span-3">
            <p className="text-[10px] uppercase tracking-[0.22em] text-[#4A4744]">03</p>
          </div>
          <div className="col-span-24 lg:col-span-10 lg:col-start-5">
            <h2 className="text-[clamp(1.75rem,4vw,4.5rem)] font-black leading-[0.88] tracking-tight uppercase">
              What we<br />manage.
            </h2>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {ownership.map((item) => (
            <span key={item} className="px-4 py-2 border border-[#2A2824] text-[11px] uppercase tracking-[0.1em] text-[#6B6560] hover:border-[#C49A5A] hover:text-[#EDE9E2] transition-colors">
              {item}
            </span>
          ))}
        </div>
      </section>

      {/* ── Team ─────────────────────────────────────────────────────────── */}
      <section id="team" className="border-t border-[#2A2824] py-28 px-[20px]">
        <div className="grid grid-cols-24 gap-[8px] mb-20">
          <div className="col-span-24 lg:col-span-3">
            <p className="text-[10px] uppercase tracking-[0.22em] text-[#4A4744]">04</p>
          </div>
          <div className="col-span-24 lg:col-span-10 lg:col-start-5">
            <h2 className="text-[clamp(1.75rem,4vw,4.5rem)] font-black leading-[0.88] tracking-tight uppercase">
              The team.
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#2A2824]">
          {team.map((member) => (
            <div key={member.name} className="bg-[#141210] p-8 hover:bg-[#1C1916] transition-colors">
              {/* Initials block */}
              <div className="w-12 h-12 bg-[#2A2824] flex items-center justify-center mb-6">
                <span className="text-[11px] uppercase tracking-[0.12em] font-semibold text-[#9B9490]">{member.initials}</span>
              </div>
              <p className="font-semibold tracking-tight mb-1">{member.name}</p>
              <p className="text-[11px] text-[#C49A5A] uppercase tracking-[0.1em] mb-4">{member.role}</p>
              <div className="pt-4 border-t border-[#2A2824]">
                <p className="text-[11px] text-[#6B6560] leading-relaxed">{member.focus}</p>
                <p className="text-[10px] uppercase tracking-[0.15em] text-[#4A4744] mt-3">{member.location}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── How We Work ──────────────────────────────────────────────────── */}
      <section id="how-we-work" className="border-t border-[#2A2824] py-28 px-[20px] bg-[#0E0C0A]">
        <div className="grid grid-cols-24 gap-[8px] mb-20">
          <div className="col-span-24 lg:col-span-3">
            <p className="text-[10px] uppercase tracking-[0.22em] text-[#4A4744]">05</p>
          </div>
          <div className="col-span-24 lg:col-span-10 lg:col-start-5">
            <h2 className="text-[clamp(1.75rem,4vw,4.5rem)] font-black leading-[0.88] tracking-tight uppercase">
              How we<br />work.
            </h2>
          </div>
        </div>

        <div>
          {process.map((step, i) => (
            <div key={step.step}
              className={`grid grid-cols-24 gap-[8px] items-center py-8 ${i < process.length - 1 ? "border-b border-[#1E1C19]" : ""}`}>
              {/* Amber number — tiny punctuation */}
              <div className="col-span-3 lg:col-span-2">
                <span className="text-[11px] font-medium text-[#C49A5A] uppercase tracking-[0.15em]">{step.step}</span>
              </div>
              {/* Step name */}
              <div className="col-span-21 lg:col-span-7 lg:col-start-4">
                <p className="text-lg font-black uppercase tracking-tight">{step.name}</p>
              </div>
              {/* Description */}
              <div className="col-span-24 lg:col-span-13 lg:col-start-12">
                <p className="text-sm text-[#6B6560] leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Components ───────────────────────────────────────────────────── */}
      <section id="components" className="border-t border-[#2A2824] py-28 px-[20px]">
        <div className="grid grid-cols-24 gap-[8px] mb-20">
          <div className="col-span-24 lg:col-span-3">
            <p className="text-[10px] uppercase tracking-[0.22em] text-[#4A4744]">06</p>
          </div>
          <div className="col-span-24 lg:col-span-10 lg:col-start-5">
            <h2 className="text-[clamp(1.75rem,4vw,4.5rem)] font-black leading-[0.88] tracking-tight uppercase">
              Published<br />components.
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-[#2A2824]">
          {components.map((comp) => (
            <div key={comp.name} className="bg-[#141210] p-6 hover:bg-[#1C1916] transition-colors group">
              {/* Preview zone — atmospheric abstract band */}
              <div className="w-full h-24 bg-[#1A1816] mb-6 flex items-end p-3">
                <span className="text-[9px] uppercase tracking-[0.15em] text-[#3A3733]">{comp.category}</span>
              </div>
              <div className="flex items-start justify-between mb-2">
                <p className="text-sm font-semibold tracking-tight">{comp.name}</p>
              </div>
              <div className="flex items-center justify-between mt-3">
                <Badge status={comp.status} />
                <span className="text-[10px] text-[#4A4744]">{comp.updated}</span>
              </div>
              <a href="#" className="mt-4 block text-[10px] uppercase tracking-[0.15em] text-[#C49A5A] opacity-0 group-hover:opacity-100 transition-opacity">
                Open in Figma →
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="border-t border-[#C49A5A] px-[20px] py-12">
        <div className="grid grid-cols-24 gap-[8px]">
          <div className="col-span-24 lg:col-span-8">
            <p className="text-[clamp(1.25rem,2.5vw,2.5rem)] font-black uppercase tracking-tight leading-none mb-6 text-[#EDE9E2]">
              tapestry.design
            </p>
            <p className="text-[11px] text-[#6B6560] leading-relaxed max-w-xs">
              The home for our design team's people, practices, and reusable product UI work.
            </p>
          </div>
          <div className="col-span-12 lg:col-span-4 lg:col-start-13 mt-8 lg:mt-0">
            <p className="text-[10px] uppercase tracking-[0.18em] text-[#4A4744] mb-4">Navigate</p>
            <ul className="space-y-2">
              {["Team", "Capabilities", "How We Work", "Components", "Resources"].map((item) => (
                <li key={item}><a href="#" className="text-[11px] text-[#6B6560] hover:text-[#EDE9E2] transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>
          <div className="col-span-12 lg:col-span-4 lg:col-start-18 mt-8 lg:mt-0">
            <p className="text-[10px] uppercase tracking-[0.18em] text-[#4A4744] mb-4">Contact</p>
            <ul className="space-y-2">
              <li><a href="#" className="text-[11px] text-[#6B6560] hover:text-[#EDE9E2] transition-colors">Teams channel</a></li>
              <li><a href="#" className="text-[11px] text-[#6B6560] hover:text-[#EDE9E2] transition-colors">Office hours</a></li>
              <li><a href="#" className="text-[11px] text-[#6B6560] hover:text-[#EDE9E2] transition-colors">Figma workspace</a></li>
            </ul>
          </div>
          <div className="col-span-24 lg:col-span-3 lg:col-start-22 self-end mt-8 lg:mt-0">
            <p className="text-[10px] uppercase tracking-[0.18em] text-[#3A3733]">
              Tapestry, Inc.<br />2026
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
