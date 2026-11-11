"use client";

import { memo } from "react";
import useTradingViewWidget from "@/hooks/useTradingViewWidget";
import { cn } from "@/lib/utils";

type Props = {
  title?: string;
  scriptUrl: string;
  config: Record<string, unknown>;
  height?: number;
  className?: string;
};

const TradingViewWidget = ({ title, scriptUrl, config, height = 600, className }: Props) => {
  const containerRef = useTradingViewWidget(scriptUrl, config, height);
  return (
    <div className="w-full">
      {title && <h3 className="mb-5 text-2xl font-semibold text-gray-100">{title}</h3>}
      <div className={cn("tradingview-widget-container", className)} ref={containerRef} />
    </div>
  );
};

export default memo(TradingViewWidget);
