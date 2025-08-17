import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead, b as addAttribute } from '../chunks/astro/server_BGRiWwYu.mjs';
import 'kleur/colors';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_BeWkVdSl.mjs';
import { g as getCollection } from '../chunks/_astro_content_GUi7wX1v.mjs';
export { renderers } from '../renderers.mjs';

const $$Blog = createComponent(async ($$result, $$props, $$slots) => {
  const posts = (await getCollection("posts")).sort((a, b) => a.data.date < b.data.date ? 1 : -1);
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Blog \u2014 EIREQuant" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<h1 class="text-2xl font-semibold mb-6">Blog</h1> <div class="grid gap-6"> ${posts.map((p) => renderTemplate`<a${addAttribute(`/blog/${p.slug}/`, "href")} class="block rounded-2xl border border-neutral-200 bg-white p-6 hover:scale-[1.01] transition"> <h2 class="font-semibold">${p.data.title}</h2> <p class="text-xs text-neutral-600 mt-1">${p.data.date} · ${p.data.type?.toUpperCase?.() ?? ""}</p> ${p.data.summary && renderTemplate`<p class="text-sm text-neutral-700 mt-2">${p.data.summary}</p>`} </a>`)} </div> ` })}`;
}, "C:/Users/pauli/OneDrive/Documents/Projects/live-project/eirequant-site/src/pages/blog.astro", void 0);

const $$file = "C:/Users/pauli/OneDrive/Documents/Projects/live-project/eirequant-site/src/pages/blog.astro";
const $$url = "/blog";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Blog,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
