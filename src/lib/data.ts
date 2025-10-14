// Canonical types used across the site

export type Latest = { date: string };

export type ModelSelection = {
    run_date?: string;
    series?: string;
    environment?: string;
    model_id?: string;
    regime?: string;
    vol_bucket?: string;
    confidence?: number;
    constraints?: Record<string, any>;
    rationale?: string;
};

export type RiskGreeksDaily = {
    stats?: {
        beta_median?: number;
        gamma_median?: number;
        vega_median?: number;
        theta_median?: number;
    };
    summary?: Record<string, any>;
};

export type GreekProxyPoint = {
    delta?: number;
    gamma?: number;
    vega?: number;
    theta?: number;
    as_of?: string;
    note?: string;
};
export type GreekProxies = { proxies?: GreekProxyPoint[] };

export type Driver =
    | { type: "sector"; sector?: string; value?: number; note?: string; comment?: string }
    | { type: "ticker"; ticker?: string; value?: number; note?: string; comment?: string }
    | { type: "news"; title?: string; source?: string; sentiment?: number; comment?: string }
    | Record<string, any>;
export type TopDrivers = { drivers?: Driver[]; generated_at?: string; sim_date?: string };

export type TickerLeader = { ticker?: string; omega?: number; hit_rate?: number; trades?: number };
export type TickerLeaderboard = { top?: TickerLeader[]; bottom?: TickerLeader[] };

export type DailySector = {
    sector?: string;
    n_names?: number;
    median_beta?: number;
    median_mcap?: number;
    median_liquidity?: number;
    top_names?: { symbol?: string; name?: string; market_cap?: number }[];
};
export type SectorHealthDaily = { run_date?: string; sectors?: DailySector[] };

export type SectorPerfRow = {
    sector?: string;
    contribution?: number;
    omega?: number;
    hit_rate?: number;
    avg_return?: number;
    trades?: number;
};
export type SectorPerf = { sectors?: SectorPerfRow[] };

export type Consistency = {
    top_win_streaks?: { length?: number; end_date?: string }[];
    portfolio?: {
        max_loss_streak?: number;
        max_drawdown?: number;
        longest_flat?: number;
        win_rate?: number;
    };
};

export type Calibration = {
    ece?: number;
    bins?: { p?: number; o?: number; n?: number }[];
    badge?: string;
};

export type ByRegimePerf = {
    pid_by_regime?: Record<
        string,
        { cagr?: number; vol?: number; sharpe?: number; maxdd?: number; winr?: number; trades?: number; n?: number }
    >;
};

export type OpsHealth = { modules?: { name?: string; status?: "ok" | "warn" | "error"; note?: string }[] };

export type PauseOMeter = {
    current_30d?: { paused?: boolean; reason?: string; score?: number };
    items?: { date?: string; reason?: string; score?: number }[];
};

export type PolicyTrace = { trace?: { t?: number | string; p?: number; i?: number; d?: number; control?: number }[] };

export type RegimeTimeline = { timeline?: { start?: string; end?: string; label?: string }[] };
export type RegimeTransitions = { transitions?: { from?: string; to?: string; count?: number }[] };

export type CatalogItem = { key?: string; label?: string; kind?: string; href?: string; note?: string };
export type Catalog = { items?: CatalogItem[] };

export type EquityDocVariant =
    | { x?: string[]; series?: { key?: string; name?: string; y?: number[] }[]; title?: string; window?: string }
    | { model?: [string | number, number][] } // [[t,v]]
    | [string | number, number][] // [[t,v]]
    | { data?: [string | number, number][] }
    | { [label: string]: { t?: string | number; v?: number }[] };

export type EquityNormalized = {
    x: number[];
    series: { label: string; y: number[] }[];
};

export type Status = {
    trading?: boolean;
    last_run?: string;
    message?: string;
};

export type SectorMap = Record<string, { sector?: string; industry?: string }>;
