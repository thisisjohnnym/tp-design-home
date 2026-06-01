import Link from "next/link";
import { capabilities, team, process, components, ownership } from "@/data/content";

// ─── Palette ─────────────────────────────────────────────────────────────────
// Ground: #F2EBD9   Type: #1A130A   Muted: #7A6A58   Accent: #D4956A
// Secondary: #E8DFCC   Mode: Warm card interface + modular information bands

const STATUS_STYLES: Record<string, string> = {
  Published: "bg-[#1A130A] text-[#F2EBD9]",
  "In Review": "bg-[#D4956A]/20 text-[#9A6A42] border border-[#D4956A]/30",
  Exploratory: "border border-[#C8BCA8] text-[#9A8E7E]",
  Deprecated: "text-[#B0A898] line-through",
};

function Badge({ status }: { status: string }) {
  return (
    <span className={`inline-flex px-2.5 py-0.5 text-[9px] uppercase tracking-[0.15em] rounded-full ${STATUS_STYLES[status] ?? ""}`}>
      {status}
    </span>
  );
}

export default function V3() {
  return (
    <div className="bg-[#F2EBD9] text-[#1A130A] min-h-screen">

      {/* ── Nav ──────────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#F2EBD9]/95 backdrop-blur-sm border-b border-[#DDD3C0]">
        <div className="px-[20px] h-11 flex items-center justify-between">
          <span className="text-[11px] uppercase tracking-[0.2em] font-medium">tapestry.design</span>
          <div className="hidden md:flex items-center gap-8">
            {["Team", "Capabilities", "How We Work", "Components", "Resources"].map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(/ /g, "-")}`}
                className="text-[11px] uppercase tracking-[0.12em] text-[#9A8E7E] hover:text-[#1A130A] transition-colors">
                {item}
              </a>
            ))}
          </div>
          <Link href="/" className="text-[11px] uppercase tracking-[0.12em] text-[#9A8E7E] hover:text-[#1A130A] transition-colors">
            ← All versions
          </Link>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="pt-11 min-h-[90vh] flex flex-col">
        {/* Clay accent bar — one bounded color event */}
        <div className="h-1 bg-[#D4956A]" />

        <div className="flex-1 flex flex-col justify-center px-[20px] py-24">
          <div className="grid grid-cols-24 gap-[8px]">
            <div className="col-span-24 lg:col-span-14">
              <p className="text-[11px] uppercase tracking-[0.25em] text-[#9A8E7E] mb-8">
                Product Design · Tapestry, Inc.
              </p>
              <h1 className="text-[clamp(2.75rem,7vw,8rem)] font-black leading-[0.88] tracking-tight mb-10">
                Designing the<br />
                connective<br />
                tissue.
              </h1>
              <p className="text-base text-[#7A6A58] leading-relaxed max-w-prose mb-10">
                We create reusable patterns that help product teams move faster
                while keeping the experience consistent. tapestry.design is our
                home for team information, working practices, and published UI references.
              </p>
              <div className="flex gap-4">
                <a href="#components"
                  className="px-5 py-2.5 bg-[#1A130A] text-[#F2EBD9] text-[11px] uppercase tracking-[0.15em] hover:bg-[#D4956A] transition-colors">
                  Explore components
                </a>
                <a href="#team"
                  className="px-5 py-2.5 border border-[#DDD3C0] text-[11px] uppercase tracking-[0.15em] text-[#7A6A58] hover:border-[#1A130A] hover:text-[#1A130A] transition-colors">
                  Meet the team
                </a>
              </div>
            </div>

            {/* Right: team summary card */}
            <div className="hidden lg:block col-span-7 lg:col-start-18">
              <div className="bg-[#EAE0CC] p-8 h-full">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#9A8E7E] mb-6">Team at a glance</p>
                <dl className="space-y-4">
                  {[
                    ["Members", "6 designers"],
                    ["Leads", "Cong Kim\nJuliana Botero"],
                    ["Location", "New York · Remote"],
                    ["Focus", "Product · Systems · Research"],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <dt className="text-[10px] uppercase tracking-[0.15em] text-[#9A8E7E] mb-1">{k}</dt>
                      <dd className="text-sm text-[#1A130A] leading-snug whitespace-pre-line">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Capabilities ─────────────────────────────────────────────────── */}
      <section id="capabilities" className="border-t border-[#DDD3C0] py-24 px-[20px]">
        <div className="grid grid-cols-24 gap-[8px] mb-16">
          <div className="col-span-24 lg:col-span-14">
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#9A8E7E] mb-4">What we do</p>
            <h2 className="text-[clamp(1.75rem,3.5vw,4rem)] font-black leading-[0.9] tracking-tight">
              Our capabilities.
            </h2>
          </div>
          <div className="hidden lg:flex col-span-8 lg:col-start-17 items-end">
            <p className="text-sm text-[#7A6A58] leading-relaxed">
              We partner across product, engineering, and leadership to shape
              experiences that are useful, consistent, and thoughtfully crafted.
            </p>
          </div>
        </div>

        {/* 3-column modular card grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[8px]">
          {capabilities.map((cap) => (
            <div key={cap.id} className="bg-[#EAE0CC] hover:bg-[#E0D4BA] transition-colors">
              {/* Clay accent header bar */}
              <div className="h-1 bg-[#D4956A] opacity-40" />
              <div className="p-6">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#D4956A] block mb-4">{cap.id}</span>
                <h3 className="text-sm font-bold tracking-tight mb-3">{cap.name}</h3>
                <p className="text-[12px] text-[#7A6A58] leading-relaxed">{cap.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── What We Manage ───────────────────────────────────────────────── */}
      <section className="border-t border-[#DDD3C0] py-24 px-[20px] bg-[#EAE0CC]">
        <div className="grid grid-cols-24 gap-[8px] mb-16">
          <div className="col-span-24 lg:col-span-14">
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#9A8E7E] mb-4">Ownership</p>
            <h2 className="text-[clamp(1.75rem,3.5vw,4rem)] font-black leading-[0.9] tracking-tight">
              What we manage.
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-[8px]">
          {ownership.map((item) => (
            <div key={item} className="bg-[#F2EBD9] p-5 border-l-2 border-[#DDD3C0] hover:border-[#D4956A] transition-colors">
              <p className="text-[11px] uppercase tracking-[0.08em] leading-snug text-[#1A130A]">{item}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Team ─────────────────────────────────────────────────────────── */}
      <section id="team" className="border-t border-[#DDD3C0] py-24 px-[20px]">
        <div className="grid grid-cols-24 gap-[8px] mb-16">
          <div className="col-span-24 lg:col-span-14">
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#9A8E7E] mb-4">People</p>
            <h2 className="text-[clamp(1.75rem,3.5vw,4rem)] font-black leading-[0.9] tracking-tight">
              The team.
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[8px]">
          {team.map((member) => (
            <div key={member.name} className="bg-[#EAE0CC] p-8 hover:bg-[#E0D4BA] transition-colors">
              {/* Initials */}
              <div className="w-12 h-12 rounded-full bg-[#F2EBD9] flex items-center justify-center mb-6 border border-[#DDD3C0]">
                <span className="text-[11px] uppercase tracking-[0.08em] font-bold text-[#7A6A58]">{member.initials}</span>
              </div>
              <p className="font-bold tracking-tight mb-1">{member.name}</p>
              <p className="text-[11px] text-[#D4956A] uppercase tracking-[0.1em] mb-4">{member.role}</p>
              <div className="pt-4 border-t border-[#DDD3C0]">
                <p className="text-[12px] text-[#7A6A58] mb-2">{member.focus}</p>
                <p className="text-[10px] uppercase tracking-[0.15em] text-[#B0A898]">{member.location}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── How We Work ──────────────────────────────────────────────────── */}
      <section id="how-we-work" className="border-t border-[#DDD3C0] py-24 px-[20px] bg-[#EAE0CC]">
        <div className="grid grid-cols-24 gap-[8px] mb-16">
          <div className="col-span-24 lg:col-span-14">
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#9A8E7E] mb-4">Process</p>
            <h2 className="text-[clamp(1.75rem,3.5vw,4rem)] font-black leading-[0.9] tracking-tight">
              How we work.
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-24 gap-[8px]">
          {/* Spine */}
          <div className="hidden lg:flex col-span-1 flex-col items-center pt-3">
            <div className="w-px flex-1 bg-[#DDD3C0]" />
          </div>

          <div className="col-span-24 lg:col-span-23 space-y-0">
            {process.map((step, i) => (
              <div key={step.step} className={`grid grid-cols-24 gap-[8px] py-8 ${i < process.length - 1 ? "border-b border-[#DDD3C0]" : ""}`}>
                {/* Step number — clay dot + number */}
                <div className="col-span-3 lg:col-span-2 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#D4956A] flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-[9px] font-bold text-[#F2EBD9]">{i + 1}</span>
                  </div>
                </div>
                {/* Name */}
                <div className="col-span-21 lg:col-span-6 lg:col-start-4">
                  <p className="text-base font-black tracking-tight">{step.name}</p>
                </div>
                {/* Description */}
                <div className="col-span-24 lg:col-span-14 lg:col-start-11">
                  <p className="text-sm text-[#7A6A58] leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Components ───────────────────────────────────────────────────── */}
      <section id="components" className="border-t border-[#DDD3C0] py-24 px-[20px]">
        <div className="grid grid-cols-24 gap-[8px] mb-16">
          <div className="col-span-24 lg:col-span-14">
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#9A8E7E] mb-4">Library</p>
            <h2 className="text-[clamp(1.75rem,3.5vw,4rem)] font-black leading-[0.9] tracking-tight">
              Published components.
            </h2>
          </div>
          <div className="hidden lg:flex col-span-8 lg:col-start-17 items-end">
            <p className="text-[11px] uppercase tracking-[0.15em] text-[#9A8E7E]">
              {components.filter((c) => c.status === "Published").length} published · {components.length} total entries
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[8px]">
          {components.map((comp) => (
            <div key={comp.name} className="bg-[#EAE0CC] hover:bg-[#E0D4BA] transition-colors group">
              {/* Preview zone */}
              <div className="h-28 bg-[#F2EBD9] flex items-center justify-center border-b border-[#DDD3C0]">
                <div className="w-16 h-10 bg-[#EAE0CC] rounded" />
              </div>
              <div className="p-5">
                <p className="text-sm font-semibold tracking-tight mb-2">{comp.name}</p>
                <p className="text-[11px] text-[#9A8E7E] mb-4">{comp.category}</p>
                <div className="flex items-center justify-between">
                  <Badge status={comp.status} />
                  <span className="text-[10px] text-[#B0A898]">{comp.updated}</span>
                </div>
                <a href="#" className="mt-4 block text-[10px] uppercase tracking-[0.15em] text-[#D4956A] opacity-0 group-hover:opacity-100 transition-opacity">
                  Open in Figma →
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-8 border-t border-[#DDD3C0]">
          <a href="#"
            className="inline-flex px-5 py-2.5 border border-[#DDD3C0] text-[11px] uppercase tracking-[0.15em] text-[#7A6A58] hover:border-[#1A130A] hover:text-[#1A130A] transition-colors">
            Browse all in Figma →
          </a>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="border-t border-[#1A130A] px-[20px] py-12 bg-[#1A130A] text-[#F2EBD9]">
        <div className="grid grid-cols-24 gap-[8px]">
          <div className="col-span-24 lg:col-span-8">
            <p className="text-[clamp(1.25rem,2.5vw,2.5rem)] font-black uppercase tracking-tight leading-none mb-6">
              tapestry.design
            </p>
            <p className="text-[11px] text-[#7A6A58] leading-relaxed max-w-xs">
              The home for our design team's people, practices, and reusable product UI work.
            </p>
          </div>
          <div className="col-span-12 lg:col-span-4 lg:col-start-13 mt-8 lg:mt-0">
            <p className="text-[10px] uppercase tracking-[0.18em] text-[#4A3F34] mb-4">Navigate</p>
            <ul className="space-y-2">
              {["Team", "Capabilities", "How We Work", "Components", "Resources"].map((item) => (
                <li key={item}><a href="#" className="text-[11px] text-[#7A6A58] hover:text-[#F2EBD9] transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>
          <div className="col-span-12 lg:col-span-4 lg:col-start-18 mt-8 lg:mt-0">
            <p className="text-[10px] uppercase tracking-[0.18em] text-[#4A3F34] mb-4">Contact</p>
            <ul className="space-y-2">
              <li><a href="#" className="text-[11px] text-[#7A6A58] hover:text-[#F2EBD9] transition-colors">Teams channel</a></li>
              <li><a href="#" className="text-[11px] text-[#7A6A58] hover:text-[#F2EBD9] transition-colors">Office hours</a></li>
              <li><a href="#" className="text-[11px] text-[#7A6A58] hover:text-[#F2EBD9] transition-colors">Figma workspace</a></li>
            </ul>
          </div>
          <div className="col-span-24 lg:col-span-3 lg:col-start-22 self-end mt-8 lg:mt-0">
            <p className="text-[10px] uppercase tracking-[0.18em] text-[#4A3F34]">
              Tapestry, Inc.<br />Product Design<br />2026
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
