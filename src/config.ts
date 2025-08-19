import { defineCollection, z } from "astro:content";

// MODELS
const models = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),                       // e.g. "EQ-Core Mk II"
    slug: z.string(),                        // e.g. "eq-core-mk2"
    series: z.enum(["eq-core", "eq-sentinel", "eq-tbd"]),
    mark: z.number(),                        // 1,2,3...
    version: z.string().optional(),
    status: z.enum(["research", "stable", "preview"]).default("research"),
    summary: z.string().optional(),
    chartKey: z.string().optional(),         // key/path for CurveChart
    updated: z.string().optional(),          // ISO date
  }),
});

// PORTFOLIOS
const portfolios = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    summary: z.string().optional(),
    chartKey: z.string().optional(),
    drawdownKey: z.string().optional(),
    rebalance: z.string().optional(),
    allocation: z.record(z.string(), z.number()).optional(),
    updated: z.string().optional(),
  }),
});

export const collections = { models, portfolios };
