# PRD: tapestry.design — Internal Product Design Team Landing Page

**Project:** tapestry.design  
**Leads:** Cong Kim, Juliana Botero  
**Status:** Pre-development — MVP scoping  
**Last Updated:** June 2026

---

## 1. Overview

`tapestry.design` is an internal landing page and content experience for Tapestry's Product Design team. It will serve as the team's home on the web — part team profile, part capabilities overview, part working library, and part reference point for internal partners.

The first release is not a design system documentation site. It is a polished, lightweight content experience that makes the team visible, communicates how to work with them, and creates a practical reference point for design assets and published UI patterns.

---

## 2. Problem Statement

Internal partners, new hires, and cross-functional stakeholders currently lack a single, clear place to:

- Understand the Product Design team's scope, capabilities, and people
- Know how to collaborate with the team or make a design request
- Find source-of-truth Figma files and published component references
- Get oriented quickly during onboarding

This leads to repeated Slack/Teams questions, misalignment about team ownership, and difficulty surfacing design work to the right audiences.

---

## 3. Goals

### Primary Goals

- Make the design team's people, capabilities, and owned work clearly visible to internal partners
- Reduce friction for partners who need to engage the team or find design assets
- Give team members a shared reference point for identity, norms, and published UI work
- Establish a credible, polished content foundation that can grow over time

### Non-Goals (v1)

- A fully integrated design system documentation site
- A coded component library with production-ready implementation guidance
- A governance platform for tokens, accessibility specs, changelogs, or release pipelines
- Public-facing content (internal only for v1)

---

## 4. Audiences


| Audience                                       | Primary Needs                                                                         |
| ---------------------------------------------- | ------------------------------------------------------------------------------------- |
| **Product & engineering partners**             | Know what the team owns, how to collaborate, where to find assets, and who to contact |
| **Design team members**                        | Shared reference for team identity, working norms, UI patterns, and component work    |
| **Leadership & cross-functional stakeholders** | Clear view of team capabilities, responsibilities, operating model, and impact        |
| **New hires & onboarding partners**            | Welcoming introduction to the team, its culture, and systems already in motion        |


---

## 5. Experience Goals

The site should help any visitor:

- Understand the team's purpose and scope within the first minute
- Discover who is on the team and what each person contributes
- Learn how the team works, collaborates, and makes decisions
- Find current component or pattern references quickly
- Access source-of-truth Figma links without needing deep documentation
- Build confidence that the team has a clear point of view, strong craft, and a scalable way of working

---

## 6. Site Structure & Page Requirements

### 6.1 Home

**Purpose:** Front door. Quickly communicate who the team is, what it owns, and where to go next.

**Required sections:**

- Hero with team mission statement and short supporting copy
- High-level capability area overview
- "What We Manage" snapshot
- Team preview (photo-led, links to full Team page)
- How We Work process summary
- Featured component/pattern cards with status badges and Figma links
- Quick navigation links to all primary sections
- Resources and contact paths

**Sample hero copy:**

> *Designing the connective tissue of our product experience.*
> We are a design team focused on creating clear, cohesive, and reusable experiences across our product ecosystem.

---

### 6.2 Team

**Purpose:** Introduce the team as individuals and as a collective.

**Required content:**

- Group or candid team imagery
- Individual member cards containing:
  - Name and role/title
  - Short bio (warm and concise — not a résumé)
  - Areas of focus
  - Location/time zone *(optional)*
  - Contact link *(optional)*
- Shared team values or principles
- Onboarding/hiring note *(optional)*

**Bio tone guidance:** Each bio should answer — what does this person focus on, what are they great at, and how do they contribute to the team? Avoid corporate language.

---

### 6.3 Capabilities

**Purpose:** Explain the team's expertise so partners know when and how to engage.

**Capability areas to cover:**

- Product experience design
- UI systems and reusable patterns
- Interaction design
- Prototyping and concept development
- Design strategy
- Accessibility and inclusive design
- Content design
- Research collaboration
- Design operations
- Figma libraries and tooling
- Cross-platform experience quality
- Design critique and quality reviews

**Each capability card should include:**

- What it means
- Why it matters
- How the team applies it
- Example outputs or artifacts
- Related contacts/owners *(optional)*

---

### 6.4 What We Manage

**Purpose:** Make the team's ownership scope clear and practical.

**Required content:**

- Product areas and surfaces the team supports
- Design assets the team owns (Figma libraries, kits, files, pattern collections)
- Component categories
- Review rituals and quality checkpoints
- Partner teams and collaboration models
- Ownership status labels: *Owned / Influenced / Supported / Experimental*

---

### 6.5 How We Work

**Purpose:** Explain the team's operating model, collaboration style, and decision-making approach.

**Required sections:**

- Design process overview (see model below)
- How to engage the team
- Critique and review rituals
- Decision-making principles
- Quality bar expectations
- Accessibility expectations
- Figma organization and file hygiene
- Design-to-engineering collaboration

**Design process model:**

1. **Frame** — Clarify the user need, business context, constraints, and success criteria
2. **Explore** — Generate concepts, flows, prototypes, or pattern options
3. **Align** — Review with stakeholders, engineering, product, and design peers
4. **Refine** — Resolve interaction details, edge cases, accessibility, and content
5. **Publish** — Document the design artifact, component, or pattern with a Figma reference
6. **Evolve** — Revisit based on usage, feedback, implementation, and product needs

---

### 6.6 Resources

**Purpose:** One place to find important design references and links.

**Required links:**

- Main Figma workspace
- UI kit
- Component files
- Team rituals or calendars
- Design review process
- Accessibility resources
- Brand/content guidelines *(if applicable)*
- Onboarding materials
- Team Teams/Slack channel

---

### 6.8 Contact

**Purpose:** Help partners understand how to reach the team.

**Required content:**

- When to contact the team
- What types of requests are appropriate
- Preferred intake process and team channel
- Office hours, critique sessions, or review rituals
- Turnaround expectations *(optional)*
- Links to intake forms, tickets, or channels *(optional)*

---

## 7. MVP Scope

### Pages

- Home
- Team
- Capabilities
- What We Manage
- How We Work
- Components / Patterns
- Resources
- Contact

### Content (required to launch)

- Team mission statement
- Team photos (group + individual)
- Individual bios for all team members
- Capability descriptions for all areas
- Ownership map
- Collaboration and intake model
- 5–10 published component/pattern entries
- Contact and intake guidance

### Functionality (required)

- Responsive layout (mobile + desktop)
- Simple top navigation
- Component cards with status badges
- Component detail pages or modals
- Figma outbound links

### Functionality (optional for v1)

- Basic component filtering by category and status
- Search
- Lightweight CMS or content editing model

---

## 8. Visual & Interaction Direction

### Design Principles


| Quality                            | Description                                                                                                                    |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| **Editorial**                      | Structured like a high-quality publication or studio portfolio — strong hierarchy, thoughtful pacing, intentional storytelling |
| **Human**                          | Team photography, bios, voice, and working principles make the team feel approachable and real                                 |
| **Useful**                         | Every page helps someone take an action: learn, contact, find, reference, or reuse                                             |
| **System-aware, not system-heavy** | Coherent and reusable UI, but no full design system adoption required on day one                                               |
| **Crafted**                        | Every page demonstrates the team's quality bar through layout, typography, spacing, interaction, and content clarity           |


### Visual Foundations

- Strong typographic hierarchy
- Modular page sections with editorial spacing
- Flexible cards
- Large team photography
- Simple, clear navigation
- Subtle interaction states
- Thoughtful empty states

### UI Kit (v1 local kit — not a full design system)

The following components should be designed and implemented for the site itself:


| Category  | Components                                                     |
| --------- | -------------------------------------------------------------- |
| Shell     | Page shell, Navigation/header, Footer                          |
| Content   | Hero blocks, Section headers, Content blocks, Image treatments |
| Cards     | Team cards, Capability cards, Component cards, Link cards      |
| Metadata  | Metadata rows, Status badges, Resource lists                   |
| Templates | Detail page template, Empty state                              |
| Utility   | Search/filter pattern *(optional)*                             |


---

## 9. Content Principles

**Clarity over completeness** — Answer the most important questions quickly. Avoid dense wikis.

**Human before institutional** — Plain language, team photos, real bios, and real examples.

**Useful defaults** — Every page should prompt an action: learn, contact, find, reference, or reuse.

**Source-aware** — Always link directly to Figma source files when a component or pattern exists there.

**Evolve in public, internally** — Areas can be marked as evolving or in progress, as long as status is clear.

---

## 10. Tone & Voice

**Write with:** confidence, warmth, and directness.


| Avoid                                               | Prefer                                             |
| --------------------------------------------------- | -------------------------------------------------- |
| Corporate jargon                                    | Clear verbs and short paragraphs                   |
| Abstract mission language                           | Useful examples and honest status labels           |
| Dense process documentation                         | Human team language and practical guidance         |
| "Design system" language that overpromises maturity | Language that accurately reflects where things are |


**Example:**

> Instead of: *We operationalize scalable design paradigms across enterprise surfaces.*
> Use: *We create reusable patterns that help product teams move faster while keeping the experience consistent.*

---

## 11. Success Metrics

### Qualitative

- Internal partners can clearly describe the team's role and scope after one visit
- New hires rate the site as useful during onboarding
- Team members actively reference the site in rituals and project work
- The site reduces repeated questions about ownership, process, and source files

### Quantitative (potential indicators)

- Number of visits to component/pattern pages
- Click-throughs to Figma files
- Number of components published in first 90 days post-launch
- Stakeholder satisfaction rating after launch
- New hire usefulness score

---

## 12. Future Enhancements (Post-MVP)

After the content experience is established, the site can evolve toward deeper design system support:

- Full component documentation (anatomy, do/don't, variants)
- Token references and changelog
- Accessibility checklists and specs
- Figma embed support
- Version history and release notes
- Usage analytics
- Contribution workflow and request form
- Engineering implementation links and code examples
- Design system roadmap
- Pattern decision records
- Governance model

---

## 13. Open Questions

These questions should be resolved before or during development:

1. Is `tapestry.design` internal only, public, or semi-public?
2. Who owns content updates after launch, and what is the update cadence?
3. What is the minimum quality bar for a component to be published?
4. Should component entries be pages, cards, or both?
5. How often should stale component references be reviewed?
6. Which Figma files are considered source-of-truth?
7. What should be visible to leadership vs. day-to-day collaborators?
8. What is the long-term relationship between this site and a future design system?
9. What tech stack will power the site, and does it need a CMS?
10. Who is responsible for initial content population before launch?

---

## 14. Launch Narrative

> We are the team behind a growing set of design practices, product patterns, and reusable UI foundations. `tapestry.design` gives our partners a clearer view into who we are, what we manage, how we work, and where to find the latest design references.

---

*Document owner: Cong Kim, Juliana Botero*