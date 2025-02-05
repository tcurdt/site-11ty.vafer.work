import path from "path";
import { DateTime } from "luxon";
import htmlmin from "html-minifier-terser";
import markdown from "markdown-it";
import pluginRss from "@11ty/eleventy-plugin-rss";
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";

export default function (config) {
  // support for github pages
  const pathPrefix = process.env.GITHUB_REPOSITORY
    ? process.env.GITHUB_REPOSITORY.split("/")[1]
    : "";

  // minimize for production
  if (process.env.ELEVENTY_PRODUCTION) {
    config.addTransform("htmlmin", htmlminTransform);
  }

  // filters
  config.addFilter("hasPrefix", (str, prefix) => {
    return str.startsWith(prefix);
  });
  config.addFilter("isoDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("yyyy-LL-dd");
  });

  // plugins
  config.addPlugin(pluginRss);
  config.addPlugin(markdown);
  config.addPlugin(eleventyImageTransformPlugin);

  config.addPassthroughCopy({ "src/static": "." });
  config.addWatchTarget("./src/styles/");

  return {
    dir: {
      input: "src",
    },
    pathPrefix,
  };
}

function htmlminTransform(content, outputPath) {
  if (outputPath.endsWith(".html")) {
    let minified = htmlmin.minify(content, {
      useShortDoctype: true,
      removeComments: true,
      collapseWhitespace: true,
    });
    return minified;
  }
  return content;
}
