import Logo from "@/components/Logo";
import NavItems from "@/components/NavItems";
import UserDropdown from "@/components/UserDropdown";
import { searchStocks } from "@/lib/actions/finnhub.actions";
import { getUserWatchlistSymbols } from "@/lib/actions/watchlist.actions";

export default async function Header({ user }: { user: { id: string; name: string; email: string } }) {
  const [initialStocks, watchlistSymbols] = await Promise.all([searchStocks(), getUserWatchlistSymbols()]);

  return (
    <header className="sticky top-0 z-40 border-b border-gray-700 bg-gray-800">
      <div className="container flex items-center justify-between py-4">
        <Logo />
        <nav className="hidden sm:block">
          <NavItems initialStocks={initialStocks} watchlistSymbols={watchlistSymbols} />
        </nav>
        <UserDropdown user={user} initialStocks={initialStocks} watchlistSymbols={watchlistSymbols} />
      </div>
    </header>
  );
}
