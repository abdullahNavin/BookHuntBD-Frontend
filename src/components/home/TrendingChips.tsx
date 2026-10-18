"use client";

import { useRouter } from "next/navigation";

const TRENDING_CHIPS: { label: string; query: string; emoji: string }[] = [
  { label: "Humayun Ahmed", query: "Humayun Ahmed", emoji: "✍️" },
  { label: "Atomic Habits", query: "Atomic Habits", emoji: "📈" },
  { label: "Islamic Books", query: "Islamic", emoji: "📖" },
  { label: "Anisul Hoque", query: "Anisul Hoque", emoji: "✒️" },
  { label: "Programming", query: "Programming", emoji: "💻" },
  { label: "Children's Books", query: "Children", emoji: "🌟" },
  { label: "Muhammad Zafar Iqbal", query: "Muhammad Zafar Iqbal", emoji: "🔬" },
  { label: "Mystery", query: "Mystery", emoji: "🔍" },
  { label: "Self Help", query: "Self Help", emoji: "🧠" },
  { label: "Tahmima Anam", query: "Tahmima Anam", emoji: "🌺" },
];

export function TrendingChips() {
  const router = useRouter();

  const handleChip = (query: string) => {
    router.push(`/search?query=${encodeURIComponent(query)}`);
  };

  return (
    <div className="w-full">
      <p
        className="text-xs font-medium uppercase tracking-widest mb-3"
        style={{ color: "var(--color-text-muted)" }}
      >
        Popular Searches
      </p>
      <div className="flex flex-wrap gap-2">
        {TRENDING_CHIPS.map((chip) => (
          <button
            key={chip.query}
            onClick={() => handleChip(chip.query)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all"
            style={{
              backgroundColor: "var(--color-bg-muted)",
              border: "1px solid var(--color-border)",
              color: "var(--color-text-secondary)",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget;
              el.style.borderColor = "var(--color-primary)";
              el.style.color = "var(--color-text-primary)";
              el.style.backgroundColor = "var(--color-bg-subtle)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget;
              el.style.borderColor = "var(--color-border)";
              el.style.color = "var(--color-text-secondary)";
              el.style.backgroundColor = "var(--color-bg-muted)";
            }}
            aria-label={`Search for ${chip.label}`}
          >
            <span>{chip.emoji}</span>
            <span>{chip.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
