import { defineCollection, z } from "astro:content";

const models = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    series: z.enum(["eq-core","eq-sentinel","eq-tbd"]),
    mark: z.number(),
    version: z.string().optional(),
    status: z.enum(["research","stable","preview"]).default("research"),
    summary: z.string().optional(),
    chartKey: z.string().optional(),
    updated: z.string().optional(),
  }),
});

const portfolios = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    summary: z.string().optional(),
    chartKey: z.string().optional(),     // e.g., "core12_equity"
    drawdownKey: z.string().optional(),  // optional alt path
    rebalance: z.string().optional(),    // e.g., "Monthly"
    allocation: z.record(z.string(), z.number()).optional(), // { TICKER: weight }
    updated: z.string().optional(),
  }),
});

export const collections = { models, portfolios };
