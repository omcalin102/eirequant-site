import React, { useRef, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';

function Chart({ id, option, className }) {
  const instRef = useRef(null);
  useEffect(() => {
    const onUpdate = (e) => {
      const detail = e.detail;
      if (!instRef.current || !detail) return;
      const which = (id ?? "").toLowerCase();
      if (which.includes("nav") && detail.nav) instRef.current.setOption(detail.nav, true);
      if (which.includes("dd") && detail.dd) instRef.current.setOption(detail.dd, true);
      if (which.includes("sh") && detail.sh) instRef.current.setOption(detail.sh, true);
    };
    const onReady = () => window.dispatchEvent(new Event("echarts:ready"));
    window.addEventListener("echarts:update", onUpdate);
    window.addEventListener("load", onReady);
    return () => {
      window.removeEventListener("echarts:update", onUpdate);
      window.removeEventListener("load", onReady);
    };
  }, [id]);
  return /* @__PURE__ */ React.createElement(
    ReactECharts,
    {
      option,
      className: className ?? "w-full h-80",
      onChartReady: (inst) => {
        instRef.current = inst;
      },
      opts: { renderer: "canvas" }
    }
  );
}

export { Chart as C };
