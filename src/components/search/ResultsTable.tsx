"use client";

import { useState } from "react";
import { Heart, ExternalLink, Bell, ArrowUp, ArrowDown, ChevronsUpDown } from "lucide-react";
import { SiteLogo } from "@/components/shared/SiteLogo";
import type { BookResult } from "@/types/book";
import type { WishlistItem } from "@/types/wishlist";

type SortKey = "title" | "site" | "price" | "oldPrice" | "discount";

interface ResultsTableProps {
  results: BookResult[];
  wishlist?: WishlistItem[];
  onWishlistToggle?: (book: BookResult) => void;
  onAddAlert?: (book: BookResult) => void;
}

function SortIcon({ active, dir }: { active: boolean; dir: "asc" | "desc" }) {
  if (!active) return <ChevronsUpDown className="w-3 h-3 ml-1 inline opacity-40" />;
  return dir === "asc"
    ? <ArrowUp className="w-3 h-3 ml-1 inline" style={{ color: "var(--color-primary)" }} />
    : <ArrowDown className="w-3 h-3 ml-1 inline" style={{ color: "var(--color-primary)" }} />;
}

export function ResultsTable({
  results,
  wishlist = [],
  onWishlistToggle,
  onAddAlert,
}: ResultsTableProps) {
  const [localSort, setLocalSort] = useState<{ key: SortKey; dir: "asc" | "desc" }>({
    key: "price",
    dir: "asc",
  });

  const wishlisted = new Set(wishlist.map((w) => w.link));

  const handleHeaderClick = (key: SortKey) => {
    setLocalSort((prev) => ({
      key,
      dir: prev.key === key && prev.dir === "asc" ? "desc" : "asc",
    }));
  };

  const sorted = [...results].sort((a, b) => {
    const mul = localSort.dir === "asc" ? 1 : -1;
    switch (localSort.key) {
      case "title":   return mul * (a.title.localeCompare(b.title));
      case "site":    return mul * (a.site.localeCompare(b.site));
      case "price":   return mul * (a.price - b.price);
      case "oldPrice": return mul * ((a.oldPrice ?? 0) - (b.oldPrice ?? 0));
      case "discount": return mul * ((a.discount ?? 0) - (b.discount ?? 0));
      default: return 0;
    }
  });

  const thClass = "px-4 py-3 text-left text-xs font-medium uppercase tracking-wider select-none cursor-pointer transition-colors hover:opacity-80 whitespace-nowrap";
  const tdClass = "px-4 py-3 text-sm";

  return (
    <div className="hidden md:block w-full overflow-auto rounded-xl border" style={{ borderColor: "var(--color-border)" }}>
      <table className="w-full border-collapse" style={{ backgroundColor: "var(--color-bg-card)" }}>
        <thead style={{ borderBottom: `1px solid var(--color-border)` }}>
          <tr>
            <th className={thClass} style={{ color: "var(--color-text-muted)" }}>#</th>
            <th className={thClass} onClick={() => handleHeaderClick("title")} style={{ color: "var(--color-text-muted)" }}>
              Title <SortIcon active={localSort.key === "title"} dir={localSort.dir} />
            </th>
            <th className={thClass} style={{ color: "var(--color-text-muted)" }}>Author</th>
            <th className={thClass} onClick={() => handleHeaderClick("site")} style={{ color: "var(--color-text-muted)" }}>
              Site <SortIcon active={localSort.key === "site"} dir={localSort.dir} />
            </th>
            <th className={thClass} onClick={() => handleHeaderClick("price")} style={{ color: "var(--color-text-muted)" }}>
              Price <SortIcon active={localSort.key === "price"} dir={localSort.dir} />
            </th>
            <th className={thClass} onClick={() => handleHeaderClick("oldPrice")} style={{ color: "var(--color-text-muted)" }}>
              Was <SortIcon active={localSort.key === "oldPrice"} dir={localSort.dir} />
            </th>
            <th className={thClass} onClick={() => handleHeaderClick("discount")} style={{ color: "var(--color-text-muted)" }}>
              Disc. <SortIcon active={localSort.key === "discount"} dir={localSort.dir} />
            </th>
            <th className={thClass} style={{ color: "var(--color-text-muted)" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((book, i) => {
            const isWish = wishlisted.has(book.link);
            return (
              <tr
                key={`${book.link}-${i}`}
                id={`result-row-${i}`}
                style={{
                  borderTop: i > 0 ? `1px solid var(--color-border)` : undefined,
                  transition: "background-color 0.15s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "var(--color-bg-muted)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                <td className={tdClass} style={{ color: "var(--color-text-muted)" }}>
                  {i + 1}
                </td>
                <td className={tdClass} style={{ maxWidth: "240px" }}>
                  <span
                    className="font-medium line-clamp-2 block"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    {book.title}
                  </span>
                </td>
                <td className={tdClass} style={{ color: "var(--color-text-secondary)" }}>
                  {book.author ?? "—"}
                </td>
                <td className={tdClass}>
                  <SiteLogo site={book.site} />
                </td>
                <td className={tdClass}>
                  <span className="font-semibold" style={{ color: "var(--color-text-primary)" }}>
                    ৳ {book.price.toLocaleString()}
                  </span>
                </td>
                <td className={tdClass}>
                  {book.oldPrice ? (
                    <span className="line-through text-xs" style={{ color: "var(--color-text-muted)" }}>
                      ৳ {book.oldPrice.toLocaleString()}
                    </span>
                  ) : (
                    <span style={{ color: "var(--color-text-muted)" }}>—</span>
                  )}
                </td>
                <td className={tdClass}>
                  {book.discount != null && book.discount > 0 ? (
                    <span
                      className="text-xs font-medium px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: "color-mix(in srgb, var(--color-success) 15%, transparent)",
                        color: "var(--color-success)",
                      }}
                    >
                      {book.discount}%
                    </span>
                  ) : (
                    <span style={{ color: "var(--color-text-muted)" }}>—</span>
                  )}
                </td>
                <td className={tdClass}>
                  <div className="flex items-center gap-1.5">
                    <a
                      href={book.affiliateLink || book.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-opacity hover:opacity-90"
                      style={{ backgroundColor: "var(--color-primary)", color: "#fff" }}
                    >
                      <ExternalLink className="w-3 h-3" />
                      Buy
                    </a>
                    {onWishlistToggle && (
                      <button
                        onClick={() => onWishlistToggle(book)}
                        aria-label={isWish ? "Remove from wishlist" : "Add to wishlist"}
                        className="p-1.5 rounded-md transition-colors"
                        style={{
                          color: isWish ? "var(--color-danger)" : "var(--color-text-muted)",
                          backgroundColor: isWish
                            ? "color-mix(in srgb, var(--color-danger) 10%, transparent)"
                            : "transparent",
                        }}
                      >
                        <Heart className="w-4 h-4" fill={isWish ? "currentColor" : "none"} />
                      </button>
                    )}
                    {onAddAlert && (
                      <button
                        onClick={() => onAddAlert(book)}
                        aria-label="Set price alert"
                        className="p-1.5 rounded-md transition-colors hover:opacity-80"
                        style={{ color: "var(--color-text-muted)" }}
                      >
                        <Bell className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
