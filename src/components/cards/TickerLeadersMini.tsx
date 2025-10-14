import React, { useEffect, useMemo, useState } from "react";
import { TickerLeaderboard } from "../../lib/type";
import { getLatestDate, safeTickerLeaders } from "../../lib/api";

type Row = { ticker: string; omega?: number | null; hit_rate?: number | null };

const fmtOmega = (n?: number | null) =>
    typeof n === "number" && isFinite(n) ? n.toFixed(2) : "—";
const fmtHit = (n?: number | null) =>
    typeof n === "number" && isFinite(n) ? `${(n * 100).toFixed(0)}%` : "—";

// normalize either {top:[{ticker,omega,hit_rate}]} or {leaders:[{ticker,score}|[t,s]]}
function normalize(doc: TickerLeaderboard | null | undefined): Row[] {
    if (!doc) return [];
    if (Array.isArray((doc as any).top) && (doc as any).top.length) {
        return (doc as any).top.map((t: any) => ({
            ticker: t.ticker ?? String(t[0] ?? "—"),
            omega: typeof t.omega === "number" ? t.omega : null,
            hit_rate: typeof t.hit_rate === "number" ? t.hit_rate : null,
        }));
    }
    if (Array.isArray((doc as any).leaders)) {
        const L: any[] = (doc as any).leaders;
        return L.map((x: any) => {
            if (Array.isArray(x)) {
                return { ticker: String(x[0] ?? "—"), omega: +x[1] || null, hit_rate: null };
            }
            return {
                ticker: x.ticker ?? x.symbol ?? String(x.name ?? "—"),
                omega:
                    typeof x.omega === "number" ? x.omega :
                        typeof x.score === "number" ? x.score : null,
                hit_rate: typeof x.hit_rate === "number" ? x.hit_rate : null,
            };
        });
    }
    return [];
}

export default function TickerLeadersMini() {
    const [date, setDate] = useState<string | null>(null); // kept for potential future use; not rendered
    const [rows, setRows] = useState<Row[]>([]);

    useEffect(() => {
        (async () => {
            const d = await getLatestDate();
            setDate(d);
            const board: TickerLeaderboard | null = await safeTickerLeaders(d ?? undefined, "eqx-m1");
            setRows(normalize(board));
        })();
    }, []);

    const top = useMemo(() => rows.slice(0, 8), [rows]);

    if (!top.length) {
        return <div className="muted">No leaders available.</div>;
    }

    // Content-only: page supplies the panel + heading. We render just the grid.
    return (
        <div className="pill-grid two-col" aria-live="polite">
            {top.map((t, i) => (
                <div key={i} className="pill pill-row">
                    <span className="pill-key">{t.ticker}</span>
                    <span className="muted pill-val">
                        {/* ASCII-safe labels to avoid glyph fallbacks */}
                        Om {fmtOmega(t.omega)} | HR {fmtHit(t.hit_rate)}
                    </span>
                    <button
                        type="button"
                        className="help-dot"
                        aria-label="What do these stats mean?"
                        data-tip="Leaders ranked by Omega (gain/loss asymmetry) and Hit Rate over the lookback window."
                    >
                        ?
                    </button>
                </div>
            ))}
        </div>
    );
}
