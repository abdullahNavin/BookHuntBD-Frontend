export interface WishlistItem {
  id: string;
  title: string;
  author?: string;
  site?: string | null;
  price?: number | null;
  link: string;
  image?: string | null;
  createdAt?: string;
}

export interface WishlistPayload {
  title: string;
  author?: string;
  site: string;
  price: number;
  link: string;
  image?: string;
}
