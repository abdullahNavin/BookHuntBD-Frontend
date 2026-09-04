"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { keepPreviousData } from "@tanstack/react-query";
import type { BookFilters, SearchResponse } from "@/types/book";

type SearchParams = {
  query: string;
  limit: number;
} & BookFilters;

export function useBooks(query: string, filters: BookFilters) {
  return useQuery({
    queryKey: ["books", query, filters],
    queryFn: () => {
      const params: Partial<SearchParams> = { query, limit: 10, ...filters };
      Object.keys(params).forEach(key => {
        const paramKey = key as keyof SearchParams;
        if (params[paramKey] === "" || params[paramKey] == null) {
          delete params[paramKey];
        }
      });
      return api
        .get<SearchResponse>("/api/books/search", { params })
        .then((r) => r.data);
    },
    enabled: query.length > 0,
    staleTime: 1000 * 60 * 5, // 5 min — backend caches for 24h
    placeholderData: keepPreviousData, // no flicker on filter change
  });
}
