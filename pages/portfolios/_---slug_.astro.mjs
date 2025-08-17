import { c as createComponent, d as createAstro, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_BGRiWwYu.mjs';
import 'kleur/colors';
import { $ as $$BaseLayout } from '../../chunks/BaseLayout_BeWkVdSl.mjs';
import { g as getCollection } from '../../chunks/_astro_content_GUi7wX1v.mjs';
import { C as Chart } from '../../chunks/chart_B842jVlB.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro();
async function getStaticPaths() {
  const items = await getCollection("portfolios");
  return items.map((p) => ({ params: { slug: p.slug }, props: { entry: p } }));
}
const $$ = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$;
  const { entry } = Astro2.props;
  const demo = { tooltip: { trigger: "axis" }, xAxis: { type: "category", data: ["Jan", "Feb", "Mar", "Apr", "May"] }, yAxis: { type: "value" }, series: [{ type: "line", data: [1, 1.01, 1, 1.03, 1.06] }] };
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": `${entry.data.name} \u2014 Portfolio` }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<h1 class="text-2xl font-semibold">${entry.data.name}</h1> <p class="text-sm text-neutral-700 mt-2">${entry.data.objective}</p> <section class="rounded-2xl border border-neutral-200 bg-white p-6 mt-6"> <h2 class="font-semibold mb-3">Theory</h2> <p class="text-sm">Math/assumptions will be filled in; page is ready to ingest JSON results for the "Simulate" section below.</p> </section> <section class="rounded-2xl border border-neutral-200 bg-white p-6 mt-6"> <h2 class="font-semibold mb-3">Simulate (Chosen vs Baseline)</h2> <p class="text-sm mb-3">This will compare precomputed curves once artifacts are dropped.</p> ${renderComponent($$result2, "Chart", Chart, { "client:load": true, "id": "navChart", "option": demo, "client:component-hydration": "load", "client:component-path": "C:/Users/pauli/OneDrive/Documents/Projects/live-project/eirequant-site/src/components/Chart.tsx", "client:component-export": "default" })} </section> ` })}`;
}, "C:/Users/pauli/OneDrive/Documents/Projects/live-project/eirequant-site/src/pages/portfolios/[...slug].astro", void 0);

const $$file = "C:/Users/pauli/OneDrive/Documents/Projects/live-project/eirequant-site/src/pages/portfolios/[...slug].astro";
const $$url = "/portfolios/[...slug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$,
  file: $$file,
  getStaticPaths,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
