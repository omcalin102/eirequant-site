import React, { useEffect, useMemo, useState } from "react";
import { TopDrivers, Driver } from "../../lib/type";
import { getLatestDate, safeTopDrivers } from "../../lib/api";

const pct = (n?: number | null, d = 2) =>
    typeof n === "number" && isFinite(n) ? `${(n * 100).toFixed(d)}%` : "—";

function kindOf(d: any): "sector" | "ticker" | "news" | "other" {
    if (d?.type === "sector" || "sector" in d) return "sector";
    if (d?.type === "ticker" || "ticker" in d) return "ticker";
    if (d?.type === "news" || "title" in d) return "news";
    return "other";
}

export default function TopDriversMini() {
    const [date, setDate] = useState<string | null>(null);
    const [drivers, setDrivers] = useState<Driver[]>([]);

    useEffect(() => {
        (async () => {
            const d = await getLatestDate();
            setDate(d);
            const doc: TopDrivers | null = await safeTopDrivers(d ?? undefined, "eqx-m1");
            setDrivers(doc?.drivers ?? []);
        })();
    }, []);

    const picks = useMemo(() => {
        const sectors = drivers
            .filter((x) => kindOf(x) === "sector")
            .sort((a: any, b: any) => (b.value ?? 0) - (a.value ?? 0));
        const tickers = drivers
            .filter((x) => kindOf(x) === "ticker")
            .sort((a: any, b: any) => Math.abs(b.value ?? 0) - Math.abs(a.value ?? 0));
        const news = drivers
            .filter((x) => kindOf(x) === "news")
            .sort((a: any, b: any) => (b.sentiment ?? 0) - (a.sentiment ?? 0));
        const picked = [...sectors.slice(0, 3), ...tickers.slice(0, 2), ...news.slice(0, 1)];
        if (picked.length) return picked;

        return [...drivers]
            .sort((a: any, b: any) => Math.abs(b.value ?? 0) - Math.abs(a.value ?? 0))
            .slice(0, 6);
    }, [drivers]);

    return (
        <div className="card">
            <div className="card-head">
                <h3 className="card-title">Top Drivers</h3>
                <div className="card-sub">{date ?? "—"}</div>
            </div>

            {picks.length ? (
                <ul className="list topdrivers-list" style={{ marginTop: ".5rem" }}>
                    {picks.map((d: any, i: number) => {
                        const k = kindOf(d);
                        if (k === "sector") {
                            return (
                                <li key={`s${i}`} className="row" style={{ display: "flex", gap: ".5rem", alignItems: "center" }}>
                                    <span className="badge">Sector</span>
                                    <span className="kv-key" style={{ flex: 1, minWidth: 0 }}>{d.sector ?? "—"}</span>
                                    <span className="kv-val muted">{pct(d.value)}</span>
                                </li>
                            );
                        }
                        if (k === "ticker") {
                            return (
                                <li key={`t${i}`} className="row" style={{ display: "flex", gap: ".5rem", alignItems: "center" }}>
                                    <span className="badge">Ticker</span>
                                    <span className="kv-key" style={{ flex: 1, minWidth: 0 }}>{d.ticker ?? "—"}</span>
                                    <span className="kv-val muted">{pct(d.value)}</span>
                                </li>
                            );
                        }
                        if (k === "news") {
                            const title: string = d.title ?? "News";
                            return (
                                <li
                                    key={`n${i}`}
                                    className="row news-row"
                                    style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: ".5rem", alignItems: "start" }}
                                >
                                    <span className="badge">News</span>
                                    <span className="news-title" title={title}>{title}</span>
                                </li>
                            );
                        }
                        return (
                            <li key={`x${i}`} className="row" style={{ display: "flex", gap: ".5rem", alignItems: "center" }}>
                                <span className="badge">Info</span>
                                <span style={{ flex: 1 }}>—</span>
                                <span className="muted">—</span>
                            </li>
                        );
                    })}
                </ul>
            ) : (
                <div className="muted" style={{ marginTop: ".5rem" }}>
                    No drivers available.
                </div>
            )}

            <style>{`
        .topdrivers-list { gap: .35rem; }
        .topdrivers-list > li + li { border-top:1px solid var(--border); padding-top:.35rem; margin-top:.35rem; }
        /* Full-width headline, wrap on spaces only */
        .news-title {
          display:block;
          white-space: normal;
          word-break: keep-all;
          overflow-wrap: break-word;
          hyphens: none;
          line-height: 1.25;
        }
      `}</style>
        </div>
    );
}
