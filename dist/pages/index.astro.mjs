import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_BGRiWwYu.mjs';
import 'kleur/colors';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_BeWkVdSl.mjs';
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "EireQuant" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="text-center py-16"> <h1 class="text-4xl font-bold mb-4">EireQuant</h1> <p class="text-lg text-neutral-600 max-w-2xl mx-auto">
A next-generation quantitative research platform —
      blending model families, portfolios, and real-time pipelines into one open showcase.
</p> <div class="mt-8 flex gap-4 justify-center"> <a href="/models" class="px-6 py-3 bg-black text-white rounded-lg">Explore Models</a> <a href="/blog" class="px-6 py-3 border rounded-lg">Read Blog</a> </div> </section> ` })}`;
}, "C:/Users/pauli/OneDrive/Documents/Projects/live-project/eirequant-site/src/pages/index.astro", void 0);

const $$file = "C:/Users/pauli/OneDrive/Documents/Projects/live-project/eirequant-site/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
