# BookHuntBD Frontend — UI/UX Redesign PRD

> **Scope:** `BookHuntBD-Frontend/` only. Home page (`/`) and Search Results page (`/search`).  
> **Source of truth:** This document synthesizes two design prompts plus the existing `about.md`. Where they conflict, Prompt 1 (Figma-aligned spec) wins on visual tokens; Prompt 2 wins on UX detail. Backend contracts are never changed.

---

## Table of Contents

1. [Project Context & Constraints](#1-project-context--constraints)
2. [Design System & Tokens](#2-design-system--tokens)
3. [File & Component Plan](#3-file--component-plan)
4. [Shared Components](#4-shared-components)
5. [Home Page (/)](#5-home-page-)
6. [Search Page (/search)](#6-search-page-search)
7. [State Handling & Edge Cases](#7-state-handling--edge-cases)
8. [Accessibility & Quality Bar](#8-accessibility--quality-bar)
9. [Static / Placeholder Data Policy](#9-static--placeholder-data-policy)
10. [Implementation Order & Workflow](#10-implementation-order--workflow)
11. [Out of Scope](#11-out-of-scope)
12. [Open Questions / Decisions Made](#12-open-questions--decisions-made)

---

## 1. Project Context & Constraints

### What we are building

BookHuntBD is a **price-comparison web app** for Bangladeshi online bookstores. Users search once and instantly see prices from 9 BD book e-commerce sites. They can add books to a wishlist and set price-drop email alerts.

### Hard rules (non-negotiable)

| Rule | Detail |
|------|--------|
| **Frontend only** | Work exclusively inside `BookHuntBD-Frontend/`. Never touch `bookHuntBD-server/`. |
| **pnpm only** | Never run `npm` or `yarn` inside the frontend repo. |
| **No API contract changes** | `GET /api/books/search?query&page&limit` returns `{results[], errors[], page, limit, total, cached}`. Shape is fixed. |
| **No new dependencies without approval** | All needed packages already exist in `package.json`. Ask before adding anything new. |
| **No invented endpoints** | Trending feeds, categories, price history, store stats — none of these are in the backend. Must be static/placeholder with TODO comments pointing to `about.md §3.6`. |
| **No hardcoded secrets** | Only reference `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_APP_NAME` via `src/lib/env.ts`. |
| **Next.js 16 + React 19** | Check `node_modules/next/dist/docs/` before any structural changes. Server components by default; `"use client"` only where interactivity requires it. |
| **Existing hooks reuse** | Reuse `useBooks`, `useWishlist`, `useAddToWishlist`, `useRemoveFromWishlist`, `useAlerts`, `useFilters`, `useDebounce`. Do NOT rewrite them (extend `useFilters` if needed). |
| **Tailwind v4 conventions** | Use `@theme {}` in `globals.css` for all design tokens. No hardcoded hex values in components — reference via `var(--token)`. |

---

## 2. Design System & Tokens

All tokens are defined as CSS custom properties inside a Tailwind v4 `@theme {}` block in `src/app/globals.css`. Components reference them via `var(--token)` only.

### 2.1 Color Palette

```css
@theme {
  /* ── Backgrounds (layered dark navy) ─────────────────── */
  --color-bg:            #0B0D12;   /* page background */
  --color-bg-alt:        #0E1117;   /* alternate section bg */
  --color-surface:       #12151C;   /* surface panels */
  --color-card:          #161A23;   /* elevated cards */

  /* ── Borders ─────────────────────────────────────────── */
  --color-border:        #242A3A;
  --color-border-strong: #2F3750;

  /* ── Text ────────────────────────────────────────────── */
  --color-text:          #F4F6FA;   /* primary text */
  --color-muted:         #8B93A7;   /* secondary/muted text */
  --color-dim:           #6B7388;   /* very dim / decorative text only */

  /* ── Brand ───────────────────────────────────────────── */
  --color-primary:       #4F8CFF;   /* blue — CTAs, links, focus rings */
  --color-accent:        #8B5CF6;   /* violet accent */
  --color-gradient-start:#4F8CFF;   /* button gradient start */
  --color-gradient-end:  #6D6BFF;   /* button gradient end */
  --color-gradient-text-from: #5B9BFF;
  --color-gradient-text-to:   #A78BFA;

  /* ── Semantic ────────────────────────────────────────── */
  --color-success:       #22C55E;   /* best price, in-stock */
  --color-success-alt:   #4ADE80;   /* lighter success highlight */
  --color-warning:       #F59E0B;   /* discounts, amber banners */
  --color-error:         #EF4444;   /* errors, out-of-stock */

  /* ── Typography ──────────────────────────────────────── */
  --font-sans:    "Inter", "Anek Bangla", "Hind Siliguri", sans-serif;
  --font-mono:    "JetBrains Mono", monospace;

  /* ── Radius ──────────────────────────────────────────── */
  --radius-card:    20px;   /* BookCard, section cards */
  --radius-card-lg: 24px;   /* hero preview card, CTA banner */
  --radius-btn:     12px;   /* buttons and text inputs */
  --radius-pill:    999px;  /* pills, chips, badges */

  /* ── Shadows ─────────────────────────────────────────── */
  --shadow-card: 0 4px 24px rgba(0,0,0,0.4);
  --shadow-glow: 0 0 40px rgba(79,140,255,0.15);
}
```

### 2.2 Store Brand Colors

Extract to **`src/lib/stores.ts`** — the single source of truth consumed by `SiteLogo`, `StorePill`, and filter dots. Replaces the inline records currently scattered across `SiteLogo.tsx` and `SearchFilters.tsx`.

```ts
// src/lib/stores.ts
// TODO: update colors if stores rebrand.
export const STORE_META: Record<string, { label: string; color: string }> = {
  bookshoper: { label: "Bookshoper", color: "#14B8A6" },
  dheebooks:  { label: "Dhee Books", color: "#A855F7" },
  boibazar:   { label: "Boibazar",   color: "#EAB308" },
  harekrokom: { label: "Harekrokom", color: "#EF4444" },
  eboighar:   { label: "Eboighar",   color: "#10B981" },
  baatighar:  { label: "Baatighar",  color: "#EC4899" },
  rokomari:   { label: "Rokomari",   color: "#3B82F6" },
  wafilife:   { label: "Wafilife",   color: "#F97316" },
  prothoma:   { label: "Prothoma",   color: "#38BDF8" },
};
```

### 2.3 Typography Rules

- Load fonts via **`next/font/google`** in `layout.tsx`:
  - `Inter` (subsets: `["latin"]`) → CSS var `--font-sans`
  - `Anek_Bangla` or `Hind_Siliguri` (subsets: `["latin", "bengali"]`) → CSS var `--font-bangla`
  - Combined in `--font-sans` font stack so Bangla characters fall through to the Bangla font.
- Headings: `font-weight: 800`, `letter-spacing: -0.02em` to `-0.03em`.
- Gradient text utility class (defined in `globals.css`):
  ```css
  .gradient-text {
    background: linear-gradient(135deg, var(--color-gradient-text-from), var(--color-gradient-text-to));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  ```
- Prices: `font-variant-numeric: tabular-nums` on all price containers to keep numerals aligned.

### 2.4 Motion Tokens

```css
/* In globals.css */
--transition-base: 0.2s ease;
--transition-lift: transform 0.2s ease, box-shadow 0.2s ease;

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration:  0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}

/* Fade + slide-up on scroll — activated by IntersectionObserver adding .is-visible */
@keyframes fadeSlideUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
.animate-fade-up {
  opacity: 0;
  animation: fadeSlideUp 0.5s ease forwards;
}
.animate-fade-up.is-visible { opacity: 1; }
```

- Hover lift on cards: `transform: translateY(-2px)` + `box-shadow` enhancement.
- No external JS animation libraries.

### 2.5 Layout Constants

- **Content max-width:** `1200px`, `margin: 0 auto`, `padding: 0 1.5rem`.
- **Section vertical padding:** `py-20` desktop, `py-12` mobile.
- **Card radius:** `var(--radius-card)` = 20px.

---

## 3. File & Component Plan

### Files to create (new)

```
src/
├── lib/
│   ├── stores.ts          ← STORE_META constant (brand colors & labels)
│   ├── sample-data.ts     ← TRENDING_SAMPLE, STATS_PLACEHOLDER (all TODOs)
│   └── normalize.ts       ← normalizeKey() for client-side book grouping
├── components/
│   ├── ui/
│   │   ├── StorePill.tsx       ← NEW: colored dot + store label pill
│   │   ├── PriceChip.tsx       ← NEW: price chip, green if best
│   │   ├── DiscountBadge.tsx   ← NEW: amber "-N%" badge
│   │   ├── BookCover.tsx       ← NEW: image with gradient fallback
│   │   ├── SectionHead.tsx     ← NEW: eyebrow + title + subtitle block
│   │   └── GlowBlob.tsx        ← NEW: decorative blurred bg blob (aria-hidden)
│   ├── home/
│   │   ├── HeroSection.tsx          ← NEW ("use client")
│   │   ├── HeroPreviewCard.tsx      ← NEW (static, aria-hidden)
│   │   ├── StoreStrip.tsx           ← NEW
│   │   ├── StatsSection.tsx         ← NEW
│   │   ├── HowItWorks.tsx           ← NEW
│   │   ├── TrendingSection.tsx      ← NEW ("use client", static data + TODO)
│   │   ├── CategorySection.tsx      ← NEW (static links)
│   │   ├── WishlistFeatureSection.tsx ← NEW ("use client" for session check)
│   │   ├── FaqSection.tsx           ← NEW ("use client", Radix Accordion)
│   │   └── FinalCtaBanner.tsx       ← NEW ("use client")
│   └── search/
│       └── (see replacements below)
```

### Files to replace or significantly modify

| File | Action | Reason |
|------|--------|--------|
| `src/app/globals.css` | **Replace** | New design token system |
| `src/app/layout.tsx` | **Modify** | Add Bangla font loading |
| `src/app/page.tsx` | **Replace** | Assemble new home sections |
| `src/app/search/page.tsx` | **Modify** | New layout, error/rate-limit states |
| `src/components/layout/Navbar.tsx` | **Replace** | Full visual redesign |
| `src/components/layout/Footer.tsx` | **Replace** | Full visual redesign |
| `src/components/shared/SiteLogo.tsx` | **Modify** | Use `stores.ts` instead of inline record |
| `src/components/search/BookCard.tsx` | **Replace** | New grouped layout with PriceChips |
| `src/components/search/SearchBar.tsx` | **Modify** | Enhanced: clear button, 64px, gradient button |
| `src/components/search/SearchFilters.tsx` | **Replace** | New filter types (priceMin/Max, discount, inStock) |
| `src/components/search/ResultsGrid.tsx` | **Modify** | Use new BookCard |
| `src/components/search/ResultsTable.tsx` | **Modify** | Update to new design tokens |
| `src/hooks/useFilters.ts` | **Extend** | Add priceMin, priceMax, discount, inStock params |

### Files to keep unchanged

- `src/hooks/useBooks.ts`, `useWishlist.ts`, `useAlerts.ts`, `useDebounce.ts`
- `src/lib/auth.ts`, `src/lib/axios.ts`, `src/lib/providers.tsx`, `src/lib/env.ts`, `src/lib/queryClient.ts`
- `src/types/` — all type definition files
- `src/app/wishlist/`, `src/app/alerts/`, `src/app/auth/` — not in scope for this pass
- `src/components/alerts/CreateAlertDialog.tsx`
- `src/components/search/Pagination.tsx` — keep, minor token update only
- `src/components/search/NoResults.tsx` — keep, minor token update only
- `src/components/shared/PriceBadge.tsx`, `ErrorMessage.tsx`, `SkeletonCard.tsx` — keep, minor token update only

---

## 4. Shared Components

### 4.1 Navbar (`src/components/layout/Navbar.tsx`) — `"use client"`

**Visual:**
- `position: sticky; top: 0; z-index: 50`
- Background: `var(--color-bg-alt)` + `backdrop-filter: blur(16px)` + `background-color: color-mix(in srgb, var(--color-bg-alt) 85%, transparent)`
- Bottom border: `1px solid var(--color-border)`
- Max-width container (1200px) inside

**Logo (left):**
- Small gradient square (16×16px, `border-radius: 6px`, `background: linear-gradient(135deg, var(--color-primary), var(--color-accent))`) with a white book SVG icon.
- Next to it: `<span>BookHunt</span>` bold white + `<span>BD</span>` in `var(--color-primary)`.
- Entire logo is a `<Link href="/">`.

**Nav links (center, desktop only — hidden below `md`):**
- "Search" → `/search`
- "Trending Deals" → `/search?query=bestseller` (placeholder, static link)
- "How it works" → `/#how-it-works` (anchor)

**Right side:**
- **Signed out:** `"Sign in with Google"` button → calls `signIn()` from `@/lib/auth`.
- **Signed in:** Heart icon link `/wishlist`, Bell icon link `/alerts`, user chip (avatar initial letter in gradient circle + truncated name + `ChevronDown`). Dropdown: "Sign out" using existing `signOut()`.
- **Loading:** `animate-pulse` skeleton bar (existing pattern).

**Mobile (below `md`):**
- Show hamburger menu button (lucide `Menu` icon). Opens a Radix `<Dialog>` bottom-sheet containing all nav links + auth CTA.
- Use `@radix-ui/react-dialog` (already in `package.json`).

---

### 4.2 Footer (`src/components/layout/Footer.tsx`)

Server component — no `"use client"`.

**Structure:**
- Background: `var(--color-bg-alt)`, `border-top: 1px solid var(--color-border)`
- Top row: Logo (same as Navbar) + tagline `"Find the best book prices in Bangladesh."`
- Three link columns:
  - **Explore:** Home, Search, Wishlist, Price Alerts
  - **Stores:** All 9 stores — each links to `/search?query=<store display name>` (e.g. `/search?query=Rokomari`)
  - **About:** About (`/#how-it-works`), FAQ (`/#faq`), Privacy (`/privacy` — static placeholder page)
- Bottom bar: `"© 2025 BookHuntBD"` + `"Not affiliated with any of the listed stores."` + `"Built for book lovers in Bangladesh 🇧🇩"`

---

### 4.3 `StorePill` (`src/components/ui/StorePill.tsx`)

```
Props: site: string; size?: "sm" | "md"
```

Renders a pill with:
- Colored 8px dot (from `STORE_META[site].color`)
- Store label text
- `border-radius: var(--radius-pill)`, `border: 1px solid {color}44`, `background: {color}15`

No `"use client"` needed.

---

### 4.4 `PriceChip` (`src/components/ui/PriceChip.tsx`)

```
Props: price: number; isBest?: boolean; storeName?: string
```

- If `price <= 0` or `isNaN(price)`: render `"Unavailable"` in `var(--color-dim)` — never show ৳0.
- If `isBest`: green background, green text, star icon.
- Otherwise: muted background, muted text.
- Format: `৳ {price.toLocaleString("en-BD")}`

---

### 4.5 `DiscountBadge` (`src/components/ui/DiscountBadge.tsx`)

```
Props: discount: number
```

- Only renders if `discount > 0`.
- Shows `"-{discount}%"` amber pill (`var(--color-warning)` text on amber/10 background).

---

### 4.6 `BookCover` (`src/components/ui/BookCover.tsx`)

```
Props: imageUrl?: string; title: string; alt: string; width: number; height: number
```

- If `imageUrl` provided: renders `next/image` with `onError` fallback.
- If no `imageUrl` or load error: renders a gradient div (`background: linear-gradient(135deg, var(--color-primary)33, var(--color-accent)33)`) with the first ~2 words of title centered in white.
- Always reserves exact dimensions (`width` + `height` props) to prevent CLS.

---

### 4.7 `SectionHead` (`src/components/ui/SectionHead.tsx`)

```
Props: eyebrow?: string; title: string; subtitle?: string; centered?: boolean
```

- `eyebrow`: small uppercase pill badge with `border: 1px solid var(--color-border-strong)`, `var(--color-muted)` text.
- `title`: `<h2>`, large, may contain inline `<span className="gradient-text">` for gradient words.
- `subtitle`: `<p>` in `var(--color-muted)`.
- `centered`: applies `text-align: center; margin: 0 auto` on subtitle.

---

### 4.8 `GlowBlob` (`src/components/ui/GlowBlob.tsx`)

```
Props: color: "blue" | "violet"; className?: string
```

- `aria-hidden="true"`, `pointer-events: none`, `position: absolute`
- A blurred div: `filter: blur(100px)`, `opacity: 0.25–0.35`, large (400–600px).
- Blue variant: `var(--color-primary)` background.
- Violet variant: `var(--color-accent)` background.

---

### 4.9 `SiteLogo` (migrate existing `src/components/shared/SiteLogo.tsx`)

- Remove inline `SITE_LABELS` and `SITE_COLORS` records.
- Import from `stores.ts`: `STORE_META`.
- Same visual output — colored pill with label.

---

## 5. Home Page (`/`)

**`src/app/page.tsx`** — server component (no `"use client"` at page level). Client-only sections are their own child components with `"use client"`.

### 5.1 Hero Section (`src/components/home/HeroSection.tsx`) — `"use client"`

**Background:**
- Page bg: `var(--color-bg)`.
- Two `<GlowBlob>` absolutely positioned behind the content: blue (top-left corner), violet (top-right corner). Both `aria-hidden`, `pointer-events-none`, `z-0`.

**Layout:** Two columns on `lg+` (left ~55%, right ~45%), stacked on mobile (left first).

**Left column (copy + search):**

1. **Eyebrow pill:** `<span>` with animated green pulse dot + `"Live prices from 9 Bangladeshi bookstores"`. Style: `rounded-full`, `border: 1px solid var(--color-success)33`, green text `var(--color-success)`, small font.

2. **H1:** `"Never overpay for a book again."` — wrap `"overpay"` in `<span className="gradient-text">`. Size: `text-5xl md:text-6xl`, `font-extrabold`, `tracking-tight` (`letter-spacing: -0.03em`).

3. **Subtitle:** `"Search once. Compare prices across Rokomari, Wafilife, Prothoma and 6 more stores — instantly."` `text-xl`, `var(--color-muted)`.

4. **Large search bar (64px tall):**
   - Container: `border: 1px solid var(--color-border-strong)`, `border-radius: var(--radius-btn)`, `background: var(--color-card)`, flex row.
   - Left: `<Search>` icon (lucide, `var(--color-dim)`).
   - Input: `flex-1`, transparent bg, `var(--color-text)`, placeholder `"Search by title, author, or ISBN..."` in `var(--color-dim)`. Bangla characters must render via font fallback.
   - Clear button (`<X>` icon): visible only when input has value. `aria-label="Clear search"`.
   - Right: gradient `"Search →"` button — `background: linear-gradient(135deg, var(--color-gradient-start), var(--color-gradient-end))`, `border-radius: var(--radius-btn)`, white text, `font-semibold`. On click / Enter: `router.push("/search?query=" + encodeURIComponent(value))`.
   - No `autoFocus` on mobile (prevents unwanted keyboard pop-up).

5. **Popular chips row:** Static list, horizontal scroll on mobile. Each chip: `rounded-full`, `border: 1px solid var(--color-border)`, hover border brightens. Link to `/search?query=<chip>`.
   - Chips: `"শরৎচন্দ্র"`, `"হুমায়ূন আহমেদ"`, `"Harry Potter"`, `"Islamic Books"`, `"Academic"`, `"Poetry"`

6. **Trust row:** 3 items with green `<Check>` icons: `"No sign-up to search"` / `"Results in seconds"` / `"Free, always"`. `var(--color-muted)` text.

**Right column:** `<HeroPreviewCard />` (static, see below).

---

### 5.2 Hero Preview Card (`src/components/home/HeroPreviewCard.tsx`)

**Static, `aria-hidden="true"`, no `"use client"` needed.**

Decorative comparison card showing sample data:

```
[BookCover gradient placeholder]
"হুমায়ূন আহমেদের শ্রেষ্ঠ গল্প"
by Humayun Ahmed

Rokomari    ৳ 320   [BEST PRICE ✓]   [Buy]
Wafilife    ৳ 350
Boibazar    ৳ 345
Prothoma    ৳ 365

[♡ Save to wishlist]   [🔔 Set alert]
```

- Best price row: `background: color-mix(in srgb, var(--color-success) 10%, transparent)`, green text, `"BEST PRICE"` badge.
- Card: `var(--color-card)`, `border-radius: var(--radius-card-lg)`, `border: 1px solid var(--color-border)`, `box-shadow: var(--shadow-card)`.
- Floating toast: absolutely positioned at top-right edge of card, slightly rotated `~3deg`, `z-10`. Shows `"↓ Price dropped 18% 🎉"` with `var(--color-success)` text. `aria-hidden="true"`.

---

### 5.3 Store Strip (`src/components/home/StoreStrip.tsx`)

- Background: `var(--color-bg-alt)`, subtle `border-top` and `border-bottom`.
- `<SectionHead eyebrow="SUPPORTED STORES" title="Comparing prices across 9 Bangladeshi bookstores" centered />`.
- Row of 9 `<StorePill>` for all sites in `STORE_META`. `flex flex-wrap justify-center gap-3`.

---

### 5.4 Stats Section (`src/components/home/StatsSection.tsx`)

`grid-cols-2 lg:grid-cols-4`, each card: `var(--color-card)`, `border-radius: var(--radius-card)`, centered large number + label.

| # | Value | Label | Source |
|---|-------|-------|--------|
| 1 | **9** | Bookshops | Real — hardcoded constant |
| 2 | **Every 6h** | Price refresh | Real — `about.md §3.4` alert job schedule |
| 3 | **12,000+** | Books tracked | **PLACEHOLDER** → `STATS_PLACEHOLDER.booksTracked` |
| 4 | **850+** | Price drops this week | **PLACEHOLDER** → `STATS_PLACEHOLDER.priceDrops` |

> `sample-data.ts` TODO: Replace placeholder stats with real backend aggregate endpoints when available. See `about.md §3.6`.

---

### 5.5 How It Works (`src/components/home/HowItWorks.tsx`)

- Section `id="how-it-works"` (anchor for Navbar + Footer links).
- Background: `var(--color-bg)`.
- `<SectionHead eyebrow="HOW IT WORKS" title="Find the best price in 3 steps" centered />`.
- `grid-cols-1 md:grid-cols-3 gap-6`:

| Step | Icon (lucide) | Title | Body |
|------|--------------|-------|------|
| 1 | `Search` | Search once | Enter a title, author, or ISBN. We query all 9 stores simultaneously. |
| 2 | `BarChart2` | Compare instantly | See all prices side by side. The best price is highlighted in green. |
| 3 | `BellRing` | Save & get alerted | Add to wishlist or set a target price. We email you when it drops below your target. |

Each card: `var(--color-card)`, `border: 1px solid var(--color-border)`, `border-radius: var(--radius-card)`, hover lift via `var(--transition-lift)`. Faint large step number (`text-8xl font-black opacity-[0.05]`) in the card background behind the icon.

---

### 5.6 Trending Price Drops (`src/components/home/TrendingSection.tsx`) — `"use client"`

> ⚠️ **TODO:** No backend support for trending/bestseller/new arrivals. All data is static from `TRENDING_SAMPLE` in `sample-data.ts`. Replace with real API call when backend adds this endpoint — see `about.md §3.6`.

- Tab control (3 tabs: "Price drops" / "Bestsellers" / "New arrivals"). Implement with simple `useState` tab switcher (avoids adding `@radix-ui/react-tabs` if not already a transitive dep).
- Each tab: 4 `<BookCard>` components (existing, updated design) from `TRENDING_SAMPLE`.
- Cards link to `/search?query=<book title>`.

---

### 5.7 Browse by Category (`src/components/home/CategorySection.tsx`)

> ⚠️ **TODO:** No backend category endpoint. Links resolve to search queries — see `about.md §3.6`.

`grid-cols-2 sm:grid-cols-3 gap-4`, 6 tiles:

| Display | Query keyword |
|---------|--------------|
| Novels & Fiction | উপন্যাস |
| Islamic Books | ইসলামিক বই |
| Academic | academic textbook |
| Children's Books | শিশু বই |
| Self-Help | self help |
| Poetry | কবিতা |

Each tile: `var(--color-card)`, `border-radius: var(--radius-card)`, unique colored icon bg, bold label. Links to `/search?query=<keyword>`. Hover: `transform: translateY(-2px)`.

---

### 5.8 Wishlist & Alerts Feature (`src/components/home/WishlistFeatureSection.tsx`) — `"use client"`

Two-column layout (`md:grid-cols-2 gap-12`), stacked on mobile.

**Left column (copy):**
- `<SectionHead title="Never miss a price drop" subtitle="Track the books you want and let us do the watching." />`
- 4 check bullets with `<Check>` icon in `var(--color-success)`:
  - "Add any book from search results to your wishlist"
  - "Set a target price — we check every 6 hours"
  - "Get an email the moment the price drops"
  - "Works across all 9 bookstores"
- CTA button `"Create a free price alert"`:
  - Gradient background (`var(--color-gradient-start)` → `var(--color-gradient-end)`), white text.
  - Link to `/alerts` if `session` exists; `/auth/login` if signed out.
  - `useSession()` from `@/lib/auth` to determine this.

**Right column:** Static mock alert card (`aria-hidden="true"`):

```
🔔 Price Alert Active
"আমার ছেলেবেলা" — Humayun Ahmed

Current price:  ৳ 380
Target price:   ৳ 320
[████████░░░░] 84% of the way there

✉ We'll email you when the price drops to ৳ 320
```

Card: `var(--color-card)`, `border: 1px solid var(--color-border)`, `border-radius: var(--radius-card)`. No interactivity.

---

### 5.9 FAQ Section (`src/components/home/FaqSection.tsx`) — `"use client"`

- Section `id="faq"`.
- Background: `var(--color-bg-alt)`.
- `<SectionHead eyebrow="FAQ" title="Frequently asked questions" centered />`
- **Dependency:** `@radix-ui/react-accordion` — check if present as transitive dep in `node_modules/` first. If missing, install with `pnpm add @radix-ui/react-accordion`. If that's not approved, implement a simple `useState` accordion.

4 items (copy must reflect real behavior from `about.md`):

| Question | Answer |
|----------|--------|
| Is BookHuntBD free? | Yes, completely free. You don't need to sign up to search. Create an account only to use wishlists and price alerts. |
| How fresh are the prices? | Search results are cached for 24 hours. Searching the same query again within 24h shows cached results (look for the "Cached" badge). Price alerts are re-checked automatically every 6 hours. |
| Do you sell books? | No. BookHuntBD is a price comparison tool only. Clicking "Buy" takes you to the retailer's own website. We have no cart, checkout, or payments. |
| Why is a store sometimes missing from results? | Scraping a store can occasionally fail due to network issues or changes on the store's website. When this happens, an amber warning banner explains which stores didn't respond, and you can Retry the search. |

---

### 5.10 Final CTA Banner (`src/components/home/FinalCtaBanner.tsx`) — `"use client"`

- Full-width card: `background: linear-gradient(135deg, var(--color-primary), var(--color-accent))`, `border-radius: var(--radius-card-lg)`.
- Text: `"Start finding the best book prices today"` (white, `font-extrabold`, large) + `"Join book lovers in Bangladesh saving money every day."` (white/80, `text-lg`).
- Button logic (uses `useSession()` from `@/lib/auth`):
  - **Signed out:** white button `"Continue with Google"` → calls `signIn()`.
  - **Signed in:** white button `"Search for a book"` → `router.push("/search")`.

---

### 5.11 Home Page Assembly (`src/app/page.tsx`)

```tsx
// server component — no "use client"
export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <StoreStrip />
      <StatsSection />
      <HowItWorks />
      <TrendingSection />
      <CategorySection />
      <WishlistFeatureSection />
      <FaqSection />
      <FinalCtaBanner />
    </main>
  );
}
```

---

## 6. Search Page (`/search`)

**`src/app/search/page.tsx`** — keep `"use client"` wrapper with `<Suspense>`.

### 6.1 Sticky Search Toolbar

Sticky below the Navbar (a toolbar within the page, not a second navbar):
- Contains `<SearchBar>` with the current `query` pre-filled.
- `isFetching` spinner (small) to the right of the search bar.
- Meta line below (only when `data` exists):
  - `"Searched 9 stores · {N} results for "{query}""`.
  - If `data.cached === true`: amber `"Cached"` badge.
  - If `data.errors?.length > 0`: `"⚠ {n} store(s) didn't respond"` text linking to the error banner below.

### 6.2 Page Layout

```
[ Sticky search toolbar (full-width)    ]
[ Amber warning banner (if errors)       ]
[ Sidebar 264px | Results area flex-1   ]
```

- `gap-6` between sidebar and results.
- Sidebar: `position: sticky; top: {navbar-height + toolbar-height}; align-self: start`.
- **Mobile:** Sidebar hidden. A `"Filters"` pill button (sticky below toolbar) opens a Radix `<Dialog>` bottom-sheet.

### 6.3 Extended `useFilters` Hook

Extend `src/hooks/useFilters.ts` to add these URL search params:

```ts
export interface Filters {
  sort:     string;   // price_asc | price_desc | discount_desc | site_asc
  site:     string;   // comma-separated store keys
  page:     number;
  // NEW:
  priceMin: number;   // client-side filter
  priceMax: number;   // client-side filter
  discount: string;   // "any" | "10" | "25" | "40"
  inStock:  boolean;  // client-side filter
}
```

- `priceMin`, `priceMax`, `discount`, `inStock` are applied **client-side** on `data.results` (backend does not support these params).
- `sort`, `site`, `page` continue to be sent to the API via `useBooks`.

### 6.4 Filters Sidebar (`src/components/search/SearchFilters.tsx` — rewrite)

Sidebar sections:

**1. Sort** (radio group):
- Lowest price (`price_asc`)
- Highest price (`price_desc`)
- Biggest discount (`discount_desc`)
- Site A–Z (`site_asc`)

**2. Stores** (checkbox group):
- Each row: colored dot (from `STORE_META`) + label + result count (count = items in `data.results` for that store after other filters).
- Unchecking all = show all stores.

**3. Price Range:**
- Two labeled `<input type="number">` fields: "Min ৳" and "Max ৳".
- (Note: A dual-thumb slider would require `@radix-ui/react-slider` — only add if it's already a transitive dep without a separate install. Number inputs are the acceptable fallback.)

**4. Discount** (chip group, single-select):
- `"Any"` / `"10%+"` / `"25%+"` / `"40%+"`. Applies client-side: `book.discount >= threshold`.

**5. In-Stock toggle:**
- Boolean. Filters client-side: `book.inStock === true`. Note: `inStock` field may be missing from some scrapers — treat `undefined` as "unknown" not "out of stock"; only filter if `inStock` is explicitly `false`.

**6. "Clear All"** button: resets to `?query=<current query>` via `clearFilters()`.

**Bottom-sheet (mobile):** Same content inside a Radix `<Dialog>` with `"position: fixed; bottom: 0"` panel, `border-radius: 20px 20px 0 0`.

### 6.5 Results Area

**Results header:**
- Left: `"Found {N} results for "{query}""`
- Center: Active filter chips — one chip per active non-default filter, each with `×` remove button that clears that specific filter param.
- Right: View toggle — two icon buttons `<LayoutList>` / `<LayoutGrid>` (lucide). State in `useState` (not URL — no need to make view mode shareable).

### 6.6 Client-Side Book Grouping

Before rendering, group `data.results` by a normalized key:

```ts
// src/lib/normalize.ts
export function normalizeKey(title: string, author?: string): string {
  const clean = (s: string) =>
    s.toLowerCase()
     .replace(/[\s\-_'".،,।;:!?()[\]{}]+/g, "")
     .trim();
  return `${clean(title)}||${clean(author ?? "")}`;
}
```

For each group, collect all results (one per store). Render one `<BookCard>` per group showing all store prices as `<PriceChip>` components.

**Important caveats:**
- This is a heuristic that will produce false positives (same title, different edition) and false negatives (slightly different title spellings).
- It's intentionally deterministic and easy to replace with ISBN-based matching once backend supports it. See `about.md §3.6`.
- Add a `// TODO: Replace with ISBN-based grouping. See about.md §3.6.` comment.

### 6.7 BookCard (redesigned — `src/components/search/BookCard.tsx`)

```
┌─────────────────────────────────────────────────────────────┐
│ [BookCover]   Title (bold, line-clamp-2)                     │
│  80×110px     Author · Publisher  (muted)                    │
│                                                              │
│  Store prices (PriceChips):                                  │
│  [★ Rokomari ৳320]  [Wafilife ৳350]  [Boibazar ৳345] ...   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  BEST PRICE     ৳ 320    ~~৳ 380~~    -16%           │   │
│  │  [Buy on Rokomari ↗]         [♡]  [🔔]              │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

- **`<BookCover>`**: `width=80 height=110`, `border-radius: 8px`.
- **Store prices row**: flex-wrap row of `<PriceChip>` for each store in the group. `isBest` on the cheapest store with `price > 0`.
- **Best price box**: `background: color-mix(in srgb, var(--color-success) 8%, transparent)`, `border: 1px solid color-mix(in srgb, var(--color-success) 25%, transparent)`, `border-radius: 12px`. Contains:
  - "BEST PRICE" label in `var(--color-success)` uppercase small.
  - `<PriceChip>` with the best price (large, green).
  - Original price struck-through in `var(--color-muted)`.
  - `<DiscountBadge discount={bestDiscount}>` if applicable.
  - `"Buy on {storeName} ↗"` button — opens `book.link` (or `book.affiliateLink` if set) in new tab, `rel="noopener noreferrer"`, primary gradient bg.
  - Heart button (`aria-label="Add to wishlist"` / `"Remove from wishlist"`): calls existing `useAddToWishlist` / `useRemoveFromWishlist`. If signed out: sonner toast `"Sign in to save to wishlist"`.
  - Bell button (`aria-label="Set price alert"`): opens `<CreateAlertDialog>`. If signed out: sonner toast `"Sign in to set price alerts"`.
- **Price = 0 rule:** Never show ৳0. Never highlight `price <= 0` as best. Sort such entries last.
- **Card**: `var(--color-card)`, `border: 1px solid var(--color-border)`, `border-radius: var(--radius-card)`, hover: `transform: translateY(-2px)`, enhanced `box-shadow`.

### 6.8 Error & Warning Banner

When `data.errors?.length > 0` (rendered above results, full-width):

```
⚠  Rokomari and Wafilife didn't respond in time.
   Showing results from the other 7 stores.              [↺ Retry]
```

- Amber bg: `color-mix(in srgb, var(--color-warning) 10%, transparent)`, `border: 1px solid color-mix(in srgb, var(--color-warning) 30%, transparent)`.
- Retry button calls `refetch()` from `useBooks`.
- Stores listed in the banner come from `data.errors` (which contains `{site, message}` per `about.md §7`).

### 6.9 Rate-Limit State (HTTP 429)

When `error` has HTTP status 429:

```
🚦 Too many searches. Please wait a minute and try again.

                                        [Try again in 58s ↻]
```

- Red/error tones: `color-mix(in srgb, var(--color-error) 10%, transparent)` bg.
- Countdown: `useState(60)` with `useEffect` setInterval decrement. Button re-enables at 0 and calls `refetch()`.

### 6.10 All States

| State | Condition | Display |
|-------|-----------|---------|
| No query | `!query` | Centered prompt: `"Enter a book title, author, or ISBN to search"` |
| Loading | `isLoading && query` | 6 skeleton cards (shimmer animation) |
| Error (non-429) | `error && !isLoading` | `<ErrorMessage>` with Retry button |
| Rate-limited | `error && error.status === 429` | Rate-limit message + 60s countdown |
| Partial failure | `data.errors.length > 0` | Amber banner above results |
| Empty | `data.results.length === 0` | `<NoResults>` with popular search suggestions |
| Results | `data.results.length > 0` | Results grid/list + pagination |

### 6.11 Pagination

- Keep existing `<Pagination>` component, update styles to use new tokens.
- Previous / Next + numbered page buttons.
- Bound to the `page` URL param via `setFilter("page", n.toString())`.

---

## 7. State Handling & Edge Cases

| Scenario | Behavior |
|----------|----------|
| `price === 0` or `NaN` | Show "Unavailable" text, never highlight as best, sort last |
| `inStock === undefined` | Do NOT filter out — treat unknown as potentially in stock |
| All scrapers fail | Empty `results[]`, non-empty `errors[]` — show full amber banner + empty state |
| User signs out mid-session | Wishlist/alert actions show sonner toast "Sign in to ..."; search still works |
| Bangla characters in query | URL-encoded via `encodeURIComponent`; font fallback covers display |
| `cached: true` in response | Show amber "Cached" badge in search toolbar meta line |
| Image load failure | `BookCover` gradient fallback via `onError` |
| Very long titles | `line-clamp-2` on cards; `title` HTML attribute for full text |
| Grouping false positive | Two different editions with same title will appear merged — acceptable until ISBN matching |

---

## 8. Accessibility & Quality Bar

### Responsiveness

Validate at: **375px** (mobile), **768px** (tablet), **1440px** (desktop).
- Mobile-first CSS with `md:` and `lg:` Tailwind prefixes.
- All interactive tap targets: minimum **44×44px**.

### WCAG AA Contrast

| Foreground | Background | Status |
|-----------|-----------|--------|
| `#F4F6FA` (text) | `#161A23` (card) | ✅ Passes AA |
| `#8B93A7` (muted) | `#161A23` (card) | ⚠️ Verify — adjust if fails |
| `#6B7388` (dim) | any | ⚠️ Use for decorative text only, never as sole meaning |

### Focus Rings

```css
:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
```

All interactive elements must have visible focus rings. Tab order must be logical.

### Aria Labels

- All icon-only buttons: `aria-label` describing the action.
- Decorative elements (HeroPreviewCard, WishlistFeature right panel, floating toast, GlowBlob): `aria-hidden="true"`.
- `BookCover` `<img>`: descriptive `alt={`Cover of ${title}`}`.
- FAQ accordion: Radix handles `aria-expanded` automatically.

### Semantic HTML

- `<main>` wraps all page content.
- `<nav>` for Navbar.
- `<footer>` for Footer.
- `<section>` for each home page section (with a human-readable `aria-label` or `id`).
- `<article>` for `BookCard`.
- `<h1>` exactly once per page. `<h2>` for section headings. `<h3>` for card titles.

### Bangla Rendering

- `Anek_Bangla` or `Hind_Siliguri` loaded via `next/font/google`, injected into the `--font-sans` stack.
- The ৳ symbol must render in all price displays.
- Bangla text in search input, book titles, and author names must display without tofu characters.

### Performance & CLS Prevention

- No heavy images in the hero (CSS gradients + GlowBlobs).
- All `<BookCover>` images use `next/image` with explicit `width` and `height` to reserve space.
- Sections use `animate-fade-up` class activated by `IntersectionObserver` — no JS animation library.

### Lint & Build Gates

- `pnpm lint` must pass with zero errors.
- `pnpm build` must succeed with no TypeScript errors.
- No new `any` types introduced; extend existing types in `src/types/` as needed.
- No secrets or API URLs hardcoded; reference `env.ts` only.

---

## 9. Static / Placeholder Data Policy

All placeholder data lives in **`src/lib/sample-data.ts`** with this header:

```ts
/**
 * STATIC SAMPLE DATA
 *
 * These exports are placeholder constants used where the backend does not
 * yet support the corresponding feature.
 *
 * TODO: Replace each export with a real API call when the backend adds support.
 * See: about.md §3.6 (Planned / Not Built)
 */
```

| Export | Used by | TODO note |
|--------|---------|-----------|
| `TRENDING_SAMPLE.priceDrops` | `TrendingSection` | Needs backend trending endpoint |
| `TRENDING_SAMPLE.bestsellers` | `TrendingSection` | Needs backend bestseller feed |
| `TRENDING_SAMPLE.newArrivals` | `TrendingSection` | Needs backend new arrivals feed |
| `STATS_PLACEHOLDER.booksTracked` | `StatsSection` | Needs aggregate stats endpoint |
| `STATS_PLACEHOLDER.priceDrops` | `StatsSection` | Needs aggregate stats endpoint |

Sample books in `TRENDING_SAMPLE` must use plausible real Bangladeshi books (real authors, real titles). They link to `/search?query=<title>` so users see actual real results.

---

## 10. Implementation Order & Workflow

Implement in this exact order to keep the app buildable at every step:

1. **Design tokens & fonts** — `globals.css` (full token replacement) + `layout.tsx` (Bangla font)
2. **`src/lib/stores.ts`** and **`src/lib/sample-data.ts`** and **`src/lib/normalize.ts`**
3. **UI atoms** — `StorePill`, `PriceChip`, `DiscountBadge`, `BookCover`, `SectionHead`, `GlowBlob`
4. **Migrate `SiteLogo`** to use `stores.ts`
5. **Navbar** (full redesign, mobile hamburger sheet)
6. **Footer** (full redesign)
7. **Home sections** (in order): `HeroSection` → `HeroPreviewCard` → `StoreStrip` → `StatsSection` → `HowItWorks` → `TrendingSection` → `CategorySection` → `WishlistFeatureSection` → `FaqSection` → `FinalCtaBanner`
8. **Assemble `src/app/page.tsx`** (home page)
9. **Extend `useFilters`** (new URL params)
10. **Redesign `SearchFilters`** (new filter types + mobile bottom-sheet)
11. **Redesign `BookCard`** (grouped layout, PriceChips, best-price box)
12. **Enhance `SearchBar`** (clear button, 64px height, gradient button)
13. **Update search `page.tsx`** (new layout, grouping logic, rate-limit state, all states)
14. **Update minor shared components** to new tokens: `ResultsTable`, `ResultsGrid`, `Pagination`, `NoResults`, `SkeletonCard`, `PriceBadge`, `ErrorMessage`
15. **`pnpm lint`** → fix all errors
16. **`pnpm build`** → fix all TypeScript and Next.js errors
17. **Final review**: responsive at 375 / 768 / 1440; keyboard nav; Bangla text rendering; CLS check

---

## 11. Out of Scope

The following are explicitly **not** part of this redesign pass:

- Wishlist page (`/wishlist`) — inherits new tokens automatically, no redesign
- Alerts page (`/alerts`) — same
- Login / Register pages (`/auth/*`) — same
- `CreateAlertDialog` component — reused as-is
- Any backend changes
- Admin dashboard
- ISBN-based book matching (replace heuristic grouping when backend ready)
- Price history sparklines (no backend support — omit entirely)
- Rokomari affiliate link full wiring (env var exists, leave as-is)
- Dark / light mode toggle (dark-only for this pass)
- Privacy page content (stub only)

---

## 12. Open Questions / Decisions Made

| Topic | Decision |
|-------|----------|
| Dark vs. light mode | **Dark mode only** for this pass (clarified by user). |
| `@radix-ui/react-accordion` | Check `node_modules/` transitive deps first. Install via `pnpm add` if missing (needs approval). Fallback: simple `useState` accordion. |
| `@radix-ui/react-slider` (price range) | Only use if already a transitive dep. Fallback: two `<input type="number">` fields. |
| `@radix-ui/react-tabs` (trending) | Check transitive deps. Fallback: simple `useState` tab switcher — no additional install. |
| Dual-thumb price range | Two number inputs as accessible fallback if slider not available. |
| Title grouping heuristic | `normalizeKey(title, author)` in `normalize.ts`; clearly documented as temporary. |
| New filter params (priceMin/Max/discount/inStock) | Applied **client-side only** on `data.results`; not sent to API. |
| Hero visual element | No heavy images — CSS gradient `<GlowBlob>` blobs + static `<HeroPreviewCard>`. |
| Trending section | Static sample data from `sample-data.ts` with TODO. Tab switcher via `useState`. |
| Store brand colors | Updated to Prompt 1 spec values in `stores.ts` (different from existing `SiteLogo.tsx` hardcoded values). |
| Scroll-triggered animations | CSS `@keyframes fadeSlideUp` + small `IntersectionObserver` utility. No JS animation library needed. |
| `semple.html` in `src/` | Unrelated artifact — left completely untouched. |
| Hero search bar autoFocus | Only on desktop — no `autoFocus` on mobile to prevent unwanted keyboard pop-up. |

---

*This PRD was synthesized from: (1) Figma-aligned design prompt, (2) UX detail prompt, (3) full codebase inspection of `BookHuntBD-Frontend/` (globals.css, layout.tsx, page.tsx, Navbar, Footer, SearchFilters, ResultsTable, BookCard, SiteLogo, all hooks), and (4) `about.md` project documentation.*

*Last updated: 2026-10-24*
