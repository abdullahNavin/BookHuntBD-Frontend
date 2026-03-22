import Link from "next/link";
import { HeartCrack } from "lucide-react";

export function WishlistEmpty() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center px-4">
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
        style={{ backgroundColor: "var(--color-bg-muted)" }}
      >
        <HeartCrack className="w-8 h-8" style={{ color: "var(--color-text-muted)" }} />
      </div>
      <h2
        className="text-xl font-semibold mb-2"
        style={{ color: "var(--color-text-primary)" }}
      >
        Your wishlist is empty
      </h2>
      <p
        className="text-sm max-w-sm mb-8"
        style={{ color: "var(--color-text-secondary)" }}
      >
        Start searching for books and save the ones you want to buy later by
        clicking the heart icon.
      </p>
      <Link
        href="/"
        className="px-6 py-2.5 rounded-xl text-sm font-medium transition-opacity hover:opacity-90"
        style={{ backgroundColor: "var(--color-primary)", color: "#fff" }}
      >
        Search books
      </Link>
    </div>
  );
}
