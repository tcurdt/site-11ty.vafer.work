const fs = require("fs");
const htmlmin = require("html-minifier-terser");

module.exports = function(config) {

  config.addFilter("hasPrefix", (str, prefix) => {
    return str.startsWith(prefix);
  });

  if (process.env.ELEVENTY_PRODUCTION) {
    config.addTransform("htmlmin", htmlminTransform);
  }

  config.addPassthroughCopy({ "src/static": "." });

  config.addWatchTarget("./src/styles/");

  var pathPrefix = "";
  if (process.env.GITHUB_REPOSITORY) {
    pathPrefix = process.env.GITHUB_REPOSITORY.split('/')[1];
  }

  return {
    dir: {
      input: "src"
    },
    pathPrefix
  }
};

function htmlminTransform(content, outputPath) {
  if( outputPath.endsWith(".html") ) {
    let minified = htmlmin.minify(content, {
      useShortDoctype: true,
      removeComments: true,
      collapseWhitespace: true
    });
    return minified;
  }
  return content;
}
