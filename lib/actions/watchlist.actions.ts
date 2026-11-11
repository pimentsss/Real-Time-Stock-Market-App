"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { connectToDatabase } from "@/database/mongoose";
import { Watchlist } from "@/database/models/watchlist.model";
import { getAuth } from "@/lib/better-auth/auth";
import { getQuote } from "@/lib/actions/finnhub.actions";

const SYMBOL_RE = /^[A-Z0-9.\-:]{1,20}$/;

const requireUserId = async () => {
  const auth = await getAuth();
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Not authenticated");
  return session.user.id;
};

// Used by the daily news job (no session there).
export async function getWatchlistSymbolsByEmail(email: string): Promise<string[]> {
  if (!email) return [];
  try {
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) throw new Error("MongoDB connection not found");
    const user = await db.collection("user").findOne<{ _id?: unknown; id?: string }>({ email });
    if (!user) return [];
    const userId = (user.id as string) || String(user._id ?? "");
    if (!userId) return [];
    const items = await Watchlist.find({ userId }, { symbol: 1 }).lean();
    return items.map((i) => String(i.symbol));
  } catch (err) {
    console.error("getWatchlistSymbolsByEmail error:", err);
    return [];
  }
}

export async function getUserWatchlistSymbols(): Promise<string[]> {
  try {
    const userId = await requireUserId();
    await connectToDatabase();
    const items = await Watchlist.find({ userId }, { symbol: 1 }).lean();
    return items.map((i) => String(i.symbol));
  } catch {
    return [];
  }
}

export async function addToWatchlist(symbol: string, company: string) {
  const sym = symbol.trim().toUpperCase();
  if (!SYMBOL_RE.test(sym)) return { success: false, error: "Invalid symbol" };
  try {
    const userId = await requireUserId();
    await connectToDatabase();
    await Watchlist.updateOne(
      { userId, symbol: sym },
      { $setOnInsert: { userId, symbol: sym, company: company.trim().slice(0, 200) || sym, addedAt: new Date() } },
      { upsert: true },
    );
    revalidatePath("/watchlist");
    return { success: true };
  } catch (e) {
    console.error("addToWatchlist error:", e);
    return { success: false, error: "Failed to add to watchlist" };
  }
}

export async function removeFromWatchlist(symbol: string) {
  try {
    const userId = await requireUserId();
    await connectToDatabase();
    await Watchlist.deleteOne({ userId, symbol: symbol.trim().toUpperCase() });
    revalidatePath("/watchlist");
    return { success: true };
  } catch (e) {
    console.error("removeFromWatchlist error:", e);
    return { success: false, error: "Failed to remove from watchlist" };
  }
}

export async function getWatchlistWithData() {
  const userId = await requireUserId();
  await connectToDatabase();
  const items = await Watchlist.find({ userId }).sort({ addedAt: -1 }).lean();
  return Promise.all(
    items.map(async (i) => {
      const q = await getQuote(i.symbol);
      return {
        symbol: i.symbol,
        company: i.company,
        addedAt: i.addedAt.toISOString(),
        price: q?.c,
        change: q?.d,
        changePercent: q?.dp,
      };
    }),
  );
}
