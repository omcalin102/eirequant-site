import {
    Latest,
    ModelSelection,
    RiskGreeksDaily,
    TopDrivers,
    TickerLeaderboard,
    SectorHealthDaily,
    SectorPerf,
    GreekProxies,
    Consistency,
    Calibration,
    ByRegimePerf,
    OpsHealth,
    PauseOMeter,
    PolicyTrace,
    RegimeTimeline,
    RegimeTransitions,
    Catalog,
    EquityDocVariant,
    EquityNormalized,
    Status,
    SectorMap,
} from "./type";

const baseHref = () =>
    (typeof document !== "undefined"
        ? document.querySelector("base")?.getAttribute("href") || "/"
        : "/").replace(/\/+$/, "/");

const toUrl = (path: string) =>
    (baseHref() + path.replace(/^\//, "")).replace(/([^:]\/)\/+/g, "$1");

async function getJSON<T>(path: string, cache: RequestCache = "no-cache"): Promise<T | null> {
    try {
        const r = await fetch(toUrl(path), { cache });
        if (!r.ok) return null;
        return (await r.json()) as T;
    } catch {
        return null;
    }
}

let _latestDate: string | null = null;

export async function getLatestDate(): Promise<string | null> {
    if (_latestDate) return _latestDate;
    // try both locations
    const a = await getJSON<Latest>("/data/daily/latest.json");
    const b = a?.date ? null : await getJSON<Latest>("/data/latest.json");
    _latestDate = (a?.date ?? b?.date) ?? null;
    return _latestDate;
}

const withDate = (p: string, d?: string | null) => (d ? `${p}?v=${encodeURIComponent(d)}` : p);

// Daily
export async function getModelSelection(date?: string | null) {
    const d = date ?? (await getLatestDate());
    return await getJSON<ModelSelection>(withDate(`/data/daily/${d}/model_selection.json`, d));
}

export async function getDailyGreeks(date?: string | null) {
    const d = date ?? (await getLatestDate());
    return await getJSON<RiskGreeksDaily>(withDate(`/data/daily/${d}/risk_greeks.json`, d));
}

export async function getTopDrivers(date?: string | null) {
    const d = date ?? (await getLatestDate());
    return await getJSON<TopDrivers>(withDate(`/data/daily/${d}/top_drivers.json`, d));
}

export async function getTickerLeaders(date?: string | null) {
    const d = date ?? (await getLatestDate());
    return await getJSON<TickerLeaderboard>(withDate(`/data/daily/${d}/ticker_leaderboard.json`, d));
}

export async function getSectorHealth(date?: string | null) {
    const d = date ?? (await getLatestDate());
    return await getJSON<SectorHealthDaily>(withDate(`/data/daily/${d}/sector_health.json`, d));
}

export async function getPolicyTraceDaily(date?: string | null) {
    const d = date ?? (await getLatestDate());
    return await getJSON<PolicyTrace>(withDate(`/data/daily/${d}/pid_policy_trace.json`, d));
}

export async function getStatusDaily(date?: string | null) {
    const d = date ?? (await getLatestDate());
    return await getJSON<Status>(withDate(`/data/daily/${d}/status.json`, d));
}

// Pipeline status (non-dated)
export async function getPipelineStatus() {
    return await getJSON<Status>("/data/pipeline/status.json");
}

// Model-level (default model = eqx-m1)
export async function getCatalog(model = "eqx-m1") {
    return await getJSON<Catalog>(`/data/models/${model}/catalog.json`);
}

export async function getGreekProxies(model = "eqx-m1") {
    return await getJSON<GreekProxies>(`/data/models/${model}/greek_proxies.json`);
}

export async function getSectorPerf(model = "eqx-m1") {
    return await getJSON<SectorPerf>(`/data/models/${model}/sector_perf.json`);
}

export async function getConsistency(model = "eqx-m1") {
    return await getJSON<Consistency>(`/data/models/${model}/consistency.json`);
}

export async function getCalibration(model = "eqx-m1") {
    return await getJSON<Calibration>(`/data/models/${model}/calibration.json`);
}

export async function getByRegimePerf(model = "eqx-m1") {
    return await getJSON<ByRegimePerf>(`/data/models/${model}/by_regime_perf.json`);
}

export async function getPolicyTraceModel(model = "eqx-m1") {
    return await getJSON<PolicyTrace>(`/data/models/${model}/pid_policy_trace.json`);
}

export async function getOpsHealth(model = "eqx-m1") {
    return await getJSON<OpsHealth>(`/data/models/${model}/ops_health.json`);
}

export async function getPauseOMeter(model = "eqx-m1") {
    return await getJSON<PauseOMeter>(`/data/models/${model}/pause_o_meter.json`);
}

export async function getRegimeTimeline(model = "eqx-m1") {
    return await getJSON<RegimeTimeline>(`/data/models/${model}/regime_timeline.json`);
}

export async function getRegimeTransitions(model = "eqx-m1") {
    return await getJSON<RegimeTransitions>(`/data/models/${model}/regime_transitions.json`);
}

export async function getSectorMap() {
    return await getJSON<SectorMap>(`/data/universe/sector_map.json`);
}

// Equity windows
function equityPaths(win: string, model = "eqx-m1", cb = false) {
    const base = cb ? `equity_${win}_cb` : `equity_${win}`;
    const u = `/data/models/${model}/equity/${base}.json`;
    const h = `/data/models/${model}/equity/${base.replace(/_/g, "-")}.json`;
    return [u, h];
}

export async function getEquityWindowRaw(win: string, model = "eqx-m1", cb = false) {
    for (const p of equityPaths(win, model, cb)) {
        const d = await getJSON<EquityDocVariant>(p);
        if (d) return d;
    }
    return null;
}

const toTs = (x: any) => (typeof x === "number" ? x : +new Date(x) || 0);

export function normalizeEquity(doc: EquityDocVariant | null | undefined): EquityNormalized | null {
    if (!doc) return null;

    if ((doc as any).x && (doc as any).series) {
        const X = ((doc as any).x as any[]).map(toTs);
        const series = ((doc as any).series as any[]).map((s: any, i: number) => ({
            label: s?.name ?? s?.key ?? `Series ${i + 1}`,
            y: Array.isArray(s?.y) ? s.y.map((v: any) => Number(v)) : [],
        }));
        return { x: X, series };
    }

    const arr =
        (doc as any).model ??
        (doc as any).data ??
        (Array.isArray(doc) ? (doc as any) : null);
    if (Array.isArray(arr) && arr.length && Array.isArray(arr[0])) {
        const X: number[] = [];
        const Y: number[] = [];
        arr.forEach((p: any) => {
            X.push(toTs(p[0]));
            Y.push(Number(p[1]));
        });
        return { x: X, series: [{ label: "Series", y: Y }] };
    }

    const keys = Object.keys(doc as any);
    if (keys.length && Array.isArray((doc as any)[keys[0]])) {
        const labels = keys.slice(0, 2);
        const X: number[] = ((doc as any)[labels[0]] as any[]).map((p: any) => toTs(p.t ?? p.date ?? p[0]));
        const series = labels.map((k) => ({
            label: k,
            y: ((doc as any)[k] as any[]).map((p: any) => Number(p.v ?? p.value ?? p[1])),
        }));
        return { x: X, series };
    }

    return null;
}

// Fallback helpers
export async function safeTopDrivers(date?: string | null, model = "eqx-m1") {
    const d = date ?? (await getLatestDate());
    const daily = await getTopDrivers(d);
    if (daily?.drivers?.length) return daily;
    return await getJSON<TopDrivers>(`/data/models/${model}/top_drivers.json`);
}

export async function safeTickerLeaders(date?: string | null, model = "eqx-m1") {
    const d = date ?? (await getLatestDate());
    const daily = await getTickerLeaders(d);
    if (daily?.top?.length) return daily;
    return await getJSON<TickerLeaderboard>(`/data/models/${model}/ticker_leaderboard.json`);
}

export async function safeSectorHeat(date?: string | null, model = "eqx-m1") {
    const d = date ?? (await getLatestDate());
    const daily = await getSectorHealth(d);
    if (daily?.sectors?.length || daily?.leaders?.length) return { daily, modelPerf: null as SectorPerf | null };
    const perf = await getSectorPerf(model);
    return { daily: null as SectorHealthDaily | null, modelPerf: perf ?? null };
}

export async function safePolicyTrace(date?: string | null, model = "eqx-m1") {
    const d = date ?? (await getLatestDate());
    const daily = await getPolicyTraceDaily(d);
    if (daily?.trace?.length) return daily;
    return await getPolicyTraceModel(model);
}

// Expose a safe URL helper when needed in Astro scripts
export const api = {
    url: toUrl,
    baseHref,
    equityPaths,
};
