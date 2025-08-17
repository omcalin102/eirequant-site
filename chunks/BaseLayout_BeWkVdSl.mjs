import { c as createComponent, d as createAstro, b as addAttribute, h as renderHead, i as renderSlot, a as renderTemplate } from './astro/server_BGRiWwYu.mjs';
import 'kleur/colors';
import 'clsx';

const $$Astro = createAstro();
const $$BaseLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$BaseLayout;
  const { title = "EireQuant", description = "" } = Astro2.props;
  return renderTemplate`<html lang="en"> <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${title}</title><meta name="description"${addAttribute(description, "content")}><link rel="stylesheet" href="/src/styles/global.css">${renderHead()}</head> <body class="bg-neutral-50 text-neutral-900 font-sans antialiased"> <header class="p-4 shadow-md bg-white"> <nav class="max-w-6xl mx-auto flex justify-between items-center"> <a href="/" class="font-bold text-xl">EireQuant</a> <ul class="flex gap-6 text-sm"> <li><a href="/models">Models</a></li> <li><a href="/portfolios">Portfolios</a></li> <li><a href="/pipelines">Pipelines</a></li> <li><a href="/blog">Blog</a></li> <li><a href="/about">About</a></li> </ul> </nav> </header> <main class="max-w-6xl mx-auto p-6"> ${renderSlot($$result, $$slots["default"])} </main> <footer class="mt-10 border-t py-6 text-sm text-neutral-500"> <div class="max-w-6xl mx-auto flex justify-between"> <span>© ${(/* @__PURE__ */ new Date()).getFullYear()} EireQuant</span> <span><a href="/contact">Contact</a></span> </div> </footer> </body></html>`;
}, "C:/Users/pauli/OneDrive/Documents/Projects/live-project/eirequant-site/src/layouts/BaseLayout.astro", void 0);

export { $$BaseLayout as $ };
