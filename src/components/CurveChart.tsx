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
  AreaChart,
  Area,
} from "recharts";

type CurvePoint = { date: string; value: number };
type CurveFile = { series: CurvePoint[]; meta?: { label?: string } };

const isAbsolutePath = (s: string) => s.startsWith("/") || s.startsWith("http");

async function getCurve(chartKeyOrPath: string): Promise<CurveFile> {
  const url = isAbsolutePath(chartKeyOrPath)
    ? chartKeyOrPath
    : `/data/universe_v1/curves/${chartKeyOrPath}.json`;
  const res = await fetch(url, { cache: "no-cache" as RequestCache });
  if (!res.ok) throw new Error(`Curve fetch failed: ${url}`);
  return res.json();
}

export function drawdownFromSeries(series: CurvePoint[]) {
  let peak = 0;
  return series.map((p) => {
    peak = Math.max(peak, p.value || 0);
    const dd = peak ? p.value / peak - 1 : 0;
    return { date: p.date, value: dd };
  });
}

type Props = { chartKey: string; title?: string; showDrawdown?: boolean };

export default function CurveChart({
  chartKey,
  title = "Equity Curve",
  showDrawdown = false,
}: Props) {
  const [file, setFile] = useState<CurveFile | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    setFile(null);
    setErr(null);
    if (!chartKey) {
      setErr("No chartKey provided.");
      return;
    }
    getCurve(chartKey)
      .then(setFile)
      .catch((e) => setErr(String(e)));
  }, [chartKey]);

  const ddSeries = useMemo(
    () => (file ? drawdownFromSeries(file.series) : []),
    [file]
  );

  if (err) return <div style={{ color: "#b91c1c" }}>{err}</div>;
  if (!file) return <div>Loading…</div>;

  return (
    <div className="curve">
      <h3>{title}</h3>
      <div className="panel">
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={file.series}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" minTickGap={30} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="value"
              name={file.meta?.label || "Equity"}
              dot={false}
              stroke="#2563eb"
              strokeWidth={2}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {showDrawdown && (
        <div className="panel">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={ddSeries}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" minTickGap={30} />
              <YAxis tickFormatter={(v: number) => `${(v * 100).toFixed(0)}%`} />
              <Tooltip formatter={(v: number) => [`${(v * 100).toFixed(2)}%`, "Drawdown"]} />
              <Area
                type="monotone"
                dataKey="value"
                name="Drawdown"
                stroke="#dc2626"
                fill="#fecaca"
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      <style>{`
        .curve h3{ margin:.25rem 0 .5rem; }
        .panel{ border:1px solid #eee; border-radius:12px; padding:.5rem; background:#fff; margin-bottom:.5rem; }
      `}</style>
    </div>
  );
}
