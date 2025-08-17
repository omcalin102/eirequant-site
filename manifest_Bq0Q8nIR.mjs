import '@astrojs/internal-helpers/path';
import 'kleur/colors';
import { N as NOOP_MIDDLEWARE_HEADER, j as decodeKey } from './chunks/astro/server_BGRiWwYu.mjs';
import 'clsx';
import 'cookie';
import 'es-module-lexer';
import 'html-escaper';

const NOOP_MIDDLEWARE_FN = async (_ctx, next) => {
  const response = await next();
  response.headers.set(NOOP_MIDDLEWARE_HEADER, "true");
  return response;
};

const codeToStatusMap = {
  // Implemented from IANA HTTP Status Code Registry
  // https://www.iana.org/assignments/http-status-codes/http-status-codes.xhtml
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  PAYMENT_REQUIRED: 402,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  NOT_ACCEPTABLE: 406,
  PROXY_AUTHENTICATION_REQUIRED: 407,
  REQUEST_TIMEOUT: 408,
  CONFLICT: 409,
  GONE: 410,
  LENGTH_REQUIRED: 411,
  PRECONDITION_FAILED: 412,
  CONTENT_TOO_LARGE: 413,
  URI_TOO_LONG: 414,
  UNSUPPORTED_MEDIA_TYPE: 415,
  RANGE_NOT_SATISFIABLE: 416,
  EXPECTATION_FAILED: 417,
  MISDIRECTED_REQUEST: 421,
  UNPROCESSABLE_CONTENT: 422,
  LOCKED: 423,
  FAILED_DEPENDENCY: 424,
  TOO_EARLY: 425,
  UPGRADE_REQUIRED: 426,
  PRECONDITION_REQUIRED: 428,
  TOO_MANY_REQUESTS: 429,
  REQUEST_HEADER_FIELDS_TOO_LARGE: 431,
  UNAVAILABLE_FOR_LEGAL_REASONS: 451,
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
  HTTP_VERSION_NOT_SUPPORTED: 505,
  VARIANT_ALSO_NEGOTIATES: 506,
  INSUFFICIENT_STORAGE: 507,
  LOOP_DETECTED: 508,
  NETWORK_AUTHENTICATION_REQUIRED: 511
};
Object.entries(codeToStatusMap).reduce(
  // reverse the key-value pairs
  (acc, [key, value]) => ({ ...acc, [value]: key }),
  {}
);

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex,
    origin: rawRouteData.origin
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///C:/Users/pauli/OneDrive/Documents/Projects/live-project/eirequant-site/","cacheDir":"file:///C:/Users/pauli/OneDrive/Documents/Projects/live-project/eirequant-site/node_modules/.astro/","outDir":"file:///C:/Users/pauli/OneDrive/Documents/Projects/live-project/eirequant-site/dist/","srcDir":"file:///C:/Users/pauli/OneDrive/Documents/Projects/live-project/eirequant-site/src/","publicDir":"file:///C:/Users/pauli/OneDrive/Documents/Projects/live-project/eirequant-site/public/","buildClientDir":"file:///C:/Users/pauli/OneDrive/Documents/Projects/live-project/eirequant-site/dist/client/","buildServerDir":"file:///C:/Users/pauli/OneDrive/Documents/Projects/live-project/eirequant-site/dist/server/","adapterName":"","routes":[{"file":"file:///C:/Users/pauli/OneDrive/Documents/Projects/live-project/eirequant-site/dist/404.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/404","isIndex":false,"type":"page","pattern":"^\\/404\\/?$","segments":[[{"content":"404","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/404.astro","pathname":"/404","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"file:///C:/Users/pauli/OneDrive/Documents/Projects/live-project/eirequant-site/dist/blog/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/blog","isIndex":false,"type":"page","pattern":"^\\/blog\\/?$","segments":[[{"content":"blog","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/blog.astro","pathname":"/blog","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"file:///C:/Users/pauli/OneDrive/Documents/Projects/live-project/eirequant-site/dist/contact/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/contact","isIndex":false,"type":"page","pattern":"^\\/contact\\/?$","segments":[[{"content":"contact","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/contact.astro","pathname":"/contact","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"file:///C:/Users/pauli/OneDrive/Documents/Projects/live-project/eirequant-site/dist/disclaimer/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/disclaimer","isIndex":false,"type":"page","pattern":"^\\/disclaimer\\/?$","segments":[[{"content":"disclaimer","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/disclaimer.astro","pathname":"/disclaimer","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"file:///C:/Users/pauli/OneDrive/Documents/Projects/live-project/eirequant-site/dist/eirequant/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/eirequant","isIndex":false,"type":"page","pattern":"^\\/eirequant\\/?$","segments":[[{"content":"eirequant","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/eirequant.astro","pathname":"/eirequant","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"file:///C:/Users/pauli/OneDrive/Documents/Projects/live-project/eirequant-site/dist/models/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/models","isIndex":true,"type":"page","pattern":"^\\/models\\/?$","segments":[[{"content":"models","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/models/index.astro","pathname":"/models","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"file:///C:/Users/pauli/OneDrive/Documents/Projects/live-project/eirequant-site/dist/performance/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/performance","isIndex":false,"type":"page","pattern":"^\\/performance\\/?$","segments":[[{"content":"performance","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/performance.astro","pathname":"/performance","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"file:///C:/Users/pauli/OneDrive/Documents/Projects/live-project/eirequant-site/dist/pipelines/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/pipelines","isIndex":false,"type":"page","pattern":"^\\/pipelines\\/?$","segments":[[{"content":"pipelines","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/pipelines.astro","pathname":"/pipelines","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"file:///C:/Users/pauli/OneDrive/Documents/Projects/live-project/eirequant-site/dist/portfolios/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/portfolios","isIndex":true,"type":"page","pattern":"^\\/portfolios\\/?$","segments":[[{"content":"portfolios","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/portfolios/index.astro","pathname":"/portfolios","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"file:///C:/Users/pauli/OneDrive/Documents/Projects/live-project/eirequant-site/dist/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}}],"base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["\u0000astro:content",{"propagation":"in-tree","containsHead":false}],["C:/Users/pauli/OneDrive/Documents/Projects/live-project/eirequant-site/src/pages/blog.astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/blog@_@astro",{"propagation":"in-tree","containsHead":false}],["C:/Users/pauli/OneDrive/Documents/Projects/live-project/eirequant-site/src/pages/blog/[...slug].astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/blog/[...slug]@_@astro",{"propagation":"in-tree","containsHead":false}],["C:/Users/pauli/OneDrive/Documents/Projects/live-project/eirequant-site/src/pages/models/[...slug].astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/models/[...slug]@_@astro",{"propagation":"in-tree","containsHead":false}],["C:/Users/pauli/OneDrive/Documents/Projects/live-project/eirequant-site/src/pages/models/index.astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/models/index@_@astro",{"propagation":"in-tree","containsHead":false}],["C:/Users/pauli/OneDrive/Documents/Projects/live-project/eirequant-site/src/pages/portfolios/[...slug].astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/portfolios/[...slug]@_@astro",{"propagation":"in-tree","containsHead":false}],["C:/Users/pauli/OneDrive/Documents/Projects/live-project/eirequant-site/src/pages/portfolios/index.astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/portfolios/index@_@astro",{"propagation":"in-tree","containsHead":false}],["C:/Users/pauli/OneDrive/Documents/Projects/live-project/eirequant-site/src/pages/404.astro",{"propagation":"none","containsHead":true}],["C:/Users/pauli/OneDrive/Documents/Projects/live-project/eirequant-site/src/pages/contact.astro",{"propagation":"none","containsHead":true}],["C:/Users/pauli/OneDrive/Documents/Projects/live-project/eirequant-site/src/pages/disclaimer.astro",{"propagation":"none","containsHead":true}],["C:/Users/pauli/OneDrive/Documents/Projects/live-project/eirequant-site/src/pages/eirequant.astro",{"propagation":"none","containsHead":true}],["C:/Users/pauli/OneDrive/Documents/Projects/live-project/eirequant-site/src/pages/index.astro",{"propagation":"none","containsHead":true}],["C:/Users/pauli/OneDrive/Documents/Projects/live-project/eirequant-site/src/pages/performance.astro",{"propagation":"none","containsHead":true}],["C:/Users/pauli/OneDrive/Documents/Projects/live-project/eirequant-site/src/pages/pipelines.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000noop-middleware":"_noop-middleware.mjs","\u0000noop-actions":"_noop-actions.mjs","\u0000@astro-page:src/pages/404@_@astro":"pages/404.astro.mjs","\u0000@astro-page:src/pages/blog@_@astro":"pages/blog.astro.mjs","\u0000@astro-page:src/pages/blog/[...slug]@_@astro":"pages/blog/_---slug_.astro.mjs","\u0000@astro-page:src/pages/contact@_@astro":"pages/contact.astro.mjs","\u0000@astro-page:src/pages/disclaimer@_@astro":"pages/disclaimer.astro.mjs","\u0000@astro-page:src/pages/eirequant@_@astro":"pages/eirequant.astro.mjs","\u0000@astro-page:src/pages/models/index@_@astro":"pages/models.astro.mjs","\u0000@astro-page:src/pages/models/[...slug]@_@astro":"pages/models/_---slug_.astro.mjs","\u0000@astro-page:src/pages/performance@_@astro":"pages/performance.astro.mjs","\u0000@astro-page:src/pages/pipelines@_@astro":"pages/pipelines.astro.mjs","\u0000@astro-page:src/pages/portfolios/index@_@astro":"pages/portfolios.astro.mjs","\u0000@astro-page:src/pages/portfolios/[...slug]@_@astro":"pages/portfolios/_---slug_.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astrojs-manifest":"manifest_Bq0Q8nIR.mjs","C:\\Users\\pauli\\OneDrive\\Documents\\Projects\\live-project\\eirequant-site\\.astro\\content-assets.mjs":"chunks/content-assets_DleWbedO.mjs","C:\\Users\\pauli\\OneDrive\\Documents\\Projects\\live-project\\eirequant-site\\.astro\\content-modules.mjs":"chunks/content-modules_Dz-S_Wwv.mjs","\u0000astro:data-layer-content":"chunks/_astro_data-layer-content_C_0wKc5K.mjs","C:/Users/pauli/OneDrive/Documents/Projects/live-project/eirequant-site/node_modules/astro/dist/assets/services/sharp.js":"chunks/sharp_yw2t8OJO.mjs","C:/Users/pauli/OneDrive/Documents/Projects/live-project/eirequant-site/src/components/Chart.tsx":"_astro/Chart.BeBYOhqO.js","C:/Users/pauli/OneDrive/Documents/Projects/live-project/eirequant-site/src/components/MegaGraph.tsx":"_astro/MegaGraph.PfwQ4ej7.js","C:/Users/pauli/OneDrive/Documents/Projects/live-project/eirequant-site/node_modules/mermaid/dist/chunks/mermaid.core/c4Diagram-6F6E4RAY.mjs":"_astro/c4Diagram-6F6E4RAY.Jjibus5k.js","C:/Users/pauli/OneDrive/Documents/Projects/live-project/eirequant-site/node_modules/mermaid/dist/chunks/mermaid.core/flowDiagram-KYDEHFYC.mjs":"_astro/flowDiagram-KYDEHFYC.C_N8cOsR.js","C:/Users/pauli/OneDrive/Documents/Projects/live-project/eirequant-site/node_modules/mermaid/dist/chunks/mermaid.core/erDiagram-3M52JZNH.mjs":"_astro/erDiagram-3M52JZNH.X8sdWTuw.js","C:/Users/pauli/OneDrive/Documents/Projects/live-project/eirequant-site/node_modules/mermaid/dist/chunks/mermaid.core/gitGraphDiagram-GW3U2K7C.mjs":"_astro/gitGraphDiagram-GW3U2K7C.DE3MJ0C0.js","C:/Users/pauli/OneDrive/Documents/Projects/live-project/eirequant-site/node_modules/mermaid/dist/chunks/mermaid.core/infoDiagram-LHK5PUON.mjs":"_astro/infoDiagram-LHK5PUON.CKkcMrvM.js","C:/Users/pauli/OneDrive/Documents/Projects/live-project/eirequant-site/node_modules/mermaid/dist/chunks/mermaid.core/quadrantDiagram-2OG54O6I.mjs":"_astro/quadrantDiagram-2OG54O6I.CTbAdkcg.js","C:/Users/pauli/OneDrive/Documents/Projects/live-project/eirequant-site/node_modules/mermaid/dist/chunks/mermaid.core/requirementDiagram-QOLK2EJ7.mjs":"_astro/requirementDiagram-QOLK2EJ7.D0OG38iS.js","C:/Users/pauli/OneDrive/Documents/Projects/live-project/eirequant-site/node_modules/mermaid/dist/chunks/mermaid.core/sequenceDiagram-SKLFT4DO.mjs":"_astro/sequenceDiagram-SKLFT4DO.zMsONH5O.js","C:/Users/pauli/OneDrive/Documents/Projects/live-project/eirequant-site/node_modules/mermaid/dist/chunks/mermaid.core/classDiagram-M3E45YP4.mjs":"_astro/classDiagram-M3E45YP4.DN2655kk.js","C:/Users/pauli/OneDrive/Documents/Projects/live-project/eirequant-site/node_modules/mermaid/dist/chunks/mermaid.core/classDiagram-v2-YAWTLIQI.mjs":"_astro/classDiagram-v2-YAWTLIQI.DN2655kk.js","C:/Users/pauli/OneDrive/Documents/Projects/live-project/eirequant-site/node_modules/mermaid/dist/chunks/mermaid.core/stateDiagram-MI5ZYTHO.mjs":"_astro/stateDiagram-MI5ZYTHO.D-gLxADh.js","C:/Users/pauli/OneDrive/Documents/Projects/live-project/eirequant-site/node_modules/mermaid/dist/chunks/mermaid.core/stateDiagram-v2-5AN5P6BG.mjs":"_astro/stateDiagram-v2-5AN5P6BG.uL-zsqaD.js","C:/Users/pauli/OneDrive/Documents/Projects/live-project/eirequant-site/node_modules/mermaid/dist/chunks/mermaid.core/journeyDiagram-EWQZEKCU.mjs":"_astro/journeyDiagram-EWQZEKCU.C1DvKYrq.js","C:/Users/pauli/OneDrive/Documents/Projects/live-project/eirequant-site/node_modules/mermaid/dist/chunks/mermaid.core/timeline-definition-MYPXXCX6.mjs":"_astro/timeline-definition-MYPXXCX6.D6LoVzjE.js","C:/Users/pauli/OneDrive/Documents/Projects/live-project/eirequant-site/node_modules/mermaid/dist/chunks/mermaid.core/kanban-definition-ZSS6B67P.mjs":"_astro/kanban-definition-ZSS6B67P.DRQipXXz.js","C:/Users/pauli/OneDrive/Documents/Projects/live-project/eirequant-site/node_modules/mermaid/dist/chunks/mermaid.core/diagram-5UYTHUR4.mjs":"_astro/diagram-5UYTHUR4.fbrfwI4W.js","C:/Users/pauli/OneDrive/Documents/Projects/live-project/eirequant-site/node_modules/mermaid/dist/chunks/mermaid.core/diagram-ZTM2IBQH.mjs":"_astro/diagram-ZTM2IBQH.kDaV1b3Z.js","C:/Users/pauli/OneDrive/Documents/Projects/live-project/eirequant-site/node_modules/mermaid/dist/chunks/mermaid.core/blockDiagram-6J76NXCF.mjs":"_astro/blockDiagram-6J76NXCF.B8SNY8Ms.js","C:/Users/pauli/OneDrive/Documents/Projects/live-project/eirequant-site/node_modules/katex/dist/katex.mjs":"_astro/katex.DsmCZfJr.js","astro:scripts/page.js":"_astro/page.BDyLB3EG.js","C:/Users/pauli/OneDrive/Documents/Projects/live-project/eirequant-site/node_modules/mermaid/dist/chunks/mermaid.core/dagre-JOIXM2OF.mjs":"_astro/dagre-JOIXM2OF.DVgPEvgl.js","C:/Users/pauli/OneDrive/Documents/Projects/live-project/eirequant-site/node_modules/mermaid/dist/chunks/mermaid.core/xychartDiagram-H2YORKM3.mjs":"_astro/xychartDiagram-H2YORKM3.JtDjagw3.js","C:/Users/pauli/OneDrive/Documents/Projects/live-project/eirequant-site/node_modules/mermaid/dist/chunks/mermaid.core/pieDiagram-NIOCPIFQ.mjs":"_astro/pieDiagram-NIOCPIFQ.BHpwnWQ9.js","C:/Users/pauli/OneDrive/Documents/Projects/live-project/eirequant-site/node_modules/mermaid/dist/chunks/mermaid.core/mindmap-definition-6CBA2TL7.mjs":"_astro/mindmap-definition-6CBA2TL7.Bmcakzt1.js","C:/Users/pauli/OneDrive/Documents/Projects/live-project/eirequant-site/node_modules/mermaid/dist/chunks/mermaid.core/architectureDiagram-SUXI7LT5.mjs":"_astro/architectureDiagram-SUXI7LT5.Bu-yTgnO.js","C:/Users/pauli/OneDrive/Documents/Projects/live-project/eirequant-site/node_modules/mermaid/dist/chunks/mermaid.core/sankeyDiagram-4UZDY2LN.mjs":"_astro/sankeyDiagram-4UZDY2LN.CgmbSBPY.js","C:/Users/pauli/OneDrive/Documents/Projects/live-project/eirequant-site/node_modules/mermaid/dist/chunks/mermaid.core/diagram-VMROVX33.mjs":"_astro/diagram-VMROVX33.BX7EOVS6.js","C:/Users/pauli/OneDrive/Documents/Projects/live-project/eirequant-site/node_modules/mermaid/dist/chunks/mermaid.core/ganttDiagram-EK5VF46D.mjs":"_astro/ganttDiagram-EK5VF46D.r68_TF8L.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[],"assets":["/_astro/page.BDyLB3EG.js","/file:///C:/Users/pauli/OneDrive/Documents/Projects/live-project/eirequant-site/dist/404.html","/file:///C:/Users/pauli/OneDrive/Documents/Projects/live-project/eirequant-site/dist/blog/index.html","/file:///C:/Users/pauli/OneDrive/Documents/Projects/live-project/eirequant-site/dist/contact/index.html","/file:///C:/Users/pauli/OneDrive/Documents/Projects/live-project/eirequant-site/dist/disclaimer/index.html","/file:///C:/Users/pauli/OneDrive/Documents/Projects/live-project/eirequant-site/dist/eirequant/index.html","/file:///C:/Users/pauli/OneDrive/Documents/Projects/live-project/eirequant-site/dist/models/index.html","/file:///C:/Users/pauli/OneDrive/Documents/Projects/live-project/eirequant-site/dist/performance/index.html","/file:///C:/Users/pauli/OneDrive/Documents/Projects/live-project/eirequant-site/dist/pipelines/index.html","/file:///C:/Users/pauli/OneDrive/Documents/Projects/live-project/eirequant-site/dist/portfolios/index.html","/file:///C:/Users/pauli/OneDrive/Documents/Projects/live-project/eirequant-site/dist/index.html"],"buildFormat":"directory","checkOrigin":false,"serverIslandNameMap":[],"key":"mTeG8b+3hyYPokss5lqTmkIATgaKsON/epBBU+2nmug="});
if (manifest.sessionConfig) manifest.sessionConfig.driverModule = null;

export { manifest };
