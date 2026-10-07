import { DateTime } from "luxon";

export default function (eleventyConfig) {
  // Bot journal and planning notes are not site content.
  eleventyConfig.ignores.add(".Jules");
  eleventyConfig.ignores.add("_plan");

  eleventyConfig.addCollection("posts", (collectionApi) =>
    collectionApi
      .getFilteredByGlob("_posts/*.md")
      .sort((a, b) => b.date - a.date)
  );

  eleventyConfig.addFilter("postDate", (date) =>
    DateTime.fromJSDate(date, { zone: "utc" })
      .setLocale("en-US")
      .toLocaleString(DateTime.DATE_MED)
  );

  eleventyConfig.addFilter(
    "isoDate",
    (date) => date.toISOString().slice(0, 10)
  );

  eleventyConfig.addFilter("readingTime", (content) => {
    if (!content) return "1 min read";
    const clean = content.replace(/<[^>]*>/g, " ");
    const words = clean.trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.ceil(words / 200));
    return `${minutes} min read`;
  });

  eleventyConfig.addPassthroughCopy("style.css");
  eleventyConfig.addPassthroughCopy("favicon.svg");

  return {
    dir: {
      input: ".",
      includes: "_includes",
      output: "_site",
    },
  };
}
