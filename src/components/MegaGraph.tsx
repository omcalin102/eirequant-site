import React, { useEffect, useMemo, useState } from "react";
import ReactECharts from "echarts-for-react";

type Curve = { id: string; label: string; path: string; family?: string[] };
type Registry = { universe: string; curves: Curve[] };
type Series = { id: string; label: string; dates: string[]; nav: number[]; ret: number[] };

async function fetchJSON<T = any>(url: string): Promise<T | null> {
  try {
    const r = await fetch(url);
    if (!r.ok) return null;
    return await r.json();
  } catch {
    return null;
  }
}
function ddFromNav(nav: number[]) {
  let peak = nav[0] ?? 1;
  return nav.map((v) => {
    peak = Math.max(peak, v);
    return v / peak - 1;
  });
}
function rollSharpe(ret: number[], win = 60) {
  const out: number[] = [];
  for (let i = 0; i < ret.length; i++) {
    const s = Math.max(0, i - win + 1);
    const sl = ret.slice(s, i + 1);
    const m = sl.reduce((a, b) => a + b, 0) / (sl.length || 1);
    const sd = Math.sqrt(sl.reduce((a, b) => a + (b - m) ** 2, 0) / (sl.length || 1));
    out.push(sd ? (m / sd) * Math.sqrt(252) : 0);
  }
  return out;
}

export default function MegaGraph() {
  const [reg, setReg] = useState<Registry | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [series, setSeries] = useState<Series[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const r = await fetchJSON<Registry>("/data/universe_v1/registry.json");
      setReg(r);
      if (r?.curves?.length) setSelected(r.curves.slice(0, 2).map((c) => c.id));
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (!reg) return;
      setLoading(true);
      const out: Series[] = [];
      for (const id of selected) {
        const meta = reg.curves.find((c) => c.id === id);
        if (!meta?.path) continue;
        const j: any = await fetchJSON(`/data/universe_v1/${meta.path}`);
        if (!j) continue;
        out.push({
          id,
          label: j.label ?? id,
          dates: j.dates ?? [],
          nav: j.nav ?? [],
          ret: j.ret ?? [],
        });
      }
      setSeries(out);
      setLoading(false);
    })();
  }, [reg, selected]);

  const navOpt = useMemo(
    () => ({
      tooltip: { trigger: "axis" },
      legend: {},
      xAxis: { type: "category", data: series[0]?.dates ?? [] },
      yAxis: { type: "value" },
      series: series.map((s) => ({ name: s.label, type: "line", data: s.nav })),
    }),
    [series]
  );

  const ddOpt = useMemo(
    () => ({
      tooltip: { trigger: "axis" },
      legend: {},
      xAxis: { type: "category", data: series[0]?.dates ?? [] },
      yAxis: { type: "value" },
      series: series.map((s) => ({ name: s.label, type: "line", data: ddFromNav(s.nav) })),
    }),
    [series]
  );

  const shOpt = useMemo(
    () => ({
      tooltip: { trigger: "axis" },
      legend: {},
      xAxis: { type: "category", data: series[0]?.dates ?? [] },
      yAxis: { type: "value" },
      series: series.map((s) => ({ name: s.label, type: "line", data: rollSharpe(s.ret) })),
    }),
    [series]
  );

  return (
    <div className="space-y-4">
      {reg ? (
        <div className="flex flex-wrap gap-2">
          {reg.curves.map((c) => (
            <label key={c.id} className="text-sm inline-flex items-center gap-2 border px-3 py-1.5 rounded-lg">
              <input
                type="checkbox"
                checked={selected.includes(c.id)}
                onChange={(e) =>
                  setSelected((prev) => (e.target.checked ? [...new Set([...prev, c.id])] : prev.filter((x) => x !== c.id)))
                }
              />
              {c.label}
            </label>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border bg-yellow-50 p-4">
          No registry yet. Drop files under <code>/public/data/universe_v1/</code>.
        </div>
      )}

      {loading && <div className="text-sm text-neutral-600">Loading curves…</div>}

      <div className="rounded-2xl border bg-white p-4">
        <h2 className="font-medium mb-2">Cumulative NAV</h2>
        <ReactECharts option={navOpt} className="w-full h-80" />
      </div>
      <div className="rounded-2xl border bg-white p-4">
        <h2 className="font-medium mb-2">Drawdown</h2>
        <ReactECharts option={ddOpt} className="w-full h-80" />
      </div>
      <div className="rounded-2xl border bg-white p-4">
        <h2 className="font-medium mb-2">Rolling Sharpe (60d)</h2>
        <ReactECharts option={shOpt} className="w-full h-80" />
      </div>
    </div>
  );
}
