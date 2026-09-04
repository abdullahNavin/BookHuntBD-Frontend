interface PriceBadgeProps {
  price?: number | null;
  oldPrice?: number | null;
  discount?: number | null;
}

export function PriceBadge({ price, oldPrice, discount }: PriceBadgeProps) {
  if (price == null) {
    return (
      <span
        className="text-sm"
        style={{ color: "var(--color-text-muted)" }}
      >
        Price unavailable
      </span>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span
        className="font-semibold text-base"
        style={{ color: "var(--color-text-primary)" }}
      >
        ৳ {price.toLocaleString()}
      </span>
      {oldPrice && oldPrice > price && (
        <span
          className="text-sm line-through"
          style={{ color: "var(--color-text-muted)" }}
        >
          ৳ {oldPrice.toLocaleString()}
        </span>
      )}
      {discount != null && discount > 0 && (
        <span
          className="text-xs font-medium px-2 py-0.5 rounded-full"
          style={{
            backgroundColor: "color-mix(in srgb, var(--color-success) 15%, transparent)",
            color: "var(--color-success)",
          }}
        >
          {discount}% off
        </span>
      )}
    </div>
  );
}
