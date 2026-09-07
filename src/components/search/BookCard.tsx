"use client";

import Image from "next/image";
import { Heart, ExternalLink } from "lucide-react";
import { PriceBadge } from "@/components/shared/PriceBadge";
import { SiteLogo } from "@/components/shared/SiteLogo";

interface BookCardProps {
  title: string;
  author?: string;
  publisher?: string;
  site: string;
  price: number;
  oldPrice?: number;
  discount?: number;
  image?: string;
  link: string;
  affiliateLink?: string;
  isWishlisted?: boolean;
  onWishlist?: () => void;
  id?: string;
}

export function BookCard({
  title,
  author,
  publisher,
  site,
  price,
  oldPrice,
  discount,
  image,
  link,
  affiliateLink,
  isWishlisted = false,
  onWishlist,
  id,
}: BookCardProps) {
  return (
    <article
      className="rounded-xl border p-4 flex flex-col gap-3 transition-colors hover:border-opacity-60"
      style={{
        backgroundColor: "var(--color-bg-card)",
        borderColor: "var(--color-border)",
      }}
      id={id}
    >
      {/* Image */}
      {image && (
        <div className="relative w-full h-40 rounded-lg overflow-hidden">
          <Image
            src={image}
            alt={`Cover of ${title}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 300px"
          />
        </div>
      )}

      {/* Title + meta */}
      <div className="flex-1 space-y-1">
        <h3
          className="font-semibold text-sm leading-snug line-clamp-2"
          style={{ color: "var(--color-text-primary)" }}
        >
          {title}
        </h3>
        {(author || publisher) && (
          <p className="text-xs truncate" style={{ color: "var(--color-text-muted)" }}>
            {author && <span>{author}</span>}
            {author && publisher && <span> · </span>}
            {publisher && <span>{publisher}</span>}
          </p>
        )}
        <SiteLogo site={site} />
      </div>

      <PriceBadge price={price} oldPrice={oldPrice} discount={discount} />

      {/* Actions */}
      <div className="flex gap-2">
        <a
          href={affiliateLink || link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-opacity hover:opacity-90"
          style={{ backgroundColor: "var(--color-primary)", color: "#fff" }}
        >
          <ExternalLink className="w-3 h-3" />
          Buy
        </a>
        {onWishlist && (
          <button
            onClick={onWishlist}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            className="flex items-center justify-center w-9 h-9 rounded-lg border transition-colors hover:opacity-80"
            style={{
              borderColor: "var(--color-border)",
              color: isWishlisted ? "var(--color-danger)" : "var(--color-text-muted)",
              backgroundColor: isWishlisted
                ? "color-mix(in srgb, var(--color-danger) 10%, transparent)"
                : "var(--color-bg-muted)",
            }}
          >
            <Heart
              className="w-4 h-4"
              fill={isWishlisted ? "currentColor" : "none"}
            />
          </button>
        )}
      </div>
    </article>
  );
}
