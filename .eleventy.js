const postcss = require("postcss");
const postcssImport = require("postcss-import");
const tailwindcss = require("tailwindcss");
const autoprefixer = require("autoprefixer");

module.exports = function (eleventyConfig) {
  // Static assets — copied as-is into dist/
  eleventyConfig.addPassthroughCopy({ "src/js": "js" });
  eleventyConfig.addPassthroughCopy({ "src/data": "data" });
  eleventyConfig.addPassthroughCopy({ "src/_data/i18n": "i18n" });

  // Process CSS through PostCSS (for Tailwind)
  eleventyConfig.addTemplateFormats("css");
  eleventyConfig.addExtension("css", {
    outputFileExtension: "css",
    compile: async function (inputContent) {
      const result = await postcss([
        postcssImport,
        tailwindcss,
        autoprefixer,
      ]).process(inputContent, {
        from: undefined,
      });
      return async () => result.css;
    },
  });

  // Global data for base URL (GitHub Pages subdirectory support)
  eleventyConfig.addGlobalData("baseUrl", process.env.BASE_URL || "/");

  return {
    dir: {
      input: "src",
      output: "dist",
      includes: "_includes",
      data: "_data",
    },
    // Allow Nunjucks-in-.html files (processed as templates, output as .html)
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
};
