# Tapestry Design Team — tapestry.design

Internal team site for Tapestry Design: who we are, what we do, what we manage, how we work, and how to collaborate.

## Quick start

```bash
cd design-team-landing-page
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

**After code changes:** production preview requires a fresh build — `npm run build && npm run start`. For live reload while editing, use `npm run dev` instead. The hero intro animation runs once per session (`tapestry-hero-intro-seen` in session storage); use a private window or clear that key to replay it.

## Pages

| Route | Purpose |
|-------|---------|
| `/` | Landing — hero + section teasers |
| `/team` | Values + poster gallery (each member + chosen design poster) |
| `/capabilities` | Capability breakdown |
| `/what-we-manage` | Ownership map |
| `/how-we-work` | 6-step process + principles |
| `/contact` | Collaboration info + intake form |

## Layout grid

Tokens in `src/content/grid.ts` (applied via CSS in `globals.css`):

| | Mobile | Desktop (768px+) |
|---|--------|------------------|
| Columns | 12 | 24 |
| Margin | 12px | 20px |
| Gutter | 4px | 8px |

Use `PageGrid` and `GridCell` from `src/components/layout/PageGrid.tsx`:

```tsx
<PageGrid>
  <GridCell span={12}>Half width on desktop; 6 cols on mobile (proportional)</GridCell>
  <GridCell span={12} spanMobile={12}>Full width on mobile, half on desktop</GridCell>
</PageGrid>
```

`span` = desktop (1–24). `spanMobile` = mobile (1–12); defaults to full width or proportional to `span`.

To preview columns in dev, add `page-grid--debug` to a `PageGrid` `className`.

**Section spacing:** `--section-gap` is `120px` between major sections. Use `section-stack` on a flex column parent, or `mt-section` / `gap-section` (Tailwind).

## Theme controls

Inspired by [michelegre.co](https://www.michelegre.co) — controls in the header (right of “Tapestry · Design”):

- **Sun** — light mode
- **Moon** — dark mode  
- **Shuffle** — cycles palettes: **Studio** `#f0f0f0` (default, accent `#ffcb00`), **Sage** `#EAF2E7`, **Plum** `#5C0036`, **Flame** `#F05400`

Default palette is **Studio** (`#f0f0f0` background, black type, `#ffcb00` accent). Preferences persist in `localStorage`. Tokens live in `src/content/themes.ts` and `globals.css`.

## Edit content

All copy, team roster, capabilities, and placeholders live in one file:

**`src/content/site.ts`**

Update `links.figma`, `links.slack`, and `links.intakeForm` when URLs are ready — contact page will show those buttons automatically.

## Team poster gallery

Each team member is paired with a design poster in `public/team-posters/` (URL-safe filenames, e.g. `sean-kelly.jpg`). Source originals live on Desktop in `Team posters/`.

To change a pairing, update `poster` and optional `posterLabel` on that member in `src/content/site.ts`, then copy or replace the JPG in `public/team-posters/`. Intro copy is `site.teamIntro`.

## Contact form

`src/components/contact/ContactForm.tsx` currently acknowledges submit locally. Wire to Formspree, Slack webhook, or an internal API when ready.

## Stack

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS 3.4 (editorial type scale, Helvetica typography)
- Framer Motion (optional — add motion as you design)
- Material Symbols (`Icon` component)

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Local dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | ESLint |

## Fonts

Helvetica Roman and Bold are loaded from `public/fonts/coachtopia/` via `src/app/fonts.ts`. Licensed for internal Tapestry use.
