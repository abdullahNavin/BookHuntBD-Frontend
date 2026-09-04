# Book Comparison — Frontend PRD v2.0

**App:** Next.js (App Router)
**Style:** Modern · Clean · Minimal · Dark mode first
**Language:** English only
**Date:** March 2026

---

## Table of Contents

1. [Objective](#1-objective)
2. [Tech Stack](#2-tech-stack)
3. [Design System](#3-design-system)
4. [App Structure](#4-app-structure)
5. [Pages](#5-pages)
6. [Components](#6-components)
7. [Data Fetching](#7-data-fetching)
8. [Authentication](#8-authentication)
9. [UI & UX Patterns](#9-ui--ux-patterns)
10. [Performance Strategy](#10-performance-strategy)
11. [Error Handling](#11-error-handling)
12. [Environment & Config](#12-environment--config)
13. [Open Questions](#13-open-questions)

---

## 1. Objective

Build a fast, minimal, dark-mode-first Next.js frontend that allows users to:

- Search for books and compare prices across Bangladeshi e-commerce sites
- Filter and sort results in a clean comparison table
- Manage their wishlist and price alerts from a protected dashboard

The UI must feel snappy — skeleton loaders on every async boundary, optimistic updates on wishlist/alert mutations, and zero layout shifts on navigation.

---

## 2. Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| Framework | Next.js 14+ (App Router) | Server components where possible |
| Language | TypeScript | Strict mode enabled |
| Styling | Tailwind CSS, Shadcn UI | Dark mode via `class` strategy |
| Server state | TanStack Query v5 | Caching, background refetch, pagination |
| HTTP client | Axios | Centralised instance with interceptors |
| Auth | Better Auth (client SDK) | Session management, protected routes |
| Forms | React Hook Form + Zod | Validated forms for alerts, auth |
| Notifications | Sonner | Lightweight toast library |
| Icons | Lucide React | Consistent, tree-shakeable icon set |
| Font | Inter (next/font) | Clean sans-serif, great for dark UIs |

---

## 3. Design System

### 3.1 Theme

Dark mode is the **default**. Light mode is supported as an opt-in. Use Tailwind's `class` strategy — toggle by adding/removing the `dark` class on `<html>`.

```ts
// tailwind.config.ts
export default {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: "#0f0f0f",   // page bg
          card:    "#1a1a1a",   // card surface
          muted:   "#242424",   // inputs, hover states
        },
        border:  "#2e2e2e",
        primary: "#4f8ef7",     // CTA blue
        success: "#22c55e",
        warning: "#f59e0b",
        danger:  "#ef4444",
        text: {
          primary:   "#f5f5f5",
          secondary: "#a3a3a3",
          muted:     "#6b7280",
        }
      }
    }
  }
}
```

### 3.2 Typography

```
Headings: Inter 600 — used sparingly
Body:     Inter 400 — 14–16px
Labels:   Inter 500 — 12–13px uppercase tracking
Code:     JetBrains Mono (for any technical displays)
```

### 3.3 Spacing & Radius

- Base unit: `4px` (Tailwind default)
- Card radius: `rounded-xl` (12px)
- Button radius: `rounded-lg` (8px)
- Input radius: `rounded-md` (6px)
- Max content width: `max-w-6xl` centered

### 3.4 Component Tokens

| Token | Value | Usage |
|---|---|---|
| Card | `bg-background-card border border-border` | All cards |
| Input | `bg-background-muted border border-border focus:ring-1 focus:ring-primary` | All inputs |
| Button primary | `bg-primary text-white hover:bg-primary/90` | CTAs |
| Button ghost | `bg-transparent hover:bg-background-muted` | Secondary actions |
| Badge | `text-xs font-medium px-2 py-0.5 rounded-full` | Site tags, discount labels |

---

## 4. App Structure

```
app/
  layout.tsx                  ← Root layout: ThemeProvider, QueryProvider, Navbar
  page.tsx                    ← Home (search hero + recent results)
  search/
    page.tsx                  ← Search results (comparison table + filters)
    loading.tsx               ← Skeleton for search results
  wishlist/
    page.tsx                  ← Protected: saved books grid
    loading.tsx
  alerts/
    page.tsx                  ← Protected: active price alerts
    loading.tsx
  auth/
    login/page.tsx
    register/page.tsx
  not-found.tsx
  error.tsx                   ← Global error boundary

components/
  ui/                         ← Primitives (Button, Input, Badge, Skeleton, Dialog)
  layout/
    Navbar.tsx
    Footer.tsx
    ProtectedRoute.tsx
  search/
    SearchBar.tsx
    SearchFilters.tsx         ← Sort + site filter
    ResultsTable.tsx          ← Price comparison table (must-have)
    ResultsGrid.tsx           ← Card grid fallback for mobile
    BookCard.tsx
    NoResults.tsx
  wishlist/
    WishlistItem.tsx
    WishlistEmpty.tsx
  alerts/
    AlertCard.tsx
    CreateAlertDialog.tsx
  shared/
    PriceBadge.tsx            ← Price + discount display
    SiteLogo.tsx              ← Site name/icon badge
    SkeletonCard.tsx
    ErrorMessage.tsx

lib/
  axios.ts                    ← Axios instance + interceptors
  queryClient.ts              ← TanStack Query client config
  auth.ts                     ← Better Auth client

hooks/
  useBooks.ts
  useWishlist.ts
  useAlerts.ts
  useDebounce.ts
  useFilters.ts               ← URL-synced filter state

types/
  book.ts
  wishlist.ts
  alert.ts
  api.ts                      ← API response shapes
```

---

## 5. Pages

### 5.1 Home (`/`)

**Purpose:** Entry point. Fast search hero with no clutter.

**Layout:**
- Centered hero: app name, one-line tagline, `SearchBar`
- Below the fold (optional at launch): recently searched or trending queries as pill chips
- No sidebar, no distracting content — the search box is the entire focus

**Behaviour:**
- On submit, push to `/search?query=...`
- Autofocus the search input on mount
- Show keyboard shortcut hint (`/` to focus) in muted text below the input

---

### 5.2 Search Page (`/search?query=...`)

**Purpose:** The core page. Shows all results for a query with filtering and sorting. Price comparison table is the primary layout.

**URL state:** All filter/sort state lives in the URL query string — never in component state. This makes results shareable and browser-navigable.

```
/search?query=humayun+ahmed&sort=price_asc&site=bookshoper&page=1
```

**Layout (desktop):**
```
┌─────────────────────────────────────────┐
│ SearchBar (pre-filled)                  │
├──────────────┬──────────────────────────┤
│ Filters      │ ResultsTable             │
│ (sticky      │ (scrollable)             │
│  sidebar)    │                          │
└──────────────┴──────────────────────────┘
```

**Layout (mobile):** Filters collapse into a drawer/sheet triggered by a "Filters" button. Table switches to a card grid (`ResultsGrid`).

**Filter panel (`SearchFilters`):**
- Sort: Price low→high, Price high→low, Discount %, Site name A→Z
- Site: Checkbox list of all sites (Bookshoper, Dhee Books, Boibazar, Harekrokom, Eboighar, Baatighar)
- "Clear filters" resets to defaults

**Results table (`ResultsTable`) — must-have:**

| # | Title | Author | Site | Price | Was | Discount | Actions |
|---|---|---|---|---|---|---|---|
| 1 | Book name | Author | 🏷 Bookshoper | ৳ 280 | ৳ 350 | 20% off | Buy · ♡ |

- Rows sorted/filtered client-side (data already fetched)
- Sticky header on scroll
- "Buy" opens the source link in a new tab
- Wishlist heart icon toggles with optimistic update
- "Add alert" icon opens `CreateAlertDialog`
- Show `failed: string[]` from the API as a muted banner: _"Results from Eboighar unavailable right now"_

**States:**
- Loading → `SkeletonCard` × 6 or skeleton table rows
- Empty → `NoResults` with suggestion to broaden the query
- Error → `ErrorMessage` with retry button
- Partial (some scrapers failed) → results shown + failure banner

---

### 5.3 Wishlist Page (`/wishlist`) — Protected

**Purpose:** View and manage saved books.

**Layout:** Responsive grid of `WishlistItem` cards (3 cols desktop, 2 tablet, 1 mobile).

**Each item shows:**
- Book title, site badge, price at time of save
- "View" button → opens source link
- "Remove" button → DELETE with optimistic removal
- "Set alert" shortcut button

**Empty state:** Illustrated empty state with a link back to search.

---

### 5.4 Alerts Page (`/alerts`) — Protected

**Purpose:** View, manage, and create price alerts.

**Layout:** List of `AlertCard` components + a "New alert" button that opens `CreateAlertDialog`.

**Each `AlertCard` shows:**
- Book title
- Target price (৳ X)
- Current status: Active / Notified
- Site badge
- Created date
- Delete button

**`CreateAlertDialog`:**
- Fields: book title (text), target price (number), site (select), link (URL)
- Validated with React Hook Form + Zod
- On success: optimistic insert into list + success toast

---

### 5.5 Auth Pages (`/auth/login`, `/auth/register`)

- Minimal centered card layout
- React Hook Form + Zod validation
- Inline field errors (not toast)
- Google OAuth button via Better Auth
- Redirect to `/` on success; redirect to `/auth/login` if accessing protected route

---

## 6. Components

### 6.1 `SearchBar`

```tsx
interface SearchBarProps {
  defaultValue?: string;
  onSearch?: (query: string) => void; // used on home page
  autoFocus?: boolean;
}
```

- Debounced input: 400ms via `useDebounce`
- On home page: submit pushes to `/search?query=...`
- On search page: submit updates the URL query param (replaces history entry)
- Shows a loading spinner inside the input while `isFetching` is true
- Clear button (×) appears when input has a value

### 6.2 `BookCard`

```tsx
interface BookCardProps {
  title: string;
  author?: string;
  publisher?: string;
  site: string;
  price: number;
  oldPrice?: number;
  discount?: number;
  image?: string;
  link: string;
  isWishlisted?: boolean;
  onWishlist?: () => void;
}
```

- Used in `ResultsGrid` (mobile) and potentially elsewhere
- Discount shown as a green badge: `20% off`
- Old price shown with strikethrough in muted text
- Currency: always prefix with ৳ (Bangladeshi Taka)

### 6.3 `SearchFilters`

- Reads from and writes to URL search params via `useFilters` hook
- Changing a filter triggers a new TanStack Query fetch (query key includes filters)
- Desktop: sticky left sidebar, `min-w-[200px]`
- Mobile: hidden by default, slides in as a bottom sheet on "Filters" button tap

### 6.4 `ResultsTable`

- Desktop-only component (`hidden md:block`)
- Columns: #, Title, Author, Site, Price, Old Price, Discount, Actions
- Sortable columns — clicking a header updates URL sort param
- Rows are virtualized if result count exceeds 50 (use `@tanstack/react-virtual`)

### 6.5 `CreateAlertDialog`

```tsx
const alertSchema = z.object({
  title:       z.string().min(1, "Required"),
  link:        z.string().url("Must be a valid URL"),
  site:        z.enum(["bookshoper", "dheebooks", "boibazar", "harekrokom", "eboighar", "baatighar"]),
  targetPrice: z.coerce.number().positive("Must be a positive number"),
});
```

- Uses Radix UI Dialog (or shadcn/ui Dialog)
- Submit calls POST /alerts via `useAlerts` mutation
- On success: close dialog, invalidate alerts query, show toast
- On error: show inline error, keep dialog open

### 6.6 `PriceBadge`

Reusable component for displaying price + discount consistently across table and card views.

```tsx
// ৳ 280  ৳ 350  20% off
<PriceBadge price={280} oldPrice={350} discount={20} />
```

---

## 7. Data Fetching

### 7.1 Axios instance

```ts
// lib/axios.ts
import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      window.location.href = "/auth/login";
    }
    return Promise.reject(err);
  }
);
```

### 7.2 Query hooks

```ts
// hooks/useBooks.ts
export function useBooks(query: string, filters: BookFilters) {
  return useQuery({
    queryKey: ["books", query, filters],
    queryFn: () => api.get("/books/search", { params: { query, ...filters } }).then(r => r.data),
    enabled: query.length > 0,
    staleTime: 1000 * 60 * 5,      // 5 min — backend caches for 24h anyway
    placeholderData: keepPreviousData, // no flicker on filter change
  });
}
```

```ts
// hooks/useWishlist.ts
export function useWishlist() {
  return useQuery({
    queryKey: ["wishlist"],
    queryFn: () => api.get("/wishlist").then(r => r.data),
  });
}

export function useAddToWishlist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (book: WishlistPayload) => api.post("/wishlist", book),
    onMutate: async (book) => {
      await qc.cancelQueries({ queryKey: ["wishlist"] });
      const prev = qc.getQueryData(["wishlist"]);
      qc.setQueryData(["wishlist"], (old: any) => [...(old ?? []), { ...book, id: "temp" }]);
      return { prev };
    },
    onError: (_, __, ctx) => qc.setQueryData(["wishlist"], ctx?.prev),
    onSettled: () => qc.invalidateQueries({ queryKey: ["wishlist"] }),
  });
}
```

```ts
// hooks/useAlerts.ts
export function useAlerts() {
  return useQuery({
    queryKey: ["alerts"],
    queryFn: () => api.get("/alerts").then(r => r.data),
  });
}

export function useCreateAlert() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (alert: AlertPayload) => api.post("/alerts", alert),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["alerts"] }),
  });
}

export function useDeleteAlert() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/alerts/${id}`),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: ["alerts"] });
      const prev = qc.getQueryData(["alerts"]);
      qc.setQueryData(["alerts"], (old: any[]) => old?.filter(a => a.id !== id));
      return { prev };
    },
    onError: (_, __, ctx) => qc.setQueryData(["alerts"], ctx?.prev),
    onSettled: () => qc.invalidateQueries({ queryKey: ["alerts"] }),
  });
}
```

### 7.3 TanStack Query client config

```ts
// lib/queryClient.ts
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 2,
      refetchOnWindowFocus: false,
    },
  },
});
```

---

## 8. Authentication

### 8.1 Better Auth client

```ts
// lib/auth.ts
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export const { signIn, signOut, signUp, useSession } = authClient;
```

### 8.2 Protected routes

Use a `ProtectedRoute` wrapper component in the layout of protected pages. It reads the session from `useSession()` and redirects to `/auth/login` if unauthenticated.

```tsx
// components/layout/ProtectedRoute.tsx
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = useSession();

  if (isPending) return <FullPageSpinner />;
  if (!session) redirect("/auth/login");

  return <>{children}</>;
}
```

Apply in `/wishlist/layout.tsx` and `/alerts/layout.tsx` — not in the root layout — so the Navbar and home page remain accessible to unauthenticated users.

### 8.3 Navbar auth state

```
Logged out: [Login]  [Register]
Logged in:  [Wishlist]  [Alerts]  [Avatar dropdown → Logout]
```

---

## 9. UI & UX Patterns

### 9.1 Skeleton loaders

Every async boundary must show a skeleton, not a spinner. Skeletons prevent layout shift and give the user a sense of the incoming content shape.

- Search results: render 6 skeleton table rows (desktop) or 4 skeleton cards (mobile)
- Wishlist: render 6 skeleton cards
- Alerts: render 4 skeleton rows
- Use `loading.tsx` files at the route segment level for RSC boundaries

```tsx
// components/shared/SkeletonCard.tsx
export function SkeletonCard() {
  return (
    <div className="rounded-xl bg-background-card border border-border p-4 animate-pulse space-y-3">
      <div className="h-4 bg-background-muted rounded w-3/4" />
      <div className="h-3 bg-background-muted rounded w-1/2" />
      <div className="h-6 bg-background-muted rounded w-1/4" />
    </div>
  );
}
```

### 9.2 Toast notifications

Use **Sonner** for all toasts. Call from mutation callbacks — never inside render.

```ts
import { toast } from "sonner";

// Success
toast.success("Added to wishlist");

// Error
toast.error("Failed to create alert. Try again.");

// Info (partial scraper failure)
toast.info("Results from Eboighar unavailable right now", { duration: 6000 });
```

### 9.3 Optimistic updates

Apply to all wishlist and alert mutations (see `useAddToWishlist` and `useDeleteAlert` above). The UI must respond instantly — network latency should be invisible for these actions.

### 9.4 URL-synced filters

Filter state lives in the URL, not in `useState`. Use Next.js `useSearchParams` + `useRouter` to read and update. This means:

- Refreshing the page preserves filters
- Back/forward navigation works correctly
- Results are shareable via URL

```ts
// hooks/useFilters.ts
export function useFilters() {
  const params = useSearchParams();
  const router = useRouter();

  const filters = {
    sort:  params.get("sort") ?? "price_asc",
    site:  params.get("site") ?? "",
    page:  Number(params.get("page") ?? 1),
  };

  const setFilter = (key: string, value: string) => {
    const next = new URLSearchParams(params.toString());
    next.set(key, value);
    next.set("page", "1"); // reset page on filter change
    router.replace(`?${next.toString()}`);
  };

  return { filters, setFilter };
}
```

### 9.5 Partial failure banner

When the API returns `failed: string[]`, show a non-blocking banner above the results table:

```
⚠️  Results from Eboighar and Baatighar are unavailable right now. Showing results from other sites.
```

Style: `bg-warning/10 border border-warning/30 text-warning text-sm rounded-lg px-4 py-2`

### 9.6 Empty & error states

| State | Component | Copy |
|---|---|---|
| No results | `NoResults` | "No books found for '[query]'. Try a different title or author." |
| Network error | `ErrorMessage` | "Something went wrong. Check your connection and try again." + Retry button |
| Wishlist empty | `WishlistEmpty` | "No saved books yet. Search for a book and hit the heart icon." |
| Alerts empty | — inline | "No active alerts. Create one from any search result." |

### 9.7 Accessibility

- All interactive elements have visible focus rings (`focus-visible:ring-2 focus-visible:ring-primary`)
- Skeleton elements have `aria-hidden="true"`
- Dialogs use `role="dialog"` and `aria-modal="true"` (handled by Radix UI)
- Images have meaningful `alt` text or `alt=""` for decorative images
- Color alone never conveys state — always pair color with text or icon

---

## 10. Performance Strategy

| Strategy | Detail |
|---|---|
| Server components | Home page, auth pages, and layout are RSCs — zero JS shipped for static content |
| `staleTime: 5min` | Search results cached in TanStack Query; re-fetches only when stale |
| `keepPreviousData` | No flicker when changing filters — old results stay visible while new ones load |
| `next/font` | Inter loaded via `next/font/google` — self-hosted, no layout shift |
| `next/image` | Book cover images use `<Image>` with `width`/`height` to prevent CLS |
| Row virtualization | `@tanstack/react-virtual` on `ResultsTable` if result count > 50 |
| Bundle size | Lucide icons imported individually, not as a barrel import |
| Debounce | `useDebounce(400ms)` on `SearchBar` prevents API calls on every keystroke |

---

## 11. Error Handling

### 11.1 Axios interceptor

The global 401 interceptor (see `lib/axios.ts`) redirects to login on expired sessions. All other errors are propagated to TanStack Query's `error` state and handled at the component level.

### 11.2 Error boundary

`app/error.tsx` catches unhandled RSC/SSR errors and shows a generic "Something went wrong" UI with a "Try again" button that calls `reset()`.

### 11.3 Form errors

Auth and alert forms use React Hook Form's `formState.errors` for inline field-level errors. Do not use toasts for form validation errors — they disappear before the user can act on them.

---

## 12. Environment & Config

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3000   # backend base URL
NEXT_PUBLIC_APP_NAME="BookCompare"
```

Validate at startup using a simple check in `lib/env.ts`:

```ts
// lib/env.ts
if (!process.env.NEXT_PUBLIC_API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined");
}
```

---

## 13. Open Questions

| Topic | Notes |
|---|---|
| Dark/light toggle | Is a manual toggle needed, or system preference only? If toggle, persist choice in `localStorage`. |
| Book cover images | Source sites may not expose images consistently. Define a fallback: a generated placeholder with the book initial. |
| Pagination vs infinite scroll | PRD currently assumes pagination (`page` param). Infinite scroll is a UX alternative — decide before building `ResultsTable`. |
| Mobile comparison table | A full table is unusable on small screens. `ResultsGrid` (card view) is the fallback — confirm this is acceptable. |
| Search history | Should recent searches be stored locally (`localStorage`) and shown as suggestions on the home page? |
| Taka symbol | Use `৳` (U+09F3) consistently. Confirm rendering across target browsers/devices. |

---

*Book Comparison — Frontend PRD v2.0 — March 2026*
