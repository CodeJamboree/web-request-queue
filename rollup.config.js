import typescript from 'rollup-plugin-typescript2';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

export default {
  input: './src/index.ts',
  output: [{
    file:
      'dist/bundle.js',
    format: 'esm', // Or 'cjs', 'esm'
    name: 'webRequestQueue'
  },
  {
    file: 'dist/bundle.min.js',
    format: 'esm',
    plugins: [terser()]
  }
  ],
  plugins: [
    typescript(),
    commonjs(),
    resolve({
      browser: false
    }),
  ],
};