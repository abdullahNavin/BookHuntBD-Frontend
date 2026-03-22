import { SearchX } from "lucide-react";

interface NoResultsProps {
  query?: string;
}

export function NoResults({ query }: NoResultsProps) {
  return (
    <div className="flex flex-col items-center gap-4 py-20 text-center">
      <SearchX className="w-12 h-12" style={{ color: "var(--color-text-muted)" }} />
      <div>
        <p className="font-medium text-base" style={{ color: "var(--color-text-secondary)" }}>
          No books found{query ? ` for "${query}"` : ""}
        </p>
        <p className="text-sm mt-1" style={{ color: "var(--color-text-muted)" }}>
          Try a different title or author, or broaden your search.
        </p>
      </div>
    </div>
  );
}
