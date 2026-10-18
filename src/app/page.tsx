import { Suspense } from "react";
import { SearchBar } from "@/components/search/SearchBar";
import { PriceShowcase } from "@/components/home/PriceShowcase";
import { TrendingChips } from "@/components/home/TrendingChips";
import { StoreGrid } from "@/components/home/StoreGrid";
import { BookOpen, Zap, Bell, Heart, ArrowRight, Search, SlidersHorizontal } from "lucide-react";

/* ── Section wrapper helper ─────────────────────────────────── */
function Section({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`w-full max-w-6xl mx-auto px-4 sm:px-6 ${className}`}>
      {children}
    </section>
  );
}

/* ── Section heading helper ─────────────────────────────────── */
function SectionHeading({ label, title }: { label: string; title: string }) {
  return (
    <div className="mb-8">
      <p
        className="text-xs font-medium uppercase tracking-widest mb-2"
        style={{ color: "var(--color-text-muted)" }}
      >
        {label}
      </p>
      <h2
        className="font-display text-3xl sm:text-4xl"
        style={{ color: "var(--color-text-primary)" }}
      >
        {title}
      </h2>
    </div>
  );
}

export default function HomePage() {
  return (
    <div
      className="flex flex-col items-center gap-20 pt-12 sm:pt-20 pb-16"
      style={{ minHeight: "calc(100vh - 140px)" }}
    >
      {/* ── HERO ─────────────────────────────────────────────── */}
      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-start">

          {/* Left: copy + search */}
          <div className="flex flex-col gap-5 animate-fade-up lg:pt-4">
            {/* Eyebrow badge */}
            <div className="inline-flex w-fit items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium"
              style={{
                backgroundColor: "rgba(108,99,255,0.1)",
                color: "var(--color-primary)",
                border: "1px solid rgba(108,99,255,0.2)",
              }}
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              9 bookshops. One search.
            </div>

            {/* Headline */}
            <h1
              className="font-display leading-tight"
              style={{
                fontSize: "clamp(2.2rem, 5vw, 3.4rem)",
                color: "var(--color-text-primary)",
                lineHeight: 1.1,
              }}
            >
              Find the{" "}
              <span
                style={{
                  color: "var(--color-primary)",
                  display: "inline-block",
                }}
              >
                best price
              </span>{" "}
              for any book in Bangladesh
            </h1>

            {/* Sub-copy */}
            <p
              className="text-lg leading-relaxed"
              style={{
                color: "var(--color-text-secondary)",
                maxWidth: "38ch",
              }}
            >
              Compare prices across Rokomari, Wafilife, Boibazar, Harekrokom,
              and 5 more — instantly, with live availability.
            </p>

            {/* Search bar */}
            <div
              className="mt-1 rounded-xl glow-ring transition-all"
              style={{ border: "1px solid var(--color-border)" }}
            >
              <Suspense
                fallback={
                  <div
                    className="h-14 w-full rounded-xl animate-pulse"
                    style={{ backgroundColor: "var(--color-bg-muted)" }}
                  />
                }
              >
                <SearchBar autoFocus />
              </Suspense>
            </div>

            {/* Trending chips */}
            <div className="mt-2">
              <Suspense fallback={null}>
                <TrendingChips />
              </Suspense>
            </div>
          </div>

          {/* Right: price showcase */}
          <div
            className="animate-float hidden lg:block"
            style={{ animationDelay: "200ms" }}
          >
            <PriceShowcase />
          </div>
        </div>

        {/* Mobile-only price showcase */}
        <div className="mt-10 lg:hidden">
          <PriceShowcase />
        </div>
      </Section>

      {/* ── HOW IT WORKS ─────────────────────────────────────── */}
      <Section>
        <SectionHeading label="How it works" title="Search once, save everywhere" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              icon: Search,
              num: "01",
              title: "Search",
              body: "Type a title, author, or publisher. We query 9 stores simultaneously in under 5 seconds.",
              color: "var(--color-primary)",
              glow: "rgba(108,99,255,0.1)",
            },
            {
              icon: SlidersHorizontal,
              num: "02",
              title: "Compare",
              body: "Side-by-side prices, sorted by best deal. Filter by store, sort by price or availability.",
              color: "var(--color-savings)",
              glow: "rgba(16,217,160,0.08)",
            },
            {
              icon: Bell,
              num: "03",
              title: "Alert & Save",
              body: "Set a target price. Get an email the moment a book drops below it. Wishlist your favourites.",
              color: "var(--color-warning)",
              glow: "rgba(245,158,11,0.08)",
            },
          ].map((step, i) => (
            <div
              key={step.num}
              className="relative flex flex-col gap-4 p-6 rounded-xl"
              style={{
                backgroundColor: "var(--color-bg-card)",
                border: "1px solid var(--color-border)",
                animationDelay: `${i * 80}ms`,
              }}
            >
              {/* Number — huge in the background */}
              <span
                className="absolute top-4 right-5 font-display text-6xl font-bold select-none"
                style={{ color: step.glow, lineHeight: 1 }}
                aria-hidden="true"
              >
                {step.num}
              </span>

              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{
                  backgroundColor: step.glow,
                  border: `1px solid ${step.color}30`,
                }}
              >
                <step.icon className="w-5 h-5" style={{ color: step.color }} />
              </div>

              <div>
                <h3
                  className="font-semibold text-base mb-1.5"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {step.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  {step.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── FEATURE STRIPS ───────────────────────────────────── */}
      <Section>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Wishlist feature */}
          <div
            className="flex items-start gap-4 p-5 rounded-xl"
            style={{
              backgroundColor: "var(--color-bg-card)",
              border: "1px solid var(--color-border)",
            }}
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{
                backgroundColor: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.2)",
              }}
            >
              <Heart className="w-5 h-5" style={{ color: "var(--color-danger)" }} />
            </div>
            <div>
              <h3
                className="font-semibold mb-1"
                style={{ color: "var(--color-text-primary)" }}
              >
                Wishlist
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Save books you want to buy later. Access them from any device with your account.
              </p>
            </div>
          </div>

          {/* Price alerts feature */}
          <div
            className="flex items-start gap-4 p-5 rounded-xl"
            style={{
              backgroundColor: "var(--color-bg-card)",
              border: "1px solid var(--color-border)",
            }}
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{
                backgroundColor: "rgba(245,158,11,0.1)",
                border: "1px solid rgba(245,158,11,0.2)",
              }}
            >
              <Bell className="w-5 h-5" style={{ color: "var(--color-warning)" }} />
            </div>
            <div>
              <h3
                className="font-semibold mb-1"
                style={{ color: "var(--color-text-primary)" }}
              >
                Price Alerts
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Set your target price. We'll email you the moment any store drops below it.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* ── STORE SPOTLIGHT ──────────────────────────────────── */}
      <Section>
        <SectionHeading label="Supported stores" title="All 9 bookshops, covered" />
        <StoreGrid />
      </Section>

      {/* ── BOTTOM CTA ───────────────────────────────────────── */}
      <Section className="pb-4">
        <div
          className="relative overflow-hidden rounded-2xl p-10 text-center"
          style={{
            background:
              "linear-gradient(135deg, rgba(108,99,255,0.15) 0%, rgba(108,99,255,0.05) 50%, rgba(16,217,160,0.08) 100%)",
            border: "1px solid rgba(108,99,255,0.2)",
          }}
        >
          {/* Decorative blobs */}
          <div
            aria-hidden="true"
            className="absolute -top-16 -left-16 w-48 h-48 rounded-full opacity-20"
            style={{ backgroundColor: "var(--color-primary)", filter: "blur(60px)" }}
          />
          <div
            aria-hidden="true"
            className="absolute -bottom-12 -right-12 w-40 h-40 rounded-full opacity-15"
            style={{ backgroundColor: "var(--color-savings)", filter: "blur(50px)" }}
          />

          <div className="relative z-10 flex flex-col items-center gap-5">
            <BookOpen
              className="w-10 h-10"
              style={{ color: "var(--color-primary)" }}
            />
            <h2
              className="font-display text-3xl sm:text-4xl"
              style={{ color: "var(--color-text-primary)" }}
            >
              Ready to hunt a great deal?
            </h2>
            <p
              className="text-base max-w-md"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Search your next book and we'll compare prices across all 9
              stores in seconds.
            </p>
            <a
              href="/search"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:brightness-110 active:scale-95"
              style={{
                backgroundColor: "var(--color-primary)",
                color: "#fff",
                boxShadow: "0 4px 24px rgba(108,99,255,0.35)",
              }}
            >
              Start Searching
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </Section>
    </div>
  );
}

