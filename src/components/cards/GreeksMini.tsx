import React, { useEffect, useState } from "react";

type Latest = { date?: string };

type DailyGreeks =
    | { delta?: number; gamma?: number; nu?: number; vega?: number; theta?: number; Delta?: number; Gamma?: number; Vega?: number; Theta?: number }
    | { stats?: Record<string, number>; summary?: Record<string, number>; portfolio?: Record<string, number> }
    | Record<string, any>;

type ProxyPoint = { delta?: number; gamma?: number; vega?: number; theta?: number; nu?: number; Delta?: number; Gamma?: number; Vega?: number; Theta?: number };
type Proxies = { proxies?: ProxyPoint[] } | ProxyPoint[] | Record<string, any>;

const baseHref = () => (document.querySelector("base")?.getAttribute("href") || "/").replace(/\/+$/, "/");
async function getJSON<T>(relPath: string): Promise<T | null> {
    const url = baseHref() + relPath.replace(/^\//, "");
    try { const r = await fetch(url, { cache: "no-cache" }); if (!r.ok) return null; return (await r.json()) as T; }
    catch { return null; }
}

const fmt = (n: number | null | undefined, d = 3) => (typeof n === "number" && isFinite(n) ? n.toFixed(d) : "—");

const pickFin = (...xs: any[]): number | null => {
    for (const x of xs) { const v = Number(x); if (Number.isFinite(v)) return v; }
    return null;
};

function extractDailyGreeks(doc: DailyGreeks | null) {
    if (!doc || typeof doc !== "object") return { delta: null, gamma: null, vega: null, theta: null };
    const g: Record<string, any> = { ...(doc as any), ...(doc as any).portfolio, ...(doc as any).stats, ...(doc as any).summary };
    return {
        delta: pickFin(g.delta, g.Delta, g.beta, g.beta_median, g.delta_median),
        gamma: pickFin(g.gamma, g.Gamma, g.gamma_median),
        vega: pickFin(g.nu, g.Vega, g.vega, g.vega_median),
        theta: pickFin(g.theta, g.Theta, g.theta_median),
    };
}

function extractProxyGreeks(doc: Proxies | null) {
    if (!doc) return { delta: null, gamma: null, vega: null, theta: null };
    const arr: ProxyPoint[] = Array.isArray((doc as any)?.proxies) ? (doc as any).proxies : Array.isArray(doc) ? (doc as any) : [doc as any];
    const last = arr.length ? arr[arr.length - 1] : null;
    if (!last) return { delta: null, gamma: null, vega: null, theta: null };
    return {
        delta: pickFin(last.delta, last.Delta),
        gamma: pickFin(last.gamma, last.Gamma),
        vega: pickFin(last.nu, last.Vega, last.vega),
        theta: pickFin(last.theta, last.Theta),
    };
}

export default function GreeksMini() {
    const [date, setDate] = useState<string | null>(null);
    const [delta, setDelta] = useState<number | null>(null);
    const [gamma, setGamma] = useState<number | null>(null);
    const [vega, setVega] = useState<number | null>(null);
    const [theta, setTheta] = useState<number | null>(null);

    useEffect(() => {
        (async () => {
            const latest = await getJSON<Latest>("/data/latest.json");
            const d = latest?.date ?? null;
            setDate(d);

            let dGreeks = { delta: null, gamma: null, vega: null, theta: null };
            if (d) {
                const daily = await getJSON<DailyGreeks>(`/data/daily/${d}/risk_greeks.json?v=${encodeURIComponent(d)}`);
                dGreeks = extractDailyGreeks(daily);
            }

            if ([dGreeks.delta, dGreeks.gamma, dGreeks.vega, dGreeks.theta].some(v => v === null)) {
                const proxies = await getJSON<Proxies>("/data/models/eqx-m1/greek_proxies.json");
                const p = extractProxyGreeks(proxies);
                dGreeks = {
                    delta: dGreeks.delta ?? p.delta,
                    gamma: dGreeks.gamma ?? p.gamma,
                    vega: dGreeks.vega ?? p.vega,
                    theta: dGreeks.theta ?? p.theta,
                };
            }

            setDelta(dGreeks.delta);
            setGamma(dGreeks.gamma);
            setVega(dGreeks.vega);
            setTheta(dGreeks.theta);
        })();
    }, []);

    return (
        <>
            <div className="greek-grid" aria-live="polite">
                <div className="greek-box"><div className="greek-sym">Delta</div><div className="greek-val">{fmt(delta)}</div></div>
                <div className="greek-box"><div className="greek-sym">Gamma</div><div className="greek-val">{fmt(gamma)}</div></div>
                <div className="greek-box"><div className="greek-sym">Vega</div><div className="greek-val">{fmt(vega)}</div></div>
                <div className="greek-box"><div className="greek-sym">Theta</div><div className="greek-val">{fmt(theta)}</div></div>
            </div>
            <div className="muted note">
                Daily medians where available; otherwise model proxies.
                <button type="button" className="help-dot" data-tip="Greeks summarise portfolio exposures; values prefer daily medians, falling back to model proxies.">?</button>
                <span className="card-sub">{date ?? "—"}</span>
            </div>
        </>
    );
}
