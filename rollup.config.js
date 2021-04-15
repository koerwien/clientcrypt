// rollup.config.js
// import sourcemaps from 'rollup-plugin-sourcemaps';
// import { babel } from '@rollup/plugin-babel';

import pkg from './package.json';


import babel from 'rollup-plugin-babel';
import { nodeResolve } from '@rollup/plugin-node-resolve';
// import uglify from 'rollup-plugin-uglify';
// import uglify from 'rollup-plugin-uglify-es';
import filesize from 'rollup-plugin-filesize';
import commonjs from 'rollup-plugin-commonjs';
import progress from 'rollup-plugin-progress';

let pluginOptions = [
  nodeResolve({
    jsnext: true,
    browser: true
  }),
  commonjs(),
  progress(),
  babel({
    exclude: 'node_modules/**',
  }),
//   uglify(),
  filesize({
    showGzippedSize: false,
  })
];

export default {
    input: 'src/index.js',
    output: {
        name: "clientcrypt",
        file: pkg.main,
        format: 'iife',
    },
    plugins: pluginOptions
};