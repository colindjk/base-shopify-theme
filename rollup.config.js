/* plugin imports */
import copy from 'rollup-plugin-copy-glob';
import includePaths from 'rollup-plugin-includepaths';

/* misc. imports */
import glob from 'glob';

/* global constants */
const IS_DEV_MODE = !process.env.production;

/* config.plugins */
const copyConfig = [
  { files: 'src/**/*.liquid', dest: 'dist' },
  { files: 'src/**/**/*.liquid', dest: 'dist' },
  { files: 'src/config/*.json', dest: 'dist/config' },
  { files: 'src/locales/*.json', dest: 'dist/locales' },
];

const includePathsConfig = {
  include: {},
  paths: ['src/scripts'],
  external: [],
  extensions: ['.js', '.json', '.html']
}

/* config.input */
const inputScripts = {};

for (const filename of glob.sync('src/scripts/templates/*.js')) {
  const bundle = filename.replace('src/scripts/', '').replace('.js', '').replace('/', '.');
  inputScripts[bundle] = filename;
}

const config = {
  input: inputScripts,

  output: [
    // ES module version, for modern browsers
    {
      dir: 'dist/assets/',
      format: 'es',
      sourcemap: true
    },
  ],

  plugins: [
    includePaths(includePathsConfig),
    copy(copyConfig),
  ]
}

// Browser support for IE.
const iifeConfigs = [];

if (!IS_DEV_MODE) {
  for (const key in inputScripts) {
    iifeConfigs.push({
      input: { [key + '.iife']: inputScripts[key] },
      output: {
        dir: 'dist/assets',
        format: 'iife'
      },
      plugins: [
        includePaths(includePathsConfig),
      ]
    });
  }
}

export default [
  config,
  ...iifeConfigs,
]
