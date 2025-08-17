import { c as createComponent, d as createAstro, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_BGRiWwYu.mjs';
import 'kleur/colors';
import { $ as $$BaseLayout } from '../../chunks/BaseLayout_BeWkVdSl.mjs';
import { g as getCollection } from '../../chunks/_astro_content_GUi7wX1v.mjs';
import { C as Chart } from '../../chunks/chart_B842jVlB.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro();
async function getStaticPaths() {
  const models = await getCollection("models");
  return models.map((m) => ({ params: { slug: m.slug }, props: { entry: m } }));
}
const $$ = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$;
  const { entry } = Astro2.props;
  const demo = { tooltip: { trigger: "axis" }, xAxis: { type: "category", data: ["Jan", "Feb", "Mar", "Apr", "May"] }, yAxis: { type: "value" }, series: [{ type: "line", data: [1, 1.02, 0.98, 1.05, 1.08] }] };
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": `${entry.data.name} \u2014 Models` }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<h1 class="text-2xl font-semibold">${entry.data.name} <span class="text-neutral-600">(${entry.data.version})</span></h1> <p class="text-sm text-neutral-700 mt-2">${entry.data.synopsis}</p> <div class="mt-8 grid gap-6 md:grid-cols-2"> <section class="rounded-2xl border border-neutral-200 bg-white p-6"> <h2 class="font-semibold mb-3">Quick Metrics</h2> <ul class="text-sm text-neutral-800 list-disc pl-5"> <li>Sharpe / MaxDD will populate from metrics.json (when available)</li> </ul> </section> <section class="rounded-2xl border border-neutral-200 bg-white p-6"> <h2 class="font-semibold mb-3">Equity Curve (demo)</h2> ${renderComponent($$result2, "Chart", Chart, { "client:load": true, "id": "navChart", "option": demo, "client:component-hydration": "load", "client:component-path": "C:/Users/pauli/OneDrive/Documents/Projects/live-project/eirequant-site/src/components/Chart.tsx", "client:component-export": "default" })} </section> </div> ` })}`;
}, "C:/Users/pauli/OneDrive/Documents/Projects/live-project/eirequant-site/src/pages/models/[...slug].astro", void 0);

const $$file = "C:/Users/pauli/OneDrive/Documents/Projects/live-project/eirequant-site/src/pages/models/[...slug].astro";
const $$url = "/models/[...slug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$,
  file: $$file,
  getStaticPaths,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
