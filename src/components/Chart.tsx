import React, { useEffect, useRef } from "react";
import ReactECharts from "echarts-for-react";

type ChartProps = {
  /** Pass "navChart", "ddChart", or "shChart" so we know which updates to apply */
  id?: string;
  option: any;
  className?: string;
};

export default function Chart({ id, option, className }: ChartProps) {
  // hold the actual ECharts instance, set via onChartReady
  const instRef = useRef<any>(null);

  useEffect(() => {
    const onUpdate = (e: Event) => {
      const detail: any = (e as CustomEvent).detail;
      if (!instRef.current || !detail) return;

      const which = (id ?? "").toLowerCase();
      if (which.includes("nav") && detail.nav) instRef.current.setOption(detail.nav, true);
      if (which.includes("dd")  && detail.dd)  instRef.current.setOption(detail.dd, true);
      if (which.includes("sh")  && detail.sh)  instRef.current.setOption(detail.sh, true);
    };

    const onReady = () => window.dispatchEvent(new Event("echarts:ready"));

    window.addEventListener("echarts:update", onUpdate as EventListener);
    window.addEventListener("load", onReady);

    return () => {
      window.removeEventListener("echarts:update", onUpdate as EventListener);
      window.removeEventListener("load", onReady);
    };
  }, [id]);

  return (
    <ReactECharts
      option={option}
      className={className ?? "w-full h-80"}
      // safer than peeking into refs; provides the ECharts instance
      onChartReady={(inst: any) => { instRef.current = inst; }}
      opts={{ renderer: "canvas" }}
    />
  );
}
