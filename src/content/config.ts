import { defineCollection, z } from "astro:content";

export const collections = {
  posts: defineCollection({
    type: "content",
    schema: z.object({
      title: z.string(),
      date: z.string(),               // ISO
      author: z.string(),
      type: z.enum(["morning","eod","think"]).optional(),
      summary: z.string().optional(),
      tags: z.array(z.string()).optional(),
    }),
  }),
  models: defineCollection({
    type: "content",
    schema: z.object({
      name: z.string(),
      family: z.enum(["EQ Series","Trend"]),
      version: z.string(),
      synopsis: z.string(),
      intended_use: z.string().optional(),
      caveats: z.string().optional(),
      links_to_artifacts: z.array(z.string()).optional(), // paths to /public/data/** if any
    }),
  }),
  portfolios: defineCollection({
    type: "content",
    schema: z.object({
      name: z.string(),
      objective: z.string(),
      math: z.string().optional(),
      assumptions: z.string().optional(),
      status: z.enum(["stable","experimental","under_construction"]).default("experimental"),
    }),
  }),
  authors: defineCollection({
    type: "data",
    schema: z.object({ id: z.string(), name: z.string(), role: z.string().optional(), avatar: z.string().optional() }),
  }),
  events: defineCollection({
    type: "data",
    schema: z.object({ id: z.string(), label: z.string(), start: z.string(), end: z.string(), description: z.string().optional() }),
  }),
};
