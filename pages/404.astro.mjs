import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_BGRiWwYu.mjs';
import 'kleur/colors';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_BeWkVdSl.mjs';
export { renderers } from '../renderers.mjs';

const $$404 = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Not found \u2014 EIREQuant" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<h1 class="text-2xl font-semibold mb-6">Page not found</h1> <a class="underline" href="/">Go home</a> ` })}`;
}, "C:/Users/pauli/OneDrive/Documents/Projects/live-project/eirequant-site/src/pages/404.astro", void 0);

const $$file = "C:/Users/pauli/OneDrive/Documents/Projects/live-project/eirequant-site/src/pages/404.astro";
const $$url = "/404";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$404,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
