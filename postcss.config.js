import fs from "fs";
import postcssCalc from "postcss-calc";
import postcssPresetEnv from "postcss-preset-env";
import postcssNested from "postcss-nested";
import postcssVars from "postcss-simple-vars";
import postcssImport from "postcss-import";

// this could later be exported
const config = {
  root: `${__dirname}/src/`,
  cssVariables: `${__dirname}/src/shared/css/variables.js`
};

export default {
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
