import resolve from "@rollup/plugin-node-resolve";
import path from "path";
import css from "rollup-plugin-css-only";
//import babel from "@rollup/plugin-babel";
//import {eslint} from 'rollup-plugin-eslint';
import commonjs from "rollup-plugin-commonjs";

// ./node_modules/rollup-plugin-eslint/index.js


export default {
  input: path.resolve(__dirname,"src/app.js"),
  output: [
    {
        format: "esm",
        file: "./src/bundle.js",
        //sourceMap: "inline"
    }    
  ],
  plugins: [
    resolve({
        jsnext:true, 
        main: true, 
        browser:true
    }),
    commonjs(),
    css({output:"css/style.css"}),
    // eslint({
    //     exclude: ['src/css/**'],
    // }),
    // babel({
    //     babelHelpers: 'bundled',
    //     exclude: 'node_modules/**'
    // }),
    
]
};