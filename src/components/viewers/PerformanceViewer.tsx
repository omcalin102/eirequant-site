import React, { useEffect, useMemo, useRef, useState } from "react";
import {
    Chart,
    LineController,
    LineElement,
    PointElement,
    LinearScale,
    TimeSeriesScale,
    Tooltip,
    Legend,
    Filler,
    CategoryScale,
} from "chart.js";
import "chartjs-adapter-date-fns";

Chart.register(LineController, LineElement, PointElement, LinearScale, TimeSeriesScale, Tooltip, Legend, Filler, CategoryScale);

type CatalogItem = { key?: string; label?: string };
type CatalogDoc = { items?: CatalogItem[] };

type EquityDoc = {
    x?: string[]; // ISO dates
    series?: { key?: string; name?: string; y?: number[] }[];
    title?: string;
    window?: string;
};

const baseHref = () =>
    (document.querySelector("base")?.getAttribute("href") || "/").replace(/\/+$/, "/");

async function getJSON<T>(relPath: string): Promise<T | null> {
    const url = baseHref() + relPath.replace(/^\//, "");
    try {
        const r = await fetch(url, { cache: "no-cache" });
        if (!r.ok) return null;
        return (await r.json()) as T;
    } catch {
        return null;
    }
}

async function fetchEquity(key: string): Promise<EquityDoc | null> {
    // try underscore file; then hyphen variant
    const p1 = `/data/models/eqx-m1/equity/${key}.json`;
    const p2 = `/data/models/eqx-m1/equity/${key.replace(/_/g, "-")}.json`;
    const a = await getJSON<EquityDoc>(p1);
    if (a?.series?.length) return a;
    const b = await getJSON<EquityDoc>(p2);
    return b ?? null;
}

function normalize(series: number[]): number[] {
    if (!series.length) return series;
    const s0 = series[0] === 0 ? 1 : series[0];
    return series.map(v => (typeof v === "number" && isFinite(v) ? v / s0 : v));
}

export default function PerformanceViewer() {
    const [catalog, setCatalog] = useState<CatalogItem[]>([]);
    const [selected, setSelected] = useState<string | null>(null);
    const [doc, setDoc] = useState<EquityDoc | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const chartRef = useRef<Chart | null>(null);

    useEffect(() => {
        (async () => {
            const cat = await getJSON<CatalogDoc>("/data/models/eqx-m1/catalog.json");
            const items = (cat?.items ?? []).filter(i => i?.key?.startsWith("equity"));
            setCatalog(items);
            const def = items.find(i => i.key?.toLowerCase() === "equity_25y") || items[0] || null;
            const key = def?.key ?? null;
            setSelected(key);
            if (key) {
                const d = await fetchEquity(key);
                setDoc(d);
            }
        })();
    }, []);

    useEffect(() => {
        (async () => {
            if (!selected) return;
            const d = await fetchEquity(selected);
            setDoc(d);
        })();
    }, [selected]);

    const datasets = useMemo(() => {
        if (!doc?.series?.length) return [];
        const palette = [
            "#0a0a0a",
            "#8a2be2",
            "#1e90ff",
            "#228b22",
            "#b22222",
            "#ff8c00",
            "#2f4f4f",
        ];
        return doc.series.map((s, i) => ({
            label: s?.name ?? s?.key ?? `Series ${i + 1}`,
            data: normalize(s?.y ?? []).map((y, idx) => ({ x: doc.x?.[idx] ?? idx, y })),
            borderColor: palette[i % palette.length],
            backgroundColor: palette[i % palette.length] + "33",
            pointRadius: 0,
            fill: false,
            borderWidth: 1.5,
            tension: 0.1,
        }));
    }, [doc]);

    useEffect(() => {
        const ctx = canvasRef.current?.getContext("2d");
        if (!ctx) return;

        if (chartRef.current) {
            chartRef.current.destroy();
            chartRef.current = null;
        }

        chartRef.current = new Chart(ctx, {
            type: "line",
            data: { datasets },
            options: {
                responsive: true,
                interaction: { intersect: false, mode: "index" },
                maintainAspectRatio: false,
                scales: {
                    x: { type: "timeseries", grid: { display: false } },
                    y: {
                        type: "linear",
                        grid: { color: "rgba(0,0,0,0.06)" },
                        ticks: { callback: (v) => Number(v).toFixed(1) + "×" },
                    },
                },
                plugins: {
                    legend: { position: "bottom" },
                    tooltip: {
                        callbacks: {
                            label: (ctx) => {
                                const v = typeof ctx.parsed.y === "number" ? ctx.parsed.y : null;
                                return `${ctx.dataset.label}: ${v !== null ? v.toFixed(3) + "×" : "—"}`;
                            },
                        },
                    },
                },
            },
        });
    }, [datasets]);

    return (
        <div className="card">
            <div className="card-head">
                <h3 className="card-title">Performance Viewer</h3>
                <div className="card-actions">
                    <select
                        value={selected ?? ""}
                        onChange={(e) => setSelected(e.target.value || null)}
                        style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}
                    >
                        {catalog.map((i, idx) => (
                            <option key={idx} value={i.key ?? ""}>
                                {i.label ?? i.key}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div style={{ height: "360px", marginTop: ".5rem" }}>
                <canvas ref={canvasRef} />
            </div>

            <div className="muted" style={{ marginTop: ".5rem" }}>
                Series normalized to start = 1.0 for comparison.
            </div>
        </div>
    );
}
