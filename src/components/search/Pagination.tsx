"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useFilters } from "@/hooks/useFilters";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export function Pagination({ currentPage, totalPages }: PaginationProps) {
  const { setFilter } = useFilters();

  if (totalPages <= 1) return null;

  const handlePrev = () => {
    if (currentPage > 1) {
      setFilter("page", (currentPage - 1).toString());
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setFilter("page", (currentPage + 1).toString());
    }
  };

  return (
    <div className="flex items-center justify-between py-6">
      <div className="text-sm" style={{ color: "var(--color-text-muted)" }}>
        Page <span className="font-semibold" style={{ color: "var(--color-text-primary)" }}>{currentPage}</span> of{" "}
        <span className="font-semibold" style={{ color: "var(--color-text-primary)" }}>{totalPages}</span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handlePrev}
          disabled={currentPage <= 1}
          className="p-2 rounded-lg border flex items-center justify-center transition-colors hover:bg-black/10 disabled:opacity-40"
          style={{ borderColor: "var(--color-border)", color: "var(--color-text-primary)", backgroundColor: "var(--color-bg-card)" }}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={handleNext}
          disabled={currentPage >= totalPages}
          className="p-2 rounded-lg border flex items-center justify-center transition-colors hover:bg-black/10 disabled:opacity-40"
          style={{ borderColor: "var(--color-border)", color: "var(--color-text-primary)", backgroundColor: "var(--color-bg-card)" }}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
