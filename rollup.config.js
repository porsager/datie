import buble from 'rollup-plugin-buble'
import { terser } from 'rollup-plugin-terser'
import filesize from 'rollup-plugin-filesize'

export default [
  {
    input: 'index.js',
    output: {
      file: 'dist/datie.umd.js',
      exports: 'default',
      format: 'umd',
      name: 'datie',
      sourcemap: true
    },
    plugins: [
      buble(),
      filesize()
    ]
  }, {
    input: 'index.js',
    output: {
      file: 'dist/datie.umd.min.js',
      exports: 'default',
      format: 'umd',
      name: 'datie',
      sourcemap: true
    },
    plugins: [
      buble(),
      terser({ mangle: true, compress: true }),
      filesize()
    ]
  }, {
    input: 'index.js',
    output: {
      file: 'dist/datie.js',
      format: 'esm',
      sourcemap: true
    },
    plugins: [
      buble(),
      filesize()
    ]
  }, {
    input: 'index.js',
    output: {
      file: 'dist/datie.min.js',
      format: 'esm',
      sourcemap: true
    },
    plugins: [
      buble(),
      filesize()
    ]
  }
]
