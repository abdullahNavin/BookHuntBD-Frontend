"use client";

import { BookCard } from "@/components/search/BookCard";
import type { BookResult } from "@/types/book";
import type { WishlistItem } from "@/types/wishlist";

interface ResultsGridProps {
  results: BookResult[];
  wishlist?: WishlistItem[];
  onWishlistToggle?: (book: BookResult) => void;
}

export function ResultsGrid({ results, wishlist = [], onWishlistToggle }: ResultsGridProps) {
  const wishlisted = new Set(wishlist.map((w) => w.link));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
      {results.map((book, i) => (
        <BookCard
          key={`${book.link}-${i}`}
          id={`book-card-${i}`}
          title={book.title}
          author={book.author}
          publisher={book.publisher}
          site={book.site}
          price={book.price}
          oldPrice={book.oldPrice}
          discount={book.discount}
          image={book.image}
          link={book.link}
          affiliateLink={book.affiliateLink}
          isWishlisted={wishlisted.has(book.link)}
          onWishlist={onWishlistToggle ? () => onWishlistToggle(book) : undefined}
        />
      ))}
    </div>
  );
}
