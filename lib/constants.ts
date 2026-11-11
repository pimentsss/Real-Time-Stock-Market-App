export const NAV_ITEMS = [
  { href: "/", label: "Dashboard" },
  { href: "/search", label: "Search" },
  { href: "/watchlist", label: "Watchlist" },
];

export const INVESTMENT_GOALS = [
  { value: "Growth", label: "Growth" },
  { value: "Income", label: "Income" },
  { value: "Balanced", label: "Balanced" },
  { value: "Conservative", label: "Conservative" },
];

export const RISK_TOLERANCE_OPTIONS = [
  { value: "Low", label: "Low" },
  { value: "Medium", label: "Medium" },
  { value: "High", label: "High" },
];

export const PREFERRED_INDUSTRIES = [
  { value: "Technology", label: "Technology" },
  { value: "Healthcare", label: "Healthcare" },
  { value: "Finance", label: "Finance" },
  { value: "Energy", label: "Energy" },
  { value: "Consumer Goods", label: "Consumer Goods" },
];

export const POPULAR_STOCK_SYMBOLS = [
  "AAPL", "MSFT", "GOOGL", "AMZN", "TSLA", "META", "NVDA", "NFLX", "ORCL", "CRM",
];

// ---------- TradingView widget configs ----------
const DARK = {
  colorTheme: "dark",
  isTransparent: true,
  locale: "en",
  backgroundColor: "#141414",
} as const;

export const MARKET_OVERVIEW_WIDGET_CONFIG = {
  ...DARK,
  dateRange: "12M",
  showChart: true,
  width: "100%",
  height: 600,
  largeChartUrl: "",
  showSymbolLogo: true,
  showFloatingTooltip: true,
  plotLineColorGrowing: "#0FEDBE",
  plotLineColorFalling: "#0FEDBE",
  gridLineColor: "rgba(240, 243, 250, 0)",
  scaleFontColor: "#DBDBDB",
  belowLineFillColorGrowing: "rgba(41, 98, 255, 0.12)",
  belowLineFillColorFalling: "rgba(41, 98, 255, 0.12)",
  symbolActiveColor: "rgba(15, 237, 190, 0.05)",
  tabs: [
    {
      title: "Financial",
      symbols: [
        { s: "NYSE:JPM", d: "JPMorgan Chase" },
        { s: "NYSE:WFC", d: "Wells Fargo" },
        { s: "NYSE:BAC", d: "Bank of America" },
        { s: "NYSE:HSBC", d: "HSBC Holdings" },
        { s: "NYSE:C", d: "Citigroup" },
        { s: "NYSE:MA", d: "Mastercard" },
      ],
    },
    {
      title: "Technology",
      symbols: [
        { s: "NASDAQ:AAPL", d: "Apple" },
        { s: "NASDAQ:GOOGL", d: "Alphabet" },
        { s: "NASDAQ:MSFT", d: "Microsoft" },
        { s: "NASDAQ:META", d: "Meta Platforms" },
        { s: "NYSE:ORCL", d: "Oracle" },
        { s: "NASDAQ:INTC", d: "Intel" },
      ],
    },
    {
      title: "Services",
      symbols: [
        { s: "NASDAQ:AMZN", d: "Amazon" },
        { s: "NYSE:BABA", d: "Alibaba" },
        { s: "NYSE:T", d: "AT&T" },
        { s: "NYSE:WMT", d: "Walmart" },
        { s: "NYSE:V", d: "Visa" },
      ],
    },
  ],
};

export const HEATMAP_WIDGET_CONFIG = {
  ...DARK,
  dataSource: "SPX500",
  blockSize: "market_cap_basic",
  blockColor: "change",
  grouping: "sector",
  hasTopBar: false,
  isDataSetEnabled: false,
  isZoomEnabled: true,
  hasSymbolTooltip: true,
  isMonoSize: false,
  width: "100%",
  height: "600",
};

export const TOP_STORIES_WIDGET_CONFIG = {
  ...DARK,
  displayMode: "regular",
  feedMode: "market",
  market: "stock",
  width: "100%",
  height: "600",
};

export const MARKET_DATA_WIDGET_CONFIG = {
  ...DARK,
  title: "Stocks",
  width: "100%",
  height: 600,
  showSymbolLogo: true,
  symbolsGroups: [
    {
      name: "Financial",
      symbols: [
        { name: "NYSE:JPM", displayName: "JPMorgan Chase" },
        { name: "NYSE:WFC", displayName: "Wells Fargo Co New" },
        { name: "NYSE:BAC", displayName: "Bank Amer Corp" },
        { name: "NYSE:HSBC", displayName: "Hsbc Hldgs Plc" },
        { name: "NYSE:C", displayName: "Citigroup Inc" },
        { name: "NYSE:MA", displayName: "Mastercard Incorporated" },
      ],
    },
    {
      name: "Technology",
      symbols: [
        { name: "NASDAQ:AAPL", displayName: "Apple" },
        { name: "NASDAQ:GOOGL", displayName: "Alphabet" },
        { name: "NASDAQ:MSFT", displayName: "Microsoft" },
        { name: "NASDAQ:FB", displayName: "Meta Platforms" },
        { name: "NYSE:ORCL", displayName: "Oracle Corp" },
        { name: "NASDAQ:INTC", displayName: "Intel Corp" },
      ],
    },
    {
      name: "Services",
      symbols: [
        { name: "NASDAQ:AMZN", displayName: "Amazon" },
        { name: "NYSE:BABA", displayName: "Alibaba Group Hldg Ltd" },
        { name: "NYSE:T", displayName: "At&t Inc" },
        { name: "NYSE:WMT", displayName: "Walmart Inc" },
        { name: "NYSE:V", displayName: "Visa" },
      ],
    },
  ],
};

export const SYMBOL_INFO_WIDGET_CONFIG = (symbol: string) => ({
  ...DARK,
  symbol: symbol.toUpperCase(),
  width: "100%",
  height: 170,
});

export const CANDLE_CHART_WIDGET_CONFIG = (symbol: string) => ({
  ...DARK,
  allow_symbol_change: false,
  calendar: false,
  details: true,
  hide_side_toolbar: true,
  hide_top_toolbar: false,
  hide_legend: false,
  hide_volume: false,
  hotlist: false,
  interval: "D",
  save_image: false,
  style: 1,
  symbol: symbol.toUpperCase(),
  theme: "dark",
  timezone: "Etc/UTC",
  backgroundColor: "#141414",
  gridColor: "#141414",
  watchlist: [],
  withdateranges: false,
  compareSymbols: [],
  studies: [],
  width: "100%",
  height: 600,
});

export const BASELINE_WIDGET_CONFIG = (symbol: string) => ({
  ...CANDLE_CHART_WIDGET_CONFIG(symbol),
  style: 10,
});

export const TECHNICAL_ANALYSIS_WIDGET_CONFIG = (symbol: string) => ({
  ...DARK,
  symbol: symbol.toUpperCase(),
  interval: "1h",
  largeChartUrl: "",
  width: "100%",
  height: 400,
  showIntervalTabs: true,
  displayMode: "single",
});

export const COMPANY_PROFILE_WIDGET_CONFIG = (symbol: string) => ({
  ...DARK,
  symbol: symbol.toUpperCase(),
  width: "100%",
  height: 440,
});

export const COMPANY_FINANCIALS_WIDGET_CONFIG = (symbol: string) => ({
  ...DARK,
  symbol: symbol.toUpperCase(),
  width: "100%",
  height: 464,
  displayMode: "regular",
});

export const TV = (name: string) => `https://s3.tradingview.com/external-embedding/embed-widget-${name}.js`;
