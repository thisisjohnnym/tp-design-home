import Link from "next/link";
import { capabilities, team, process, components, ownership } from "@/data/content";

// ─── Palette ─────────────────────────────────────────────────────────────────
// Ground: #F7F5F0   Marks: #0C0B09   Muted: #9B9490   Rule: #E2DDD8
// Mode: Typographic poster + restrained editorial system

const STATUS_STYLES: Record<string, string> = {
  Published: "bg-[#0C0B09] text-[#F7F5F0]",
  "In Review": "bg-[#D8D4CE] text-[#4A4740]",
  Exploratory: "border border-[#D8D4CE] text-[#9B9490]",
  Deprecated: "text-[#C0BBB5] line-through",
};

function Badge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex px-2 py-px text-[9px] uppercase tracking-[0.15em] ${STATUS_STYLES[status] ?? ""}`}
    >
      {status}
    </span>
  );
}

export default function V1() {
  return (
    <div className="bg-[#F7F5F0] text-[#0C0B09] min-h-screen">

      {/* ── Nav ──────────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#F7F5F0]/95 backdrop-blur-sm border-b border-[#E2DDD8]">
        <div className="px-[20px] h-11 flex items-center justify-between">
          <span className="text-[11px] uppercase tracking-[0.2em] font-medium">tapestry.design</span>
          <div className="hidden md:flex items-center gap-8">
            {["Team", "Capabilities", "How We Work", "Components", "Resources"].map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(/ /g, "-")}`}
                className="text-[11px] uppercase tracking-[0.12em] text-[#9B9490] hover:text-[#0C0B09] transition-colors">
                {item}
              </a>
            ))}
          </div>
          <Link href="/" className="text-[11px] uppercase tracking-[0.12em] text-[#9B9490] hover:text-[#0C0B09] transition-colors">
            ← All versions
          </Link>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="pt-11 min-h-screen flex flex-col justify-end">
        <div className="px-[20px] pb-16">
          <p className="text-[11px] uppercase tracking-[0.25em] text-[#9B9490] mb-10">
            Product Design · Tapestry, Inc.
          </p>

          <h1 className="text-[clamp(3.25rem,10.5vw,12rem)] font-black leading-[0.84] tracking-tight uppercase mb-14">
            Designing<br />
            the connective<br />
            tissue.
          </h1>

          <div className="border-t border-[#E2DDD8] pt-8 grid grid-cols-24 gap-[8px]">
            <div className="col-span-24 lg:col-span-11">
              <p className="text-base text-[#5C5752] leading-relaxed">
                We are a design team focused on creating clear, cohesive, and
                reusable experiences across our product ecosystem.
                tapestry.design is our home for team information, working
                practices, and published UI references.
              </p>
              <div className="mt-8 flex gap-6">
                <a href="#components" className="text-[11px] uppercase tracking-[0.18em] font-medium border-b border-[#0C0B09] pb-0.5 hover:text-[#9B9490] hover:border-[#9B9490] transition-colors">
                  Explore components
                </a>
                <a href="#team" className="text-[11px] uppercase tracking-[0.18em] text-[#9B9490] border-b border-[#E2DDD8] pb-0.5 hover:text-[#0C0B09] hover:border-[#0C0B09] transition-colors">
                  Meet the team
                </a>
              </div>
            </div>

            <div className="col-span-24 lg:col-span-5 lg:col-start-20 mt-8 lg:mt-0">
              <dl className="space-y-3">
                {[
                  ["Team", "Product Design"],
                  ["Leads", "Cong Kim · Juliana Botero"],
                  ["Members", "6 designers"],
                  ["Location", "New York · Remote"],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between pt-3 border-t border-[#E2DDD8]">
                    <dt className="text-[10px] uppercase tracking-[0.18em] text-[#9B9490]">{k}</dt>
                    <dd className="text-[11px] text-[#0C0B09]">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* ── What We Do ───────────────────────────────────────────────────── */}
      <section id="capabilities" className="border-t border-[#E2DDD8] py-28 px-[20px]">
        <div className="grid grid-cols-24 gap-[8px] mb-20">
          <div className="col-span-24 lg:col-span-4">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#9B9490]">02 — Capabilities</p>
          </div>
          <div className="col-span-24 lg:col-span-14 lg:col-start-6">
            <h2 className="text-[clamp(2rem,4.5vw,5rem)] font-black leading-[0.9] tracking-tight uppercase">
              What<br />we do.
            </h2>
          </div>
        </div>

        <div className="space-y-0">
          {capabilities.map((cap, i) => (
            <div key={cap.id} className={`grid grid-cols-24 gap-[8px] py-6 ${i < capabilities.length - 1 ? "border-b border-[#E2DDD8]" : ""}`}>
              <div className="col-span-2 lg:col-span-1">
                <span className="text-[10px] uppercase tracking-[0.18em] text-[#C8C4BE]">{cap.id}</span>
              </div>
              <div className="col-span-22 lg:col-span-9 lg:col-start-3">
                <p className="text-sm font-semibold tracking-tight">{cap.name}</p>
              </div>
              <div className="col-span-24 lg:col-span-11 lg:col-start-13">
                <p className="text-sm text-[#7A7570] leading-relaxed">{cap.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── What We Manage ───────────────────────────────────────────────── */}
      <section className="border-t border-[#E2DDD8] py-28 px-[20px] bg-[#F0EDE6]">
        <div className="grid grid-cols-24 gap-[8px] mb-20">
          <div className="col-span-24 lg:col-span-4">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#9B9490]">03 — Ownership</p>
          </div>
          <div className="col-span-24 lg:col-span-14 lg:col-start-6">
            <h2 className="text-[clamp(2rem,4.5vw,5rem)] font-black leading-[0.9] tracking-tight uppercase">
              What we<br />manage.
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-px border border-[#E2DDD8]">
          {ownership.map((item) => (
            <div key={item} className="bg-[#F0EDE6] p-5 border-r border-b border-[#E2DDD8] last:border-r-0">
              <p className="text-[11px] uppercase tracking-[0.1em] leading-snug text-[#0C0B09]">{item}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Team ─────────────────────────────────────────────────────────── */}
      <section id="team" className="border-t border-[#E2DDD8] py-28 px-[20px]">
        <div className="grid grid-cols-24 gap-[8px] mb-20">
          <div className="col-span-24 lg:col-span-4">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#9B9490]">04 — People</p>
          </div>
          <div className="col-span-24 lg:col-span-14 lg:col-start-6">
            <h2 className="text-[clamp(2rem,4.5vw,5rem)] font-black leading-[0.9] tracking-tight uppercase">
              The team.
            </h2>
          </div>
        </div>

        <div className="space-y-0">
          {team.map((member, i) => (
            <div key={member.name} className={`grid grid-cols-24 gap-[8px] py-7 ${i < team.length - 1 ? "border-b border-[#E2DDD8]" : ""}`}>
              {/* Initials */}
              <div className="col-span-3 lg:col-span-2">
                <div className="w-10 h-10 bg-[#E8E4DE] flex items-center justify-center">
                  <span className="text-[10px] uppercase tracking-[0.1em] font-semibold text-[#5C5752]">{member.initials}</span>
                </div>
              </div>
              {/* Name + role */}
              <div className="col-span-21 lg:col-span-7 lg:col-start-3">
                <p className="font-semibold tracking-tight text-sm">{member.name}</p>
                <p className="text-[11px] text-[#9B9490] mt-0.5">{member.role}</p>
              </div>
              {/* Focus */}
              <div className="col-span-24 lg:col-span-8 lg:col-start-11">
                <p className="text-sm text-[#7A7570]">{member.focus}</p>
              </div>
              {/* Location */}
              <div className="hidden lg:block col-span-4 lg:col-start-21">
                <p className="text-[11px] uppercase tracking-[0.12em] text-[#C8C4BE]">{member.location}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── How We Work ──────────────────────────────────────────────────── */}
      <section id="how-we-work" className="border-t border-[#E2DDD8] py-28 px-[20px] bg-[#F0EDE6]">
        <div className="grid grid-cols-24 gap-[8px] mb-20">
          <div className="col-span-24 lg:col-span-4">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#9B9490]">05 — Process</p>
          </div>
          <div className="col-span-24 lg:col-span-14 lg:col-start-6">
            <h2 className="text-[clamp(2rem,4.5vw,5rem)] font-black leading-[0.9] tracking-tight uppercase">
              How we<br />work.
            </h2>
          </div>
        </div>

        <div className="space-y-0">
          {process.map((step, i) => (
            <div key={step.step} className={`grid grid-cols-24 gap-[8px] items-baseline ${i < process.length - 1 ? "border-b border-[#E2DDD8]" : ""}`}>
              {/* Giant step number */}
              <div className="col-span-24 lg:col-span-4 py-6 lg:py-10">
                <span className="text-[clamp(3rem,6vw,6.5rem)] font-black leading-none tracking-tight text-[#D8D4CE]">
                  {step.step}
                </span>
              </div>
              {/* Name */}
              <div className="col-span-24 lg:col-span-6 lg:col-start-6 pb-6 lg:pb-0">
                <p className="text-xl font-black tracking-tight uppercase">{step.name}</p>
              </div>
              {/* Description */}
              <div className="col-span-24 lg:col-span-12 lg:col-start-13 pb-6 lg:pb-0">
                <p className="text-sm text-[#7A7570] leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Components ───────────────────────────────────────────────────── */}
      <section id="components" className="border-t border-[#E2DDD8] py-28 px-[20px]">
        <div className="grid grid-cols-24 gap-[8px] mb-20">
          <div className="col-span-24 lg:col-span-4">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#9B9490]">06 — Library</p>
          </div>
          <div className="col-span-24 lg:col-span-12 lg:col-start-6">
            <h2 className="text-[clamp(2rem,4.5vw,5rem)] font-black leading-[0.9] tracking-tight uppercase">
              Published<br />components.
            </h2>
          </div>
          <div className="col-span-24 lg:col-span-5 lg:col-start-20 self-end">
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#9B9490]">
              {components.filter((c) => c.status === "Published").length} published · {components.length} total
            </p>
          </div>
        </div>

        {/* Table */}
        <div>
          <div className="grid grid-cols-24 gap-[8px] border-b border-[#0C0B09] pb-2 mb-0">
            <div className="col-span-12 lg:col-span-9">
              <p className="text-[10px] uppercase tracking-[0.18em] text-[#9B9490]">Component</p>
            </div>
            <div className="hidden lg:block col-span-4">
              <p className="text-[10px] uppercase tracking-[0.18em] text-[#9B9490]">Category</p>
            </div>
            <div className="col-span-8 lg:col-span-4 lg:col-start-17">
              <p className="text-[10px] uppercase tracking-[0.18em] text-[#9B9490]">Status</p>
            </div>
            <div className="hidden lg:block col-span-4 lg:col-start-22 text-right">
              <p className="text-[10px] uppercase tracking-[0.18em] text-[#9B9490]">Updated</p>
            </div>
          </div>
          {components.map((comp, i) => (
            <div key={comp.name} className={`grid grid-cols-24 gap-[8px] py-4 ${i < components.length - 1 ? "border-b border-[#E2DDD8]" : ""} hover:bg-[#F0EDE6] -mx-[20px] px-[20px] transition-colors`}>
              <div className="col-span-12 lg:col-span-9">
                <p className="text-sm font-medium">{comp.name}</p>
              </div>
              <div className="hidden lg:block col-span-4">
                <p className="text-sm text-[#9B9490]">{comp.category}</p>
              </div>
              <div className="col-span-8 lg:col-span-4 lg:col-start-17">
                <Badge status={comp.status} />
              </div>
              <div className="hidden lg:block col-span-4 lg:col-start-22 text-right">
                <p className="text-[11px] text-[#C8C4BE]">{comp.updated}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-[#E2DDD8]">
          <a href="#" className="text-[11px] uppercase tracking-[0.18em] font-medium border-b border-[#0C0B09] pb-0.5 hover:text-[#9B9490] hover:border-[#9B9490] transition-colors">
            Browse all in Figma →
          </a>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="border-t border-[#0C0B09] px-[20px] py-12">
        <div className="grid grid-cols-24 gap-[8px]">
          <div className="col-span-24 lg:col-span-8">
            <p className="text-[clamp(1.25rem,2.5vw,2.5rem)] font-black uppercase tracking-tight leading-none mb-6">
              tapestry.design
            </p>
            <p className="text-[11px] text-[#9B9490] leading-relaxed max-w-xs">
              The home for our design team's people, practices, and reusable product UI work.
            </p>
          </div>
          <div className="col-span-24 lg:col-span-4 lg:col-start-13">
            <p className="text-[10px] uppercase tracking-[0.18em] text-[#9B9490] mb-4">Navigate</p>
            <ul className="space-y-2">
              {["Team", "Capabilities", "How We Work", "Components", "Resources"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-[11px] text-[#7A7570] hover:text-[#0C0B09] transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-span-24 lg:col-span-4 lg:col-start-18">
            <p className="text-[10px] uppercase tracking-[0.18em] text-[#9B9490] mb-4">Contact</p>
            <ul className="space-y-2">
              <li><a href="#" className="text-[11px] text-[#7A7570] hover:text-[#0C0B09] transition-colors">Teams channel</a></li>
              <li><a href="#" className="text-[11px] text-[#7A7570] hover:text-[#0C0B09] transition-colors">Office hours</a></li>
              <li><a href="#" className="text-[11px] text-[#7A7570] hover:text-[#0C0B09] transition-colors">Figma workspace</a></li>
            </ul>
          </div>
          <div className="col-span-24 lg:col-span-4 lg:col-start-22 self-end">
            <p className="text-[10px] uppercase tracking-[0.18em] text-[#C8C4BE]">
              Tapestry, Inc.<br />Product Design<br />2026
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
