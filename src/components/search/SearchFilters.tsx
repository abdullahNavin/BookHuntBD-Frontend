"use client";

import { useFilters } from "@/hooks/useFilters";
import { X, SlidersHorizontal } from "lucide-react";
import { useEffect, useId, useState } from "react";

const SORT_OPTIONS = [
  { value: "price_asc", label: "Price: Low → High" },
  { value: "price_desc", label: "Price: High → Low" },
  { value: "discount_desc", label: "Discount %" },
  { value: "site_asc", label: "Site A → Z" },
];

const SITES = [
  { value: "bookshoper", label: "Bookshoper" },
  { value: "dheebooks", label: "Dhee Books" },
  { value: "boibazar", label: "Boibazar" },
  { value: "harekrokom", label: "Harekrokom" },
  { value: "eboighar", label: "Eboighar" },
  { value: "baatighar", label: "Baatighar" },
  { value: "rokomari", label: "Rokomari" },
  { value: "wafilife", label: "Wafilife" },
  { value: "prothoma", label: "Prothoma" },
];

function FilterPanel({ onClose }: { onClose?: () => void }) {
  const { filters, setFilter, clearFilters } = useFilters();
  const uid = useId();
  const sortLabelId = `${uid}-sort-label`;
  const siteLabelId = `${uid}-site-label`;

  return (
    <div className="space-y-6">
      {onClose && (
        <div className="flex items-center justify-between">
          <span className="font-semibold text-sm" style={{ color: "var(--color-text-primary)" }}>
            Filters
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close filters"
            className="p-1 rounded"
            style={{ color: "var(--color-text-muted)" }}
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      )}

      {/* Sort */}
      <div>
        <p
          id={sortLabelId}
          className="text-xs font-medium uppercase tracking-wider mb-2"
          style={{ color: "var(--color-text-muted)" }}
        >
          Sort by
        </p>
        <div className="space-y-1" role="radiogroup" aria-labelledby={sortLabelId}>
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
        <p
          id={siteLabelId}
          className="text-xs font-medium uppercase tracking-wider mb-2"
          style={{ color: "var(--color-text-muted)" }}
        >
          Site
        </p>
        <div className="space-y-1" role="group" aria-labelledby={siteLabelId}>
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
        type="button"
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
  const sheetId = useId();

  useEffect(() => {
    if (!sheetOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSheetOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [sheetOpen]);

  return (
    <>
      {/* Desktop: sticky sidebar */}
      <aside
        aria-label="Filters"
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
          type="button"
          id="filters-trigger"
          onClick={() => setSheetOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={sheetOpen}
          aria-controls={sheetId}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium"
          style={{
            backgroundColor: "var(--color-bg-muted)",
            border: "1px solid var(--color-border)",
            color: "var(--color-text-secondary)",
          }}
        >
          <SlidersHorizontal className="w-4 h-4" aria-hidden="true" />
          Filters
        </button>
      </div>

      {/* Mobile: bottom sheet */}
      {sheetOpen && (
        <>
          <div
            aria-hidden="true"
            className="fixed inset-0 z-40 bg-black/60 md:hidden"
            onClick={() => setSheetOpen(false)}
          />
          <div
            id={sheetId}
            role="dialog"
            aria-modal="true"
            aria-label="Filters"
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
