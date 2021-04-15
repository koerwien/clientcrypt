// rollup.config.js
import sourcemaps from 'rollup-plugin-sourcemaps';

import pkg from './package.json';

export default {
    input: 'src/index.js',
    output: {
        file: pkg.main,
        format: 'cjs',
    },
    //   souceMap: true,
    plugins: [
        sourcemaps()
    ],
};