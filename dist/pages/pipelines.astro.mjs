import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_BGRiWwYu.mjs';
import 'kleur/colors';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_BeWkVdSl.mjs';
export { renderers } from '../renderers.mjs';

const $$Pipelines = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Pipelines \u2014 EIREQuant" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<h1 class="text-2xl font-semibold mb-6">Pipelines</h1> <div class="rounded-2xl border border-neutral-200 bg-white p-6">
\`\`\`mermaid
flowchart LR
  A[Ingestion] --> B[Features]
  B --> C[Training]
  C --> D[Reporting]
  D -->|Artifacts (JSON/CSV/MD)| E[Public Site Repo]
  E -->|GitHub Action build| F[GitHub Pages]</div>` })}`;
}, "C:/Users/pauli/OneDrive/Documents/Projects/live-project/eirequant-site/src/pages/pipelines.astro", void 0);

const $$file = "C:/Users/pauli/OneDrive/Documents/Projects/live-project/eirequant-site/src/pages/pipelines.astro";
const $$url = "/pipelines";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Pipelines,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
