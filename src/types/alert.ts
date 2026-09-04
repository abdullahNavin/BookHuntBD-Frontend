export type AlertSite =
  | "rokomari"
  | "dheebooks"
  | "boibazar"
  | "harekrokom"
  | "eboighar"
  | "baatighar";

export interface PriceAlert {
  id: string;
  title: string;
  link: string;
  site: AlertSite;
  targetPrice: number;
  notifiedAt?: string | null;
  isActive: boolean;
  createdAt?: string;
}

export interface AlertPayload {
  title: string;
  link: string;
  site: AlertSite;
  targetPrice: number;
}
