import typescript from 'rollup-plugin-typescript2';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import { dts } from 'rollup-plugin-dts';

export default [{
  input: './src/index.ts',
  external: ['http', 'https'],
  output: [
    {
      file: 'dist/index.d.ts',
      format: 'es',
    },
  ],
  plugins: [
    dts()
  ],
},
{
  input: './src/index.ts',
  external: ['http', 'https'],
  output: [
    {
      file:
        'dist/bundle.js',
      format: 'esm',
      name: 'webRequestQueue'
    },
    {
      file: 'dist/bundle.min.js',
      format: 'esm',
      plugins: [terser()]
    },
  ],
  plugins: [
    typescript({
      declaration: true,
      declarationDir: 'types'
    }),
    commonjs(),
    resolve({
      browser: false
    }),
  ],
}];