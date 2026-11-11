import TradingViewWidget from "@/components/TradingViewWidget";
import WatchlistButton from "@/components/WatchlistButton";
import { getCompanyName } from "@/lib/actions/finnhub.actions";
import { getUserWatchlistSymbols } from "@/lib/actions/watchlist.actions";
import {
  BASELINE_WIDGET_CONFIG,
  CANDLE_CHART_WIDGET_CONFIG,
  COMPANY_FINANCIALS_WIDGET_CONFIG,
  COMPANY_PROFILE_WIDGET_CONFIG,
  SYMBOL_INFO_WIDGET_CONFIG,
  TECHNICAL_ANALYSIS_WIDGET_CONFIG,
  TV,
} from "@/lib/constants";

export default async function StockDetails({ params }: { params: Promise<{ symbol: string }> }) {
  const { symbol: raw } = await params;
  const symbol = decodeURIComponent(raw).toUpperCase();
  const [company, watchlist] = await Promise.all([getCompanyName(symbol), getUserWatchlistSymbols()]);

  return (
    <div className="flex min-h-screen p-4 md:p-6 lg:p-8">
      <section className="grid w-full grid-cols-1 gap-8 xl:grid-cols-2">
        <div className="flex flex-col gap-6">
          <TradingViewWidget scriptUrl={TV("symbol-info")} config={SYMBOL_INFO_WIDGET_CONFIG(symbol)} height={170} />
          <TradingViewWidget scriptUrl={TV("advanced-chart")} config={CANDLE_CHART_WIDGET_CONFIG(symbol)} className="custom-chart" height={600} />
          <TradingViewWidget scriptUrl={TV("advanced-chart")} config={BASELINE_WIDGET_CONFIG(symbol)} className="custom-chart" height={600} />
        </div>
        <div className="flex flex-col gap-6">
          <WatchlistButton symbol={symbol} company={company} isInWatchlist={watchlist.includes(symbol)} />
          <TradingViewWidget scriptUrl={TV("technical-analysis")} config={TECHNICAL_ANALYSIS_WIDGET_CONFIG(symbol)} height={400} />
          <TradingViewWidget scriptUrl={TV("symbol-profile")} config={COMPANY_PROFILE_WIDGET_CONFIG(symbol)} height={440} />
          <TradingViewWidget scriptUrl={TV("financials")} config={COMPANY_FINANCIALS_WIDGET_CONFIG(symbol)} height={464} />
        </div>
      </section>
    </div>
  );
}
