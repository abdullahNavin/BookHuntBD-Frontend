"use client";

import { Suspense } from "react";
import { SearchBar } from "@/components/search/SearchBar";
import { SearchFilters } from "@/components/search/SearchFilters";
import { ResultsTable } from "@/components/search/ResultsTable";
import { ResultsGrid } from "@/components/search/ResultsGrid";
import { Pagination } from "@/components/search/Pagination";
import { NoResults } from "@/components/search/NoResults";
import { ErrorMessage } from "@/components/shared/ErrorMessage";
import { SkeletonCard, SkeletonRow } from "@/components/shared/SkeletonCard";
import { useBooks } from "@/hooks/useBooks";
import { useFilters } from "@/hooks/useFilters";
import { useWishlist, useAddToWishlist, useRemoveFromWishlist } from "@/hooks/useWishlist";
import { CreateAlertDialog } from "@/components/alerts/CreateAlertDialog";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import type { BookResult } from "@/types/book";

function SearchPageContent() {
  const { filters } = useFilters();
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  
  const { data, isLoading, isFetching, error, refetch } = useBooks(query, filters);
  const { data: wishlist = [] } = useWishlist();
  const { mutate: addWishlist } = useAddToWishlist();
  const { mutate: removeWishlist } = useRemoveFromWishlist();

  const [alertOpen, setAlertOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<BookResult | null>(null);

  const handleWishlistToggle = (book: BookResult) => {
    const existing = wishlist.find((w) => w.link === book.link);
    if (existing) {
      removeWishlist(existing.id);
    } else {
      addWishlist({
        title: book.title,
        link: book.link,
        site: book.site,
        price: book.price,
        image: book.image,
        author: book.author,
      });
    }
  };

  const handleAddAlert = (book: BookResult) => {
    setSelectedBook(book);
    setAlertOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <SearchBar defaultValue={query} isFetching={isFetching} />
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        <SearchFilters />

        <div className="flex-1 w-full min-w-0">
          {!query && !isLoading && !data && (
            <div className="py-20 text-center text-sm" style={{ color: "var(--color-text-muted)" }}>
              Enter a search query to find books.
            </div>
          )}

          {isLoading && query && (
            <>
              {/* Desktop Loading Skeleton */}
              <div className="hidden md:block overflow-hidden rounded-xl border border-b-0" style={{ borderColor: "var(--color-border)" }}>
                <table className="w-full">
                  <tbody className="divide-y" style={{ borderTopColor: "var(--color-border)", borderBottomColor: "var(--color-border)" }}>
                    {Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)}
                  </tbody>
                </table>
              </div>
              {/* Mobile Loading Skeleton */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
                {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            </>
          )}

          {error && !isLoading && (
            <ErrorMessage 
              message={error.message || "Failed to fetch search results."} 
              onRetry={() => refetch()} 
            />
          )}

          {data && data.failed && data.failed.length > 0 && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm border mb-4"
              style={{ backgroundColor: "color-mix(in srgb, var(--color-warning) 10%, transparent)", borderColor: "color-mix(in srgb, var(--color-warning) 30%, transparent)", color: "var(--color-warning)" }}>
              ⚠️ Results from {data.failed.join(" and ")} are unavailable right now. Showing results from other sites.
            </div>
          )}

          {data && data.results.length === 0 && (
            <NoResults query={query} />
          )}

          {data && data.results.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between text-sm" style={{ color: "var(--color-text-secondary)" }}>
                <span>Found <strong style={{ color: "var(--color-text-primary)" }}>{data.total ?? data.results.length}</strong> results</span>
              </div>
              
              <ResultsTable
                results={data.results}
                wishlist={wishlist}
                onWishlistToggle={handleWishlistToggle}
                onAddAlert={handleAddAlert}
              />
              
              <ResultsGrid
                results={data.results}
                wishlist={wishlist}
                onWishlistToggle={handleWishlistToggle}
              />

              {data.totalPages && data.totalPages > 1 && (
                <Pagination 
                  currentPage={data.page || 1} 
                  totalPages={data.totalPages} 
                />
              )}
            </div>
          )}
        </div>
      </div>

      {selectedBook && (
        <CreateAlertDialog
          book={selectedBook}
          open={alertOpen}
          onOpenChange={setAlertOpen}
        />
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="mb-8 p-4 rounded-xl border animate-pulse" style={{ backgroundColor: "var(--color-bg-muted)", borderColor: "var(--color-border)", height: 50 }} />
          <div className="flex gap-8">
            <div className="hidden md:block w-[200px] h-[300px] rounded-xl border animate-pulse" style={{ backgroundColor: "var(--color-bg-muted)", borderColor: "var(--color-border)" }} />
            <div className="flex-1 w-full h-[500px] rounded-xl border animate-pulse" style={{ backgroundColor: "var(--color-bg-muted)", borderColor: "var(--color-border)" }} />
          </div>
        </div>
      }
    >
      <SearchPageContent />
    </Suspense>
  );
}
