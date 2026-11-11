"use client";

import { useState, useTransition } from "react";
import { Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { addToWatchlist, removeFromWatchlist } from "@/lib/actions/watchlist.actions";

type Props = { symbol: string; company: string; isInWatchlist: boolean; type?: "button" | "icon" };

export default function WatchlistButton({ symbol, company, isInWatchlist, type = "button" }: Props) {
  const [added, setAdded] = useState(isInWatchlist);
  const [pending, startTransition] = useTransition();

  const toggle = () =>
    startTransition(async () => {
      const next = !added;
      setAdded(next); // optimistic
      const res = next ? await addToWatchlist(symbol, company) : await removeFromWatchlist(symbol);
      if (!res.success) {
        setAdded(!next);
        toast.error(res.error ?? "Something went wrong");
      } else {
        toast.success(next ? `${symbol} added to watchlist` : `${symbol} removed from watchlist`);
      }
    });

  if (type === "icon")
    return (
      <button onClick={toggle} disabled={pending} aria-label={added ? `Remove ${symbol} from watchlist` : `Add ${symbol} to watchlist`} className="cursor-pointer p-1 disabled:opacity-50">
        <Star className={`h-5 w-5 ${added ? "fill-yellow-400 text-yellow-400" : "text-gray-500"}`} />
      </button>
    );

  return (
    <button
      onClick={toggle}
      disabled={pending}
      className={added
        ? "flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-red-500 font-medium text-white hover:opacity-90 disabled:opacity-60"
        : "yellow-btn flex items-center justify-center gap-2"}
    >
      {added ? <><Trash2 className="h-4 w-4" /> Remove from Watchlist</> : <><Star className="h-4 w-4" /> Add to Watchlist</>}
    </button>
  );
}
