"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Loader2 } from "lucide-react";

interface SearchBarProps {
  defaultValue?: string;
  autoFocus?: boolean;
  isFetching?: boolean;
}

export function SearchBar({
  defaultValue = "",
  autoFocus = false,
  isFetching = false,
}: SearchBarProps) {
  const [value, setValue] = useState(defaultValue);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus on mount
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  // Keyboard shortcut: "/" to focus
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      router.push(`/search?query=${encodeURIComponent(value.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} role="search" className="w-full">
      <div className="relative flex gap-2">
        <div className="relative flex-1 flex items-center">
          {/* Leading icon */}
          <div className="absolute left-3 pointer-events-none">
            {isFetching ? (
              <Loader2 className="w-4 h-4 animate-spin" style={{ color: "var(--color-primary)" }} />
            ) : (
              <Search className="w-4 h-4" style={{ color: "var(--color-text-muted)" }} />
            )}
          </div>

          <input
            ref={inputRef}
            type="search"
            id="search-input"
            name="query"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Search by title, author, or publisher…"
            autoComplete="off"
            className="w-full pl-10 pr-10 py-3 rounded-xl text-sm transition-all"
            style={{
              backgroundColor: "var(--color-bg-muted)",
              border: "1px solid var(--color-border)",
              color: "var(--color-text-primary)",
              outline: "none",
            }}
            onFocus={(e) =>
              (e.currentTarget.style.boxShadow = `0 0 0 2px var(--color-primary)`)
            }
            onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
          />

          {/* Clear button */}
          {value && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => setValue("")}
              className="absolute right-3 transition-opacity hover:opacity-80"
              style={{ color: "var(--color-text-muted)" }}
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        
        {/* Search Button */}
        <button
          type="submit"
          disabled={!value.trim()}
          className="px-6 py-3 rounded-xl text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-50"
          style={{ backgroundColor: "var(--color-primary)", color: "#fff" }}
        >
          Search
        </button>
      </div>
    </form>
  );
}
