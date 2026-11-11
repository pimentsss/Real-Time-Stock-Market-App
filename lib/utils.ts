import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatPrice = (price?: number) =>
  price == null ? "—" : new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(price);

export const formatChangePercent = (p?: number) =>
  p == null ? "" : `${p > 0 ? "+" : ""}${p.toFixed(2)}%`;

export const getFormattedTodayDate = () =>
  new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });

// Finnhub wants YYYY-MM-DD
export const getDateRange = (days: number) => {
  const to = new Date();
  const from = new Date(to.getTime() - days * 24 * 60 * 60 * 1000);
  return { from: from.toISOString().split("T")[0], to: to.toISOString().split("T")[0] };
};

export type MarketNewsArticle = {
  id: number;
  headline: string;
  summary: string;
  source: string;
  url: string;
  datetime: number;
  related?: string;
  image?: string;
};

export const validateArticle = (a: Partial<MarketNewsArticle>) => Boolean(a.headline && a.summary && a.url && a.datetime);
