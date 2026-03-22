"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { keepPreviousData } from "@tanstack/react-query";
import type { BookFilters, SearchResponse } from "@/types/book";

export function useBooks(query: string, filters: BookFilters) {
  return useQuery({
    queryKey: ["books", query, filters],
    queryFn: () =>
      api
        .get<SearchResponse>("/books/search", {
          params: { query, ...filters },
        })
        .then((r) => r.data),
    enabled: query.length > 0,
    staleTime: 1000 * 60 * 5, // 5 min — backend caches for 24h
    placeholderData: keepPreviousData, // no flicker on filter change
  });
}
