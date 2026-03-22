"use client";

import Image from "next/image";
import { ExternalLink, Trash2, Loader2 } from "lucide-react";
import { PriceBadge } from "@/components/shared/PriceBadge";
import { SiteLogo } from "@/components/shared/SiteLogo";
import type { WishlistItem as WishlistItemType } from "@/types/wishlist";
import { useRemoveFromWishlist } from "@/hooks/useWishlist";

interface WishlistItemProps {
  item: WishlistItemType;
}

export function WishlistItem({ item }: WishlistItemProps) {
  const { mutate: remove, isPending } = useRemoveFromWishlist();

  return (
    <article
      className="rounded-xl border p-4 flex flex-col sm:flex-row gap-4 transition-colors hover:border-opacity-60"
      style={{
        backgroundColor: "var(--color-bg-card)",
        borderColor: "var(--color-border)",
      }}
    >
      {/* Mobile-only image */}
      {item.image && (
        <div className="relative w-full sm:w-24 h-40 sm:h-32 rounded-lg overflow-hidden shrink-0">
          <Image
            src={item.image}
            alt={`Cover of ${item.title}`}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 96px"
          />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 flex flex-col justify-between">
        <div className="space-y-1 mb-4 sm:mb-0">
          <h3
            className="font-semibold text-sm sm:text-base leading-snug line-clamp-2"
            style={{ color: "var(--color-text-primary)" }}
          >
            {item.title}
          </h3>
          {item.author && (
            <p className="text-sm truncate" style={{ color: "var(--color-text-muted)" }}>
              {item.author}
            </p>
          )}
          <div className="pt-1">
            <SiteLogo site={item.site} />
          </div>
        </div>
        <PriceBadge price={item.price} />
      </div>

      {/* Actions */}
      <div className="flex sm:flex-col gap-2 shrink-0 sm:w-32 justify-end sm:justify-start">
        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium transition-opacity hover:opacity-90"
          style={{ backgroundColor: "var(--color-primary)", color: "#fff" }}
        >
          <ExternalLink className="w-3 h-3" />
          Buy Now
        </a>
        <button
          onClick={() => remove(item.id)}
          disabled={isPending}
          className="flex items-center justify-center gap-1.5 w-10 sm:w-full py-2 px-3 rounded-lg text-xs font-medium border transition-colors hover:opacity-80 disabled:opacity-50"
          style={{
            borderColor: "var(--color-border)",
            color: "var(--color-danger)",
            backgroundColor: "color-mix(in srgb, var(--color-danger) 10%, transparent)",
          }}
        >
          {isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
          <span className="hidden sm:inline">Remove</span>
        </button>
      </div>
    </article>
  );
}
