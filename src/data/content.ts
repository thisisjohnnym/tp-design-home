export const capabilities = [
  { id: "01", name: "Product Experience Design", description: "End-to-end UX across web and mobile product surfaces, from concept to shipped quality." },
  { id: "02", name: "UI Systems & Patterns", description: "Reusable components, design tokens, and scalable UI foundations across platforms." },
  { id: "03", name: "Interaction Design", description: "Detailed flows, micro-interactions, and behavior specification that make products feel right." },
  { id: "04", name: "Prototyping", description: "High-fidelity concept exploration and stakeholder communication in Figma." },
  { id: "05", name: "Design Strategy", description: "Scoping, prioritization, and alignment with product direction and business goals." },
  { id: "06", name: "Accessibility & Inclusive Design", description: "Inclusive practices across color, structure, interaction, and content from day one." },
  { id: "07", name: "Content Design", description: "UX writing, information hierarchy, and in-product language that guides people clearly." },
  { id: "08", name: "Research Collaboration", description: "Synthesis, facilitation, and integration of user insights into product decisions." },
  { id: "09", name: "Design Operations", description: "Tooling, rituals, file hygiene, and the infrastructure that keeps the team moving." },
  { id: "10", name: "Figma Libraries & Tooling", description: "Master component libraries, variables, and file organization for the whole org." },
];

export type TeamMember = {
  name: string;
  role: string;
  image: string;
  quirk?: string;
  emoji?: string;
  color?: string;
};

export const team: TeamMember[] = [
  { name: "Sean Kelly", role: "Sr. Product Designer", image: "/team/member-1.jpg", quirk: "Will die on the spacing hill", emoji: "📐", color: "#FF5722" },
  { name: "Wendy Chan", role: "Sr. Product Designer", image: "/team/member-2.jpg", quirk: "Figma file naming evangelist", emoji: "🗂️", color: "#6C63FF" },
  { name: "Cong Kim", role: "Sr. Product Designer", image: "/team/member-3.jpg", quirk: "Shader enthusiast, obviously", emoji: "✨", color: "#FFD93D" },
  { name: "Juliana Botero", role: "Sr. Product Designer", image: "/team/member-4.jpg", quirk: "Accessibility before aesthetics (but both)", emoji: "♿", color: "#4ECDC4" },
  { name: "Johnathan Martinez", role: "Sr. Product Designer", image: "/team/member-5.jpg", quirk: "Prototype first, ask questions later", emoji: "⚡", color: "#FF6B9D" },
  { name: "Kat Guzman", role: "Sr. Product Designer", image: "/team/member-6.jpg", quirk: "Critique sessions are her love language", emoji: "💬", color: "#95E1A3" },
  { name: "Mitra Raveendran", role: "Product Designer", image: "/team/member-7.jpg", quirk: "Research notes longer than the spec", emoji: "🔍", color: "#C084FC" },
  { name: "Gulsheen Bhatia", role: "Sr. Product Designer", image: "/team/member-8.jpg", quirk: "Component library guardian", emoji: "🛡️", color: "#FB923C" },
];

export const teamMarquee = [
  "pixel pushers",
  "figma nerds",
  "flow chart people",
  "critique lovers",
  "Coach · Kate Spade · Stuart Weitzman",
  "design token hoarders",
  "micro-interaction obsessives",
  "accessibility advocates",
];

export const quirkyCapabilities = [
  { label: "Design Strategy", size: "xl" as const },
  { label: "Product Experience", size: "lg" as const },
  { label: "Interaction Design", size: "md" as const },
  { label: "Research Collab", size: "lg" as const },
  { label: "Prototyping", size: "xl" as const },
  { label: "UI Systems", size: "sm" as const },
  { label: "Content Design", size: "md" as const },
  { label: "Accessibility", size: "sm" as const },
];

export const process = [
  { step: "01", name: "Frame", description: "Clarify the user need, business context, constraints, and success criteria." },
  { step: "02", name: "Explore", description: "Generate concepts, flows, prototypes, or pattern options." },
  { step: "03", name: "Align", description: "Review with stakeholders, engineering, product, and design peers." },
  { step: "04", name: "Refine", description: "Resolve interaction details, edge cases, accessibility, and content." },
  { step: "05", name: "Publish", description: "Document the artifact, component, or pattern with a Figma reference." },
  { step: "06", name: "Evolve", description: "Revisit based on usage, feedback, implementation, and product needs." },
];

export const components = [
  { name: "Navigation Bar", category: "Navigation", status: "Published", updated: "May 2026" },
  { name: "Product Card", category: "Content", status: "Published", updated: "May 2026" },
  { name: "Filter Chip", category: "Controls", status: "Published", updated: "Apr 2026" },
  { name: "Empty State", category: "Feedback", status: "Published", updated: "Apr 2026" },
  { name: "Form Input", category: "Forms", status: "In Review", updated: "Jun 2026" },
  { name: "Toast Notification", category: "Feedback", status: "In Review", updated: "Jun 2026" },
  { name: "Modal Dialog", category: "Overlay", status: "Exploratory", updated: "Jun 2026" },
  { name: "Data Table", category: "Data", status: "Exploratory", updated: "Jun 2026" },
];

export const ownership = [
  "Coach Web Platform", "Coach Mobile App", "Kate Spade Platform", "Stuart Weitzman Site",
  "Checkout Flow", "Product Detail Page", "Search & Discovery", "Account & Profile",
  "Design Tokens", "Component Library", "Figma Master Library", "Icon System",
  "Critique Rituals", "Design Reviews", "Onboarding Templates", "Brand Alignment",
];
