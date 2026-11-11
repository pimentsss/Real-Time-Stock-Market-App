"use server";

import { cache } from "react";
import { POPULAR_STOCK_SYMBOLS } from "@/lib/constants";
import { getDateRange, validateArticle, type MarketNewsArticle } from "@/lib/utils";

const FINNHUB_BASE_URL = "https://finnhub.io/api/v1";
const token = () => process.env.FINNHUB_API_KEY ?? "";

async function fetchJSON<T>(url: string, revalidateSeconds?: number): Promise<T> {
  const options: RequestInit & { next?: { revalidate?: number } } = revalidateSeconds
    ? { cache: "force-cache", next: { revalidate: revalidateSeconds } }
    : { cache: "no-store" };
  const res = await fetch(url, options);
  if (!res.ok) throw new Error(`Finnhub fetch failed ${res.status}: ${await res.text().catch(() => "")}`);
  return (await res.json()) as T;
}

export type StockWithWatchlistStatus = {
  symbol: string;
  name: string;
  exchange: string;
  type: string;
  isInWatchlist: boolean;
};

type ProfileResponse = { name?: string; ticker?: string; exchange?: string };
type SearchResponse = { result?: { symbol: string; description: string; displaySymbol?: string; type: string }[] };

// Up to 6 articles: round-robin across the given symbols, else general market news.
export async function getNews(symbols?: string[]): Promise<MarketNewsArticle[]> {
  const { from, to } = getDateRange(5);
  const clean = (symbols ?? []).map((s) => s.trim().toUpperCase()).filter(Boolean);
  const maxArticles = 6;

  try {
    if (clean.length > 0) {
      const perSymbol: Record<string, MarketNewsArticle[]> = {};
      await Promise.all(
        clean.map(async (sym) => {
          try {
            const url = `${FINNHUB_BASE_URL}/company-news?symbol=${encodeURIComponent(sym)}&from=${from}&to=${to}&token=${token()}`;
            const articles = await fetchJSON<MarketNewsArticle[]>(url, 300);
            perSymbol[sym] = (articles ?? []).filter(validateArticle);
          } catch (e) {
            console.error("company-news error", sym, e);
            perSymbol[sym] = [];
          }
        }),
      );

      const collected: MarketNewsArticle[] = [];
      for (let round = 0; round < maxArticles; round++) {
        for (const sym of clean) {
          const article = perSymbol[sym]?.shift();
          if (article) collected.push({ ...article, related: sym });
          if (collected.length >= maxArticles) break;
        }
        if (collected.length >= maxArticles) break;
      }
      if (collected.length > 0) return collected.sort((a, b) => b.datetime - a.datetime);
    }

    const general = await fetchJSON<MarketNewsArticle[]>(`${FINNHUB_BASE_URL}/news?category=general&token=${token()}`, 300);
    const seen = new Set<string>();
    return (general ?? [])
      .filter((a) => {
        if (!validateArticle(a)) return false;
        const key = `${a.id}-${a.url}-${a.headline}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .slice(0, maxArticles);
  } catch (err) {
    console.error("getNews error:", err);
    throw new Error("Failed to fetch news");
  }
}

export const searchStocks = cache(async (query?: string): Promise<StockWithWatchlistStatus[]> => {
  try {
    if (!token()) {
      console.error("FINNHUB_API_KEY is not configured");
      return [];
    }
    const trimmed = query?.trim() ?? "";
    let results: { symbol: string; description: string; exchange: string; type: string }[] = [];

    if (!trimmed) {
      // No query: show popular stocks
      const profiles = await Promise.all(
        POPULAR_STOCK_SYMBOLS.map(async (sym) => {
          try {
            const p = await fetchJSON<ProfileResponse>(`${FINNHUB_BASE_URL}/stock/profile2?symbol=${sym}&token=${token()}`, 3600);
            return { symbol: sym, description: p?.name || sym, exchange: p?.exchange || "US", type: "Common Stock" };
          } catch {
            return null;
          }
        }),
      );
      results = profiles.filter((p): p is NonNullable<typeof p> => p !== null);
    } else {
      const data = await fetchJSON<SearchResponse>(`${FINNHUB_BASE_URL}/search?q=${encodeURIComponent(trimmed)}&token=${token()}`, 1800);
      results = (data?.result ?? []).map((r) => ({
        symbol: r.symbol,
        description: r.description,
        exchange: r.displaySymbol || "US",
        type: r.type || "Stock",
      }));
    }

    return results.slice(0, 15).map((r) => ({
      symbol: r.symbol.toUpperCase(),
      name: r.description,
      exchange: r.exchange,
      type: r.type,
      isInWatchlist: false,
    }));
  } catch (err) {
    console.error("Error in stock search:", err);
    return [];
  }
});

export type Quote = { c?: number; d?: number; dp?: number };

export async function getQuote(symbol: string): Promise<Quote | null> {
  try {
    return await fetchJSON<Quote>(`${FINNHUB_BASE_URL}/quote?symbol=${encodeURIComponent(symbol)}&token=${token()}`);
  } catch (e) {
    console.error("getQuote error", symbol, e);
    return null;
  }
}

export async function getCompanyName(symbol: string): Promise<string> {
  try {
    const p = await fetchJSON<ProfileResponse>(`${FINNHUB_BASE_URL}/stock/profile2?symbol=${encodeURIComponent(symbol)}&token=${token()}`, 3600);
    return p?.name || symbol.toUpperCase();
  } catch {
    return symbol.toUpperCase();
  }
}
