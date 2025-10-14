import React, { useEffect, useRef, useState } from "react";

type Latest = { date?: string };
type TracePoint = { t?: number | string; p?: number; i?: number; d?: number; control?: number };
type TraceDoc = { trace?: TracePoint[] };

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

const toTs = (x: any) => (typeof x === "number" ? x : +new Date(x) || 0);

export default function PolicyTrace() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const wrapRef = useRef<HTMLDivElement | null>(null);
    const [data, setData] = useState<TracePoint[]>([]);
    const [date, setDate] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            const latest = await getJSON<Latest>("/data/latest.json");
            const d = latest?.date ?? null;
            setDate(d);

            let doc: TraceDoc | null = null;
            if (d) doc = await getJSON<TraceDoc>(`/data/daily/${d}/pid_policy_trace.json?v=${encodeURIComponent(d)}`);
            if (!doc?.trace?.length) doc = await getJSON<TraceDoc>("/data/models/eqx-m1/pid_policy_trace.json");
            setData(doc?.trace ?? []);
        })();
    }, []);

    useEffect(() => {
        const c = canvasRef.current, wrap = wrapRef.current;
        if (!c || !wrap) return;
        const ctx = c.getContext("2d"); if (!ctx) return;

        const W = Math.max(560, Math.min(1000, Math.floor(wrap.clientWidth)));
        const H = 220;
        c.width = W; c.height = H;

        ctx.clearRect(0, 0, W, H);
        ctx.font = "12px Inter, system-ui, sans-serif";

        if (!data.length) { ctx.fillStyle = "#777"; ctx.fillText("No policy trace data.", 12, 20); return; }

        const pad = 36;
        const xs = data.map(d => toTs(d.t));
        const vals = data.flatMap(d => [d.p, d.i, d.d, d.control]).filter(v => typeof v === "number") as number[];
        const minX = Math.min(...xs), maxX = Math.max(...xs);
        const minY = Math.min(...vals), maxY = Math.max(...vals);
        const X = (t: number) => pad + ((t - minX) / Math.max(1, maxX - minX)) * (W - 2 * pad);
        const Y = (v: number) => H - pad - ((v - minY) / Math.max(1e-9, maxY - minY)) * (H - 2 * pad);

        ctx.strokeStyle = "#e5e5e5"; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(pad, H - pad); ctx.lineTo(W - pad, H - pad); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(pad, pad); ctx.lineTo(pad, H - pad); ctx.stroke();

        const series: { key: keyof TracePoint; label: string; color: string }[] = [
            { key: "p", label: "P", color: "#0e0e0e" },
            { key: "i", label: "I", color: "#1e90ff" },
            { key: "d", label: "D", color: "#ff8c00" },
            { key: "control", label: "Control", color: "#2e7d32" },
        ];

        const step = Math.max(1, Math.floor(data.length / (W / 2)));

        series.forEach(s => {
            const filtered = data.map((d, idx) => ({ x: xs[idx], y: d[s.key] as number | undefined }))
                .filter((_, i) => i % step === 0)
                .filter(p => typeof p.y === "number") as { x: number; y: number }[];
            if (!filtered.length) return;

            ctx.beginPath();
            filtered.forEach((p, i) => { const x = X(p.x), y = Y(p.y); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); });
            ctx.strokeStyle = s.color; ctx.lineWidth = 1.8; ctx.stroke();
        });

        // legend
        let lx = pad, ly = pad - 10;
        series.forEach(s => {
            ctx.fillStyle = s.color; ctx.fillRect(lx, ly - 3, 22, 3);
            ctx.fillStyle = "#333"; ctx.fillText(s.label, lx + 28, ly);
            lx += 28 + ctx.measureText(s.label).width + 16;
        });
    }, [data]);

    useEffect(() => {
        const wrap = wrapRef.current;
        if (!wrap) return;
        const ro = new ResizeObserver(() => setData(d => [...d]));
        ro.observe(wrap);
        return () => ro.disconnect();
    }, []);

    return (
        <div ref={wrapRef} className="card">
            <div className="card-head">
                <h3 className="card-title">Policy Control Trace</h3>
                <div className="card-sub">{date ?? "—"}</div>
            </div>
            <div style={{ height: 220, marginTop: ".5rem" }}>
                <canvas ref={canvasRef} />
            </div>
            <div className="muted" style={{ marginTop: ".5rem" }}>
                Shared axis; raw P/I/D/control magnitudes.
            </div>
        </div>
    );
}
