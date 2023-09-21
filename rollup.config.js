import resolve from "@rollup/plugin-node-resolve";
import path from "path";
import commonjs from "@rollup/plugin-commonjs";

export default {
  input: path.resolve(__dirname,"./src/main.js"),
  output: [
    {
      format: "cjs",
      file: "./bundle.js",
    },
  ],
  plugins: [resolve(),
    commonjs()

],
  
};