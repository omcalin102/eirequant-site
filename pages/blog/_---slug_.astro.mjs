import { c as createComponent, d as createAstro, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_BGRiWwYu.mjs';
import 'kleur/colors';
import { $ as $$BaseLayout } from '../../chunks/BaseLayout_BeWkVdSl.mjs';
import { g as getCollection } from '../../chunks/_astro_content_GUi7wX1v.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro();
async function getStaticPaths() {
  const posts = await getCollection("posts");
  return posts.map((p) => ({ params: { slug: p.slug }, props: { post: p } }));
}
const $$ = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$;
  const { post } = Astro2.props;
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": `${post.data.title} \u2014 Blog` }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<article class="prose max-w-none"> <h1>${post.data.title}</h1> <p class="text-sm text-neutral-600">${post.data.date} · ${post.data.type?.toUpperCase?.()}</p> ${renderComponent($$result2, "post.Content", post.Content, {})} </article> ` })}`;
}, "C:/Users/pauli/OneDrive/Documents/Projects/live-project/eirequant-site/src/pages/blog/[...slug].astro", void 0);

const $$file = "C:/Users/pauli/OneDrive/Documents/Projects/live-project/eirequant-site/src/pages/blog/[...slug].astro";
const $$url = "/blog/[...slug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$,
  file: $$file,
  getStaticPaths,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
