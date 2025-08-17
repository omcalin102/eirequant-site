import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead, b as addAttribute } from '../chunks/astro/server_BGRiWwYu.mjs';
import 'kleur/colors';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_BeWkVdSl.mjs';
import { g as getCollection } from '../chunks/_astro_content_GUi7wX1v.mjs';
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const items = await getCollection("models");
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Models \u2014 EIREQuant" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<h1 class="text-2xl font-semibold mb-6">Models</h1> <div class="grid gap-6 md:grid-cols-2"> ${items.map((m) => renderTemplate`<a${addAttribute(`/models/${m.slug}/`, "href")} class="block rounded-2xl border border-neutral-200 bg-white p-6 hover:scale-[1.01] transition"> <div class="text-xs uppercase tracking-wide text-neutral-600">${m.data.family}</div> <h2 class="font-semibold mt-1">${m.data.name} <span class="text-neutral-600">(${m.data.version})</span></h2> <p class="text-sm text-neutral-700 mt-2 line-clamp-3">${m.data.synopsis}</p> </a>`)} </div> ` })}`;
}, "C:/Users/pauli/OneDrive/Documents/Projects/live-project/eirequant-site/src/pages/models/index.astro", void 0);

const $$file = "C:/Users/pauli/OneDrive/Documents/Projects/live-project/eirequant-site/src/pages/models/index.astro";
const $$url = "/models";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
