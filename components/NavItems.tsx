"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/constants";
import SearchCommand from "@/components/SearchCommand";
import type { StockWithWatchlistStatus } from "@/lib/actions/finnhub.actions";

export default function NavItems({ initialStocks, watchlistSymbols }: { initialStocks: StockWithWatchlistStatus[]; watchlistSymbols: string[] }) {
  const pathname = usePathname();
  const isActive = (path: string) => (path === "/" ? pathname === "/" : pathname.startsWith(path));

  return (
    <ul className="flex flex-col gap-3 p-2 font-medium sm:flex-row sm:gap-10">
      {NAV_ITEMS.map(({ href, label }) =>
        href === "/search" ? (
          <li key="search-trigger">
            <SearchCommand renderAs="text" label="Search" initialStocks={initialStocks} watchlistSymbols={watchlistSymbols} />
          </li>
        ) : (
          <li key={href}>
            <Link href={href} className={`hover:text-yellow-500 transition-colors ${isActive(href) ? "text-gray-100" : ""}`}>
              {label}
            </Link>
          </li>
        ),
      )}
    </ul>
  );
}
