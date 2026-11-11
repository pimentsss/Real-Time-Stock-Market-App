import TradingViewWidget from "@/components/TradingViewWidget";
import {
  HEATMAP_WIDGET_CONFIG,
  MARKET_DATA_WIDGET_CONFIG,
  MARKET_OVERVIEW_WIDGET_CONFIG,
  TOP_STORIES_WIDGET_CONFIG,
  TV,
} from "@/lib/constants";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col gap-8">
      <section className="grid w-full gap-8 md:grid-cols-2 xl:grid-cols-3">
        <div className="md:col-span-1 xl:col-span-1">
          <TradingViewWidget title="Market Overview" scriptUrl={TV("market-overview")} config={MARKET_OVERVIEW_WIDGET_CONFIG} className="custom-chart" height={600} />
        </div>
        <div className="md:col-span-1 xl:col-span-2">
          <TradingViewWidget title="Stock Heatmap" scriptUrl={TV("stock-heatmap")} config={HEATMAP_WIDGET_CONFIG} height={600} />
        </div>
      </section>
      <section className="grid w-full gap-8 md:grid-cols-2 xl:grid-cols-3">
        <div className="h-full md:col-span-1 xl:col-span-1">
          <TradingViewWidget scriptUrl={TV("timeline")} config={TOP_STORIES_WIDGET_CONFIG} height={600} />
        </div>
        <div className="h-full md:col-span-1 xl:col-span-2">
          <TradingViewWidget scriptUrl={TV("market-quotes")} config={MARKET_DATA_WIDGET_CONFIG} height={600} />
        </div>
      </section>
    </div>
  );
}
