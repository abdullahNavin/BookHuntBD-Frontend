"use client";

import { ExternalLink } from "lucide-react";

const STORES: {
  key: string;
  label: string;
  color: string;
  description: string;
  tags: string[];
  url: string;
}[] = [
  {
    key: "rokomari",
    label: "Rokomari",
    color: "#1d4ed8",
    description: "Bangladesh's largest online bookstore with the widest selection.",
    tags: ["Largest selection", "Fast delivery"],
    url: "https://www.rokomari.com",
  },
  {
    key: "wafilife",
    label: "Wafilife",
    color: "#ea580c",
    description: "Competitive prices with frequent flash deals and discounts.",
    tags: ["Frequent deals", "Islamic books"],
    url: "https://www.wafilife.com",
  },
  {
    key: "bookshoper",
    label: "Bookshoper",
    color: "#e11d48",
    description: "Great for academic and international titles at fair prices.",
    tags: ["Academic titles", "International"],
    url: "https://www.bookshoper.com",
  },
  {
    key: "dheebooks",
    label: "Dhee Books",
    color: "#7c3aed",
    description: "Curated collection of quality Bangla and English literature.",
    tags: ["Curated picks", "Literature"],
    url: "https://dheebooks.com",
  },
  {
    key: "boibazar",
    label: "Boibazar",
    color: "#2563eb",
    description: "Specialises in rare Bangla editions and hard-to-find titles.",
    tags: ["Rare editions", "Bangla books"],
    url: "https://www.boibazar.com",
  },
  {
    key: "eboighar",
    label: "Eboighar",
    color: "#059669",
    description: "Budget-friendly options with a growing digital catalogue.",
    tags: ["Budget friendly", "Digital"],
    url: "https://eboighar.com",
  },
  {
    key: "prothoma",
    label: "Prothoma",
    color: "#16a34a",
    description: "Premium publisher's own store — authentic and first-print titles.",
    tags: ["Publisher direct", "First prints"],
    url: "https://www.prothoma.com",
  },
  {
    key: "harekrokom",
    label: "Harekrokom",
    color: "#d97706",
    description: "Diverse marketplace for new and secondhand books at all prices.",
    tags: ["Secondhand", "Diverse"],
    url: "https://harekrokom.com",
  },
  {
    key: "baatighar",
    label: "Baatighar",
    color: "#db2777",
    description: "Cosy indie bookshop vibe with handpicked recommendations.",
    tags: ["Indie picks", "Curated"],
    url: "https://baatighar.com",
  },
];

export function StoreGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {STORES.map((store, i) => (
        <a
          key={store.key}
          href={store.url}
          target="_blank"
          rel="noopener noreferrer"
          data-store={store.key}
          className="group relative flex flex-col gap-3.5 p-5 rounded-xl transition-all"
          style={{
            backgroundColor: "var(--color-bg-card)",
            border: "1px solid var(--color-border)",
            animationDelay: `${i * 60}ms`,
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget;
            el.style.borderColor = `${store.color}60`;
            el.style.backgroundColor = "var(--color-bg-muted)";
            el.style.transform = "translateY(-2px)";
            el.style.boxShadow = `0 8px 32px rgba(0,0,0,0.3), 0 0 0 1px ${store.color}30`;
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget;
            el.style.borderColor = "var(--color-border)";
            el.style.backgroundColor = "var(--color-bg-card)";
            el.style.transform = "translateY(0)";
            el.style.boxShadow = "none";
          }}
        >
          {/* Store header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {/* Color avatar */}
              <span
                className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                style={{
                  backgroundColor: `${store.color}20`,
                  color: store.color,
                  border: `1px solid ${store.color}30`,
                }}
              >
                {store.label.charAt(0)}
              </span>
              <span
                className="font-semibold text-sm"
                style={{ color: "var(--color-text-primary)" }}
              >
                {store.label}
              </span>
            </div>
            <ExternalLink
              className="w-3.5 h-3.5 opacity-0 group-hover:opacity-60 transition-opacity flex-shrink-0"
              style={{ color: "var(--color-text-muted)" }}
            />
          </div>

          {/* Description */}
          <p
            className="text-xs leading-relaxed"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {store.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {store.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: `${store.color}15`,
                  color: store.color,
                  border: `1px solid ${store.color}25`,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </a>
      ))}
    </div>
  );
}
