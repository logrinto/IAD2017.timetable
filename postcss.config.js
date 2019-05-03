const fs = require("fs");
const postcssCalc = require("postcss-calc");
const postcssPresetEnv = require("postcss-preset-env");
const postcssNested = require("postcss-nested");
const postcssVars = require("postcss-simple-vars");
const postcssImport = require("postcss-import");

// this could later be exported
const config = {
  root: `${__dirname}/src/`,
  cssVariables: `${__dirname}/src/shared/css/variables.js`
};

module.exports = {
  plugins: [
    postcssImport({
      root: config.root
    }),
    postcssVars({
      variables: () => {
        if (fs.existsSync(config.cssVariables)) {
          return config.cssVariables;
        }
        return {};
      }
    }),
    postcssCalc(),
    postcssPresetEnv({
      stage: 0,
      browsers: ["last 2 versions", "IE > 10"]
    }),
    postcssNested()
  ]
};
