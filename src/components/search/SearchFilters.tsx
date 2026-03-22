"use client";

import { useFilters } from "@/hooks/useFilters";
import { X, SlidersHorizontal } from "lucide-react";
import { useState } from "react";

const SORT_OPTIONS = [
  { value: "price_asc", label: "Price: Low → High" },
  { value: "price_desc", label: "Price: High → Low" },
  { value: "discount_desc", label: "Discount %" },
  { value: "site_asc", label: "Site A → Z" },
];

const SITES = [
  { value: "rokomari", label: "Rokomari" },
  { value: "dheebooks", label: "Dhee Books" },
  { value: "boibazar", label: "Boibazar" },
  { value: "harekrokom", label: "Harekrokom" },
  { value: "eboighar", label: "Eboighar" },
  { value: "baatighar", label: "Baatighar" },
];

function FilterPanel({ onClose }: { onClose?: () => void }) {
  const { filters, setFilter, clearFilters } = useFilters();

  return (
    <div className="space-y-6">
      {onClose && (
        <div className="flex items-center justify-between">
          <span className="font-semibold text-sm" style={{ color: "var(--color-text-primary)" }}>
            Filters
          </span>
          <button onClick={onClose} style={{ color: "var(--color-text-muted)" }}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Sort */}
      <div>
        <p className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: "var(--color-text-muted)" }}>
          Sort by
        </p>
        <div className="space-y-1">
          {SORT_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className="flex items-center gap-2 cursor-pointer py-1 rounded px-1 transition-colors hover:opacity-80"
            >
              <input
                type="radio"
                name="sort"
                value={opt.value}
                checked={filters.sort === opt.value}
                onChange={() => setFilter("sort", opt.value)}
                className="accent-[var(--color-primary)]"
              />
              <span className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Site */}
      <div>
        <p className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: "var(--color-text-muted)" }}>
          Site
        </p>
        <div className="space-y-1">
          {SITES.map((site) => {
            const activeSites = filters.site ? filters.site.split(",") : [];
            const checked = activeSites.includes(site.value);

            const toggleSite = () => {
              const next = checked
                ? activeSites.filter((s) => s !== site.value)
                : [...activeSites, site.value];
              setFilter("site", next.join(","));
            };

            return (
              <label
                key={site.value}
                className="flex items-center gap-2 cursor-pointer py-1 rounded px-1 hover:opacity-80"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={toggleSite}
                  className="accent-[var(--color-primary)]"
                />
                <span className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
                  {site.label}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Clear */}
      <button
        onClick={clearFilters}
        className="w-full text-xs font-medium py-1.5 rounded-lg transition-opacity hover:opacity-80"
        style={{
          border: "1px solid var(--color-border)",
          color: "var(--color-text-muted)",
        }}
      >
        Clear filters
      </button>
    </div>
  );
}

export function SearchFilters() {
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <>
      {/* Desktop: sticky sidebar */}
      <aside
        className="hidden md:block sticky top-20 self-start min-w-[200px] rounded-xl border p-4"
        style={{
          backgroundColor: "var(--color-bg-card)",
          borderColor: "var(--color-border)",
        }}
      >
        <FilterPanel />
      </aside>

      {/* Mobile: trigger button */}
      <div className="md:hidden mb-3">
        <button
          id="filters-trigger"
          onClick={() => setSheetOpen(true)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium"
          style={{
            backgroundColor: "var(--color-bg-muted)",
            border: "1px solid var(--color-border)",
            color: "var(--color-text-secondary)",
          }}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
        </button>
      </div>

      {/* Mobile: bottom sheet */}
      {sheetOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/60 md:hidden"
            onClick={() => setSheetOpen(false)}
          />
          <div
            className="fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl border-t p-6 md:hidden"
            style={{
              backgroundColor: "var(--color-bg-card)",
              borderColor: "var(--color-border)",
            }}
          >
            <FilterPanel onClose={() => setSheetOpen(false)} />
          </div>
        </>
      )}
    </>
  );
}
