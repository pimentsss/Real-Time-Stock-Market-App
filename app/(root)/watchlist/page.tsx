import Link from "next/link";
import { Star } from "lucide-react";
import SearchCommand from "@/components/SearchCommand";
import WatchlistButton from "@/components/WatchlistButton";
import { getNews, searchStocks } from "@/lib/actions/finnhub.actions";
import { getWatchlistWithData } from "@/lib/actions/watchlist.actions";
import { formatChangePercent, formatPrice } from "@/lib/utils";

export default async function WatchlistPage() {
  const [items, initialStocks] = await Promise.all([getWatchlistWithData(), searchStocks()]);
  const symbols = items.map((i) => i.symbol);
  const news = await getNews(symbols).catch(() => []);

  return (
    <div className="flex flex-col gap-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-100">Watchlist</h1>
        <SearchCommand initialStocks={initialStocks} watchlistSymbols={symbols} />
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-lg border border-gray-600 bg-gray-800 p-12 text-center">
          <Star className="h-12 w-12 text-yellow-500" />
          <h2 className="text-xl font-semibold text-gray-100">Your watchlist is empty</h2>
          <p className="text-gray-500">Search for stocks and add them to track prices and get them in your daily news summary.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-600">
          <table className="w-full text-left">
            <thead className="bg-gray-700 text-sm text-gray-400">
              <tr>
                <th className="p-4" />
                <th className="p-4">Company</th>
                <th className="p-4">Symbol</th>
                <th className="p-4">Price</th>
                <th className="p-4">Change</th>
              </tr>
            </thead>
            <tbody>
              {items.map((i) => (
                <tr key={i.symbol} className="border-t border-gray-600 bg-gray-800 hover:bg-gray-700">
                  <td className="p-4"><WatchlistButton type="icon" symbol={i.symbol} company={i.company} isInWatchlist /></td>
                  <td className="p-4 font-medium text-gray-100"><Link href={`/stocks/${i.symbol}`} className="hover:text-yellow-500">{i.company}</Link></td>
                  <td className="p-4">{i.symbol}</td>
                  <td className="p-4 text-gray-100">{formatPrice(i.price)}</td>
                  <td className={`p-4 ${(i.changePercent ?? 0) >= 0 ? "text-teal-400" : "text-red-500"}`}>{formatChangePercent(i.changePercent)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {news.length > 0 && (
        <section className="flex flex-col gap-5">
          <h2 className="text-2xl font-semibold text-gray-100">News</h2>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {news.map((a) => (
              <a key={`${a.id}-${a.url}`} href={a.url} target="_blank" rel="noopener noreferrer" className="flex flex-col gap-2 rounded-lg border border-gray-600 bg-gray-800 p-5 hover:border-yellow-500">
                {a.related && <span className="w-fit rounded bg-gray-700 px-2 py-0.5 text-xs text-teal-400">{a.related}</span>}
                <h3 className="font-semibold text-gray-100">{a.headline}</h3>
                <p className="line-clamp-3 text-sm text-gray-500">{a.summary}</p>
                <span className="text-xs text-gray-500">{a.source} · {new Date(a.datetime * 1000).toLocaleDateString()}</span>
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
