import { useEffect, useRef, useState } from "react";

type Point = [number, number];

type Catalog =
    | null
    | {
        x?: string[] | number[];
        series?: Array<{ key: string; name: string; y: number[] }>;
    };

const WINDOWS = [
    { key: "25y", label: "25y" },
    { key: "5y_1", label: "5y_1" },
    { key: "5y_3", label: "5y_3" },
    { key: "5y_4", label: "5y_4" },
    { key: "5y_5", label: "5y_5" },
    { key: "last_1y", label: "last_1y" },
    { key: "last_3m", label: "last_3m" },
    { key: "last_1m", label: "last_1m" },
    { key: "last_1w", label: "last_1w" },
];

const MODELS = [{ key: "eqx-m1", label: "EQX-M1" } as const];
const PATHS = [
    { key: "pid", label: "PID" },
    { key: "baseline", label: "Baseline" },
] as const;

const BENCH = [{ key: "spx", label: "S&P 500 (SPX)" } as const];

const baseHref = () =>
    (document.querySelector("base")?.getAttribute("href") || "/").replace(/\/+$/, "/");
const clean = (s: string) => s.replace(/([^:]\/)\/+/g, "$1");

function fileFor(win: string) {
    // single canonical file that already contains PID, Baseline, and SPX
    return clean(`${baseHref()}data/models/eqx-m1/equity/equity_${win}.json`);
}

async function getCatalog(url: string): Promise<Catalog> {
    try {
        const r = await fetch(url, { cache: "no-cache" });
        if (!r.ok) return null;
        return (await r.json()) as Catalog;
    } catch {
        return null;
    }
}

const toTs = (x: any) => (typeof x === "number" ? x : +new Date(x) || 0);

function stats(points: Point[]) {
    if (!points || points.length < 3) return { cagr: "—", vol: "—", sharpe: "—", mdd: "—" };
    const vals = points.map((p) => p[1]);
    const R = vals.at(-1)! / vals[0] - 1;
    const years = Math.max(1, points.length / 252);
    const cagr = Math.pow(1 + R, 1 / years) - 1;

    const rets: number[] = [];
    for (let i = 1; i < vals.length; i++) rets.push(vals[i] / vals[i - 1] - 1);
    const mean = rets.reduce((a, b) => a + b, 0) / rets.length;
    const sd =
        Math.sqrt(rets.reduce((a, b) => a + (b - mean) ** 2, 0) / Math.max(1, rets.length - 1)) *
        Math.sqrt(252);
    const sharpe = sd ? (mean * 252) / sd : 0;

    let peak = vals[0],
        mdd = 0;
    for (const v of vals) {
        peak = Math.max(peak, v);
        mdd = Math.min(mdd, v / peak - 1);
    }
    const pct = (x: number) => (x * 100).toFixed(2) + "%";
    return { cagr: pct(cagr), vol: pct(sd), sharpe: sharpe.toFixed(2), mdd: pct(mdd) };
}

function seriesFromCatalog(
    cat: Catalog,
    pick: "pid" | "baseline" | "spx"
): Point[] | null {
    if (!cat?.x || !Array.isArray(cat.series)) return null;
    const sr = cat.series.find((s) => s.key.toLowerCase() === pick.toLowerCase());
    if (!sr || !Array.isArray(sr.y)) return null;
    const x = cat.x.map(toTs);
    if (x.length !== sr.y.length) return null;
    return x.map((t, i) => [t, +sr.y[i]] as Point);
}

/** Analysis paragraphs keyed by path */
const ANALYSIS: Record<
    "pid" | "baseline",
    { title: string; body: string }
> = {
    pid: {
        title: "EQX-M1 PID",
        body:
            "EQX-M1 on the PID path prioritizes risk control and capital discipline. Across the long window shown it compounds at roughly 7.1 percent with about 14.5 percent annualized volatility. The maximum drawdown is about 35 percent, materially shallower than the S&P 500 history in the same window, and the Sharpe ratio sits around 0.54. The series demonstrates consistent participation in advancing markets while reducing exposure during stress, which is visible in the smoother path and narrower distribution of returns.\n\nThe main tradeoff is headline return versus the index. The S&P 500 prints a higher long run CAGR near 13.9 percent with a Sharpe of about 0.61, albeit with much higher volatility and deeper historical losses. For allocators, PID suits mandates that value stability and controlled downside while still seeking equity growth. The weakness to acknowledge is that in powerful trending bull legs the PID path will typically trail the benchmark.",
    },
    baseline: {
        title: "EQX-M1 Baseline",
        body:
            "The Baseline path aims for a modestly higher growth rate while maintaining risk control. It delivers about 8.3 percent CAGR with roughly 16.2 percent volatility, a maximum drawdown near 36 percent, and a Sharpe ratio close to 0.57. Compared with the index, the series retains a clear advantage on depth of losses and path stability while improving on the PID return profile.\n\nThe cost is slightly higher variability than PID and continued underperformance versus the S&P 500 during extended risk on phases. In a policy context, Baseline serves as the growth leaning expression of the model, while PID remains the more defensive expression. The combination allows portfolio construction to target a desired mix of compounding and drawdown control without relying on regime calls.",
    },
};

export default function MegaGraph() {
    const [win, setWin] = useState<string>("25y");
    const [model, setModel] = useState<string>("eqx-m1");
    const [path, setPath] = useState<"pid" | "baseline">("pid");
    const [bench, setBench] = useState<string>("spx");

    const [cat, setCat] = useState<Catalog>(null);
    const [series, setSeries] = useState<{ name: string; data: Point[]; color: string }[]>([]);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const wrapRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        (async () => {
            const c = await getCatalog(fileFor(win));
            setCat(c);
        })();
    }, [win]);

    useEffect(() => {
        if (!cat) return;
        const chosen: { name: string; data: Point[]; color: string }[] = [];

        if (model === "eqx-m1") {
            const p = seriesFromCatalog(cat, path);
            if (p) chosen.push({ name: `EQX-M1 (${path === "pid" ? "PID" : "Baseline"})`, data: p, color: "#111" });
        }
        if (bench === "spx") {
            const b = seriesFromCatalog(cat, "spx");
            if (b) chosen.push({ name: "S&P 500 (SPX)", data: b, color: "#1a4fb0" });
        }
        setSeries(chosen);
    }, [cat, model, path, bench]);

    // draw
    useEffect(() => {
        const c = canvasRef.current, wrap = wrapRef.current;
        if (!c || !wrap) return;
        const ctx = c.getContext("2d"); if (!ctx) return;

        function draw() {
            const width = Math.max(640, Math.min(1100, Math.floor(wrap.clientWidth)));
            const height = 380;
            c.width = width; c.height = height;
            ctx.clearRect(0, 0, width, height);

            if (!series.length) {
                ctx.fillStyle = "#777"; ctx.font = "12px Inter, system-ui, sans-serif";
                ctx.fillText("No data available for this selection.", 14, 24);
                return;
            }

            const padL = 60, padR = 16, padT = 24, padB = 48;
            const xs = series.flatMap(s => s.data.map(p => p[0]));
            const ys = series.flatMap(s => s.data.map(p => p[1]));
            const minX = Math.min(...xs), maxX = Math.max(...xs);
            const minY = Math.min(...ys), maxY = Math.max(...ys);
            const X = (t: number) => padL + ((t - minX) / Math.max(1, maxX - minX)) * (width - padL - padR);
            const Y = (v: number) => height - padB - ((v - minY) / Math.max(1e-9, maxY - minY)) * (height - padT - padB);

            // grid
            ctx.strokeStyle = "#e8e8e8"; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(padL, height - padB); ctx.lineTo(width - padR, height - padB); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(padL, padT); ctx.lineTo(padL, height - padB); ctx.stroke();

            // y ticks
            ctx.fillStyle = "#555"; ctx.font = "11px Inter, system-ui, sans-serif";
            const yTicks = 4;
            for (let i = 0; i <= yTicks; i++) {
                const v = minY + (i * (maxY - minY)) / yTicks;
                const y = Y(v);
                ctx.strokeStyle = "#f2f2f2"; ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(width - padR, y); ctx.stroke();
                ctx.fillStyle = "#666"; ctx.fillText(v.toFixed(1) + "x", 8, y + 4);
            }

            // x ticks (years)
            const yearMs = 365 * 24 * 3600 * 1000;
            let y0 = new Date(minX).getFullYear();
            const y1 = new Date(maxX).getFullYear();
            ctx.fillStyle = "#666";
            for (let y = y0; y <= y1; y += Math.ceil((y1 - y0) / 6) || 1) {
                const t = +new Date(y, 0, 1);
                const x = X(Math.min(Math.max(t, minX), maxX));
                ctx.strokeStyle = "#f2f2f2"; ctx.beginPath(); ctx.moveTo(x, padT); ctx.lineTo(x, height - padB); ctx.stroke();
                ctx.fillText(String(y), x - 10, height - 24);
            }

            // axis labels
            ctx.fillStyle = "#333"; ctx.font = "12px Inter, system-ui, sans-serif";
            ctx.fillText("Date", width / 2 - 16, height - 10);
            ctx.save(); ctx.translate(16, height / 2); ctx.rotate(-Math.PI / 2);
            ctx.fillText("Equity (normalized multiple)", -90, 0);
            ctx.restore();

            // series
            series.forEach(s => {
                ctx.beginPath();
                s.data.forEach((p, i) => {
                    const x = X(p[0]), y = Y(p[1]);
                    i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
                });
                ctx.strokeStyle = s.color; ctx.lineWidth = 2; ctx.stroke();
            });

            // legend
            let lx = padL, ly = padT - 8;
            series.forEach(s => {
                ctx.fillStyle = s.color; ctx.fillRect(lx, ly - 3, 22, 3);
                ctx.fillStyle = "#333"; ctx.fillText(s.name, lx + 28, ly);
                lx += 28 + ctx.measureText(s.name).width + 16;
            });
        }

        draw();
        const ro = new ResizeObserver(draw);
        ro.observe(wrap);
        return () => ro.disconnect();
    }, [series]);

    const modelSeries = series.find(s => s.name.startsWith("EQX-M1"));
    const benchSeries = series.find(s => s.name.includes("S&P 500"));
    const mStats = modelSeries ? stats(modelSeries.data) : { cagr: "—", vol: "—", sharpe: "—", mdd: "—" };
    const bStats = benchSeries ? stats(benchSeries.data) : null;

    const analysis = model === "eqx-m1" ? ANALYSIS[path] : null;

    return (
        <div ref={wrapRef} className="mg">
            <div className="bar">
                <label>Window
                    <select value={win} onChange={(e) => setWin(e.target.value)}>
                        {WINDOWS.map(w => <option key={w.key} value={w.key}>{w.label}</option>)}
                    </select>
                </label>
                <label>Model
                    <select value={model} onChange={(e) => setModel(e.target.value)}>
                        {MODELS.map(m => <option key={m.key} value={m.key}>{m.label}</option>)}
                    </select>
                </label>
                <label>Path
                    <select value={path} onChange={(e) => setPath(e.target.value as "pid" | "baseline")}>
                        {PATHS.map(p => <option key={p.key} value={p.key}>{p.label}</option>)}
                    </select>
                </label>
                <label>Benchmark
                    <select value={bench} onChange={(e) => setBench(e.target.value)}>
                        {BENCH.map(b => <option key={b.key} value={b.key}>{b.label}</option>)}
                    </select>
                </label>
            </div>

            <canvas ref={canvasRef} />

            <table className="table">
                <thead>
                    <tr>
                        <th>Series</th><th>CAGR</th><th>Vol</th><th>Sharpe</th><th>Max DD</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{modelSeries?.name ?? "—"}</td>
                        <td>{mStats.cagr}</td><td>{mStats.vol}</td><td>{mStats.sharpe}</td><td>{mStats.mdd}</td>
                    </tr>
                    {bStats && (
                        <tr>
                            <td>S&P 500 (SPX)</td>
                            <td>{bStats.cagr}</td><td>{bStats.vol}</td><td>{bStats.sharpe}</td><td>{bStats.mdd}</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {analysis && (
                <div className="note">
                    <h3>{analysis.title}</h3>
                    {analysis.body.split("\n\n").map((p, i) => <p key={i}>{p}</p>)}
                </div>
            )}

            <style>{`
        .mg{display:grid;gap:12px}
        .bar{display:flex;gap:12px;align-items:center;flex-wrap:wrap}
        .bar label{font-size:.95rem;color:#333}
        .bar select{margin-left:.4rem}
        canvas{width:100%;height:auto;background:#fff;border:1px solid var(--border);border-radius:10px}
        .table{width:100%;border-collapse:separate;border-spacing:0;border:1px solid var(--border);border-radius:10px;overflow:hidden;background:#fff;margin-top:4px}
        .table thead th{background:#fafafa;text-align:left;padding:.55rem .7rem;border-bottom:1px solid var(--border)}
        .table tbody td{padding:.55rem .7rem;border-bottom:1px solid var(--border)}
        .table tbody tr:last-child td{border-bottom:0}
        .note{background:#fff;border:1px solid var(--border);border-radius:10px;padding:12px}
        .note h3{margin:.2rem 0 .35rem;font-size:1.05rem}
        .note p{margin:.35rem 0;color:#333}
      `}</style>
        </div>
    );
}
