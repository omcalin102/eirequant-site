import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead, b as addAttribute } from '../chunks/astro/server_BGRiWwYu.mjs';
import 'kleur/colors';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_BeWkVdSl.mjs';
import { g as getCollection } from '../chunks/_astro_content_GUi7wX1v.mjs';
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const items = await getCollection("portfolios");
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Portfolios \u2014 EIREQuant" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<h1 class="text-2xl font-semibold mb-6">Portfolios</h1> <div class="grid gap-6 md:grid-cols-2"> ${items.length === 0 ? renderTemplate`<div class="rounded-2xl border border-neutral-200 bg-white p-6">Under construction.</div>` : items.map((p) => renderTemplate`<a${addAttribute(`/portfolios/${p.slug}/`, "href")} class="block rounded-2xl border border-neutral-200 bg-white p-6 hover:scale-[1.01] transition"> <h2 class="font-semibold">${p.data.name}</h2> <p class="text-sm text-neutral-700 mt-2">${p.data.objective}</p> </a>`)} </div> ` })}`;
}, "C:/Users/pauli/OneDrive/Documents/Projects/live-project/eirequant-site/src/pages/portfolios/index.astro", void 0);

const $$file = "C:/Users/pauli/OneDrive/Documents/Projects/live-project/eirequant-site/src/pages/portfolios/index.astro";
const $$url = "/portfolios";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
