export function SkeletonCard() {
  return (
    <div
      aria-hidden="true"
      className="rounded-xl border p-4 animate-pulse space-y-3"
      style={{
        backgroundColor: "var(--color-bg-card)",
        borderColor: "var(--color-border)",
      }}
    >
      <div
        className="h-4 rounded w-3/4"
        style={{ backgroundColor: "var(--color-bg-muted)" }}
      />
      <div
        className="h-3 rounded w-1/2"
        style={{ backgroundColor: "var(--color-bg-muted)" }}
      />
      <div
        className="h-6 rounded w-1/4"
        style={{ backgroundColor: "var(--color-bg-muted)" }}
      />
    </div>
  );
}

export function SkeletonRow() {
  return (
    <tr aria-hidden="true">
      {Array.from({ length: 8 }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div
            className="h-4 rounded animate-pulse"
            style={{
              backgroundColor: "var(--color-bg-muted)",
              width: i === 0 ? "2rem" : i === 1 ? "10rem" : "5rem",
            }}
          />
        </td>
      ))}
    </tr>
  );
}
