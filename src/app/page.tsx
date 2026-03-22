import { Suspense } from "react";
import { SearchBar } from "@/components/search/SearchBar";
import { SiteLogo } from "@/components/shared/SiteLogo";
import { BookOpen, Zap, Bell, Heart } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-140px)] px-4 py-12">
      {/* Hero Section */}
      <div className="w-full max-w-3xl text-center space-y-6 mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4 border border-primary/20" style={{ color: "var(--color-primary)", backgroundColor: "color-mix(in srgb, var(--color-primary) 10%, transparent)", borderColor: "color-mix(in srgb, var(--color-primary) 20%, transparent)" }}>
          <Zap className="w-4 h-4 fill-current" />
          The fastest way to find books in BD
        </div>
        <h1
          className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-balance leading-tight"
          style={{ color: "var(--color-text-primary)" }}
        >
          Compare book prices across{" "}
          <span style={{ color: "var(--color-primary)" }}>Bangladesh</span>
        </h1>
        <p
          className="text-lg sm:text-xl max-w-2xl mx-auto"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Search once, check everywhere. Rokomari, Dhee Books, Boibazar, Harekrokom, Eboighar, and Baatighar.
        </p>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto mt-8 shadow-2xl rounded-xl">
          <Suspense fallback={<div className="h-12 w-full rounded-xl bg-muted animate-pulse" />}>
            <SearchBar autoFocus />
          </Suspense>
        </div>
      </div>

      {/* Features Row */}
      <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12">
        <div className="flex flex-col items-center text-center p-6 rounded-2xl border" style={{ backgroundColor: "var(--color-bg-card)", borderColor: "var(--color-border)" }}>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: "var(--color-bg-muted)", color: "var(--color-primary)" }}>
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="font-semibold mb-2" style={{ color: "var(--color-text-primary)" }}>6 Bookshops</h3>
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>We search the top e-commerce sites in Bangladesh simultaneously.</p>
        </div>
        
        <div className="flex flex-col items-center text-center p-6 rounded-2xl border" style={{ backgroundColor: "var(--color-bg-card)", borderColor: "var(--color-border)" }}>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: "color-mix(in srgb, var(--color-danger) 10%, transparent)", color: "var(--color-danger)" }}>
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="font-semibold mb-2" style={{ color: "var(--color-text-primary)" }}>Wishlist</h3>
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>Save your favorite books to buy them later with one click.</p>
        </div>

        <div className="flex flex-col items-center text-center p-6 rounded-2xl border" style={{ backgroundColor: "var(--color-bg-card)", borderColor: "var(--color-border)" }}>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: "color-mix(in srgb, var(--color-warning) 10%, transparent)", color: "var(--color-warning)" }}>
            <Bell className="w-6 h-6" />
          </div>
          <h3 className="font-semibold mb-2" style={{ color: "var(--color-text-primary)" }}>Price Alerts</h3>
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>Get notified when a book drops below your target price.</p>
        </div>
      </div>

      {/* Supported Sites */}
      <div className="mt-16 text-center space-y-4">
        <p className="text-xs font-medium uppercase tracking-widest" style={{ color: "var(--color-text-muted)" }}>Supported Stores</p>
        <div className="flex flex-wrap justify-center gap-3 opacity-80 mix-blend-luminosity hover:mix-blend-normal transition-all duration-300">
          <SiteLogo site="rokomari" />
          <SiteLogo site="dheebooks" />
          <SiteLogo site="boibazar" />
          <SiteLogo site="harekrokom" />
          <SiteLogo site="eboighar" />
          <SiteLogo site="baatighar" />
        </div>
      </div>
    </div>
  );
}
