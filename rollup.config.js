import resolve from "@rollup/plugin-node-resolve";
import path from "path";
import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import json from "@rollup/plugin-json";

export default {
  input: path.resolve(__dirname,"./src/main.js"),
  output: [
    {
      format: "cjs",
      file: "./public/bundle.js",
    },
  ],
  plugins: [resolve(),
    commonjs(),
    babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**'
        }),
    json()

],
};