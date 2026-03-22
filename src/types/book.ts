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
}

export interface SearchResponse {
  results: BookResult[];
  failed: string[];
  query: string;
  total?: number;
}

export interface BookFilters {
  sort?: string;
  site?: string;
  page?: number;
}
