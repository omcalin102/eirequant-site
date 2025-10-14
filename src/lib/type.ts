// Minimal, flexible shapes for our JSONs

export type ISODate = string;

export interface Latest {
    date?: ISODate;
}

export interface Selection {
    ticker: string;
    action?: string;
    conf?: number;
    confidence?: number;
    rationale?: string;
}
export interface ModelSelection {
    date?: ISODate;
    selections?: Selection[];
}

export interface RiskGreeksDaily {
    date?: ISODate;
    delta?: number; Delta?: number;
    gamma?: number; Gamma?: number;
    nu?: number; v?: number; Vega?: number;
}

export type DriverRow = { name?: string; score?: number } | [string, number];
export interface TopDrivers {
    date?: ISODate;
    drivers?: DriverRow[];
}

export type LeaderRow = { ticker?: string; score?: number } | [string, number];
export interface TickerLeaderboard {
    date?: ISODate;
    leaders?: LeaderRow[];
    top?: LeaderRow[]; // daily variant
}

export type SectorRow =
    | { sector?: string; name?: string; score?: number; value?: number; ret?: number }
    | [string, number];

export interface SectorHealthDaily {
    date?: ISODate;
    leaders?: SectorRow[];
    sectors?: SectorRow[];
}

export interface SectorPerf {
    date?: ISODate;
    sectors?: SectorRow[];
}

export interface GreekProxies {
    Delta?: number; Gamma?: number; Vega?: number;
    delta?: number; gamma?: number; nu?: number; v?: number;
}

export interface Consistency {
    [k: string]: unknown;
}

export interface Calibration {
    ECE?: number; ece?: number;
    Bins?: number; bins?: number;
}

export interface ByRegimePerf {
    [regime: string]: unknown;
}

export interface OpsHealth {
    env?: string;
    ok?: boolean;
    generated_at?: string;
    notes?: string | string[];
    [k: string]: unknown;
}

export interface PauseOMeter {
    [k: string]: unknown;
}

export interface PolicyTrace {
    date?: ISODate;
    trace?: number[] | Array<number | string | null>;
}

export interface RegimeTimeline {
    timeline?: Array<{ date?: ISODate; regime?: string }>;
    [k: string]: unknown;
}

export interface RegimeTransitions {
    transitions?: Array<{ from?: string; to?: string; date?: ISODate }>;
    [k: string]: unknown;
}

export interface Catalog {
    [k: string]: unknown;
}

export interface Status {
    status?: string; state?: string;
    last_run?: ISODate; last?: ISODate; date?: ISODate; as_of?: ISODate;
    trading?: boolean | "true" | "false";
    current_model?: string; model?: string;
    message?: string;
}

export interface SectorMap {
    [sector: string]: string[];
}

// Equity variants we’ve seen
export type EquityDocVariant =
    | any[] // [[t,v], ...]
    | {
        model?: any[];        // [[t,v], ...]
        benchmark?: any[];    // optional
        data?: any[];         // [[t,v], ...]
        x?: any[]; y?: any[]; // x/y arrays
        series?: Array<{ name?: string; key?: string; y?: number[] }>;
        [k: string]: unknown; // object-of-arrays variant
    };

export interface EquityLine {
    label: string;
    y: number[];
}
export interface EquityNormalized {
    x: number[];
    series: EquityLine[];
}
