"use client";

import { useState, useEffect } from "react";
import { TrendingDown, Zap, ExternalLink } from "lucide-react";

const STORES: { key: string; label: string; color: string }[] = [
  { key: "rokomari",   label: "Rokomari",   color: "#1d4ed8" },
  { key: "wafilife",   label: "Wafilife",   color: "#ea580c" },
  { key: "bookshoper", label: "Bookshoper", color: "#e11d48" },
  { key: "dheebooks",  label: "Dhee Books", color: "#7c3aed" },
  { key: "boibazar",   label: "Boibazar",   color: "#2563eb" },
  { key: "eboighar",   label: "Eboighar",   color: "#059669" },
  { key: "prothoma",   label: "Prothoma",   color: "#16a34a" },
  { key: "harekrokom", label: "Harekrokom", color: "#d97706" },
  { key: "baatighar",  label: "Baatighar",  color: "#db2777" },
];

const SAMPLE_BOOKS = [
  {
    title: "Atomic Habits",
    author: "James Clear",
    prices: {
      rokomari:   350, wafilife:   320, bookshoper: 380,
      dheebooks:  340, boibazar:   360, eboighar:   310,
      prothoma:   null, harekrokom: 370, baatighar:  330,
    },
  },
  {
    title: "Deyal",
    author: "Humayun Ahmed",
    prices: {
      rokomari:   280, wafilife:   null, bookshoper: 260,
      dheebooks:  275, boibazar:   250, eboighar:   270,
      prothoma:   290, harekrokom: null, baatighar:  265,
    },
  },
  {
    title: "The Psychology of Money",
    author: "Morgan Housel",
    prices: {
      rokomari:   420, wafilife:   390, bookshoper: 445,
      dheebooks:  410, boibazar:   400, eboighar:   385,
      prothoma:   null, harekrokom: 430, baatighar:  395,
    },
  },
];

type PriceMap = Record<string, number | null>;

function getMin(prices: PriceMap) {
  const vals = Object.values(prices).filter((v): v is number => v !== null);
  return Math.min(...vals);
}

function getMax(prices: PriceMap) {
  const vals = Object.values(prices).filter((v): v is number => v !== null);
  return Math.max(...vals);
}

export function PriceShowcase() {
  const [bookIdx, setBookIdx] = useState(0);
  const [prevIdx, setPrevIdx] = useState<number | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setPrevIdx(bookIdx);
      setBookIdx((i) => (i + 1) % SAMPLE_BOOKS.length);
      setTick((t) => t + 1);
    }, 3500);
    return () => clearInterval(t);
  }, [bookIdx]);

  const book = SAMPLE_BOOKS[bookIdx];
  const minPrice = getMin(book.prices);
  const maxPrice = getMax(book.prices);
  const savings = maxPrice - minPrice;
  const savingsPct = Math.round((savings / maxPrice) * 100);

  return (
    <div
      className="relative w-full max-w-lg rounded-2xl overflow-hidden"
      style={{
        background: "linear-gradient(145deg, #151929 0%, #1d2235 100%)",
        border: "1px solid var(--color-border-lit)",
        boxShadow: "0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(108,99,255,0.1)",
      }}
    >
      {/* Top bar — current book */}
      <div
        className="flex items-start justify-between gap-3 px-4 pt-4 pb-3"
        style={{ borderBottom: "1px solid var(--color-border)" }}
      >
        <div className="flex-1 min-w-0">
          <p
            className="text-xs font-medium uppercase tracking-widest mb-1"
            style={{ color: "var(--color-text-muted)" }}
          >
            Live Price Comparison
          </p>
          <h3
            key={`title-${bookIdx}`}
            className="font-display text-lg leading-snug animate-fade-up truncate"
            style={{ color: "var(--color-text-primary)" }}
          >
            {book.title}
          </h3>
          <p
            className="text-sm"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {book.author}
          </p>
        </div>

        {/* Savings badge */}
        <div
          key={`savings-${bookIdx}`}
          className="flex-shrink-0 flex flex-col items-end gap-1 animate-fade-up"
        >
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
            style={{
              backgroundColor: "rgba(16, 217, 160, 0.12)",
              color: "var(--color-savings)",
              border: "1px solid rgba(16, 217, 160, 0.2)",
            }}
          >
            <TrendingDown className="w-3 h-3" />
            Save {savingsPct}% (৳{savings})
          </div>
          <p
            className="text-xs"
            style={{ color: "var(--color-text-muted)" }}
          >
            vs highest price
          </p>
        </div>
      </div>

      {/* Price rows */}
      <div className="px-4 py-2 space-y-0.5">
        {STORES.map((store) => {
          const price = book.prices[store.key as keyof typeof book.prices] as number | null;
          const isBest = price === minPrice;
          const isUnavail = price === null;

          return (
            <div
              key={store.key}
              className="flex items-center justify-between gap-3 rounded-lg px-3 py-2 transition-all"
              style={{
                background: isBest
                  ? `linear-gradient(90deg, ${store.color}18, transparent)`
                  : "transparent",
                border: isBest
                  ? `1px solid ${store.color}40`
                  : "1px solid transparent",
              }}
            >
              <div className="flex items-center gap-2 min-w-0">
                {/* Color dot */}
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: store.color }}
                />
                <span
                  className="text-sm truncate"
                  style={{
                    color: isBest
                      ? "var(--color-text-primary)"
                      : "var(--color-text-secondary)",
                    fontWeight: isBest ? 600 : 400,
                  }}
                >
                  {store.label}
                </span>
                {isBest && (
                  <span
                    className="text-xs px-1.5 py-0.5 rounded-full font-medium flex-shrink-0"
                    style={{
                      backgroundColor: `${store.color}25`,
                      color: store.color,
                    }}
                  >
                    Best
                  </span>
                )}
              </div>

              {isUnavail ? (
                <span
                  className="text-xs"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  N/A
                </span>
              ) : (
                <span
                  key={`${store.key}-${bookIdx}`}
                  className="text-sm font-semibold font-mono animate-price-tick flex-shrink-0"
                  style={{
                    color: isBest ? store.color : "var(--color-text-secondary)",
                  }}
                >
                  ৳{price}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div
        className="flex items-center justify-between px-4 py-2.5"
        style={{ borderTop: "1px solid var(--color-border)" }}
      >
        <div className="flex gap-1.5">
          {SAMPLE_BOOKS.map((_, i) => (
            <button
              key={i}
              onClick={() => { setPrevIdx(bookIdx); setBookIdx(i); }}
              className="rounded-full transition-all"
              style={{
                width: i === bookIdx ? "20px" : "6px",
                height: "6px",
                backgroundColor:
                  i === bookIdx
                    ? "var(--color-primary)"
                    : "var(--color-border-lit)",
              }}
              aria-label={`View ${SAMPLE_BOOKS[i].title}`}
            />
          ))}
        </div>
        <div
          className="flex items-center gap-1.5 text-xs"
          style={{ color: "var(--color-text-muted)" }}
        >
          <Zap className="w-3 h-3" style={{ color: "var(--color-primary)" }} />
          Updates every 24h
        </div>
      </div>
    </div>
  );
}
