import React, { useEffect, useMemo, useState } from "react";
import { SectorHealthDaily, SectorPerf } from "../../lib/type";
import { getLatestDate, safeSectorHeat } from "../../lib/api";

type Row = { name: string; badge?: string; metric?: number | null; metricLabel: string; _score: number };
const num = (v: any) => (typeof v === "number" && isFinite(v) ? v : null);
const isKnown = (n: any) => typeof n === "string" && !/^unk/i.test(n.trim());

function score(s: any) {
    if (typeof s?.contribution === "number") return s.contribution;
    if (typeof s?.omega === "number") return Math.log(Math.max(1e-9, s.omega));
    if (typeof s?.median_beta === "number") return -s.median_beta;
    if (typeof s?.ret === "number") return s.ret;
    if (typeof s?.score === "number") return s.score;
    if (typeof s?.value === "number") return s.value;
    return 0;
}

export default function SectorHeatMini() {
    const [daily, setDaily] = useState<SectorHealthDaily | null>(null);
    const [perf, setPerf] = useState<SectorPerf | null>(null);

    useEffect(() => {
        (async () => {
            const d = await getLatestDate();
            const { daily, modelPerf } = await safeSectorHeat(d, "eqx-m1");
            setDaily(daily ?? null);
            setPerf(modelPerf ?? null);
        })();
    }, []);

    const rows: Row[] = useMemo(() => {
        if (daily) {
            const srcA: Row[] = Array.isArray((daily as any).sectors)
                ? (daily as any).sectors.map((s: any) => ({
                    name: s.sector ?? s.name ?? "—",
                    badge: s.top_names?.[0]?.symbol ?? "",
                    metric: num(s.median_beta),
                    metricLabel: "Beta",
                    _score: score(s),
                }))
                : [];
            const srcB: Row[] = Array.isArray((daily as any).leaders)
                ? (daily as any).leaders.map((s: any) => ({
                    name: s.sector ?? s.name ?? "—",
                    badge: "",
                    metric: num(s.score ?? s.value),
                    metricLabel: "Score",
                    _score: score(s),
                }))
                : [];
            const combined = [...srcA, ...srcB].filter(r => isKnown(r.name));
            if (combined.length) return combined.sort((a, b) => b._score - a._score).slice(0, 8);
        }
        const m: Row[] = Array.isArray(perf?.sectors)
            ? (perf!.sectors as any[]).map((s: any) => ({
                name: s.sector ?? s.name ?? "—",
                badge: "",
                metric: num(s.omega ?? s.contribution ?? s.ret ?? s.score),
                metricLabel: typeof s.omega === "number" ? "Omega" : "Contrib",
                _score: score(s),
            }))
            : [];
        return m.filter(r => isKnown(r.name)).sort((a, b) => b._score - a._score).slice(0, 8);
    }, [daily, perf]);

    if (!rows.length) return <div className="muted">No sector data.</div>;

    return (
        <>
            <div className="pill-grid two-col" aria-live="polite">
                {rows.map((r, i) => (
                    <div key={i} className="chip chip-row">
                        <span className="kv-key">
                            {r.name}
                            {r.badge ? <em className="badge" aria-label="example ticker" style={{ marginLeft: ".4rem" }}>{r.badge}</em> : null}
                        </span>
                        <span className="muted kv-val">
                            {r.metricLabel} {typeof r.metric === "number" ? r.metric.toFixed(2) : "—"}
                        </span>
                    </div>
                ))}
            </div>
            <style>{`
        .chip-row{ display:flex; align-items:center; justify-content:space-between; gap:.6rem; }
        .kv-key{ flex:1; min-width:0; font-weight:600; }
        .kv-val{ white-space:nowrap; }
      `}</style>
        </>
    );
}
