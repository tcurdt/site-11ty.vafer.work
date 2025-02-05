import path from "path";
import { DateTime } from "luxon";
import htmlmin from "html-minifier-terser";

// import pluginRss from "@11ty/eleventy-plugin-rss";
// import markdown from "markdown-it";

export default function (config) {
  config.addFilter("hasPrefix", (str, prefix) => {
    return str.startsWith(prefix);
  });
  config.addFilter("isoDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("yyyy-LL-dd");
  });

  if (process.env.ELEVENTY_PRODUCTION) {
    config.addTransform("htmlmin", htmlminTransform);
  }

  config.addPassthroughCopy({ "src/static": "." });

  // config.addPlugin(pluginRss);

  config.addWatchTarget("./src/styles/");

  // support for github pages
  const pathPrefix = process.env.GITHUB_REPOSITORY
    ? process.env.GITHUB_REPOSITORY.split("/")[1]
    : "";

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
