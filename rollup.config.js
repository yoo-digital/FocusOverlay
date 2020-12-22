import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import postcss from 'rollup-plugin-postcss';
import typescript from 'rollup-plugin-typescript';
import { version, homepage, author, license } from './package.json';

const dist = './dist/';
const name = 'focusoverlay';
const production = !process.env.ROLLUP_WATCH;
const sourcemap = !production ? 'inline' : false;
const preamble = `/* Focus Overlay - v${version}
* ${homepage}
* Copyright (c) ${new Date().getFullYear()} ${author}. Licensed ${license} */`;

const fs = require('fs');
const sass = require('sass');
const packageImporter = require('node-sass-package-importer');

const EXPORT_DIR = 'dist';

const ENTRY_FILE = 'src/styles.scss';
const OUT_FILE = 'dist/focusoverlay.css';

const checkExportDir = () => {
  if (!fs.existsSync(EXPORT_DIR)){
    fs.mkdirSync(EXPORT_DIR);
  }
};

sass.render({
  file: ENTRY_FILE,
  importer: packageImporter(),
  outFile: OUT_FILE,
}, function(error, result) {
  if (!error) {
    checkExportDir();

    fs.writeFile(OUT_FILE, result.css, function(err) {
      if (!err) {
        console.log('CSS File created');
      } else {
        console.error(err);
      }
    });
  } else {
    console.error(error);
  }
});

export default {
  input: './src/index.ts',
  output: [
    {
      file: `${dist}${name}.cjs.js`,
      format: 'cjs',
      sourcemap
    },
    {
      file: `${dist}${name}.esm.js`,
      format: 'esm',
      sourcemap
    },
    {
      name: 'FocusOverlay',
      file: `${dist}${name}.js`,
      format: 'umd',
      sourcemap
    }
  ],
  plugins: [
    resolve(),
    typescript({
      tsconfig: 'tsconfig.build.json',
    }),
    postcss({
      extract: `${dist}${name}.css`,
      minimize: true
    }),
    babel({
      exclude: 'node_modules/**',
      presets: [
        [
          '@babel/env',
          {
            modules: false,
            targets: {
              browsers: '> 1%, IE 11, not op_mini all, not dead',
              node: 8
            },
            useBuiltIns: 'usage',
            corejs: '3.8.1',
          }
        ]
      ]
    }),
    commonjs(),
    production &&
      terser({
        output: { preamble }
      }),
  ]
};
