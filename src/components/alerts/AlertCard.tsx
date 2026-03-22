"use client";

import { useDeleteAlert } from "@/hooks/useAlerts";
import type { PriceAlert } from "@/types/alert";
import { SiteLogo } from "@/components/shared/SiteLogo";
import { Trash2, BellRing, ExternalLink, Loader2, CheckCircle2 } from "lucide-react";

interface AlertCardProps {
  alert: PriceAlert;
}

export function AlertCard({ alert }: AlertCardProps) {
  const { mutate: remove, isPending } = useDeleteAlert();
  const isActive = alert.status === "active";

  return (
    <article
      className="rounded-xl border p-5 flex flex-col gap-4 relative overflow-hidden"
      style={{
        backgroundColor: "var(--color-bg-card)",
        borderColor: isActive ? "var(--color-border)" : "color-mix(in srgb, var(--color-success) 30%, var(--color-border))",
      }}
    >
      {/* Background icon decoration */}
      <div className="absolute -right-4 -top-4 opacity-5 pointer-events-none">
        <BellRing className="w-32 h-32" />
      </div>

      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1 z-10">
          <h3
            className="font-semibold text-lg leading-snug line-clamp-2"
            style={{ color: "var(--color-text-primary)" }}
          >
            {alert.title}
          </h3>
          <div className="flex items-center gap-2 pt-1">
            <SiteLogo site={alert.site} />
            <span
              className="text-xs font-medium px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: isActive
                  ? "var(--color-bg-muted)"
                  : "color-mix(in srgb, var(--color-success) 15%, transparent)",
                color: isActive ? "var(--color-text-secondary)" : "var(--color-success)",
              }}
            >
              {isActive ? "Active" : "Notified"}
            </span>
          </div>
        </div>

        <button
          onClick={() => remove(alert.id)}
          disabled={isPending}
          aria-label="Delete alert"
          className="shrink-0 p-2 rounded-lg transition-colors hover:bg-black/20"
          style={{ color: "var(--color-danger)" }}
        >
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
        </button>
      </div>

      <div className="flex items-end justify-between z-10 mt-2">
        <div>
          <p className="text-xs uppercase tracking-wider mb-1" style={{ color: "var(--color-text-muted)" }}>
            Target Price
          </p>
          <p className="text-2xl font-bold" style={{ color: "var(--color-text-primary)" }}>
            ৳ {alert.targetPrice.toLocaleString()}
          </p>
        </div>
        
        <a
          href={alert.link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors hover:opacity-80 border"
          style={{
            borderColor: "var(--color-border)",
            color: "var(--color-text-primary)",
            backgroundColor: "var(--color-bg-muted)",
          }}
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Visit Product
        </a>
      </div>
    </article>
  );
}
