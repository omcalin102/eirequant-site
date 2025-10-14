import React, { useEffect, useState } from "react";
import { Selection, TickerLeaderboard as TL, ModelSelection as MS } from "../../lib/type";
import { getLatestDate, getModelSelection, safeTickerLeaders } from "../../lib/api";

const pct = (n: number | null | undefined) =>
    typeof n === "number" && isFinite(n) ? `${(n * 100).toFixed(1)}%` : "—";

export default function ModelPicks() {
    const [date, setDate] = useState<string | null>(null);
    const [meta, setMeta] = useState<MS | null>(null);
    const [picks, setPicks] = useState<Selection[]>([]);
    const [leaders, setLeaders] = useState<TL | null>(null);

    useEffect(() => {
        (async () => {
            const d = await getLatestDate();
            setDate(d);
            const ms = await getModelSelection(d);
            setMeta(ms ?? null);
            const sel = (ms?.selections ?? []).filter(Boolean);
            setPicks(sel as Selection[]);
            const tl = await safeTickerLeaders(d);
            setLeaders(tl ?? null);
        })();
    }, []);

    const infoLine = (() => {
        const series = (meta as any)?.series ?? (meta as any)?.model_id ?? "—";
        const regime = (meta as any)?.regime ?? "—";
        const conf = pct((meta as any)?.confidence);
        return [date ?? "—", series, regime, `Conf ${conf}`].join(" | ");
    })();

    const top5 =
        (leaders as any)?.leaders?.slice(0, 5) ??
        (leaders as any)?.top?.slice(0, 5) ??
        [];

    return (
        <div>
            <div className="card-sub">{infoLine}</div>

            {picks.length ? (
                <table className="table">
                    <thead>
                        <tr>
                            <th>Ticker</th>
                            <th>Action</th>
                            <th>Conf.</th>
                        </tr>
                    </thead>
                    <tbody>
                        {picks.slice(0, 8).map((s: any, i: number) => (
                            <tr key={i}>
                                <td>{s.ticker}</td>
                                <td>{s.action ?? "—"}</td>
                                <td>{pct(s.conf ?? s.confidence)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div className="chip" style={{ marginTop: ".5rem" }}>
                    <strong className="muted">No selections today.</strong>
                </div>
            )}

            {/* Leaders (omega) */}
            {top5.length ? (
                <div className="pill-grid two-col" style={{ marginTop: ".6rem" }}>
                    {top5.map((t: any, i: number) => {
                        const ticker = t?.ticker ?? t?.symbol ?? t?.name ?? t?.[0] ?? "—";
                        const omegaVal =
                            typeof t?.omega === "number" ? t.omega :
                                (Array.isArray(t) && typeof t[1] === "number" ? t[1] : null);
                        return (
                            <span key={i} className="pill" title={ticker}>
                                {ticker}
                                {typeof omegaVal === "number" ? (
                                    <em className="meta" style={{ marginLeft: ".4rem", opacity: .6, fontStyle: "normal" }}>
                                        Om {omegaVal.toFixed(2)}
                                    </em>
                                ) : null}
                            </span>
                        );
                    })}
                </div>
            ) : null}

            <style>{`
        .table{margin-top:.5rem}
      `}</style>
        </div>
    );
}
