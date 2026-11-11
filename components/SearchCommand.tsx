"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import { Command } from "cmdk";
import { Loader2, Search, Star, TrendingUp } from "lucide-react";
import { searchStocks, type StockWithWatchlistStatus } from "@/lib/actions/finnhub.actions";
import { useDebounce } from "@/hooks/useDebounce";

type Props = {
  renderAs?: "button" | "text";
  label?: string;
  initialStocks: StockWithWatchlistStatus[];
  watchlistSymbols?: string[];
};

export default function SearchCommand({ renderAs = "button", label = "Add stock", initialStocks, watchlistSymbols = [] }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [stocks, setStocks] = useState(initialStocks);

  const isSearchMode = !!searchTerm.trim();
  const displayStocks = isSearchMode ? stocks : stocks.slice(0, 10);
  const inWatchlist = new Set(watchlistSymbols);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const handleSearch = async () => {
    if (!isSearchMode) return setStocks(initialStocks);
    setLoading(true);
    try {
      setStocks(await searchStocks(searchTerm.trim()));
    } catch {
      setStocks([]);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = useDebounce(handleSearch, 300);
  useEffect(() => { debouncedSearch(); }, [searchTerm, debouncedSearch]);

  const handleSelect = () => {
    setOpen(false);
    setSearchTerm("");
    setStocks(initialStocks);
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        {renderAs === "text" ? (
          <button className="cursor-pointer hover:text-yellow-500">{label}</button>
        ) : (
          <button className="yellow-btn w-auto px-5 h-10">{label}</button>
        )}
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60" />
        <Dialog.Content className="fixed left-1/2 top-[15%] z-50 w-[calc(100%-32px)] max-w-2xl -translate-x-1/2 overflow-hidden rounded-lg border border-gray-600 bg-gray-800 shadow-xl">
          <Dialog.Title className="sr-only">Search stocks</Dialog.Title>
          <Command shouldFilter={false}>
            <div className="flex items-center gap-2 border-b border-gray-600 px-4">
              <Search className="h-4 w-4 text-gray-500" />
              <Command.Input
                value={searchTerm}
                onValueChange={setSearchTerm}
                placeholder="Search stocks..."
                className="h-14 flex-1 bg-transparent text-white outline-none placeholder:text-gray-500"
              />
              {loading && <Loader2 className="h-4 w-4 animate-spin text-gray-500" />}
            </div>
            <Command.List className="max-h-[400px] overflow-y-auto p-2">
              {loading ? (
                <Command.Empty className="p-6 text-center text-gray-500">Loading stocks...</Command.Empty>
              ) : displayStocks.length === 0 ? (
                <div className="p-6 text-center text-gray-500">{isSearchMode ? "No results found" : "No stocks available"}</div>
              ) : (
                <>
                  <div className="px-2 py-2 text-sm text-gray-500">
                    {isSearchMode ? "Search results" : "Popular stocks"} ({displayStocks.length})
                  </div>
                  {displayStocks.map((stock) => (
                    <Command.Item
                      key={stock.symbol}
                      value={stock.symbol}
                      onSelect={() => { router.push(`/stocks/${stock.symbol}`); handleSelect(); }}
                      className="rounded-md data-[selected=true]:bg-gray-700"
                    >
                      <div className="flex cursor-pointer items-center gap-3 px-3 py-3">
                        <TrendingUp className="h-4 w-4 text-gray-500" />
                        <div className="flex-1">
                          <div className="font-medium text-gray-100">{stock.name}</div>
                          <div className="text-sm text-gray-500">{stock.symbol} | {stock.exchange} | {stock.type}</div>
                        </div>
                        {inWatchlist.has(stock.symbol) && <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />}
                      </div>
                    </Command.Item>
                  ))}
                </>
              )}
            </Command.List>
          </Command>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
