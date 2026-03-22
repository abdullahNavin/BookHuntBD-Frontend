export interface WishlistItem {
  id: string;
  title: string;
  author?: string;
  site: string;
  price: number;
  link: string;
  image?: string;
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
