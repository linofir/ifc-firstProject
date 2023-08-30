import resolve from "@rollup/plugin-node-resolve";
import path from "path";

export default {
  input: path.resolve(__dirname,"./app.js"),
  output: [

    {
      format: "esm",
      file: "./bundle.js",
    },
  ],
  plugins: [resolve()],
};