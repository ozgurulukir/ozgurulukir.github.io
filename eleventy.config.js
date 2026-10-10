import { DateTime } from "luxon";

export default function (eleventyConfig) {
  // Bot journal and planning notes are not site content.
  eleventyConfig.ignores.add(".Jules");
  eleventyConfig.ignores.add("_plan");
  eleventyConfig.ignores.add(".commandcode");

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

  eleventyConfig.amendLibrary("md", (md) => {
    const defaultLinkOpen =
      md.renderer.rules.link_open ||
      function (tokens, idx, options, env, self) {
        return self.renderToken(tokens, idx, options);
      };

    md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
      const href = tokens[idx].attrGet("href");
      if (href && /^https?:\/\//.test(href)) {
        tokens[idx].attrSet("target", "_blank");
        tokens[idx].attrSet("rel", "noopener noreferrer");
        tokens[idx].isExternal = true;
      }
      return defaultLinkOpen(tokens, idx, options, env, self);
    };

    const defaultLinkClose =
      md.renderer.rules.link_close ||
      function (tokens, idx, options, env, self) {
        return self.renderToken(tokens, idx, options);
      };

    md.renderer.rules.link_close = function (tokens, idx, options, env, self) {
      let isExternal = false;
      for (let i = idx - 1; i >= 0; i--) {
        if (tokens[i].type === "link_open") {
          isExternal = Boolean(tokens[i].isExternal);
          break;
        }
      }
      if (isExternal) {
        return `<svg class="external-icon" viewBox="0 0 16 16" width="12" height="12" aria-hidden="true"><use href="#external-icon"></use></svg><span class="sr-only">(opens in new tab)</span>${defaultLinkClose(tokens, idx, options, env, self)}`;
      }
      return defaultLinkClose(tokens, idx, options, env, self);
    };

    const defaultTableOpen =
      md.renderer.rules.table_open ||
      function (tokens, idx, options, env, self) {
        return self.renderToken(tokens, idx, options);
      };

    md.renderer.rules.table_open = function (tokens, idx, options, env, self) {
      tokens[idx].attrSet("tabindex", "0");
      return defaultTableOpen(tokens, idx, options, env, self);
    };

    const defaultFence =
      md.renderer.rules.fence ||
      function (tokens, idx, options, env, self) {
        return self.renderToken(tokens, idx, options);
      };

    md.renderer.rules.fence = function (tokens, idx, options, env, self) {
      const rawCode = defaultFence(tokens, idx, options, env, self);
      return rawCode.replace(/^<pre/i, '<pre tabindex="0"');
    };

    const defaultCodeBlock =
      md.renderer.rules.code_block ||
      function (tokens, idx, options, env, self) {
        return self.renderToken(tokens, idx, options);
      };

    md.renderer.rules.code_block = function (tokens, idx, options, env, self) {
      const rawCode = defaultCodeBlock(tokens, idx, options, env, self);
      return rawCode.replace(/^<pre/i, '<pre tabindex="0"');
    };
  });

  return {
    dir: {
      input: ".",
      includes: "_includes",
      output: "_site",
    },
  };
}
