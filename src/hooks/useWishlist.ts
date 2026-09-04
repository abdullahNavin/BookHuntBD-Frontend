"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import type { WishlistItem, WishlistPayload } from "@/types/wishlist";

export function useWishlist() {
  return useQuery<WishlistItem[]>({
    queryKey: ["wishlist"],
    queryFn: () => api.get<WishlistItem[]>("/api/wishlist").then((r) => r.data),
  });
}

export function useAddToWishlist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (book: WishlistPayload) => api.post("/api/wishlist", book),
    onMutate: async (book) => {
      await qc.cancelQueries({ queryKey: ["wishlist"] });
      const prev = qc.getQueryData<WishlistItem[]>(["wishlist"]);
      qc.setQueryData<WishlistItem[]>(
        ["wishlist"],
        (old) => [...(old ?? []), { ...book, id: "temp-" + Date.now() }]
      );
      return { prev };
    },
    onSuccess: () => toast.success("Added to wishlist"),
    onError: (_err, _vars, ctx) => {
      qc.setQueryData(["wishlist"], ctx?.prev);
      toast.error("Failed to add to wishlist");
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["wishlist"] }),
  });
}

export function useRemoveFromWishlist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/api/wishlist/${id}`),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: ["wishlist"] });
      const prev = qc.getQueryData<WishlistItem[]>(["wishlist"]);
      qc.setQueryData<WishlistItem[]>(
        ["wishlist"],
        (old) => old?.filter((item) => item.id !== id) ?? []
      );
      return { prev };
    },
    onSuccess: () => toast.success("Removed from wishlist"),
    onError: (_err, _vars, ctx) => {
      qc.setQueryData(["wishlist"], ctx?.prev);
      toast.error("Failed to remove from wishlist");
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["wishlist"] }),
  });
}
