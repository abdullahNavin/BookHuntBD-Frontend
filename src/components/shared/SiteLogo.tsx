const SITE_LABELS: Record<string, string> = {
  rokomari:   "Rokomari",
  dheebooks:  "Dhee Books",
  boibazar:   "Boibazar",
  harekrokom: "Harekrokom",
  eboighar:   "Eboighar",
  baatighar:  "Baatighar",
};

const SITE_COLORS: Record<string, string> = {
  rokomari:   "#e11d48",
  dheebooks:  "#7c3aed",
  boibazar:   "#2563eb",
  harekrokom: "#d97706",
  eboighar:   "#059669",
  baatighar:  "#db2777",
};

interface SiteLogoProps {
  site: string;
}

export function SiteLogo({ site }: SiteLogoProps) {
  const label = SITE_LABELS[site.toLowerCase()] ?? site;
  const color = SITE_COLORS[site.toLowerCase()] ?? "var(--color-primary)";

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
