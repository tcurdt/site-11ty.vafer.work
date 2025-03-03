import path from "path";
import { DateTime } from "luxon";
import yaml from "js-yaml";
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

  config.addDataExtension("yml", (contents) => yaml.load(contents));

  // collections

  config.addCollection("articles", function (collection) {
    return collection
      .getFilteredByGlob("src/articles/*/*.md")
      .sort(function (a, b) {
        return b.date - a.date;
      });
  });

  config.addCollection("products", function (collection) {
    return collection
      .getFilteredByGlob("src/products/*/index.njk")
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

  config.addFilter("stringify", (obj) => {
    const o = {
      url: obj.url,
      fileSlug: obj.fileSlug,

      class: obj.data.class,
      type: obj.data.type,
      layout: obj.data.layout,
      tags: obj.data.tags,
      date: obj.data.date,
      title: obj.data.title,
      description: obj.data.description,
    };
    return JSON.stringify(o, null, 2);
  });

  config.addFilter("hasPrefix", (str, prefix) => {
    return str.startsWith(prefix);
  });

  config.addFilter("isoDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("yyyy-LL-dd");
  });
  config.addFilter("humanDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("MMMM yyyy");
  });
  config.addFilter("formatDate", (dateObj, format) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat(format);
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
  config.addPlugin(eleventyImageTransformPlugin, {
    formats: ["webp", "jpeg", "svg"],
    svgShortCircuit: true,
    // cacheOptions: {
    //   duration: "1w",
    // },
    // sharpJpegOptions: {
    //   quality: 85,
    // },
    htmlOptions: {
      imgAttributes: {
        loading: "lazy",
        decoding: "async",
      },
      pictureAttributes: {},
    },
  });

  config.addPassthroughCopy({ "src/static": "." });
  config.addPassthroughCopy({ ".site.css": "site.css" });
  config.setUseGitIgnore(false);
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
