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

  eleventyConfig.addFilter("readingTime", (content, lang = "en") => {
    const text = (content || "").replace(/<[^>]*>/g, "").trim();
    const words = text ? text.split(/\s+/).length : 0;
    const mins = Math.max(1, Math.ceil(words / 200));
    return lang === "tr" ? `${mins} dk okuma` : `${mins} min read`;
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
