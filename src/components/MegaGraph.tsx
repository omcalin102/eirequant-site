import React, { useEffect, useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type RegistryEntry = {
  id: string;
  label: string;
  path: string;
  type?: "benchmark" | "model" | "portfolio";
};
type Registry = {
  benchmarks?: RegistryEntry[];
  models?: RegistryEntry[];
  portfolios?: RegistryEntry[];
};

type CurvePoint = { date: string; value: number };
type CurveFile = { series: CurvePoint[]; meta?: { label?: string; type?: string } };

async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url, { cache: "no-cache" as RequestCache });
  if (!res.ok) throw new Error(`Fetch failed: ${url}`);
  return res.json();
}

const COLORS = [
  "#2563eb", "#16a34a", "#dc2626", "#7c3aed", "#ea580c",
  "#0891b2", "#b91c1c", "#0ea5e9", "#a16207", "#4f46e5",
];

// Merge curves into [{ date, id1, id2, ... }]
function toSeriesMap(curves: Record<string, CurveFile>) {
  const allDates = new Set<string>();
  for (const f of Object.values(curves)) {
    for (const p of f.series) allDates.add(p.date);
  }
  const dates = Array.from(allDates).sort();

  const fastIndex: Record<string, Record<string, number>> = {};
  for (const [id, f] of Object.entries(curves)) {
    fastIndex[id] = {};
    for (const p of f.series) fastIndex[id][p.date] = p.value;
  }

  return dates.map((date) => {
    const row: Record<string, any> = { date };
    for (const id of Object.keys(curves)) row[id] = fastIndex[id][date] ?? null;
    return row;
  });
}

function dailyReturns(series: CurvePoint[]): number[] {
  const out: number[] = [];
  for (let i = 1; i < series.length; i++) {
    const prev = series[i - 1].value;
    const cur = series[i].value;
    if (prev && cur) out.push(cur / prev - 1);
  }
  return out;
}

function maxDrawdown(series: CurvePoint[]): number {
  let peak = -Infinity;
  let mdd = 0;
  for (const p of series) {
    if (p.value > peak) peak = p.value;
    const dd = peak ? p.value / peak - 1 : 0;
    if (dd < mdd) mdd = dd;
  }
  return Math.abs(mdd);
}

function yearsBetween(a: string, b: string) {
  const A = new Date(a).getTime();
  const B = new Date(b).getTime();
  return Math.max((B - A) / (1000 * 60 * 60 * 24 * 365.25), 1 / 365);
}

function metrics(series: CurvePoint[]) {
  if (!series || series.length < 2) return { CAGR: 0, VOL: 0, Sharpe: 0, MDD: 0 };
  const yrs = yearsBetween(series[0].date, series[series.length - 1].date);
  const start = series[0].value;
  const end = series[series.length - 1].value;
  const CAGR = start > 0 ? Math.pow(end / start, 1 / yrs) - 1 : 0;
  const rets = dailyReturns(series);
  const mean = rets.length ? rets.reduce((a, b) => a + b, 0) / rets.length : 0;
  const variance =
    rets.length > 1
      ? rets.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / (rets.length - 1)
      : 0;
  const VOL = Math.sqrt(variance) * Math.sqrt(252);
  const Sharpe = VOL ? (mean * 252) / VOL : 0;
  const MDD = maxDrawdown(series);
  return { CAGR, VOL, Sharpe, MDD };
}

export default function MegaGraph() {
  const [registry, setRegistry] = useState<Registry>({});
  const [selected, setSelected] = useState<string[]>([]);
  const [curves, setCurves] = useState<Record<string, CurveFile>>({});
  const [loading, setLoading] = useState(false);

  // Load registry
  useEffect(() => {
    fetchJSON<Registry>("/data/universe_v1/registry.json")
      .then((r) => setRegistry(r || {}))
      .catch(() => setRegistry({}));
  }, []);

  // Default selection when registry loads
  useEffect(() => {
    if (!registry || selected.length) return;
    const def: string[] = [];
    if (registry.benchmarks?.[0]) def.push(registry.benchmarks[0].id);
    if (registry.models?.[0]) def.push(registry.models[0].id);
    setSelected(def);
  }, [registry, selected.length]);

  // Ensure selected curves are loaded
  useEffect(() => {
    if (!selected.length) return;

    const have = new Set(Object.keys(curves));
    const toLoad = selected.filter((id) => !have.has(id));
    if (!toLoad.length) return;

    const index: Record<string, string> = {};
    for (const e of [
      ...(registry.benchmarks || []),
      ...(registry.models || []),
      ...(registry.portfolios || []),
    ]) index[e.id] = e.path;

    setLoading(true);
    Promise.all(
      toLoad.map(async (id) => {
        const path = index[id];
        if (!path) return [id, null] as const;
        try {
          const file = await fetchJSON<CurveFile>(path);
          return [id, file] as const;
        } catch {
          return [id, null] as const;
        }
      })
    ).then((pairs) => {
      const patch: Record<string, CurveFile> = {};
      for (const [id, file] of pairs) if (file) patch[id] = file;
      setCurves((prev) => ({ ...prev, ...patch }));
      setLoading(false);
    });
  }, [selected, registry, curves]);

  const lines = useMemo(() => {
    const rows: {
      id: string;
      label: string;
      color: string;
      m: ReturnType<typeof metrics>;
    }[] = [];
    const all = [
      ...(registry.benchmarks || []),
      ...(registry.models || []),
      ...(registry.portfolios || []),
    ];
    selected.forEach((id, i) => {
      const meta = all.find((e) => e.id === id);
      const file = curves[id];
      if (meta && file)
        rows.push({
          id,
          label: meta.label,
          color: COLORS[i % COLORS.length],
          m: metrics(file.series),
        });
    });
    return rows;
  }, [selected, curves, registry]);

  const data = useMemo(
    () => (Object.keys(curves).length ? toSeriesMap(curves) : []),
    [curves]
  );

  const groups: Record<string, RegistryEntry[]> = {
    Benchmarks: registry.benchmarks || [],
    Models: registry.models || [],
    Portfolios: registry.portfolios || [],
  };

  const toggle = (id: string) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const fmtPct = (x: number) => `${(x * 100).toFixed(2)}%`;
  const fmt2 = (x: number) => x.toFixed(2);

  return (
    <div className="megagraph">
      <div className="selectors">
        {Object.entries(groups).map(([group, items]) => (
          <div className="group" key={group}>
            <div className="group-title">{group}</div>
            {items.map((e) => {
              const idx = selected.indexOf(e.id);
              const color = COLORS[(idx >= 0 ? idx : 0) % COLORS.length];
              return (
                <label key={e.id} className="opt">
                  <input
                    type="checkbox"
                    checked={selected.includes(e.id)}
                    onChange={() => toggle(e.id)}
                  />
                  <span className="swatch" style={{ background: color }} />
                  {e.label}
                </label>
              );
            })}
          </div>
        ))}
        <div className="actions">
          <button onClick={() => setSelected([])}>Clear</button>
        </div>
      </div>

      <div className="chart-wrap">
        <ResponsiveContainer width="100%" height={420}>
          <LineChart data={data} margin={{ top: 10, left: 0, right: 10, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" minTickGap={32} />
            <YAxis />
            <Tooltip />
            <Legend />
            {lines.map((row) => (
              <Line
                key={row.id}
                type="monotone"
                dataKey={row.id}
                name={row.label}
                dot={false}
                stroke={row.color}
                strokeWidth={2}
                isAnimationActive={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
        {loading && <div className="loading">Loading…</div>}
      </div>

      <div className="stats">
        <table>
          <thead>
            <tr>
              <th>Series</th>
              <th>CAGR</th>
              <th>Vol</th>
              <th>Sharpe</th>
              <th>Max DD</th>
            </tr>
          </thead>
          <tbody>
            {lines.map((row) => (
              <tr key={row.id}>
                <td>
                  <span className="swatch" style={{ background: row.color }} />
                  {row.label}
                </td>
                <td>{fmtPct(row.m.CAGR)}</td>
                <td>{fmtPct(row.m.VOL)}</td>
                <td>{fmt2(row.m.Sharpe)}</td>
                <td>{fmtPct(row.m.MDD)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style>{`
        .megagraph { display:grid; gap:1rem; }
        .selectors { display:flex; flex-wrap:wrap; gap:1rem; align-items:flex-start; }
        .group { border:1px solid #eee; border-radius:12px; padding:.75rem; min-width:220px; background:#fff; }
        .group-title { font-weight:700; margin-bottom:.5rem; }
        .opt { display:flex; align-items:center; gap:.5rem; margin:.25rem 0; }
        .swatch { display:inline-block; width:12px; height:12px; border-radius:3px; margin-right:.25rem; }
        .actions button{ border:1px solid #ddd; border-radius:10px; padding:.4rem .6rem; background:#fafafa; }
        .chart-wrap { position:relative; border:1px solid #eee; border-radius:12px; padding:.5rem; background:#fff; }
        .loading { position:absolute; right:12px; top:8px; color:#555; }
        .stats table { width:100%; border-collapse:collapse; background:#fff; border:1px solid #eee; border-radius:12px; overflow:hidden; }
        .stats th,.stats td{ padding:.5rem .6rem; border-bottom:1px solid #f2f2f2; text-align:left; }
        .stats tr:last-child td{ border-bottom:0; }
        @media (max-width:820px){ .selectors{flex-direction:column;} }
      `}</style>
    </div>
  );
}
