import path from "path";
import { DateTime } from "luxon";

import markdown from "markdown-it";
import markdownAttrs from "markdown-it-attrs";
import markdownImplicitFigures from "markdown-it-implicit-figures";

import pluginRss from "@11ty/eleventy-plugin-rss";
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";

export default function (config) {
  // support for github pages
  const pathPrefix = process.env.GITHUB_REPOSITORY
    ? process.env.GITHUB_REPOSITORY.split("/")[1]
    : "";

  // markdown

  const md = markdown({
    html: true,
    linkify: true,
    typographer: true,
  });
  md.use(markdownImplicitFigures, {
    dataType: true,
    figcaption: true,
  });
  md.use(markdownAttrs);
  config.setLibrary("md", md);
  config.amendLibrary("md", (mdLib) => mdLib.enable("code"));

  // collections

  config.addCollection("tech", function (collection) {
    return collection
      .getFilteredByGlob("src/articles/tech/**/*.md")
      .sort(function (a, b) {
        return b.date - a.date;
      });
  });

  config.addCollection("rants", function (collection) {
    return collection
      .getFilteredByGlob("src/articles/rants/**/*.md")
      .sort(function (a, b) {
        return b.date - a.date;
      });
  });

  config.addCollection("articles", function (collection) {
    return collection
      .getFilteredByGlob("src/articles/**/*.md")
      .sort(function (a, b) {
        return b.date - a.date;
      });
  });

  // // minimize for production
  // if (process.env.MINIMIZE) {
  //   config.addTransform("htmlmin", htmlminTransform);
  // }

  config.addShortcode("year", () => `${new Date().getFullYear()}`);

  // filters

  config.addFilter("hasPrefix", (str, prefix) => {
    return str.startsWith(prefix);
  });
  config.addFilter("isoDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("yyyy-LL-dd");
  });
  config.addFilter("featured", (collection = [], related = []) => {
    const pages = collection.filter((page) => related.includes(page.fileSlug));
    const index = {};
    for (const page of pages) {
      index[page.fileSlug] = page;
    }
    return related.map((fileSlug) => index[fileSlug]);
  });

  // plugins

  config.addPlugin(pluginRss);
  config.addPlugin(eleventyImageTransformPlugin);

  config.addPassthroughCopy({ "src/static": "." });
  config.addPassthroughCopy({ ".site.css": "site.css" });
  config.setUseGitIgnore(false);
  // config.watchIgnores.delete(".site.css");
  config.addWatchTarget(".site.css");

  return {
    dir: {
      input: "src",
    },
    pathPrefix,
  };
}

// function htmlminTransform(content, outputPath) {
//   if (outputPath.endsWith(".html")) {
//     let minified = htmlmin.minify(content, {
//       useShortDoctype: true,
//       removeComments: true,
//       collapseWhitespace: true,
//     });
//     return minified;
//   }
//   return content;
// }
