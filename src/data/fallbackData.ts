export const dashboardFallback = {
  asOf: "2026-09-12",
  timestamp: "2026-09-12T07:30:00Z",
  model: {
    name: "EQX-M1",
    family: "Experimental",
    confidence: 0.66,
    regime: "Neutral / selective",
    regimeConfidence: 0.71,
  },
  selections: [
    { ticker: "MSFT", action: "Add", signal: "Positive", score: 0.64, confidence: 0.68 },
    { ticker: "JPM", action: "Add", signal: "Positive", score: 0.57, confidence: 0.63 },
    { ticker: "XOM", action: "Hold", signal: "Neutral", score: 0.49, confidence: 0.58 },
    { ticker: "COST", action: "Hold", signal: "Neutral", score: 0.46, confidence: 0.56 },
  ],
  greeks: {
    delta: 0.34,
    gamma: 0.018,
    vega: 0.12,
    theta: -0.027,
  },
  sectors: [
    { sector: "Technology", score: 0.62, value: 0.62, leader: "MSFT" },
    { sector: "Industrials", score: 0.57, value: 0.57, leader: "GE" },
    { sector: "Financial Services", score: 0.54, value: 0.54, leader: "JPM" },
    { sector: "Energy", score: 0.49, value: 0.49, leader: "XOM" },
    { sector: "Healthcare", score: 0.46, value: 0.46, leader: "LLY" },
  ],
  tickerLeaders: [
    { ticker: "MSFT", omega: 1.31, hit_rate: 0.57, score: 0.64 },
    { ticker: "JPM", omega: 1.24, hit_rate: 0.55, score: 0.57 },
    { ticker: "GE", omega: 1.19, hit_rate: 0.54, score: 0.53 },
    { ticker: "XOM", omega: 1.12, hit_rate: 0.52, score: 0.49 },
    { ticker: "COST", omega: 1.08, hit_rate: 0.51, score: 0.46 },
  ],
  marketDrivers: [
    { type: "sector", sector: "Technology", value: 0.021, note: "Relative momentum" },
    { type: "sector", sector: "Industrials", value: 0.014, note: "Breadth improving" },
    { type: "ticker", ticker: "MSFT", value: 0.018, note: "Signal persistence" },
    { type: "ticker", ticker: "JPM", value: 0.011, note: "Stable factor mix" },
    { type: "news", title: "Rates, breadth and volatility remain the principal regime inputs", sentiment: 0.08 },
  ],
  operationalState: {
    status: "Research interface available",
    lastRun: "12 Sep 2026 · 07:30 UTC",
    trading: "No live execution",
    currentModel: "EQX-M1",
    modules: [
      { name: "Data ingest", status: "Ready", note: "Fallback path available" },
      { name: "Feature pipeline", status: "Ready", note: "Schema checks passing" },
      { name: "Model selection", status: "Research", note: "Representative output shown" },
      { name: "Risk controls", status: "Ready", note: "Constraints loaded" },
    ],
  },
  headlines: [
    "Rates and volatility remain central to the current research regime.",
    "Cross-sector breadth is mixed, with selective strength in technology and industrials.",
    "Portfolio construction continues to favour measured exposure and explicit uncertainty.",
  ],
} as const;

export type DashboardFallback = typeof dashboardFallback;
