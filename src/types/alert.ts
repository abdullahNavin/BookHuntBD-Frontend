export type AlertSite =
  | "rokomari"
  | "dheebooks"
  | "boibazar"
  | "harekrokom"
  | "eboighar"
  | "baatighar";

export type AlertStatus = "active" | "notified";

export interface PriceAlert {
  id: string;
  title: string;
  link: string;
  site: AlertSite;
  targetPrice: number;
  status: AlertStatus;
  createdAt?: string;
}

export interface AlertPayload {
  title: string;
  link: string;
  site: AlertSite;
  targetPrice: number;
}
