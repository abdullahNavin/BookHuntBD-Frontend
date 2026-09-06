const SITE_LABELS: Record<string, string> = {
  bookshoper: "Bookshoper",
  dheebooks:  "Dhee Books",
  boibazar:   "Boibazar",
  harekrokom: "Harekrokom",
  eboighar:   "Eboighar",
  baatighar:  "Baatighar",
  rokomari:   "Rokomari",
  wafilife:   "Wafilife",
  prothoma:   "Prothoma",
};

const SITE_COLORS: Record<string, string> = {
  bookshoper: "#e11d48",
  dheebooks:  "#7c3aed",
  boibazar:   "#2563eb",
  harekrokom: "#d97706",
  eboighar:   "#059669",
  baatighar:  "#db2777",
  rokomari:   "#1d4ed8",
  wafilife:   "#ea580c",
  prothoma:   "#16a34a",
};

interface SiteLogoProps {
  site?: string | null;
}

export function SiteLogo({ site }: SiteLogoProps) {
  const normalizedSite = site?.toLowerCase() ?? "unknown";
  const label = site ? SITE_LABELS[normalizedSite] ?? site : "Unknown";
  const color = SITE_COLORS[normalizedSite] ?? "var(--color-primary)";

  return (
    <span
      className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full"
      style={{
        backgroundColor: `${color}22`,
        color,
        border: `1px solid ${color}44`,
      }}
    >
      {label}
    </span>
  );
}
