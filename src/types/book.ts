export interface BookResult {
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
}

export interface SearchResponse {
  results: BookResult[];
  failed: string[];
  query: string;
  cached: boolean;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface BookFilters {
  sort?: string;
  site?: string;
  page?: number;
}
