import { EmptyState } from "@/components/shared/EmptyState";
import { HeartCrack } from "lucide-react";

export function WishlistEmpty() {
  return (
    <EmptyState
      icon={HeartCrack}
      title="Your wishlist is empty"
      description="Start searching for books and save the ones you want to buy later by clicking the heart icon."
      actionHref="/"
      actionLabel="Search books"
    />
  );
}
