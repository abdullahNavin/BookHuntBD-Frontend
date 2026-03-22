"use client";

import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { WishlistItem } from "@/components/wishlist/WishlistItem";
import { WishlistEmpty } from "@/components/wishlist/WishlistEmpty";
import { SkeletonCard } from "@/components/shared/SkeletonCard";
import { ErrorMessage } from "@/components/shared/ErrorMessage";
import { useWishlist } from "@/hooks/useWishlist";
import { Heart } from "lucide-react";

export default function WishlistPage() {
  const { data: wishlist, isLoading, error, refetch } = useWishlist();

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center gap-3 mb-8">
          <Heart className="w-8 h-8" style={{ color: "var(--color-danger)" }} fill="currentColor" />
          <div>
            <h1 className="text-2xl font-bold" style={{ color: "var(--color-text-primary)" }}>Your Wishlist</h1>
            <p className="text-sm mt-1" style={{ color: "var(--color-text-secondary)" }}>
              Saved books for later purchase.
            </p>
          </div>
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {error && !isLoading && (
          <ErrorMessage 
            message={error.message || "Failed to load wishlist."} 
            onRetry={() => refetch()} 
          />
        )}

        {wishlist && wishlist.length === 0 && !isLoading && (
          <WishlistEmpty />
        )}

        {wishlist && wishlist.length > 0 && (
          <div className="space-y-4">
            {wishlist.map((item) => (
              <WishlistItem key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
