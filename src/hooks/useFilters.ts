"use client";

import { useRouter, useSearchParams } from "next/navigation";

export interface Filters {
  sort: string;
  site: string;
  page: number;
}

export function useFilters() {
  const params = useSearchParams();
  const router = useRouter();

  const filters: Filters = {
    sort: params.get("sort") ?? "price_asc",
    site: params.get("site") ?? "",
    page: Number(params.get("page") ?? 1),
  };

  const setFilter = (key: string, value: string) => {
    const next = new URLSearchParams(params.toString());
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    next.set("page", "1"); // reset page on filter change
    router.replace(`?${next.toString()}`);
  };

  const clearFilters = () => {
    const query = params.get("query") ?? "";
    router.replace(`?query=${encodeURIComponent(query)}`);
  };

  return { filters, setFilter, clearFilters };
}
