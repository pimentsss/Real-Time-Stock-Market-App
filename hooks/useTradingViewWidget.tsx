"use client";

import { useEffect, useRef } from "react";

// Injects a TradingView embed script into the container; cleans up on unmount/config change.
const useTradingViewWidget = (scriptUrl: string, config: Record<string, unknown>, height = 600) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const configKey = JSON.stringify(config);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.innerHTML = `<div class="tradingview-widget-container__widget" style="width: 100%; height: ${height}px;"></div>`;
    const script = document.createElement("script");
    script.src = scriptUrl;
    script.async = true;
    script.innerHTML = configKey;
    el.appendChild(script);
    return () => {
      el.innerHTML = "";
    };
  }, [scriptUrl, configKey, height]);

  return containerRef;
};

export default useTradingViewWidget;
