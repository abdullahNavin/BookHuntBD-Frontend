import Link from "next/link";
import { type LucideIcon } from "lucide-react";

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionHref,
  actionLabel,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  actionHref: string;
  actionLabel: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center px-4">
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
        style={{ backgroundColor: "var(--color-bg-muted)" }}
      >
        <Icon
          className="w-8 h-8"
          aria-hidden="true"
          style={{ color: "var(--color-text-muted)" }}
        />
      </div>
      <h2
        className="text-xl font-semibold mb-2"
        style={{ color: "var(--color-text-primary)" }}
      >
        {title}
      </h2>
      <p
        className="text-sm max-w-sm mb-8"
        style={{ color: "var(--color-text-secondary)" }}
      >
        {description}
      </p>
      <Link
        href={actionHref}
        className="px-6 py-2.5 rounded-xl text-sm font-medium transition-opacity hover:opacity-90"
        style={{ backgroundColor: "var(--color-primary)", color: "#fff" }}
      >
        {actionLabel}
      </Link>
    </div>
  );
}
