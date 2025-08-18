// Series + their marks for nav and pages.
// Slugs must align with content file slugs (content/models/*.md)
const modelSeries = [
  {
    slug: "eq-core",
    title: "EQ Core Series",
    subtitle: "Daily classification on a small universe",
    marks: [
      { slug: "eq-core-mk1", title: "Mark 1" },
      { slug: "eq-core-mk2", title: "Mark 2" },
      { slug: "eq-core-mk3", title: "Mark 3" },
    ],
  },
  {
    slug: "eq-sentinel",
    title: "EQ Sentinel Series",
    subtitle: "Low-volatility, longer holds",
    marks: [
      { slug: "eq-sentinel-mk1", title: "Mark 1" },
    ],
  },
  {
    slug: "eq-tbd",
    title: "Future Series",
    subtitle: "Coming soon",
    marks: [],
  },
];

export default modelSeries;
