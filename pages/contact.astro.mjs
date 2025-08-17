import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_BGRiWwYu.mjs';
import 'kleur/colors';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_BeWkVdSl.mjs';
export { renderers } from '../renderers.mjs';

const $$Contact = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Contact \u2014 EIREQuant" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<h1 class="text-2xl font-semibold mb-6">Contact</h1> <p>Email: <a class="underline" href="mailto:hello@eirequant.com">hello@eirequant.com</a></p> ` })}`;
}, "C:/Users/pauli/OneDrive/Documents/Projects/live-project/eirequant-site/src/pages/contact.astro", void 0);

const $$file = "C:/Users/pauli/OneDrive/Documents/Projects/live-project/eirequant-site/src/pages/contact.astro";
const $$url = "/contact";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Contact,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
