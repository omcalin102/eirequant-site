import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_BGRiWwYu.mjs';
import 'kleur/colors';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_BeWkVdSl.mjs';
import React, { useState, useEffect, useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
export { renderers } from '../renderers.mjs';

async function fetchJSON(url) {
  try {
    const r = await fetch(url);
    if (!r.ok) return null;
    return await r.json();
  } catch {
    return null;
  }
}
function ddFromNav(nav) {
  let peak = nav[0] ?? 1;
  return nav.map((v) => {
    peak = Math.max(peak, v);
    return v / peak - 1;
  });
}
function rollSharpe(ret, win = 60) {
  const out = [];
  for (let i = 0; i < ret.length; i++) {
    const s = Math.max(0, i - win + 1);
    const sl = ret.slice(s, i + 1);
    const m = sl.reduce((a, b) => a + b, 0) / (sl.length || 1);
    const sd = Math.sqrt(sl.reduce((a, b) => a + (b - m) ** 2, 0) / (sl.length || 1));
    out.push(sd ? m / sd * Math.sqrt(252) : 0);
  }
  return out;
}
function MegaGraph() {
  const [reg, setReg] = useState(null);
  const [selected, setSelected] = useState([]);
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    (async () => {
      const r = await fetchJSON("/data/universe_v1/registry.json");
      setReg(r);
      if (r?.curves?.length) setSelected(r.curves.slice(0, 3).map((c) => c.id));
    })();
  }, []);
  useEffect(() => {
    (async () => {
      if (!reg) return;
      setLoading(true);
      const out = [];
      for (const id of selected) {
        const meta = reg.curves.find((c) => c.id === id);
        if (!meta?.path) continue;
        const j = await fetchJSON(`/data/universe_v1/${meta.path}`);
        if (!j) continue;
        out.push({ id, label: j.label ?? id, dates: j.dates ?? [], nav: j.nav ?? [], ret: j.ret ?? [] });
      }
      setSeries(out);
      setLoading(false);
    })();
  }, [reg, selected]);
  const navOpt = useMemo(() => ({
    tooltip: { trigger: "axis" },
    legend: {},
    xAxis: { type: "category", data: series[0]?.dates ?? [] },
    yAxis: { type: "value" },
    series: series.map((s) => ({ name: s.label, type: "line", data: s.nav }))
  }), [series]);
  const ddOpt = useMemo(() => ({
    tooltip: { trigger: "axis" },
    legend: {},
    xAxis: { type: "category", data: series[0]?.dates ?? [] },
    yAxis: { type: "value" },
    series: series.map((s) => ({ name: s.label, type: "line", data: ddFromNav(s.nav) }))
  }), [series]);
  const shOpt = useMemo(() => ({
    tooltip: { trigger: "axis" },
    legend: {},
    xAxis: { type: "category", data: series[0]?.dates ?? [] },
    yAxis: { type: "value" },
    series: series.map((s) => ({ name: s.label, type: "line", data: rollSharpe(s.ret) }))
  }), [series]);
  return /* @__PURE__ */ React.createElement("div", { className: "space-y-4" }, reg ? /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap gap-2" }, reg.curves.map((c) => /* @__PURE__ */ React.createElement("label", { key: c.id, className: "text-sm inline-flex items-center gap-2 border px-3 py-1.5 rounded-lg" }, /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "checkbox",
      checked: selected.includes(c.id),
      onChange: (e) => setSelected((prev) => e.target.checked ? [.../* @__PURE__ */ new Set([...prev, c.id])] : prev.filter((x) => x !== c.id))
    }
  ), c.label))) : /* @__PURE__ */ React.createElement("div", { className: "rounded-2xl border bg-yellow-50 p-4" }, "No registry yet. Drop files under ", /* @__PURE__ */ React.createElement("code", null, "/public/data/universe_v1/"), "."), loading && /* @__PURE__ */ React.createElement("div", { className: "text-sm text-neutral-600" }, "Loading curves…"), /* @__PURE__ */ React.createElement("div", { className: "rounded-2xl border bg-white p-4" }, /* @__PURE__ */ React.createElement("h2", { className: "font-medium mb-2" }, "Cumulative NAV"), /* @__PURE__ */ React.createElement(ReactECharts, { option: navOpt, className: "w-full h-80" })), /* @__PURE__ */ React.createElement("div", { className: "rounded-2xl border bg-white p-4" }, /* @__PURE__ */ React.createElement("h2", { className: "font-medium mb-2" }, "Drawdown"), /* @__PURE__ */ React.createElement(ReactECharts, { option: ddOpt, className: "w-full h-80" })), /* @__PURE__ */ React.createElement("div", { className: "rounded-2xl border bg-white p-4" }, /* @__PURE__ */ React.createElement("h2", { className: "font-medium mb-2" }, "Rolling Sharpe (60d)"), /* @__PURE__ */ React.createElement(ReactECharts, { option: shOpt, className: "w-full h-80" })));
}

const $$Performance = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Performance \u2014 EIREQuant" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<h1 class="text-2xl font-semibold mb-4">Mega Graph</h1> <p class="text-sm text-neutral-600 mb-4">Compare S&P vs models/portfolios. Curves load from static JSON in <code>/public/data/</code>.</p> ${renderComponent($$result2, "MegaGraph", MegaGraph, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/pauli/OneDrive/Documents/Projects/live-project/eirequant-site/src/components/MegaGraph.tsx", "client:component-export": "default" })} ` })}`;
}, "C:/Users/pauli/OneDrive/Documents/Projects/live-project/eirequant-site/src/pages/performance.astro", void 0);

const $$file = "C:/Users/pauli/OneDrive/Documents/Projects/live-project/eirequant-site/src/pages/performance.astro";
const $$url = "/performance";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Performance,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
