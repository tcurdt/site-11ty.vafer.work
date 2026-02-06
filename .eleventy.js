import { DateTime } from "luxon";
import yaml from "js-yaml";
import markdown from "markdown-it";
import markdownAttrs from "markdown-it-attrs";
import markdownImplicitFigures from "markdown-it-implicit-figures";
import pluginRss from "@11ty/eleventy-plugin-rss";
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import { HtmlBasePlugin } from "@11ty/eleventy";

export default function (config) {
  // support for github pages
  const pathPrefix = process.env.GITHUB_REPOSITORY
    ? "/" + process.env.GITHUB_REPOSITORY.split("/")[1]
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

  config.addCollection("tech", function (collection) {
    return collection
      .getFilteredByGlob("src/tech/*/*.md")
      .filter((item) => !item.data.draft)
      .sort(function (a, b) {
        return b.date - a.date;
      });
  });

  config.addCollection("travel", function (collection) {
    return collection
      .getFilteredByGlob("src/travel/*/*.md")
      .filter((item) => !item.data.draft)
      .sort(function (a, b) {
        return b.date - a.date;
      });
  });

  config.addCollection("products", function (collection) {
    return collection
      .getFilteredByGlob("src/products/*/index.njk")
      .filter((item) => !item.data.draft)
      .sort(function (a, b) {
        return (a.data.order || 0) - (b.data.order || 0);
      });
  });

  // shortcodes

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

  config.addFilter("has", (collection = [], attributes = []) => {
    const pages = collection.filter((page) =>
      attributes.includes(page.fileSlug),
    );
    const index = {};
    for (const page of pages) {
      index[page.fileSlug] = page;
    }
    return attributes.map((fileSlug) => index[fileSlug]);
  });

  // plugins

  config.addPlugin(HtmlBasePlugin);
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
  config.addWatchTarget(".site.css");
  config.setUseGitIgnore(false);

  return {
    dir: {
      input: "src",
    },
    pathPrefix,
  };
}
